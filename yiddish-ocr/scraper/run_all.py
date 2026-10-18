"""
Run all scrapers. Sources that need no keys run automatically.
Sources needing keys are skipped with instructions if keys not provided.

Usage:
    python run_all.py [--flickr-key KEY] [--europeana-key KEY]
                      [--reddit-client-id ID --reddit-client-secret SECRET
                       --reddit-username USER --reddit-password PASS]
"""

import argparse
import subprocess
import sys

p = argparse.ArgumentParser()
p.add_argument("--flickr-key")
p.add_argument("--europeana-key")
p.add_argument("--reddit-client-id")
p.add_argument("--reddit-client-secret")
p.add_argument("--reddit-username")
p.add_argument("--reddit-password")
args = p.parse_args()


def run(cmd):
    subprocess.run([sys.executable] + cmd, check=False)


print("=" * 60)
print("Internet Archive (no key needed)")
print("=" * 60)
run(["internet_archive_scraper.py"])

if args.europeana_key:
    print("\n" + "=" * 60)
    print("Europeana")
    print("=" * 60)
    run(["europeana_scraper.py", "--api-key", args.europeana_key])
else:
    print("\n[Europeana skipped] — free key at https://pro.europeana.eu/page/get-api")

if args.flickr_key:
    print("\n" + "=" * 60)
    print("Flickr")
    print("=" * 60)
    run(["flickr_scraper.py", "--api-key", args.flickr_key])
else:
    print("[Flickr skipped] — free key at https://www.flickr.com/services/apps/create/")

if all([args.reddit_client_id, args.reddit_client_secret, args.reddit_username, args.reddit_password]):
    print("\n" + "=" * 60)
    print("Reddit")
    print("=" * 60)
    run(["reddit_scraper.py",
         "--client-id", args.reddit_client_id,
         "--client-secret", args.reddit_client_secret,
         "--username", args.reddit_username,
         "--password", args.reddit_password])
else:
    print("[Reddit skipped] — create free app at https://www.reddit.com/prefs/apps")

print("\n✓ Done. Launch review UI:")
print("  cd ../review-ui && python app.py  →  http://localhost:5050")
