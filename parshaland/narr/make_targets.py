# Synthetic target voices (Kokoro voices, no real person) for voice conversion.
import numpy as np, soundfile as sf, torch
from kokoro import KPipeline
torch.set_num_threads(4)
TXT = ("Long ago, in a land far away, there lived a man who walked with kindness every single day. "
       "When the storm came, he did not give up. He worked, and he waited, and he hoped. And that is where our story begins.")
for tag, lang, voice, speed in [('A', 'a', 'am_michael', 0.9), ('B', 'b', 'bm_george', 0.9), ('C', 'a', 'am_onyx', 0.88)]:
    p = KPipeline(lang_code=lang); a = np.concatenate([r.audio.numpy() for r in p(TXT, voice=voice, speed=speed)])
    sf.write(f'targets/{tag}.wav', a / np.abs(a).max() * 0.9, 24000); print(tag, voice, round(len(a) / 24000, 1), 's', flush=True)
