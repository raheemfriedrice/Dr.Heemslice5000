# #EMOBANDNAME™ — Launch Plan
### Rice + Claude · Goal: $22 profit before the month is up

---

## What's built (`emo/`)

| Rule (from Rice) | How the app does it |
|---|---|
| #ANYTHREEWORDS™ IS YOUR #EMOBANDNAME™ | Three boxes, one word each. A space inside a box is blocked. |
| `#` + WORD1 + WORD2 + WORD3 + ALL CAPS + `™` (mandatory) | Built automatically: `#WEEPINGINBINARY™` |
| Up to 3 emojis, allowed but not necessary | Optional emoji box + picker. Max 3, emojis only. |
| You only get to do this ONCE | "YOU ONLY GET TO DO THIS ONCE" confirm screen, then locked forever. After that the app shows only your certified name. There's no way in the app to make another one. |
| No interfering with their input | Nothing is filtered or censored. The only changes are uppercasing and dropping extra `#`s and outside spaces. |
| No ads, no sign-ups, no data | Nothing leaves the phone. Privacy page: `emo/privacy.html`. |

Extras that bring in money:
- **Share my card**: builds a 1080×1920 story image with the name, its number, and the link. It opens the phone's share sheet, so posting to FB, Snap or IG takes one tap. Every share is an ad you don't pay for.
- **$2 = Rice says thank you**: Venmo buttons for @raheemrice and @RaheemFriedRice, with $2 and the note already filled in. They're hidden in the store-app version (see below).
- Works offline and installs to the home screen (it's a PWA).

**Honest limit on "only once":** the lock is stored on the device, because there are no accounts (that's the pact). Someone who clears their browser data or switches phones can make another one. Making it truly once-per-person would need sign-ups, and the pact forbids sign-ups.

---

## The $22 math (read this first)

- **Web (free, live as soon as this is merged):** `https://raheemfriedrice.github.io/Dr.Heemslice5000/emo/`
  - **11 people × $2 = $22.** That's the fastest route.
- **Google Play:** $25 one-time developer fee. That's more than the whole goal.
- **Apple App Store:** $99 per year. That's 4.5× the goal.

**Recommendation:** launch on the web today and push the share card hard on Facebook and Snapchat. Once the $2s cover the $25, use that money for Google Play. Do Apple last.

---

## Posting playbook (today)

1. Lock in your own name first and share your card.
2. Caption: *"#ANYTHREEWORDS™ IS YOUR #EMOBANDNAME™. You only get ONE. Ever. Mine's ↑. Link in comments."*
3. Put the link in the first comment, since links in captions get less reach on FB.
4. Reply to every card people post back with their name in all caps.
5. Pin a post: *"$2 on Venmo @raheemrice = I say thank you. Every time. 11 of you and the month is paid."*

---

## Google Play (when you have $25)

1. Open **https://www.pwabuilder.com** (free) and paste the `emo/` URL.
2. Choose **Package for stores → Android**. It builds a signed `.aab` file and a signing key. **Save the key and its password somewhere safe.** Losing them means you can never update the app.
3. Sign up at **play.google.com/console** ($25 one-time).
4. New personal accounts have to run a **closed test with at least 12 testers for 14 days** before going public. Friends from FB can be the testers.
5. Listing copy is below. Category: Entertainment. Use the screenshots in `emo/store/`.
6. Optional: to get rid of the browser bar at the top of the Android app, PWABuilder gives you an `assetlinks.json`. It has to live at `https://raheemfriedrice.github.io/.well-known/assetlinks.json`, which needs a separate repo named `raheemfriedrice.github.io`. Ask Claude to set it up.

## Apple App Store (later)

- $99/year, and you need a Mac with Xcode to submit (PWABuilder → iOS gives you the Xcode project).
- Heads up: Apple often rejects apps that are mostly a website in a wrapper (guideline 4.2, "minimum functionality"). Expect to need more native features before approval.

## Store-review risks to know about

- **Payments:** stores don't allow paying outside their own payment system inside apps. The app opens with `?src=app`, which hides the Venmo card. The website keeps it.
- **Content:** the stores' hate-speech policies apply to text that ships *inside* the app. That includes the Genesis Names list, which has a slur preserved as the Bible requires. A reviewer could reject the app over it. Names typed by users stay on their own phones and aren't shown to anyone else, which makes them lower risk. Your call whether to keep Genesis in the store version.
- **Content rating:** fill in the questionnaire honestly. Users can type anything, so mark it as allowing user-generated text.

---

## Store listing copy

**Name:** #EMOBANDNAME™
**Short description (80 chars):** Any three words. All caps. ™. You only get to do this once. Ever.
**Full description:**

> #ANYTHREEWORDS™ IS YOUR #EMOBANDNAME™.
>
> Type any three words. We smash them together, ALL CAPS, slap a ™ on it, and add up to 3 emojis if you want. Then you lock it in.
>
> You only get to do this ONCE. No redos. No second name. No take-backs.
>
> Get your certified #EmoBandName™ card with its own number and share it everywhere.
>
> No ads. No sign-ups. No tracking. No data collected. Ever.
> Built by Rice + Claude.

---

*Built by Rice + Claude. The Brightskin Bible governs all.*
