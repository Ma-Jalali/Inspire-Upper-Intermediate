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

## Status: set up (16 Nov 2026)

Everything below is already done on the **Inspire Upper-Intermediate** Supabase project:

- The `push` edge function is deployed (JWT check off, like the other functions).
- The push key pair was created by the function itself on first run and is kept in the
  private `push_secrets` table (row-level security on, no policies, so the app's public key
  can't read it). To use your own keys instead, set `VAPID_PUBLIC_KEY` and
  `VAPID_PRIVATE_KEY` as Edge Function secrets.
- `pg_cron` and `pg_net` are enabled, and the job `inspire-study-reminders` calls the
  function every 15 minutes.

To check it, open
`https://pykflxozwpoifbbcmusc.supabase.co/functions/v1/push?pk=1`: it shows the public key.
To pause reminders, run `select cron.unschedule('inspire-study-reminders');` in the SQL editor.

Changing the push key pair later means every student has to turn reminders off and on again,
so leave it as it is unless it leaks.

## How it works

- The app stores each device's push address in `app_storage` under `push:<device>`
  together with the reminder time, time zone and the last day the student practised.
- Every 15 minutes the function sends a reminder to students whose reminder time has
  passed today and who haven't practised yet, once per day (`pushsent:<device>`).
- Class news is written by the function from the saved course data, so the function
  can't be used to send students any other text. Each piece of news is sent once
  (`pushlog:<kind>`).
