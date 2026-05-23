# RNN Animated Tutorial Narration

This folder holds the recorded narration used by `part5-deep-learning-and-llms/10-rnn-animated-tutorial.html`.

Expected files:

- `scene-01.mp3`
- `scene-02.mp3`
- ...
- `scene-28.mp3`

The browser page only plays these MP3 files when they exist. If a file is missing, the lesson still runs with captions and timer-based scene progression.

Recommended voice direction:

- young adult native-English woman
- warm, patient, classroom tone
- lightly conversational, not announcer-style
- natural pauses between clauses
- slightly slower than normal conversation for technical material
- clear pronunciation of symbols such as RNN, BPTT, logits, softmax, and embeddings

Generate files with:

```bash
ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... node scripts/generate-rnn-narration-elevenlabs.mjs
```

Preview the generated scene list without calling the API:

```bash
node scripts/generate-rnn-narration-elevenlabs.mjs --dry-run
```

Use a high-quality voice from ElevenLabs Voice Library or a custom voice. For this tutorial, prefer Eleven v3 for expressive delivery when available; use Eleven Multilingual v2 for stable long-form consistency.
