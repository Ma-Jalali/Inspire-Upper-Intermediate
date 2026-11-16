// Inspire push function: daily study reminders and class news as real phone notifications.
//
//   GET  ?pk=1                    -> { pk }  the public VAPID key the app subscribes with
//   POST { action: "tick" }       -> sends due study reminders (run every 15 minutes by pg_cron)
//   POST { action: "notify", kind: "homework" | "announcement" | "live" | "challenge" }
//                                 -> tells every subscribed student about new class news
//
// The message text is always built here from the saved course data, never taken from the
// request, so nobody can use this function to send students their own text.
// Setup: see PUSH-SETUP.md in the repository root.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "jsr:@supabase/supabase-js@2";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:teacher@example.com";
const TABLE = "app_storage";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
if (VAPID_PUBLIC && VAPID_PRIVATE) webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

type Row = { key: string; value: unknown };
function parse<T = any>(v: unknown): T | null {
  try { return (typeof v === "string" ? JSON.parse(v) : v) as T; } catch { return null; }
}
async function rows(prefix: string): Promise<Row[]> {
  const out: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(TABLE).select("key,value").like("key", prefix + "%").range(from, from + 999);
    if (error) throw error;
    out.push(...(data ?? []));
    if (!data || data.length < 1000) return out;
  }
}
async function one<T = any>(key: string): Promise<T | null> {
  const { data } = await sb.from(TABLE).select("value").eq("key", key).maybeSingle();
  return data ? parse<T>(data.value) : null;
}
async function put(key: string, value: unknown) {
  await sb.from(TABLE).upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
}

// deno-lint-ignore no-explicit-any
type Sub = { sub: any; on?: boolean; time?: string; tz?: string; last?: string; streak?: number; name?: string };

/* send one message; forget subscriptions the browser has thrown away */
async function send(key: string, s: Sub, msg: Record<string, unknown>) {
  try {
    await webpush.sendNotification(s.sub, JSON.stringify(msg), { TTL: 6 * 3600, urgency: "normal" });
    return true;
  } catch (e) {
    const code = (e as { statusCode?: number }).statusCode;
    if (code === 404 || code === 410) await sb.from(TABLE).delete().eq("key", key);
    return false;
  }
}

/* the local date and time in the student's own time zone */
function localNow(tz?: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz || "UTC", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { day: `${g("year")}-${g("month")}-${g("day")}`, hhmm: `${g("hour") === "24" ? "00" : g("hour")}:${g("minute")}` };
}

async function tick() {
  const subs = await rows("push:");
  const sent = new Map((await rows("pushsent:")).map((r) => [r.key.slice(9), parse<string>(r.value)]));
  let n = 0;
  for (const r of subs) {
    const s = parse<Sub>(r.value);
    if (!s || !s.sub || !s.on) continue;
    const dev = r.key.slice(5);
    const { day, hhmm } = localNow(s.tz);
    if (hhmm < (s.time || "18:00")) continue;        // not time yet for this student
    if (s.last === day || sent.get(dev) === day) continue; // already studied, or already reminded today
    const streak = s.streak || 0;
    const msg = streak > 0
      ? { title: `Your ${streak}-day streak ends tonight \u{1F525}`, body: "Five minutes of practice keeps it alive. Today's mission is waiting.", tag: "study" }
      : { title: "Time for 5 minutes of English \u{1F4DA}", body: "Your daily mission is ready. Start a streak today!", tag: "study" };
    if (await send(r.key, s, msg)) { await put("pushsent:" + dev, day); n++; }
  }
  return n;
}

async function notify(kind: string) {
  const state = await one<any>("page-tree");
  let msg: Record<string, unknown> | null = null;
  let sig = "";
  if (kind === "homework") {
    const hw = (state?.homework ?? []) as { id: string; text: string }[];
    const last = hw[hw.length - 1];
    if (last) { msg = { title: "New homework \u{1F4DD}", body: String(last.text).slice(0, 140), tag: "homework" }; sig = last.id; }
  } else if (kind === "announcement") {
    const a = state?.announcement;
    if (a?.text) { msg = { title: "New from your teacher \u{1F4E3}", body: String(a.text).slice(0, 160), tag: "announcement" }; sig = String(a.updated); }
  } else if (kind === "challenge") {
    const c = state?.challenge;
    if (c?.id) {
      const title = c.title || `${c.target} ${c.metric} this week`;
      msg = { title: "New class challenge \u{1F3C6}", body: String(title).slice(0, 140), tag: "challenge" }; sig = c.id;
    }
  } else if (kind === "live") {
    const s = await one<any>("live:session");
    if (s && s.phase === "lobby" && Date.now() - (s.t || 0) < 10 * 60000) {
      msg = { title: "Live quiz starting now \u{1F680}", body: `Join "${String(s.title).slice(0, 80)}" from the Home page.`, tag: "live", renotify: true }; sig = s.sid;
    }
  }
  if (!msg) return 0;
  // each piece of news is sent once, however many times the button is pressed
  const logKey = "pushlog:" + kind;
  if ((await one<string>(logKey)) === sig) return 0;
  await put(logKey, sig);
  let n = 0;
  for (const r of await rows("push:")) {
    const s = parse<Sub>(r.value);
    if (s?.sub && (await send(r.key, s, msg))) n++;
  }
  return n;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return json({ error: "VAPID keys are not set" }, 500);
  try {
    if (req.method === "GET") return json({ pk: VAPID_PUBLIC });
    const body = await req.json().catch(() => ({}));
    if (body.action === "tick") return json({ sent: await tick() });
    if (body.action === "notify" && typeof body.kind === "string") return json({ sent: await notify(body.kind) });
    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
