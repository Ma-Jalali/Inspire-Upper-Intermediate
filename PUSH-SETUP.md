# Turning on push reminders

The app is already set up to receive push notifications. To actually send them,
the small `push` function in `supabase/functions/push` has to run on your Supabase
project. Until it does, everything else works and the app falls back to the
in-app reminder it had before.

What students get once it's on:

- A daily reminder at the time they choose in Settings, only on days they haven't
  practised yet ("Your 6-day streak ends tonight 🔥").
- A notification when you add homework, post an announcement, start a live quiz
  or set a class challenge.

On iPhone, notifications only work after the student installs the app
(Share → Add to Home Screen) and turns reminders on from inside the installed app.

## One-time setup (about 10 minutes)

You need the Supabase CLI (`npm i -g supabase`) and to be logged in (`supabase login`).

1. Make a key pair for push (keep the private key secret, never put it in the app):

   ```bash
   npx web-push generate-vapid-keys
   ```

2. Save the keys on Supabase (use your own email for the subject):

   ```bash
   supabase secrets set --project-ref pykflxozwpoifbbcmusc VAPID_PUBLIC_KEY=<public key> VAPID_PRIVATE_KEY=<private key> VAPID_SUBJECT=mailto:<your email>
   ```

3. Deploy the function from the repository folder:

   ```bash
   supabase functions deploy push --project-ref pykflxozwpoifbbcmusc --no-verify-jwt
   ```

4. Run the daily reminders every 15 minutes. In the Supabase dashboard, open
   **Database → Extensions** and enable `pg_cron` and `pg_net`, then run this in the
   **SQL editor**:

   ```sql
   select cron.schedule(
     'inspire-study-reminders',
     '*/15 * * * *',
     $$ select net.http_post(
          url := 'https://pykflxozwpoifbbcmusc.supabase.co/functions/v1/push',
          headers := '{"Content-Type":"application/json"}'::jsonb,
          body := '{"action":"tick"}'::jsonb
        ); $$
   );
   ```

5. Check it: open
   `https://pykflxozwpoifbbcmusc.supabase.co/functions/v1/push?pk=1`.
   It should show your public key. Then on a phone, open the app, go to
   **Settings → Study reminders** and turn them on.

## How it works

- The app stores each device's push address in `app_storage` under `push:<device>`
  together with the reminder time, time zone and the last day the student practised.
- Every 15 minutes the function sends a reminder to students whose reminder time has
  passed today and who haven't practised yet, once per day (`pushsent:<device>`).
- Class news is written by the function from the saved course data, so the function
  can't be used to send students any other text. Each piece of news is sent once
  (`pushlog:<kind>`).
