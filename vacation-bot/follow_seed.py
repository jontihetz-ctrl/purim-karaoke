"""
One-time seed follow script.
Follows ~150 relevant Bluesky accounts to bootstrap visibility.
Run once: python3 follow_seed.py
"""

import os
import time
import random
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from atproto import Client

client = Client()
client.login(os.environ["BLUESKY_HANDLE"], os.environ["BLUESKY_APP_PASSWORD"])
my_did = client.me.did

print(f"Logged in as {os.environ['BLUESKY_HANDLE']} ({my_did})")

candidates = {}  # did -> handle

def add_actor(actor):
    if actor.did != my_did and not actor.viewer.following:
        candidates[actor.did] = actor.handle

# 1. Followers of well-known tech/AI/humor accounts
SEED_ACCOUNTS = [
    "pfrazee.com",          # Paul Frazee - Bluesky founder, tech crowd
    "theverge.com",         # The Verge - tech audience
    "simonwillison.net",    # Simon Willison - AI/dev tools
]

print("\n--- Harvesting followers of seed accounts ---")
for handle in SEED_ACCOUNTS:
    try:
        resp = client.app.bsky.graph.get_followers({"actor": handle, "limit": 100})
        for f in resp.followers:
            add_actor(f)
        print(f"  {handle}: +{len(resp.followers)} candidates (total: {len(candidates)})")
    except Exception as e:
        print(f"  {handle}: skipped ({e})")
    time.sleep(1)

# 2. Search for relevant keywords
SEARCH_TERMS = [
    "AI travel",
    "machine learning humor",
    "tech comedy",
    "AI bot",
    "robot vacation",
    "developer humor",
    "traveling software",
    "AI daily",
]

print("\n--- Searching by keyword ---")
for term in SEARCH_TERMS:
    try:
        resp = client.app.bsky.actor.search_actors({"q": term, "limit": 25})
        before = len(candidates)
        for a in resp.actors:
            add_actor(a)
        print(f"  '{term}': +{len(candidates) - before} new (total: {len(candidates)})")
    except Exception as e:
        print(f"  '{term}': failed ({e})")
    time.sleep(0.5)

# 3. Follow up to 150, randomised, with polite delays
TARGET = 150
pool = list(candidates.items())
random.shuffle(pool)
pool = pool[:TARGET]

print(f"\n--- Following {len(pool)} accounts ---")
followed = 0
for did, handle in pool:
    try:
        client.follow(did)
        followed += 1
        print(f"  [{followed}/{len(pool)}] followed @{handle}")
        time.sleep(random.uniform(1.5, 3.0))  # stay well under rate limits
    except Exception as e:
        print(f"  skipped @{handle}: {e}")

print(f"\nDone. Followed {followed} accounts.")
print("Expect ~10-20% to follow back over the next few days.")
