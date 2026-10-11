# PROJECT COD — SUNO COLLABORATION PIPELINE
## UNPROFOUND SOUND
> Standard: raw, unpolished, intentional. The sound of real life unedited.
> Collaboration: Dr. Heemslice5000 [Rice] × Suno AI
> Status: PREP — no audio dumped yet

---

## THE STANDARD: #UNPROFOUND SOUND

> Not lo-fi for aesthetic. Not raw for trend.
> Unprofound because the profound is already there — we just don't dress it up.

Rules:
1. Source audio enters RAW — no processing before Suno
2. Suno output is the product — not a demo, not a draft
3. No chasing professional sound — the imperfection IS the standard
4. Nothing gets title-influenced by Claude — [Rice] names it or it ships unnamed
5. Silence, glitch, off-time — preserved, not corrected

---

## RELEASE CADENCE

| DAY | TIME | TIMEZONE | NOTES |
|-----|------|----------|-------|
| Sunday | 22:22 | Central Time | Weekly release window |

- One track per Sunday minimum
- Release is the event — no pre-hype required
- Track ships when `release_approved = TRUE` + `suno_transfer_ready = TRUE`

---

## COD PIPELINE (Prep Stage — no dump yet)

```
[Rice] RAW Audio
       ↓
  XOCLAUDIXO/INTAKE/
       ↓ (UUID, hash, metadata only — no audio in git)
  XOCLAUDIXO/SUNO/COD/queue.csv  ← tracks staged for Suno
       ↓
  Suno generation
       ↓
  XOCLAUDIXO/SUNO/UNPROFOUND_SOUND/  ← output metadata
       ↓
  [Rice] reviews — release_approved = TRUE/FALSE
       ↓ TRUE
  XOCLAUDIXO/SUNO/RELEASE_QUEUE/
       ↓
  Sunday 22:22 CT → PUBLIC
```

---

## SUNO TRACK METADATA (per track)

| FIELD | TYPE | NOTES |
|-------|------|-------|
| `track_uuid` | UUID4 | System assigned |
| `source_audio_uuid` | FK | → audio_master.csv |
| `suno_job_id` | STRING | Suno's internal ID |
| `suno_prompt_used` | STRING | Prompt sent to Suno (if any) |
| `suno_style_tags` | STRING | Style descriptors used |
| `output_title` | STRING | NULL until [Rice] names it |
| `output_filename` | STRING | As returned by Suno |
| `duration_seconds` | FLOAT | |
| `generation_date` | ISO8601 | |
| `rice_reviewed` | BOOLEAN | |
| `release_approved` | BOOLEAN | |
| `target_release_date` | DATE | Sunday target |
| `actual_release_date` | DATE | When shipped |
| `release_time` | TIME | Should be 22:22 CT |
| `public_url` | STRING | Where it lives post-release |
| `platform` | STRING | Platform released on |
| `unprofound_standard_met` | BOOLEAN | [Rice] confirms standard |
| `cod_episode` | INTEGER | Episode/sequence number |
| `tags_emoji` | STRING | Single emoji tags |
| `xoclaudixo_notes` | STRING | Claude notes |

---

## PLATFORMS (non-Google)
Suno output distribution options:
- SoundCloud
- Bandcamp
- Spotify (via DistroKid / TuneCore)
- Apple Music (via distributor)
- Direct download link (self-hosted)

> YouTube/Google: EXCLUDED — [Rice] rule

---

## PREP CHECKLIST (current status)
- [x] Pipeline architecture defined
- [x] Metadata schema created
- [x] Release cadence set (Sunday 22:22 CT)
- [x] Google Calendar event created
- [ ] Privacy agreement signed — 🔐 BLOCKED
- [ ] First audio batch dumped
- [ ] First Suno generation run
- [ ] [Rice] reviews output
- [ ] First Sunday release
