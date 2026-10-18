# Step 2 of the parsha template: timing.
# Lays every segment and narration line on a timeline from the recorded narration lengths.
# Writes build/<id>/timeline.json, used by the visuals (build.py), music (music.py) and mix (mix.py).
import json, sys, pathlib, re
EP = sys.argv[1]
here = pathlib.Path(__file__).parent
ep = json.load(open(here / 'episodes' / f'{EP}.json'))
dur = json.load(open(here / 'build' / EP / 'voice.json'))
HEB = {k: v for k, v in json.load(open(here / 'hebrew.json')).items() if not k.startswith('_')}
def hebrew_subtitle(text):
    # Hebrew words appear in Hebrew letters. Each is wrapped in a right-to-left isolate (RLI…PDI) so it sits correctly
    # inside the English sentence (a left-to-right mark after it keeps following punctuation like ':' on the English side), and inner spaces become no-break spaces so a phrase never splits across lines.
    for word in sorted(HEB, key=len, reverse=True):
        he = HEB[word]['he'].replace(' ', ' '); suf = HEB[word].get('suffix', '')
        text = re.sub(r'(?<![\w-])' + re.escape(word) + r'(?![\w-])', '⁧' + he + '⁩‎' + suf, text, flags=re.I)
    return text
# Every scene type the visual library knows. Add new scenes here and in build.py (SCENE_FN).
SCENES = {'intro': 0, 'title': 1, 'corrupt': 2, 'tzaddik': 3, 'building': 4, 'animals': 5, 'rain': 6, 'inside': 7,
          'dove': 8, 'rainbow': 9, 'tower': 10, 'card': 11, 'outro': 12, 'command': 13, 'avram': 14,
          'creation': 15, 'creation2': 16, 'adam': 17, 'shabbos': 18, 'gan': 19, 'nachash': 20, 'exile': 21, 'kayin': 22, 'generations': 23,
          'call': 24, 'journey': 25, 'mitzrayim': 26, 'parting': 27, 'war': 28, 'malki': 29, 'stars': 30, 'name': 31, 'promise': 32}
LEAD, GAP, TAIL = 0.9, 0.55, 1.1          # seconds before first line, between lines, after last line
MIN = {'intro': 7.0, 'title': 6.5, 'outro': 7.0}
t = 0.0; segs = []
for si, s in enumerate(ep['segments']):
    name = s['scene']; card = s.get('card')
    scene_id = SCENES['card'] if (card and card['type'] in ('rashi', 'list')) else SCENES[name]
    lines = []; lt = LEAD if s.get('narration') else 0.0
    for li, text in enumerate(s.get('narration', [])):
        k = f's{si:02d}_{li:02d}'; lines.append({'key': k, 'start': round(t + lt, 3), 'dur': dur[k], 'text': hebrew_subtitle(text)}); lt += dur[k] + GAP
    length = max(lt - GAP + TAIL + s.get('pad', 0.0), MIN.get(name, 0.0))
    segs.append({'name': name, 'scene': scene_id, 'start': round(t, 3), 'end': round(t + length, 3), 'mood': s.get('mood', 'wonder'),
                 'src': s.get('src'), 'card': card, 'lines': lines})
    t += length
tl = {'id': EP, 'parsha': ep['parsha'], 'parshaHeb': ep['parshaHeb'], 'range': ep['range'], 'shabbos': ep['shabbos'],
      'channel': ep.get('channel', 'PARSHALAND'), 'duration': round(t + 0.5, 2), 'segments': segs}
json.dump(tl, open(here / 'build' / EP / 'timeline.json', 'w'), indent=1, ensure_ascii=False)
print(f"{len(segs)} segments, {t / 60:.1f} min")
