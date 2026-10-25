#!/bin/bash
# Parshaland environment: two Python venvs (tools + voice conversion) and node playwright. Re-run after a machine reset.
set -x
cd "$(dirname "$0")"
python3 -m venv ptts && ./ptts/bin/pip install -q --index-url https://download.pytorch.org/whl/cpu torch==2.6.0+cpu torchaudio==2.6.0+cpu
./ptts/bin/pip install -q numpy soundfile faster-whisper kokoro pyworld
python3 -m venv cbx && ./cbx/bin/pip install -q --index-url https://download.pytorch.org/whl/cpu torch==2.6.0+cpu torchaudio==2.6.0+cpu
./cbx/bin/pip install -q chatterbox-tts soundfile
mkdir -p node && cd node && npm init -y >/dev/null && npm install -s playwright@1.48.2 >/dev/null
echo SETUP_DONE
