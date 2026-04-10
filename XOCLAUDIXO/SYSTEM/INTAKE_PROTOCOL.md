# RAW INTAKE PROTOCOL
> Rule #1: RAW TRANSFER ONLY. No modification. No influence. No renaming.

---

## INTAKE STEPS (in order)

1. File received → moved to `XOCLAUDIXO/INTAKE/` unchanged
2. UUID4 assigned immediately
3. `file_hash_sha256` computed — integrity locked
4. `raw_filename` + `raw_filepath_original` written to metadata — never altered
5. Technical metadata extracted (duration, codec, sample rate, etc.)
6. `privacy_hold = TRUE` set by default — 🔐 blocked until privacy agreement signed
7. `tobacco_session = TRUE` set — always
8. `niggerplease_flag` checked — if TRUE, file moves to REVIEW_QUEUE/NIGGERPLEASE/ FIRST
9. All other flags remain NULL until [Rice] reviews
10. File written to `audio_master.csv` row — status: UNREVIEWED

---

## WHAT CLAUDE DOES NOT DO
- Does NOT rename files
- Does NOT title recordings
- Does NOT infer content meaning
- Does NOT summarize what was said
- Does NOT process audio (no EQ, no normalization, no noise reduction)
- Does NOT route based on content (only on [Rice]-set flags)
- Does NOT release anything without `release_approved = TRUE`

---

## SILENCE HANDLING
- Files with high `silence_ratio_pct` are tagged 🔇
- Silence scan is OPTIONAL — must be explicitly triggered
- Long silence = expected, normal, not a flag for deletion
- A 4-hour file with 13 seconds of content is VALID and PRESERVED

---

## TRANSCRIPTION (non-Google options)
| ENGINE | TYPE | NOTES |
|--------|------|-------|
| `whisper.cpp` | Local / self-hosted | Recommended for privacy — no data leaves machine |
| `faster-whisper` | Local / self-hosted | GPU-accelerated option |
| `AssemblyAI` | Cloud API | Privacy policy review required |
| `Deepgram` | Cloud API | Privacy policy review required |
| `Rev.ai` | Cloud API | Privacy policy review required |
> Google / YouTube transcription: EXCLUDED by [Rice] rule.

---

## FILE ROUTING MAP

```
INTAKE/ ──→ NIGGERPLEASE flag? ──YES──→ REVIEW_QUEUE/NIGGERPLEASE/
             │
             NO
             ↓
         privacy_hold? ──YES──→ BLOCKED (stay in INTAKE until agreement signed)
             │
             NO
             ↓
         rice_reviewed? ──YES──→ route by content flags
             │                    ├─ PrivatePARTS → REVIEW_QUEUE/PrivatePARTS/
             │                    ├─ Tattletales  → REVIEW_QUEUE/Tattletales/
             │                    ├─ BrightSkinBible → REVIEW_QUEUE/BrightSkinBible/
             │                    ├─ ReturnProductions → REVIEW_QUEUE/ReturnProductions/
             │                    └─ release_approved → ARCHIVE/ (cleared)
             NO
             └──→ stays UNREVIEWED (no action taken)
```

---

## STORAGE ARCHITECTURE
```
PHYSICAL AUDIO FILES → Object Storage (Backblaze B2 or S3-compatible)
                        Bucket: dr-heemslice-raw-audio
                        Key format: {decade_bucket}/{uuid}.{ext}
                        ↑ NO Google Cloud Storage

METADATA → This repo (XOCLAUDIXO/METADATA/audio_master.csv)
SCRIPTS   → This repo (XOCLAUDIXO/SYSTEM/)
GIT RULE  → Audio extensions in .gitignore — never committed
```
