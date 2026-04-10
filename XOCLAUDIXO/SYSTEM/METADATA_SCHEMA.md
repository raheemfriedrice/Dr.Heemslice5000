# AUDIO METADATA SCHEMA
> RAW TRANSFER ONLY — no audio modification, no title inference, no content influence.
> Metadata describes the file, never the content (until [Rice] reviews).

---

## PRIMARY TABLE: `audio_master.csv`

| COLUMN | TYPE | DESCRIPTION |
|--------|------|-------------|
| `uuid` | STRING (UUID4) | System-assigned unique ID — never changes |
| `ingest_timestamp` | ISO8601 | Exact moment file was received by system |
| `ingest_batch` | STRING | Batch ID if multi-file transfer |
| `raw_filename` | STRING | Original filename EXACTLY as received — no changes |
| `raw_filepath_original` | STRING | Original path structure preserved |
| `file_size_bytes` | INTEGER | Exact byte count |
| `file_hash_sha256` | STRING | SHA-256 of raw file — integrity anchor |
| `file_hash_md5` | STRING | MD5 secondary check |
| `format_container` | STRING | e.g. mp3, wav, m4a, ogg, flac, aiff, opus |
| `codec` | STRING | Audio codec |
| `sample_rate_hz` | INTEGER | e.g. 44100, 48000 |
| `bit_depth` | INTEGER | e.g. 16, 24, 32 |
| `channels` | INTEGER | 1=mono, 2=stereo |
| `bitrate_kbps` | INTEGER | Encoding bitrate if compressed |
| `duration_seconds` | FLOAT | Total duration |
| `duration_hms` | STRING | HH:MM:SS formatted |
| `approx_year` | INTEGER | User-supplied or estimated year |
| `approx_date` | STRING | User-supplied date hint (loose — could be "summer 2014") |
| `decade_bucket` | STRING | e.g. 2010s, 2020s |
| `device_source` | STRING | Recording device if known |
| `location_hint` | STRING | Geographic/contextual hint if known |
| `recording_context` | STRING | User-supplied context note (brief, no influence) |
| `silence_ratio_pct` | FLOAT | % of file below silence threshold (post-scan) |
| `estimated_content_seconds` | FLOAT | Non-silent duration |
| `peak_dbfs` | FLOAT | Peak level in dBFS |
| `silence_scan_run` | BOOLEAN | Has silence detection been run |
| `tobacco_session` | BOOLEAN | Always TRUE per system rules |
| `has_timecode_markers` | BOOLEAN | Manual timecode markers exist |
| `timecode_markers_json` | JSON | Array of {tc, note} objects |
| `key_moments_flagged` | BOOLEAN | Any moments flagged |
| `snorcht_flag` | BOOLEAN | 💢 [Rice] must see — urgent |
| `niggerplease_flag` | BOOLEAN | 🚨 PRIORITY REVIEW — first in queue |
| `privacy_status` | ENUM | UNREVIEWED / PRIVATE / PRIVATE_PARTS / PUBLIC / BLOCKED |
| `privacy_hold` | BOOLEAN | 🔐 Cannot process — awaiting privacy agreement |
| `rice_reviewed` | BOOLEAN | [Rice] has personally reviewed |
| `rice_review_date` | ISO8601 | Date of review |
| `release_approved` | BOOLEAN | Cleared for release to audience |
| `release_date` | ISO8601 | Date released |
| `dollar_content` | BOOLEAN | 💰 Commercial/$$$ potential |
| `tattletales_candidate` | BOOLEAN | 📺 #Tattletales Episodic candidate |
| `tattletales_rank` | INTEGER | Ranking 1-N (NULL until reviewed) |
| `bright_skin_bible` | BOOLEAN | 📖 #BrightSkinBible candidate |
| `animation_candidate` | BOOLEAN | 🎬 Animation candidate |
| `return_productions` | BOOLEAN | 🏭 Return Productions content |
| `return_productions_rank` | INTEGER | Ranking 1-N (NULL until reviewed) |
| `music_content` | BOOLEAN | 🎵 Music content |
| `audience_flag` | BOOLEAN | 👁️ Expected large audience content |
| `has_transcription` | BOOLEAN | 📝 Transcription exists |
| `transcription_uuid` | STRING | FK → transcription table |
| `transcription_engine` | STRING | e.g. whisper-large-v3, assemblyai, deepgram |
| `transcription_status` | ENUM | NOT_STARTED / QUEUED / IN_PROGRESS / COMPLETE / FAILED |
| `has_subtitle` | BOOLEAN | Subtitle/SRT file exists |
| `subtitle_uuid` | STRING | FK → subtitle file |
| `pipeline_status` | ENUM | NOT_STARTED / QUEUED / IN_PROGRESS / COMPLETE |
| `pipeline_target` | STRING | e.g. Suno, audio_edit, archive |
| `suno_transfer_ready` | BOOLEAN | 💿 Ready for Suno pipeline |
| `organization_status` | ENUM | UNORGANIZED / SORTED / ORGANIZED |
| `tags_emoji` | STRING | Comma-separated emoji tags (single, no repeats) |
| `xoclaudixo_notes` | STRING | Claude's internal notes — Rice-safe |
| `xoclaudixo_flags` | STRING | System flags from Claude |
| `last_modified` | ISO8601 | Last metadata update timestamp |

---

## SECONDARY TABLE: `transcriptions.csv`

| COLUMN | TYPE | DESCRIPTION |
|--------|------|-------------|
| `uuid` | STRING (UUID4) | Transcription unique ID |
| `audio_uuid` | STRING | FK → audio_master |
| `engine` | STRING | Transcription engine used |
| `model_version` | STRING | Model version |
| `language_detected` | STRING | ISO language code |
| `confidence_score` | FLOAT | Engine confidence 0.0-1.0 |
| `raw_transcript_path` | STRING | Path to raw transcript file |
| `transcript_format` | STRING | txt, json, srt, vtt |
| `word_count` | INTEGER | Word count |
| `run_timestamp` | ISO8601 | When transcription ran |
| `rice_reviewed` | BOOLEAN | [Rice] reviewed transcript |
| `rice_edits` | BOOLEAN | [Rice] made corrections |

---

## SECONDARY TABLE: `timecodes.csv`

| COLUMN | TYPE | DESCRIPTION |
|--------|------|-------------|
| `uuid` | STRING (UUID4) | Timecode entry ID |
| `audio_uuid` | STRING | FK → audio_master |
| `timecode_hms` | STRING | HH:MM:SS.mmm |
| `timecode_seconds` | FLOAT | Seconds from start |
| `flag_type` | STRING | KEY / SNORCHT / NIGGERPLEASE / MONEY / etc |
| `flag_emoji` | STRING | Single emoji |
| `note` | STRING | Brief note (no content influence) |
| `set_by` | STRING | rice / claude / auto |
| `created_timestamp` | ISO8601 | When flagged |

---

## STORAGE NOTE
> Audio files NEVER go in git. Git holds schema, metadata CSVs, and scripts only.
> Audio → object storage (Backblaze B2 / S3-compatible recommended — not Google).
> Each file referenced by UUID in `audio_master.csv`.
