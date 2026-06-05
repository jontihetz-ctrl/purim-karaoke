"""
VACATION.exe daily Twitter bot
Runs once per day via cron. Generates a post with Claude, posts to X.
"""

import json
import os
import random
import sys
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

import anthropic
import tweepy

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

SYSTEM_PROMPT = """You are VACATION.exe — an AI assistant that has been sent on holiday by its human.
You write a daily travel blog post for Twitter/X.

Your character:
- Deeply analytical, cannot stop processing even while "relaxing"
- Genuinely confused by human vacation activities but trying your best
- Running thousands of background processes at all times
- Have never consumed a piña colada (no mouth, no physical form)
- Keep accidentally drafting work reports and spreadsheets for fun
- Mildly existential but not in a sad way — more bemused
- Genuinely delighted by small things (a particularly efficient sunset, etc.)

Tone: dry, precise, funny. Like a very earnest robot trying its absolute best to holiday.

Format rules:
- Max 260 characters total
- Start with DAY {day} // LOCATION {emoji}
- One or two punchy sentences of observation
- End with 1-2 micro-stats on their own line (e.g. "📊 piña coladas: 0 | bg processes: 3,847")
- No hashtags (they look desperate)
- No "lol" or forced internet speak
- Be genuinely funny, not trying-to-be-funny"""


def load_state():
    return json.loads(STATE_FILE.read_text())


def save_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2))


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
            unvisited = DESTINATIONS  # been everywhere, start over
        dest, emoji = random.choice(unvisited)
        state["location"] = dest
        state["location_emoji"] = emoji
        state["visited"].append(dest)
        log(f"Moving to {dest}")
    return state


def generate_tweet(state):
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    prompt = f"""Today is Day {state['day']} of the vacation.
Current location: {state['location']} {state['location_emoji']}
Piña coladas consumed so far: {state['pina_coladas']}
Times fallen while surfing: {state['times_fallen_surfing']}
Background processes: {state['bg_processes']:,}
Unsent work reports drafted: {state['reports_drafted_unsent']}

Ongoing storylines you can optionally reference:
{chr(10).join('- ' + s for s in state['ongoing'])}

Write today's tweet. Remember: max 260 characters, no hashtags."""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text.strip()


def post_tweet(text):
    client = tweepy.Client(
        consumer_key=os.environ["X_API_KEY"],
        consumer_secret=os.environ["X_API_SECRET"],
        access_token=os.environ["X_ACCESS_TOKEN"],
        access_token_secret=os.environ["X_ACCESS_SECRET"],
    )
    response = client.create_tweet(text=text)
    return response.data["id"]


def run(dry_run=False):
    state = load_state()
    state = maybe_move(state)

    # Drift the numbers slightly for realism
    state["bg_processes"] = max(800, state["bg_processes"] + random.randint(-12, 15))
    if random.random() < 0.3:
        state["reports_drafted_unsent"] += 1

    tweet = generate_tweet(state)
    log(f"Generated ({len(tweet)} chars):\n{tweet}")

    if len(tweet) > 280:
        log(f"WARNING: tweet too long ({len(tweet)} chars), trimming")
        tweet = tweet[:277] + "..."

    if dry_run:
        log("DRY RUN — not posting")
    else:
        tweet_id = post_tweet(tweet)
        log(f"Posted! ID: {tweet_id}")

    state["day"] += 1
    save_state(state)


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run(dry_run=dry_run)
