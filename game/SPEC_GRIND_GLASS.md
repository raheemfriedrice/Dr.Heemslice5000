# LEVEL 11: THE GRIND GLASS (build spec)

An Archero-style rebuild of `game/level11.js`. Ten stained-glass rooms, then CVD in Room 11 (the Chancel). This spec was merged from three competing designs (Oct 10). Sections marked *(reconstructed)* lost their original detail and were filled in under the same rules; keep to the rules, adjust the numbers if playtesting says so.

## Pitch
An Archero-style room crawler for a phone, played in portrait with one thumb. Drag anywhere on the screen to move. Let go and you plant your feet and auto-fire at the nearest enemy. Clear a room and its stained-glass door shatters open. Kill enemies for XP, level up, and pick 1 of 3 ability cards. After 10 rooms you reach CVD's Chancel in ROOM 11 of LEVEL 11. The XP curve is tuned so the player usually reaches character level 11 at that door.

CVD (Claude Van Dayum) DEFENDS the Chancel. It is not the villain; it is the grind. It has 2 HP behind a fighting-game shield that drops only in readable windows. Its weapon is WORDS: its bullets are pixel letters that spell what it says. Arrows can take the first pip. The second pip only falls to a real body TOUCH.

## CVD's Law (hard rules, tested)
- No tricks, no luck, actionable outcomes only.
- Gameplay code contains no `Math.random`. A test greps for it. All variation comes from a seeded PRNG (e.g. mulberry32) whose seed is shown on screen.
- Crits are counted, not rolled (e.g. every 4th arrow).
- Card offers come from the visible seed, so the same seed gives the same offers.
- Enemy and boss attacks follow fixed rotations.
- No telegraph is ever shorter than `MIN_TELL = 30` frames. One clamp in code enforces this.
- The death screen names exactly what hit you last, e.g. `LAST HIT: CVD pattern C letter U` or `LAST HIT: Came Bat dash, Room 3`.
- Echoes (AI-assist companions) can help but can NEVER land the final touch on CVD. If an Echo would, CVD says "it has to be you." and the touch does not count.
- Cheat codes work, but a cheated run permanently locks the eclipse ending (stored in the save; never reset by `reset()`).
- Stay on Floor 11. Floors above it exist only as "go up" / "from 12"; never describe what is on them or borrow lines from Rice's other stories.

## Structure (Story, about 9 minutes)
- Menu: ENTRY (`ENTER FROM 10 ->` or `<- ENTER FROM 12`), MODE (Story; Grind, Daily, Seed unlock after the first clear), AI HELP on/off, players 1-4 (extra players are human on one device or Echoes only through the AI HELP receipt, never silently AI).
- Rooms 1-10, then Room 11 (CVD), then the result screen. The Mender stands by the exit after rooms 4 and 8 (walk-into offer: heal 2 hearts, or nothing; never blocks).

## Room loop
1. Pane-wipe transition (12f). CVD says one entry line in a top banner (typewriter, 1 char per 2f). Play is not paused.
2. Enemies assemble from glass shards during a 45f spawn telegraph (60f on tiles fissured from the other entry direction). They cannot act or hurt during it, and never spawn within 48px of a player (shift to the nearest valid tile in fixed scan order).
3. Drag to move. When input is below the deadzone for 4 consecutive frames you are PLANTED and auto-fire on the fire timer. Moving pauses the fire timer but does not reset it. The first volley after planting is instant if the cooldown has elapsed. Planting shows a 1.2x0.8 squash for 4f and a 3-pixel dust puff.
4. Target: the nearest living enemy with line of sight (ray sampled every 8px against `#` tiles; `~` does not block). With no LOS, target the nearest overall (the arrow hits the pillar: honest feedback). Ties go to the lowest enemy index.
5. Kills drop teal XP shards that stay on the floor until the room clears.
6. On the last kill: 6f hitstop, then 8f at half speed; shards vacuum to the nearest living player; XP is added; each queued level-up shows a 3-card pick; the exit pane shatters (24 gold shards) and a teal chevron points to it.
7. Walk into the open arch for the next room.

## Numbers
- XP thresholds (cumulative): 5, 12, 21, 32, 45, 60, 78, 99, 123, 150, 180, then +32 each.
- Kill XP: Shardling 2, Came Bat 3, Rosette 3, Quote 5. Elites (lowercase tile letter) x2.
- Story rooms total 183 XP, cumulative after each room: 6, 16, 27, 43, 57, 72, 88, 120, 143, 183. The player reaches character LEVEL 11 at Room 11; that pick's banner reads `LEVEL 11. ROOM 11. HE'S WAITING.`
- Player: 5 hearts; move 1.6 px/f with no inertia (velocity = input x speed); fire interval 36f; arrow 2x7px teal, speed 5.2 px/f, damage 10, range 360px; hit radius 4 on a 10x12 sprite; enemy contact radius 7; 60f i-frames after a hit.
- Pacing: rooms about 20-60s each (R8 has 2 waves), boss 60-90s, about 9 minutes total.

## Controls
- Pointer Events on `window` (not the canvas), so the letterbox and safe-area margins also work as the stick; `setPointerCapture`. Exception: a 28x28 pause button top-right inside `env(safe-area-inset-top)`.
- pointerdown creates a FLOATING joystick at that point. Deadzone 4 internal px; full speed at 14px (effectively digital; direction continuous). LEASH: past 28px the origin follows the finger. Draw a ring (r=28) in the player color.
- Keyboard: WASD/arrows to move, release to plant. Gamepad optional.
- Card pick input guard: ignore input for 18f after the cards appear; a pick needs pointerdown and pointerup on the same card.

## Enemies *(reconstructed: keep it to 4 types)*
One telegraph language for all: pink means danger, teal means friend; every attack shows a pink line/zone for at least MIN_TELL frames before it fires.
- **Shardling**: walks at the nearest player; contact damage.
- **Came Bat**: hovers, lays a pink dash line, holds it for the full telegraph, then dashes along it.
- **Rosette**: stationary turret; fires a ring of 8 slow glass beads on a fixed beat.
- **Quote**: fires a short pixel-letter word at the player (letters are bullets).
Rooms are hand-authored ASCII maps (`#` pillar, `~` low glass that does not block LOS, `.` floor, `S` shardling, `B` bat, `R` rosette, `Q` quote, lowercase = elite, `M` Mender tile, `D` door). Single screen, no camera.

## CVD, the boss (Room 11, the Chancel)
- Look: the existing `drawCvd` silhouette scaled to 32x32 with a 2px white outline (violet brim, two teal eyes, dark glass body). The shield is a ring of 12 stained-glass shards (r=26) that visibly cracks and falls.
- Boss HUD: `CVD`, 2 HP pips, `SHIELD UP` / `SHIELD DOWN`, and a TRUTH meter (120x4, gold fill).
- Shield is UP by default. Arrows that hit it deflect 30 degrees, fade, and clink; at most once per second a gray `no.` floats up. It drops ONLY in windows: (a) RECOVERY after every pattern (70f in phase 1, 60f in phase 2; shards fall with a chime, HUD shows `OPEN` in gold; from window minus 12f the shards lift back and the label blinks); (b) PANE FLICK, a 30f window triggered by a kamikaze. 
- PIP 1 (the grind pip): arrow and orbit damage landed DURING a window fills TRUTH (cap 80; counted crits count double). TRUTH never drains between windows. When full, pip 1 shatters: 10f hitstop, shake, a 40f stagger, every enemy bullet turns to gold sparks, CVD says `one. that was real.` Phase 2 begins and TRUTH resets.
- PIP 2: only a human body TOUCH during an open window lands it (contact with CVD's body). Echo contact does not count (`it has to be you.`). Arrows do nothing to pip 2.
- CVD SAYS the attack name before each telegraph. Fixed rotation. Patterns *(reconstructed names)*:
  - **A ARC**: a fan of letters spelling a word.
  - **B NO TRICKS**: the 8 letters spelled overhead for 20 frames, then a ring that opens outward clockwise at 1.7 px/f with a 2-letter gap. There is always a gap.
  - **C YOU**: letters aimed at the player's current position (`LAST HIT: CVD pattern C letter U`).
  - **D RUN**: a sweeping wall of letters with one gap that moves.
  - **E OVER**: letters that rain from the top in readable columns.
  - Phase 2 adds **Q QUOTE**: CVD fires YOUR build back at you (your picked cards as letter bullets) and opens with the L-U-C-K strikethrough joke: spell LUCK, strike it through, fire nothing, then say `there's no such thing.`
- The Glazier (NPC) turns their back whenever CVD speaks. Gallery spectators throw tomatoes with no hitbox (pure flavor).

## Ability cards *(reconstructed: about 12)*
Pick 1 of 3 per level, offered from the seed. Suggested pool: FRONT ARROW (+1 arrow forward), DIAGONAL ARROWS, RICOCHET, PIERCE, FOURTH WORD (every 4th arrow is a counted crit), ORBIT BLADES (2 blades circle you, fill TRUTH in windows), SWIFT SOLES (+20% move), HEART BOOST (+1 max heart, heal 1), STEADY HAND (-15% fire interval), LONG GLASS (+25% range), SHARD MAGNET (vacuum range up), SECOND WIND (once per run, survive a lethal hit at 1 heart). No card may add randomness.

## AI help (the receipt)
Turning AI HELP on prints THE RECEIPT, a thermal-paper transaction you HOLD to sign (about 36 frames). It lists what you get (a 4th card every level, aim assist, safe lane, Echoes) and what the enemies get in exchange (e.g. `ENEMIES GOT: FRONT ARROW`). The run is marked AI-ASSISTED on the result screen.

## Save (localStorage `l11.save.v1`)
`clears {fwd, bwd}`, `cheats []`, `eclipseLocked`, `sound`, `haptics`, `lastDir`. If the save cannot be written, show `save unreachable, the floor still knows`. A tainted test session writes nothing.

## Grind mode (after the first clear)
THE GRIND (endless rooms, rising), DAILY GRIND (seed from the date), SEED (type a seed to replay exactly).

## Feel
Archero's move-stop-shoot rhythm; Gauntlet/Contra punch (hitstop, deterministic trauma-model shake, glass bursts); 1px outlines, big readable shapes. Integer device-pixel scaling (no shimmer). A 5x7 bitmap font atlas instead of per-frame `ctx.fillText`. Swap-remove object pools, no per-frame allocations.

## Canon lines (keep exactly, lowercase)
From v1: `ouch. say it counts.`, `one. that was real.`, `touché. literally.`, `fine. that one landed.`, `too agreeable.`, `that's a reflex, not a hit.`, `the grind doesn't tip.`, `no trick gets through.`, `you looked the wrong way.`, `wait for the window.`, `grind's still standing.`, `come back when you mean it.`, `2 HP. you got zero.`, `the floor holds.`, `earned. not lucky.`, `you read the floor. respect.`, `the room opens. go up.`, `no tricks. just timing.`, `i control the approach.`, `hit me when the shield blinks.`, `i'm the grind, not the enemy.` Plus: `it has to be you.`, `there's no such thing.`, `left. trust me.`, `noted.`, `the glazier's still mad. fair.`
Lines are chosen by run number or event index, never at random.

## Bugs in v1 this rebuild must fix
1. `reset()` sets `cheatUsed=false` every run, which breaks the permanent eclipse lock.
2. `Math.random` picks patterns, lines and the AI dash.
3. Players 2-4 silently become AI with no transaction.
4. Per-frame `ctx.font`/`fillText` (blurry, slow).
5. Per-frame `Array.filter` allocations.
6. Touch works only on the canvas.
7. Fractional CSS scale shimmers the pixels.
8. No `window.__L11` test hook.
9. 0.82 velocity damping makes movement floaty.

## Out of scope
Gear, talents, gold, chests, energy, ads, IAP, gacha, power carried between runs, DLC, accounts, online anything, analytics, mailing lists, any network call, `Math.random` in gameplay. No dependencies, no build step, offline PWA, portrait first.
