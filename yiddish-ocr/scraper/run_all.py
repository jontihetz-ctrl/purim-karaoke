"""
Run all scrapers in sequence.
Usage:
    python run_all.py [--flickr-key KEY]
"""

import argparse
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--flickr-key", default=None, help="Optional Flickr API key")
args = parser.parse_args()

print("=" * 60)
print("STEP 1: Reddit (r/TranslateMe, r/OldHandwriting, r/Yiddish)")
print("=" * 60)
subprocess.run([sys.executable, "reddit_scraper.py"], check=False)

print("\n" + "=" * 60)
print("STEP 2: Internet Archive")
print("=" * 60)
subprocess.run([sys.executable, "internet_archive_scraper.py"], check=False)

if args.flickr_key:
    print("\n" + "=" * 60)
    print("STEP 3: Flickr")
    print("=" * 60)
    subprocess.run([sys.executable, "flickr_scraper.py", "--api-key", args.flickr_key], check=False)
else:
    print("\nSkipping Flickr (no --flickr-key provided)")
    print("Get a free key at: https://www.flickr.com/services/apps/create/")

print("\n✓ All scrapers done. Run the review UI to approve training pairs:")
print("  cd ../review-ui && python app.py")
