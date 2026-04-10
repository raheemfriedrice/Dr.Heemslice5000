# BOOLEAN RULE LIST — XOCLAUDIXO / CLaudio
> Numbered items = BOOLEAN response. TRUE = implemented/acknowledged. FALSE = not yet / blocked.

| # | RULE / ITEM | STATUS | NOTES |
|---|-------------|--------|-------|
| 1 | Ranking of #Tattletales Episodics | TRUE | `tattletales_rank` column in schema — NULL until [Rice] reviews |
| 2 | Organization | TRUE | Intake protocol + routing map defined |
| 3 | Animation | TRUE | `animation_candidate` boolean column in schema |
| 4 | #RAW | TRUE | Rule #1 — RAW TRANSFER ONLY — no modification ever |
| 5 | #BrightSkinBible | TRUE | `bright_skin_bible` boolean column in schema |
| 6 | #NIGGERPLEASE — review before anything else | TRUE | 🚨 PRIORITY QUEUE — routed first, before all other processing |
| 7 | TimeCode | TRUE | `timecodes.csv` table + `timecode_markers_json` in master |
| 8 | Subtitle | TRUE | `has_subtitle` + `subtitle_uuid` columns — non-Google transcription only |
| 9 | Transfer to Digital Pipeline (Suno, Gemini, Audio Editing) | TRUE | `pipeline_status` + `suno_transfer_ready` columns in schema |
| 10 | Return Productions — organize, reviewed & ranked | TRUE | `return_productions` + `return_productions_rank` columns in schema |
| 11 | [Rice] will not watch everything — large audience expected | TRUE | 👁️ `audience_flag` column — review standards enforced |
| 12 | Do not hallucinate | TRUE | ❓ tag for unknowns — Claude flags gaps, does not fill them |
| 13 | SNORCHT 💢 — single emoji, gets [Rice] attention | TRUE | 💢 = single instance only, no repeats — enforced in EMOJI_KEY |
| 14 | All numbered responses = BOOLEAN | TRUE | This table |
| 15 | Personal content organized FIRST | TRUE | Routing priority: personal → $$$ |
| 16 | Privacy agreement before upload | TRUE | 🔐 `privacy_hold = TRUE` default — blocked until signed |
| 17 | No Google/YouTube transcription | TRUE | Excluded — whisper.cpp / local options listed in INTAKE_PROTOCOL |
| 18 | No content influence (titling, summarizing, etc.) | TRUE | Claude generates technical metadata only |
| 19 | 4+ hours silence / 13 seconds content = valid | TRUE | Files preserved — silence ratio logged, nothing deleted |
| 20 | [#PrivatePARTS] gated separately | TRUE | `privacy_status = PRIVATE_PARTS` + separate review queue |
