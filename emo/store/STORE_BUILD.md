# #EMOBANDNAME™ — Getting it on the Play Store (and Apple)
### Rice + Claude · the real, honest path

The app is **store-safe and ready**. The store build (`?src=app`) already
hides the Venmo tip (store payment rules) and the Genesis Names list
(text shipped inside the binary is what reviewers judge). The website
keeps both intact.

What's left is **not code** — it's three real-world prerequisites that
only you can do, and one of them costs money. Here they are, plainly.

---

## The three things blocking a real submission

1. **The site has to be live at its final URL.** An Android "app" built
   this way (a TWA — Trusted Web Activity) is a thin wrapper that loads
   `raheemfriedrice.github.io/Dr.Heemslice5000/emo/`. That page has to be
   publicly live first. It goes live the moment this PR is merged to the
   deploy branch. Until then there's nothing for the app to wrap.

2. **A Google Play developer account — $25, one time.** That's more than
   the $22 goal by itself, which is why the **website is the way to earn
   the first $22** (11 people × $2). Use that money for the $25, then come
   back here.

3. **A signing key you keep forever.** The build creates a keystore +
   password. **If you lose it, you can never update the app again.** That's
   why I did not generate one for you in this throwaway cloud container —
   a key that lives here and vanishes is worse than no key. You'll make it
   on your own machine (or let Google manage it — see below), once, and
   back it up.

Because of #3 especially, handing you a `.aab` built in this disposable
environment would be a trap, not a gift. Here's the clean way instead.

---

## Easiest path: PWABuilder (no command line, Google holds the key)

1. The site is live (PR merged). Open **https://www.pwabuilder.com** on a
   computer.
2. Paste: `https://raheemfriedrice.github.io/Dr.Heemslice5000/emo/`
3. Click **Package for stores → Android → Generate**. Accept the defaults.
   Choosing **"Google Play-managed signing"** means Google keeps the key —
   you can't lose it. (Recommended for you.)
4. It gives you a `.aab` (the upload file) and an `assetlinks.json`.
5. **assetlinks.json** must be served at
   `https://raheemfriedrice.github.io/.well-known/assetlinks.json`. That
   needs a second repo named exactly `raheemfriedrice.github.io` (a GitHub
   user-pages repo). Tell me "set up assetlinks" and I'll give you the file
   and the exact steps — this removes the browser address bar from the app.
6. In **play.google.com/console** ($25), create the app, upload the `.aab`,
   fill the listing (copy is in `../_briefs/EMOBANDNAME_LAUNCH.md` and the
   `twa-manifest.json` here has the exact names/colors), set the content
   rating (mark that users can type free text), and submit.
7. New personal accounts must run a **closed test with 12 testers for 14
   days** before going public. Your Facebook friends are the 12 testers.

## Command-line path (if you'd rather, on your own machine)

Everything is pre-filled in **`twa-manifest.json`** in this folder.
On a computer with Node + a JDK:

```
npm i -g @bubblewrap/cli
# put twa-manifest.json in an empty folder, then:
bubblewrap build          # downloads the Android SDK the first time,
                          # asks you to create/point to a keystore,
                          # and outputs app-release-bundle.aab
```

Then upload the `.aab` to the Play Console as above.

## Apple App Store (later, needs a Mac)

PWABuilder → iOS gives you an Xcode project; you need a Mac with Xcode and
a $99/year Apple account to submit. Apple sometimes rejects "just a website
in a wrapper" (guideline 4.2), so expect to add a native touch or two. Do
this after Android is live.

---

## What I already did for you
- Store-safe app mode (`?src=app`): no Venmo link, no Genesis list in the
  binary. The website is unchanged and uncensored.
- Icons, maskable icon, Apple touch icon, OG image — all generated.
- `twa-manifest.json` — prefilled so the CLI build is one command.
- Listing copy and screenshots — in `../_briefs/EMOBANDNAME_LAUNCH.md` and
  `../store/`.

Say the word on **(a)** merging the PR to go live, and **(b)** "set up
assetlinks," and I'll do both. The $25 and the keystore backup are yours.

*Built by Rice + Claude. The Brightskin Bible governs all.*
