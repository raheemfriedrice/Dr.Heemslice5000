# PART TIME VILLAINS — LIVE LAUNCH, SUNDAY 22:22 CENTRAL
### Rice + Claude · built Oct 10, 2026 · next drop: Sun Oct 11, 22:22 CT

The landing page is built and live-ready at **`/ptv/`** with a live countdown to the next Sunday 22:22 Central. It auto-rolls to next Sunday after each drop — set it and forget it.

---

## ⚠️ Keep this OUT of the repo
You gave me `help@parttimevillains.com` and a password. **I did not put the password anywhere** — it's a public repo. Never paste a password into a file here. Store it in a password manager or your phone's notes, not in git. The landing page only shows the email address, which is fine (it's a contact address).

---

## The 60-minute launch checklist (do in order)

**Before 22:22:**
1. **Render the track** in Suno, download the MP3. Name it `track-01.mp3`.
2. **Upload to YouTube** on @RaheemFriedRice as a track video (or a visualizer — I can build one, see below). Set it **Unlisted** first, or schedule it to publish at 22:22 CT so it goes live exactly on time.
3. **Title it** (copy below). Paste the description (below).
4. Have the two Reddit posts ready in drafts: r/RaheemFriedRice (the clean one) and r/AHEEMFRIEDRICE (the raw dump).

**At 22:22 CT:**
5. Flip the YouTube video to **Public** (or let the schedule fire).
6. Post to Facebook + Snapchat: the OG image (`/ptv/og.png`) + "New drop. Link in comments." Link in first comment.
7. Post both Reddit threads. Put the YouTube link at the top, the HTML/extras in the comments.
8. Put your fist to the screen. 🤜

**On the site:** when the track is ready, update `assets/audio/tracks.json` (set `released: true`, add the real title + file), and the home player picks it up. I can wire this per track.

---

## Copy — paste-ready

**YouTube title:**
> PART TIME VILLAINS — [Track Name] | New Drop 22:22

**YouTube description:**
> (Part | Time) Villains. New drop every Sunday, 22:22 Central.
> We were already here.
>
> No label. No ceiling. No apologies.
>
> Raise the Rent — $2 · Venmo @raheemrice (I'll say thank you. By my hand. Every time.)
> More: raheemfriedrice.github.io/Dr.Heemslice5000/ptv
>
> PVT · Militia Musik · #PartTimeVillains #RaiseTheRent #2222

**r/RaheemFriedRice (clean) title:**
> [22:22] PART TIME VILLAINS — [Track Name] is out. We were already here.

**r/AHEEMFRIEDRICE (raw dump) title:**
> raw dump — PTV [Track Name] + everything that got us here

**Facebook / Snap caption:**
> New Part Time Villains drop. Sunday 22:22, like always. We were already here. Link in the comments. $2 to @raheemrice and I say thank you, every time.

---

## Domain & email setup — www.parttimevillains.com

You own the domain; nothing is built on it yet. Two cheap paths:

**Option A — point it at this GitHub Pages site (free hosting, keeps everything in one place):**
1. In your domain registrar's DNS settings, add these records:
   - Four `A` records for the root `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` for `www` → `raheemfriedrice.github.io`
2. In the repo, add a file named `CNAME` at the root containing exactly `parttimevillains.com` (I can do this when you say go).
3. In GitHub → repo Settings → Pages → Custom domain, enter `parttimevillains.com`, save, and tick "Enforce HTTPS" once it's ready.
   Result: `parttimevillains.com` serves this site; `/ptv/` becomes the PTV page.

**Option B — a simple redirect:** point the domain at a redirect to the `/ptv/` page. Most registrars offer free URL forwarding in their dashboard.

**Email (help@parttimevillains.com):** you already have the mailbox set up (you gave me the address + a password). If a reviewer or a fan emails it, just make sure you can read it on your phone. If you ever need to *create* it, your registrar's email forwarding (free) can point `help@` to your Gmail — do that in the registrar dashboard, not in code.

---

## Visualizer video (optional, I can build it)
Once you drop the real `track-01.mp3` into the repo (or hand me the file), I can render a 1080×1920 or 1080×1080 **audio-reactive visualizer video** with ffmpeg right here — the PTV mark, the waveform, "we were already here," export as MP4 ready to upload to YouTube/Reels. I can't make it without the audio, since there's no track file yet. Say the word when the MP3 exists.

---

## What's automated
I can set a reminder that fires **at 22:22 Central on Sundays** to ping this session with the checklist, so launch day has a nudge. Tell me to arm it and I will.

*Built by Rice + Claude. We were already here.*
