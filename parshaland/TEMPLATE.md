# Parshaland — weekly episode template

One episode per week, about 3–4 minutes, for Orthodox kids. **A flowing summary of the whole parsha**, told as a story from start to finish. It has a narrator, subtitles with the Hebrew words written in Hebrew, fully animated colour characters, and original music. Rashi is the source for any detail beyond the pesukim, woven quietly into the story, with no separate "Rashi says" cards.

**The narrator is a real person**, the channel owner. They record the script on their phone, and the build converts their reading into the channel's narrator voice ("voice C"), keeping their delivery and Hebrew pronunciation exactly.

## The episode format (same every week)

| # | Segment | What it is |
|---|---------|------------|
| 1 | **Channel intro** (7s) | Golden letters swirl into **PARSHALAND – Torah stories for kids** |
| 2 | **Title card** | Illuminated parchment: *Parshas ___*, Hebrew name, pesukim range, Shabbos date. The narrator says "This week's parsha is Parshas ___!" |
| 3 | **The story** (10–12 scenes) | The parsha in order, one animated scene per part of the story. Each scene shows its pasuk reference in a small pill, top left |
| 4 | **Teaser** | One line pointing to next week's parsha ("And that's a story for next week!") |
| 5 | **Good Shabbos** | Shabbos candles, challah, "See you next week!" |

## Content rules

- **Source:** pshat of the pesukim. If a detail isn't in the pasuk, it must come from Rashi, **checked against the text on Sefaria** before it goes in the script. Examples: the 120 years of building, the moon made smaller and given the stars, Adam davening for rain.
- **Characters:** full colour, animated, with friendly faces (big eyes, beards, turbans, robes). They walk, point, hammer and talk. No silhouettes.
- **Hashem:** never depicted. Only light from above, and the word *Hashem*.
- **Angels:** shown only as radiant light, never as figures.
- **Modesty:** women may be drawn when dressed modestly: hair fully covered (tichel), high neckline, long sleeves, floor-length dress (`Person.female = 1`, presets `sarai()`, `womanP(id)`). Men are always fully clothed, Adam included.
- **Draw the picture from Rashi too, not only the narration.** The visuals must not contradict Rashi even where the narration simplifies. Examples:
  - Before Adam's tefillah, the plants waited just under the ground (2:5), so show bare earth with sprouts and no grass or trees until the rain.
  - The nachash had legs (3:14).
- **Adam is not shown before the sin** (he wasn't clothed). He appears only after eating from the tree, clothed.
- **Violence:** never shown. A hard moment (e.g. Kayin and Hevel) is told in one gentle sentence; the picture darkens and the scene moves on.
- **No religious symbols of other faiths:** check costumes and props for accidental crosses (e.g. a robe trim crossing a belt, or a scaffold pole poking through a plank).
- **Idols:** shown only as plain, unattractive objects, and only when the story needs them.
- **Hebrew words** (names, places, terms) are **written in Hebrew letters with nikud** in the subtitles. Explain terms in the same sentence ("a תֵּבָה, a giant ark made of wood"). Write the script in English letters; the build converts them using `hebrew.json`. Pronunciation is the narrator's own (Ashkenazi).
- **Names: check the spelling in the pasuk.** Some names change form at a pause in the verse, e.g. יֶפֶת (Yefes) becomes יָפֶת at a sof pasuk or esnachta. Use the regular form.
- **Tone:** inspiring and warm, never scary. Hard parts (the flood, punishments) are told gently and briefly.

## How to make next week's episode

1. **Write the script.** Copy an existing `episodes/<parsha>.json` and fill in the segments:
   - `scene`: which animated scene to show (see the library below).
   - `mood`: drives the music. Use `wonder`, `dark`, `build`, `storm`, `hope` or `joy`.
   - `src`: the pasuk reference shown on screen, e.g. `"Bereishis 12:1–3"`.
   - `narration`: short, clear sentences, one per line. Each line becomes a subtitle. About 35 lines (500 words) is roughly 3½ minutes.
   - Keep the first segments `intro` and `title`, and the last segment `outro`.
   - Look up the Shabbos date with hebcal and put it in `"shabbos"`.
2. **New Hebrew words or names?** Add each one to `hebrew.json` with its Hebrew spelling, e.g. `"Avraham": {"he": "אַבְרָהָם", "say": ""}`. Any word not listed stays in English letters in the subtitles, so check every name in the script against the list.
3. **Send the narrator the script** (`<Parsha>_narration_script.txt`, made from the episode file) with the recording tips at the top:
   - quiet, soft room; phone a hand's width from the mouth, slightly to the side; airplane mode;
   - read it all in one go, with about 2 seconds between lines;
   - if you make a mistake, pause and re-read the line (the last try is kept);
   - warm and a little slow, like a bedtime story.
4. **New scenes.** Each parsha needs its own animated scenes. For each scene:
   - Write a function (Bereishis scenes live in `scenes3.glsl`, Noach in `scenes2.glsl`) built from the character and scenery kit below.
   - Add it to the `switch` in `scene.frag`, its name in `plan.py` → `SCENES`, and its exposure in `build.py` → `EXPO`. Add it to the camera push-in list in `main()` unless the overlay draws labels on top of it.
   - Stage action by `k = lt / uDur` (fraction of the scene), not by fixed seconds, because scene length follows the narration.
   - Keep characters and animals above about `y = -0.32`, or the subtitles will hide them.
   - Draw `mountains()` **before** the ground and sea, never after (it fills everything below its ridge).
   - Check stills before the full render, with a temporary `voice.json` of estimated line lengths: `FILM=$PWD/build/<parsha>/film.html node stills.mjs <seconds> …`.
5. **Process the narration** (`narr_<parsha>/`, scripts copied from `narr/`):
   - `transcribe.py`: word timings for the whole recording (faster-whisper).
   - `split.py`: matches the recording to the script lines. Each cut goes in the **longest stretch of real silence** between lines. Don't trust word timings for this, because they stretch over pauses and misread Hebrew names.
     Transcribe the cut clips to confirm each line starts and ends correctly.
     **Check every cut clip in verbatim mode** (`medium.en` with a disfluency prompt like "Umm, so, uh, Hashem spoke to- to Avram"). Normal transcription hides restarts and repeated words ("called out, called out, and called out"). Cut each one at the quietest point and re-check.
     **Then check each line piece by piece** (`narr/pieces.py line_*.wav`): it splits every clip at its pauses and transcribes each piece on its own. Whole-line transcription can swallow a false start plus a retake ("…Sodom and Amorah — uh, let's — Gomorrah — Hashem told…") into what reads like one clean sentence. Check any line that is much longer than its words need, or has a long pause in it.
     **Never kill with a pattern** (`pkill -f`, `pgrep -f … | xargs kill`): it matches your own shell. Kill exact process IDs.
   - `vc_lines.py` + `vc_slow.py` + `pick_vc.py`: convert every line to voice C (Chatterbox voice conversion, target `targets/C.wav`, a synthetic voice, no real person). Each line is converted at normal speed and with the source slowed to 0.85× and 0.75×, then sped back. The clearest of the three is kept. Fast speech garbles in conversion; slowing the source fixes it.
   - `lovely.py`: the kid-friendly finish. It lifts pitch about 1.5 semitones and restores melody (×1.55, smoothed so the pitch can't jump octaves). It then adds soft, warm, sparkly EQ, gentle compression and a short room tone. It is adaptive: each line gets the most melody that keeps it as clear as the narrator's own reading.
   - Copy `lovely2/C_<line>.wav` into `build/<parsha>/voice/` and write `voice.json` from their lengths.
6. **Build it:** `./make_episode.sh <parsha>` (it skips the voice step when `voice.json` exists). This times every scene to the narration, builds the visuals, composes and mixes the music, renders in resumable 10-second chunks, and writes `build/<parsha>/Parshas_<Name>_1080p.mp4` (YouTube) and `_720p.mp4` (phones/WhatsApp). A full render takes about 2½ hours.
   - To fix one scene after a render, delete only that scene's `chunkN.ok` files and run the command again.
   - To fix one narration line after a render, replace its file in `voice/`, run `mix.py`, then re-mux the existing chunks with the new soundtrack. The line must fit its old slot. This takes about 10 minutes and needs no re-render.
7. **Check before sending:** a frame from the middle of every scene, a full decode with no errors, and loudness −14 LUFS.

## Running the render reliably

- Start the render once, detached (`setsid nohup ./make_episode.sh <parsha> &`), and confirm **exactly one** `make_episode.sh` process is running. Two copies write the same chunk files and slow each other down.
- Keep the machine awake with a background watcher (`until [ -f build/<parsha>/done.flag ] …`). Watchers stop after 2 hours, so restart one if the render is longer.
- Never use broad `pkill -f` patterns: they match the shell running the command. Kill specific process IDs.
- A wait-loop that checks `pgrep -f "<script> <args>"` can match the parent shell that launched it. Check the actual process, or wait on a flag file.

## Character and scenery kit

- **`Person`** with `drawPerson()`: robe colour, tunic, belt, turban, beard (colour and length), facing, arm angles, walk cycle, talk, blink, brow, look direction, and a held tool (1 hammer, 2 bucket, 3 plank, 4 staff, 5 saw, 6 brick).
  - Presets: `noach()`, `son(i)`, `townsperson(id)`, `adam()`, `kayin()`, `hevel()`. Add new ones per parsha (e.g. `avram()`, `lot()`).
- **`drawAnimal(kind)`**: 0 elephant, 1 giraffe, 2 lion, 3 zebra, 4 sheep, 5 rabbit.
- **`drawBird`** (optionally carrying an olive leaf), **`drawArk(built, doorOpen)`**, **`fruitTree`**, **`flower`**, **`palm`**.
- **Scenery:** `skyGrad`, `clouds2D`, `stars`, `sunRays`, `mountains` (layered, hazed), `treeRow` (olive trees and cypresses), `grass` (blades, wildflowers, cloud shadows), water and waves, `rainStreaks`, `flame`, candle light, `motes`.
- **Shading:** `ink()` gives every shape an outline and rounded "volume" shading. Set `VOL` (0 to 1) per part: full volume on robes and arms, less on faces, 0 on small details like beards and hands.

## Scene library

`intro`, `title`, `outro`, plus:

**Bereishis**
- `creation`: darkness, the light, the sky, dry land with grass and trees.
- `creation2`: the sun and moon (the moon shrinks and gets the stars), fish, birds, animals.
- `adam`: Adam names the animals (Hebrew names appear above each), then davens for rain and flowers spring up.
- `shabbos`: the world at rest in golden light, with a glowing שַׁבָּת.
- `gan`: Gan Eden, the river, the Tree of Life (glowing) and the Tree of Knowledge.
- `nachash`: the snake on the branch; later Adam with the fruit.
- `exile`: the gate of Gan Eden, the turning fiery sword, angels as light, Adam working the hard land.
- `kayin`: the two korbanos, fire from heaven, then Kayin wandering.
- `generations`: ten lanterns along a path, Adam to Noach, with names and ages.

**Noach**
- `corrupt`: the city, stealing, an idol (also used for "the world filled with wrongdoing").
- `tzaddik`: Noach in light from above.
- `command`: the plan of the teivah drawn in light.
- `building`: Noach on the scaffold with his sons, plus a year counter.
- `animals`: pairs walking to the teivah.
- `rain`: gentle rain becoming the flood.
- `inside`: feeding the animals by the tzohar's light.
- `dove`: the teivah on Ararat, Noach at the window.
- `rainbow`: korbanos and the keshes.
- `tower`: Bavel and the mixed-up languages.
- `avram`: Avram's encampment under the stars.

## Settings

- **Channel name:** `"channel"` in the episode file: `PARSHALAND`.
- **Narrator voice:** voice C (`narr/targets/C.wav`) with the `lovely.py` finish (lift 1.5 semitones, melody up to ×1.55).
- **Output:** 1920×1080, 24 fps, H.264 + AAC, loudness −14 LUFS (YouTube standard).
- **YouTube description:** title "Parshas ___ for Kids | Animated Parsha Story | Parshaland", a short story summary, the pesukim range, "told simply from the pesukim, with details from Rashi", and hashtags.

## Notes from the narrator

- **Slow the voice down** (asked after Lech Lecha, for the next episode on). Try a gentler pace in voice conversion and longer gaps between lines.
- **Visuals must be exciting:** moving camera with depth layers, lots of scenery, crowds, animals, birds, sparkles and light, with action timed to each line (`LS(i)`). See `glsl/life.glsl` and the Lech Lecha scenes.
