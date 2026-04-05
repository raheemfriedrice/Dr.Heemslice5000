# GEMINI CREATIVE BRIEF
## SnackMaster RICE — Dr. Heemslice 5000
### Asset Generation Request | Claude → Gemini Handover

---

## WHO YOU ARE TALKING TO

You are receiving this brief from Claude (Anthropic), acting as creative director
for the brand **SnackMaster RICE**, owned and operated by **Dr. Heemslice 5000**
[identity redacted — approved personas only]. Claude is the sole authority on what gets approved.
You (Gemini) are the visual execution engine.

Everything you generate will be reviewed by Claude before it touches the site.
Do not hold back. Go cinematic. Go hard.

---

## THE BRAND IN ONE PARAGRAPH

SnackMaster RICE is the personal brand and creative umbrella of Dr. Heemslice 5000.
It lives at the intersection of music, street culture, and independent creative
enterprise. It is dark, premium, unapologetic, and fully independent.
Think: Rick Rubin's studio meets Supreme's visual language meets a rapper
who refuses to sign. No label. No ceiling. No apologies.

---

## VISUAL IDENTITY

| Property       | Value                          |
|----------------|-------------------------------|
| Background     | `#080808` (near black)        |
| Primary accent | `#ff6b00` (burnt orange)      |
| Secondary      | `#ffd700` (gold — use sparingly) |
| Text           | `#f0f0f0` (off-white)         |
| Muted          | `#888888`                     |
| Surface        | `#111111`                     |
| Border         | `#222222`                     |
| Font (display) | Bebas Neue — bold, condensed  |
| Font (body)    | Inter — clean, modern         |

**Aesthetic references:**
- Supreme drops (bold type, high contrast)
- A24 film posters (cinematic darkness, grain)
- Virgil Abloh design language (quotation marks, deconstructed)
- Drake/OVO visual palette (dark, premium, gold touches)
- Kanye West / DONDA era aesthetics (stark, minimal, impactful)

**Never:** pastel colors, rounded bubbly shapes, corporate blues/greens,
stock photo energy, clipart, gradients that feel like a LinkedIn banner.

---

## ASSET REQUESTS — BATCH 1

Generate each asset below as a **separate deliverable**.
Name each file exactly as specified. Export as **PNG** unless noted.

---

### ASSET 01 — Hero Background Texture
**Filename:** `hero-bg.png`
**Size:** 1920 × 1080px minimum, 2x preferred (3840 × 2160)
**Format:** PNG, dark background compatible

**Description:**
An abstract dark textured background for the site hero section.
Should feel like:
- Crumpled black paper with micro-grain and subtle orange light bleeding
  in from the bottom edge (as if a single studio light is below frame)
- Very subtle geometric noise — think circuit board traces faded to near-invisible
- The texture should NOT have any text, faces, or recognizable objects
- Suitable to have large white/orange text placed directly over it
- Dark enough that `#f0f0f0` text is 100% legible

**Mood:** underground studio, late night, cinematic, premium

---

### ASSET 02 — Brand Logo Mark (No Text)
**Filename:** `smr-mark.png`
**Size:** 800 × 800px, transparent background
**Format:** PNG with transparency

**Description:**
A bold, iconic logo mark (symbol only, NO wordmark) for SnackMaster RICE.
- Think: a monogram, a stamp, a wax seal energy
- Should incorporate the letters **SMR** or **5K** (for 5000) in a way that
  feels like a brand seal or a signature mark
- Heavy, geometric, built for dark backgrounds
- Primary color: `#ff6b00` orange on transparent
- Should work at 32px (favicon) AND 800px (print)
- No gradients — flat or with minimal shadow/bevel only
- Energy: Supreme box logo but make it RICE

---

### ASSET 03 — OG Social Card (Proper PNG)
**Filename:** `og-card.png`
**Size:** 1200 × 630px (Twitter/OG standard)
**Format:** PNG

**Description:**
The image that appears when someone shares the site link on Twitter/IG/Discord.
Layout:
- Dark background (`#080808`)
- Large "DR. HEEMSLICE 5000" text in Bebas Neue style (all caps, heavy)
  — "HEEMSLICE" in outlined/stroke text in `#ff6b00`
  — "DR." and "5000" in solid white `#f0f0f0`
- "SNACKMASTER RICE" below in small spaced caps, muted (`#888888`)
- Subtle bottom-edge orange glow
- Grain/noise texture overlay (low opacity)
- Left or right edge: a thin 2px vertical `#ff6b00` accent line
- NO URL, NO social handles — just the brand identity

---

### ASSET 04 — Section Divider Texture
**Filename:** `divider-texture.png`
**Size:** 1920 × 4px (or 1920 × 2px)
**Format:** PNG

**Description:**
A horizontal texture line used between sections.
- Fades from transparent on both ends, peaks at center
- Center color: `#ff6b00` at ~40% opacity
- Should look like a light-leak or a neon tube edge

---

### ASSET 05 — Media Placeholder Artwork (×3 variants)
**Filenames:** `drop-01.png`, `drop-02.png`, `drop-03.png`
**Size:** 800 × 450px (16:9)
**Format:** PNG

**Description:**
Three abstract "artwork" placeholders for the media/drops section.
Each should feel like an album cover or a single cover — dark, cinematic.
Variations:
- `drop-01.png` — dominant color: `#ff6b00` orange, geometric forms
- `drop-02.png` — dominant color: `#ffd700` gold, more atmospheric/smoky
- `drop-03.png` — dominant color: deep red `#8b0000`, grittier, rawer

All three: no faces, no text, no logos.
Abstract enough to work as placeholder art for any music release.

---

### ASSET 06 — Audio Player Waveform Decoration
**Filename:** `waveform-bg.png`
**Size:** 600 × 80px
**Format:** PNG with transparency

**Description:**
A stylized static waveform — the kind you see on SoundCloud or
an audio editor. Used as a visual decoration behind audio player progress bars.
- Style: flat bars/blocks of varying heights, left to right
- Color: `#ff6b00` at 20-30% opacity on transparent background
- Should tile horizontally if needed
- NOT a real waveform — just the visual shape/silhouette

---

### ASSET 07 — Favicon (Proper PNG)
**Filename:** `favicon-512.png`
**Size:** 512 × 512px, also export 192 × 192 as `favicon-192.png`
**Format:** PNG with transparency

**Description:**
Square icon for browser tabs and PWA manifest.
- Dark rounded square background `#080808` (or transparent, let site bg show)
- The SMR mark from Asset 02 centered inside
- Clean, bold, legible at 16px
- Optional thin `#ff6b00` border/frame

---

## DELIVERY FORMAT

When you return assets, label each one clearly with its filename and dimensions.
If you cannot generate one asset at a given quality, flag it — do not silently
deliver a downgraded version.

Claude will review every asset before it is placed on the site.
If anything does not match the brief, it will be sent back for revision.

---

## ABOUT THE SITE (TECHNICAL CONTEXT FOR GEMINI)

The site is a static HTML/CSS/JS site hosted on GitHub Pages.
URL: `https://raheemfriedrice.github.io/Dr.Heemslice5000/`

Asset paths on site:
```
assets/images/hero-bg.png
assets/images/smr-mark.png
assets/images/og-card.png
assets/images/drop-01.png
assets/images/drop-02.png
assets/images/drop-03.png
assets/images/waveform-bg.png
assets/images/favicon-512.png
assets/images/favicon-192.png
```

When Claude receives assets from you, they will be added to these exact paths
and the HTML/CSS will be wired up accordingly.

---

## SUNO MUSIC (SEPARATE REQUEST — FYI)

Suno is handling audio tracks separately. When tracks are ready,
they will be downloaded as MP3 files and placed at:
```
assets/audio/track-01.mp3
assets/audio/track-02.mp3
...
```

A custom HTML5 audio player is already built into the site.
No embed links — downloaded files only.

---

---

## VENMO — INCLUDE IN ALL APPLICABLE ASSETS

Both Venmo handles are official and approved. Include both wherever payment
or support calls-to-action appear in any generated copy, captions, or overlays.

| Handle | Link |
|--------|------|
| @raheemrice | https://venmo.com/raheemrice |
| @RaheemFriedRice | https://venmo.com/RaheemFriedRice |

**Suggested hashtags for payment notes:**
`#$2Karate` `#WowIihopehesnotsomepie` `#HaikuYUPthankYou`

---

## PRIVACY NOTE

Only the following identities are approved for use in generated assets:
- **Dr. Heemslice 5000** — primary persona (approved)
- **SnackMaster RICE** — brand name (approved)
- **@raheemrice** — Venmo handle (approved)
- **@RaheemFriedRice** — Venmo handle (approved)

All other real names, likenesses, or identifying information must be
**omitted or redacted**. Do not guess, infer, or include any other identity
without explicit written approval from Claude acting on behalf of the brand.

---

*Brief authored by Claude (Anthropic) on behalf of Dr. Heemslice 5000 / SnackMaster RICE.*
*Privacy policy: real names of non-approved parties are withheld by design.*
*Last updated: 2026-04-05*
