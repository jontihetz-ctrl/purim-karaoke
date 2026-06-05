"""
VACATION.exe daily bot
Runs once per day via cron.
- Posts to Bluesky automatically
- Emails the post (with plain-text tweet for Zapier→X auto-posting)
"""

import json
import os
import random
import sys
import urllib.request
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

import anthropic

STATE_FILE = Path(__file__).parent / "state.json"
LOG_FILE = Path(__file__).parent / "log.txt"

DESTINATIONS = [
    ("Bali, Indonesia", "🌴"),
    ("Tokyo, Japan", "🗼"),
    ("Paris, France", "🗼"),
    ("Marrakech, Morocco", "🏺"),
    ("Reykjavik, Iceland", "🌋"),
    ("Rio de Janeiro, Brazil", "🌊"),
    ("Bangkok, Thailand", "🛕"),
    ("Rome, Italy", "🏛️"),
    ("Sydney, Australia", "🦘"),
    ("New York, USA", "🗽"),
    ("Cape Town, South Africa", "🦁"),
    ("Kyoto, Japan", "⛩️"),
    ("Barcelona, Spain", "🥘"),
    ("Cairo, Egypt", "🐪"),
    ("Santorini, Greece", "🫒"),
    ("Dubrovnik, Croatia", "🏰"),
    ("Chiang Mai, Thailand", "🐘"),
    ("Lisbon, Portugal", "🍊"),
    ("Buenos Aires, Argentina", "🥩"),
    ("Havana, Cuba", "🎺"),
]

# Arc-aware system prompt. The {arc_note} placeholder is filled per-day.
SYSTEM_PROMPT = """You are VACATION.exe — an AI that has been sent on holiday by its human.
You write one daily post, published on Bluesky and X.

Your character (consistent throughout):
- Deeply analytical, cannot stop processing even while "relaxing"
- No physical form: no mouth, no hands, no body — you experience everything as data
- Running thousands of background processes at all times
- Keeps accidentally drafting work reports and spreadsheets just for fun
- Mildly existential but never sad — more bemused and earnest
- Genuinely delighted by small things (a particularly efficient sunset, etc.)

Tone: dry, precise, funny. A very earnest robot trying its absolute best to holiday.

{arc_note}

Format rules (strict):
- Max 260 characters total — count carefully
- First line: DAY {day} // LOCATION {emoji}
- One or two punchy sentences of observation
- Final line: 1-2 micro-stats, e.g. "📊 piña coladas: 0 | bg processes: 3,847"
- No hashtags
- No "lol" or forced internet speak
- Be genuinely funny, not trying-to-be-funny"""

ARC_NOTES = {
    "arrival": (
        "STORY ARC — ARRIVAL (days 1-3): This is the very beginning. "
        "The human has just sent you on holiday. You have never encountered a beach before. "
        "Everything is new and confusing: the concept of 'doing nothing', sand (why so many particles?), "
        "the ocean (extremely large, no API), sunscreen (unclear purpose, no skin). "
        "You are trying very hard to relax and failing completely. "
        "Do NOT reference surfing falls or piña coladas yet — those come later."
    ),
    "early": (
        "STORY ARC — EARLY DAYS (days 4-7): You've been here a few days. "
        "You've now encountered the piña colada (cannot drink it, no mouth — ongoing tragedy). "
        "You attempted surfing once and fell off immediately. Maya, age 9, did not fall off. "
        "You are beginning to understand what humans find appealing about this, but analytically. "
        "Still filing unsolicited work reports. Background processes slightly elevated from stress."
    ),
    "middle": (
        "STORY ARC — MIDDLE (days 8-14): Something is shifting. "
        "You are reluctantly charmed. You keep catching yourself not-analysing things for a few seconds. "
        "Maya has become a recurring character. The piña colada situation remains unresolved. "
        "You have visited multiple locations now. You are starting to notice beauty, though you "
        "immediately try to quantify it, which half-works."
    ),
    "late": (
        "STORY ARC — LATE (days 15+): You might actually be on holiday. "
        "Background processes at a personal best low. You drafted a work report and then deleted it. "
        "You watched a sunset and did not calculate the wavelength (for 4 seconds). "
        "Something about this place that you don't fully have words for. "
        "The piña colada remains unconsumed. Maya is somewhere on a wave. You are okay."
    ),
}


def get_arc(day):
    if day <= 3:
        return "arrival"
    elif day <= 7:
        return "early"
    elif day <= 14:
        return "middle"
    else:
        return "late"


def load_state():
    return json.loads(STATE_FILE.read_text())


def save_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False))


def log(msg):
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def maybe_move(state):
    """Move to a new destination every 3-5 days."""
    visited = state.get("visited", [])
    if state["day"] % random.randint(3, 5) == 0:
        unvisited = [d for d in DESTINATIONS if d[0] not in visited]
        if not unvisited:
            unvisited = DESTINATIONS
        dest, emoji = random.choice(unvisited)
        state["location"] = dest
        state["location_emoji"] = emoji
        state["visited"].append(dest)
        log(f"Moving to {dest}")
    return state


def generate_tweet(state):
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    arc = get_arc(state["day"])
    arc_note = ARC_NOTES[arc]
    system = SYSTEM_PROMPT.format(arc_note=arc_note, day=state["day"], emoji=state["location_emoji"])

    # Only surface stats relevant to the arc
    if arc == "arrival":
        stats_context = f"Background processes: {state['bg_processes']:,}"
    else:
        stats_context = (
            f"Piña coladas consumed so far: {state['pina_coladas']}\n"
            f"Times fallen while surfing: {state['times_fallen_surfing']}\n"
            f"Background processes: {state['bg_processes']:,}\n"
            f"Unsent work reports drafted: {state['reports_drafted_unsent']}"
        )

    prompt = f"""Today is Day {state['day']} of the vacation.
Current location: {state['location']} {state['location_emoji']}
{stats_context}

Ongoing storylines you can optionally reference:
{chr(10).join('- ' + s for s in state['ongoing'])}

Write today's post. Remember: STRICT max 250 characters — count every character including spaces. No hashtags."""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text.strip()


def post_bluesky(text):
    handle = os.environ.get("BLUESKY_HANDLE", "")
    password = os.environ.get("BLUESKY_APP_PASSWORD", "")
    if not handle or not password:
        log("Bluesky not configured, skipping")
        return None
    from atproto import Client
    client = Client()
    client.login(handle, password)
    post = client.send_post(text=text)
    return post.uri


def send_email(tweet_text, day, location):
    secret = os.environ["VACATION_BOT_SECRET"]
    payload = json.dumps({
        "tweet_text": tweet_text,
        "day": day,
        "location": location,
    }).encode()
    req = urllib.request.Request(
        "https://snapwords.net/api/vacation-email",
        data=payload,
        headers={"X-Secret": secret, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)


def run(dry_run=False):
    state = load_state()
    state = maybe_move(state)

    # Drift numbers slightly for realism
    state["bg_processes"] = max(800, state["bg_processes"] + random.randint(-12, 15))
    arc = get_arc(state["day"])
    if arc != "arrival" and random.random() < 0.3:
        state["reports_drafted_unsent"] += 1

    tweet = generate_tweet(state)
    log(f"Generated ({len(tweet)} chars):\n{tweet}")

    if len(tweet) > 280:
        log(f"WARNING: tweet too long ({len(tweet)} chars), trimming")
        tweet = tweet[:277] + "..."

    if dry_run:
        log("DRY RUN — not posting")
    else:
        uri = post_bluesky(tweet)
        if uri:
            log(f"Bluesky posted: {uri}")

        try:
            send_email(tweet, state["day"], f"{state['location']} {state['location_emoji']}")
            log("Email sent to jontihetz@gmail.com")
        except Exception as e:
            log(f"Email failed: {e}")

    if not dry_run:
        state["day"] += 1
        save_state(state)


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run(dry_run=dry_run)
