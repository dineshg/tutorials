#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const repoRoot = new URL("..", import.meta.url);
const scriptPath = new URL("../assets/js/rnn-animated-tutorial.js", import.meta.url);
const outputDir = new URL("../assets/audio/rnn-narration/", import.meta.url);

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_v3";
const dryRun = process.argv.includes("--dry-run");

if (!apiKey && !dryRun) {
  throw new Error("Missing ELEVENLABS_API_KEY.");
}

if (!voiceId && !dryRun) {
  throw new Error("Missing ELEVENLABS_VOICE_ID. Choose a warm native-English female educator voice from ElevenLabs Voice Library.");
}

const source = await fs.readFile(scriptPath, "utf8");
const match = source.match(/const scenes = (\[[\s\S]*?\n  \]);/);

if (!match) {
  throw new Error("Could not find the scenes array in assets/js/rnn-animated-tutorial.js.");
}

const scenes = vm.runInNewContext(`(${match[1]})`);
await fs.mkdir(outputDir, { recursive: true });

function narrationText(text) {
  return text
    .replace(/\bRNN\b/g, "R N N")
    .replace(/\bBPTT\b/g, "B P T T")
    .replace(/\bEOS\b/g, "end of sequence")
    .replace(/\(([^)]+)\)/g, "$1")
    .replace(/\. /g, ".\n\n")
    .replace(/\? /g, "?\n\n")
    .replace(/: /g, ":\n")
    .trim();
}

async function generate(scene, index) {
  const fileName = `scene-${String(index + 1).padStart(2, "0")}.mp3`;
  const outPath = new URL(fileName, outputDir);
  const voiceSettings = {
    stability: 0.42,
    similarity_boost: 0.86,
    style: 0.35,
    speed: 0.94
  };

  if (!modelId.startsWith("eleven_v3")) {
    voiceSettings.use_speaker_boost = true;
  }

  const body = {
    text: narrationText(scene.narration),
    model_id: modelId,
    voice_settings: voiceSettings
  };

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json",
      "accept": "audio/mpeg"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs failed for ${fileName}: ${response.status} ${errorText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outPath, buffer);
  console.log(`Wrote ${path.relative(repoRoot.pathname, outPath.pathname)}`);
}

for (const [index, scene] of scenes.entries()) {
  if (dryRun) {
    const fileName = `scene-${String(index + 1).padStart(2, "0")}.mp3`;
    console.log(`${fileName}: ${scene.title} (${narrationText(scene.narration).length} chars)`);
    continue;
  }

  await generate(scene, index);
}

console.log(dryRun
  ? `Dry run complete for ${scenes.length} narration files.`
  : `Generated ${scenes.length} narration files in ${outputDir.pathname}`);
