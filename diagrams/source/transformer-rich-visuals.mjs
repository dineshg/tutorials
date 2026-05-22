import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] || "diagrams/exports";
mkdirSync(outDir, { recursive: true });

const colors = {
  blue: "#0969da",
  blueSoft: "#eaf3ff",
  green: "#1a7f37",
  greenSoft: "#f3f8f1",
  purple: "#8250df",
  purpleSoft: "#f5f0ff",
  orange: "#bf8700",
  orangeSoft: "#fff8e6",
  red: "#cf222e",
  gray: "#6e7781",
  graySoft: "#f6f8fa",
  border: "#d0d7de",
  text: "#0f172a",
  muted: "#64748b",
  white: "#ffffff",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svg(width, height, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <marker id="arrow-blue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 Z" fill="${colors.blue}"/>
    </marker>
    <marker id="arrow-purple" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 Z" fill="${colors.purple}"/>
    </marker>
    <marker id="arrow-green" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 Z" fill="${colors.green}"/>
    </marker>
    <marker id="arrow-orange" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 Z" fill="${colors.orange}"/>
    </marker>
    <linearGradient id="flow-blue-purple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colors.blue}"/>
      <stop offset="100%" stop-color="${colors.purple}"/>
    </linearGradient>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <style>
    .title { font: 700 28px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: ${colors.text}; }
    .subtitle { font: 500 15px Inter, ui-sans-serif, system-ui, sans-serif; fill: ${colors.muted}; }
    .label { font: 700 16px Inter, ui-sans-serif, system-ui, sans-serif; fill: ${colors.text}; }
    .small { font: 600 13px Inter, ui-sans-serif, system-ui, sans-serif; fill: ${colors.text}; }
    .muted { font: 500 12px Inter, ui-sans-serif, system-ui, sans-serif; fill: ${colors.muted}; }
    .mono { font: 700 13px "SFMono-Regular", Consolas, monospace; fill: ${colors.text}; }
    .panel { fill: #fbfdff; stroke: ${colors.border}; stroke-width: 1.4; rx: 18; filter: url(#soft-shadow); }
    .thin { vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
  </style>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>
${body}
</svg>
`;
}

function text(x, y, value, cls = "label", anchor = "middle") {
  return `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(value)}</text>`;
}

function lines(x, y, values, cls = "label", anchor = "middle", gap = 20) {
  return values.map((line, i) => text(x, y + i * gap, line, cls, anchor)).join("\n");
}

function rect(x, y, w, h, fill, stroke, rx = 12, extra = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
}

function token(x, y, w, h, label, fill = colors.blueSoft, stroke = colors.blue) {
  return `${rect(x, y, w, h, fill, stroke, 10)}
${text(x + w / 2, y + h / 2 + 6, label, "small")}`;
}

function arrowPath(d, stroke = colors.blue, marker = "arrow-blue", width = 3, extra = "") {
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" marker-end="url(#${marker})" class="thin" ${extra}/>`;
}

function line(x1, y1, x2, y2, stroke = colors.blue, width = 3, marker = "arrow-blue", extra = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" marker-end="url(#${marker})" class="thin" ${extra}/>`;
}

function matrix(x, y, values, opts = {}) {
  const cell = opts.cell || 34;
  const gap = opts.gap || 4;
  const max = opts.max ?? 1;
  const min = opts.min ?? 0;
  const stroke = opts.stroke || "#ffffff";
  const palette = opts.palette || "blue";
  const rowLabels = opts.rowLabels || [];
  const colLabels = opts.colLabels || [];
  const labelOffset = opts.labelOffset || 18;
  let out = "";
  if (colLabels.length) {
    colLabels.forEach((label, c) => {
      out += text(x + c * (cell + gap) + cell / 2, y - labelOffset, label, "muted") + "\n";
    });
  }
  if (rowLabels.length) {
    rowLabels.forEach((label, r) => {
      out += text(x - 14, y + r * (cell + gap) + cell / 2 + 5, label, "muted", "end") + "\n";
    });
  }
  values.forEach((row, r) => {
    row.forEach((value, c) => {
      const cx = x + c * (cell + gap);
      const cy = y + r * (cell + gap);
      let fill;
      if (value === null) {
        fill = "#f1f5f9";
      } else {
        const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
        fill = heat(t, palette);
      }
      out += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
      if (opts.values && value !== null) {
        out += text(cx + cell / 2, cy + cell / 2 + 5, value.toFixed(1), "muted");
      }
      if (value === null) {
        out += `<path d="M${cx + 8} ${cy + 8} L${cx + cell - 8} ${cy + cell - 8} M${cx + cell - 8} ${cy + 8} L${cx + 8} ${cy + cell - 8}" stroke="${colors.red}" stroke-width="2" opacity=".55"/>`;
      }
      out += "\n";
    });
  });
  return out;
}

function heat(t, palette) {
  const palettes = {
    blue: [[234, 243, 255], [9, 105, 218]],
    purple: [[245, 240, 255], [130, 80, 223]],
    green: [[243, 248, 241], [26, 127, 55]],
    orange: [[255, 248, 230], [191, 135, 0]],
  };
  const [a, b] = palettes[palette] || palettes.blue;
  const rgb = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

function barChart(x, y, labels, vals, w = 260, h = 128) {
  const max = Math.max(...vals);
  return labels.map((label, i) => {
    const bw = (vals[i] / max) * (w - 92);
    const yy = y + i * 28;
    return `${text(x, yy + 16, label, "mono", "start")}
${rect(x + 78, yy, bw, 18, heat(vals[i] / max, "green"), colors.green, 7)}
${text(x + 88 + bw, yy + 15, vals[i].toFixed(2), "muted", "start")}`;
  }).join("\n");
}

const diagrams = {
  "transformer-rich-rnn-to-attention": svg(1280, 760, `
  ${text(40, 50, "From recurrent bottleneck to attention lookup", "title", "start")}
  ${text(40, 78, "The decoder stops relying on one compressed state and learns to read the relevant encoder states directly.", "subtitle", "start")}
  ${rect(44, 120, 520, 560, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${rect(716, 120, 520, 560, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${text(304, 164, "RNN seq2seq bottleneck", "label")}
  ${text(976, 164, "Attention bridge", "label")}
  ${["my", "name", "is", "dinesh"].map((v, i) => token(92 + i * 104, 210, 82, 44, v)).join("")}
  ${line(174, 232, 196, 232)}
  ${line(278, 232, 300, 232)}
  ${line(382, 232, 404, 232)}
  ${rect(180, 326, 250, 74, colors.orangeSoft, colors.orange, 16)}
  ${lines(305, 354, ["one final hidden vector", "must carry every detail"], "label")}
  ${line(305, 254, 305, 326)}
  ${rect(205, 508, 200, 72, colors.greenSoft, colors.green, 16)}
  ${lines(305, 538, ["decoder tries to", "recover details"], "label")}
  ${line(305, 400, 305, 508, colors.orange, 3, "arrow-orange")}
  ${arrowPath("M454 362 C590 350 620 264 740 254", colors.red, "arrow-orange", 3, 'stroke-dasharray="8 8"')}
  ${text(612, 318, "fragile long bridge", "muted")}
  ${["h1", "h2", "h3", "h4"].map((v, i) => token(770 + i * 104, 248, 78, 42, v)).join("")}
  ${rect(855, 410, 260, 78, colors.purpleSoft, colors.purple, 16)}
  ${lines(985, 440, ["decoder query", "what source info now?"], "label")}
  ${matrix(805, 534, [[0.1, 0.2, 0.1, 0.9]], { cell: 46, gap: 8, palette: "purple", colLabels: ["h1", "h2", "h3", "h4"], values: true })}
  ${text(930, 618, "attention weights", "muted")}
  ${rect(1050, 548, 130, 54, colors.greenSoft, colors.green, 14)}
  ${text(1115, 581, "context", "label")}
  ${arrowPath("M900 410 C850 350 810 320 808 290", colors.purple, "arrow-purple")}
  ${arrowPath("M950 410 C928 350 925 318 912 290", colors.purple, "arrow-purple")}
  ${arrowPath("M1000 410 C1030 350 1042 318 1016 290", colors.purple, "arrow-purple")}
  ${arrowPath("M1080 410 C1150 350 1140 315 1120 290", colors.purple, "arrow-purple", 4)}
  ${line(1000, 560, 1050, 575, colors.green, 3, "arrow-green")}
  ${text(976, 690, "The high weight on h4 means this decoder step can directly retrieve the source name state.", "subtitle")}
  `),

  "transformer-rich-attention-patterns": svg(1280, 720, `
  ${text(40, 50, "Attention patterns are visible as matrices", "title", "start")}
  ${text(40, 78, "Cross-attention, bidirectional self-attention, and causal self-attention use the same scoring idea with different masks.", "subtitle", "start")}
  ${rect(42, 120, 365, 520, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${rect(458, 120, 365, 520, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${rect(874, 120, 365, 520, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${text(224, 164, "Cross-attention", "label")}
  ${text(640, 164, "Self-attention", "label")}
  ${text(1056, 164, "Causal self-attention", "label")}
  ${text(224, 190, "target queries source tokens", "muted")}
  ${text(640, 190, "each token may read all tokens", "muted")}
  ${text(1056, 190, "future positions are blocked", "muted")}
  ${matrix(128, 245, [[0.7, 0.2, 0.1, 0.1], [0.1, 0.2, 0.3, 0.9], [0.1, 0.8, 0.3, 0.2]], { cell: 46, gap: 7, palette: "purple", rowLabels: ["t1", "t2", "t3"], colLabels: ["s1", "s2", "s3", "s4"], values: true })}
  ${matrix(535, 245, [[0.9, 0.4, 0.2, 0.5], [0.3, 0.8, 0.6, 0.2], [0.5, 0.4, 0.9, 0.3], [0.2, 0.7, 0.4, 0.8]], { cell: 40, gap: 7, palette: "blue", rowLabels: ["x1", "x2", "x3", "x4"], colLabels: ["x1", "x2", "x3", "x4"], values: true })}
  ${matrix(954, 245, [[0.9, null, null, null], [0.6, 0.8, null, null], [0.2, 0.5, 0.9, null], [0.3, 0.2, 0.6, 0.8]], { cell: 40, gap: 7, palette: "green", rowLabels: ["x1", "x2", "x3", "x4"], colLabels: ["x1", "x2", "x3", "x4"], values: true })}
  ${text(224, 500, "Rows are target positions; columns are source positions.", "muted")}
  ${text(640, 500, "No mask: every query can score every key.", "muted")}
  ${text(1056, 500, "Upper triangle is masked before softmax.", "muted")}
  ${arrowPath("M170 580 C220 535 265 535 330 580", colors.purple, "arrow-purple")}
  ${arrowPath("M570 580 C620 535 665 535 730 580", colors.blue, "arrow-blue")}
  ${arrowPath("M1000 580 C1050 535 1095 535 1160 580", colors.green, "arrow-green")}
  `),

  "transformer-rich-gpt-generation-loop": svg(1280, 520, `
  ${text(40, 50, "GPT generation: predict, append, repeat", "title", "start")}
  ${text(40, 78, "Training can score all next-token targets under a causal mask; inference extends the prefix one token at a time.", "subtitle", "start")}
  ${rect(50, 128, 300, 245, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${text(200, 170, "Current prefix", "label")}
  ${token(92, 216, 62, 42, "my")}
  ${token(164, 216, 82, 42, "name")}
  ${token(256, 216, 50, 42, "is")}
  ${matrix(124, 300, [[0.9, null, null], [0.5, 0.9, null], [0.2, 0.7, 0.9]], { cell: 34, gap: 5, palette: "blue" })}
  ${text(200, 432, "causal mask for visible prefix", "muted")}
  ${rect(448, 128, 300, 245, colors.purpleSoft, colors.purple, 20, 'filter="url(#soft-shadow)"')}
  ${text(598, 174, "Decoder-only Transformer", "label")}
  ${lines(598, 210, ["masked self-attention", "MLP blocks", "last-position logits"], "small", "middle", 28)}
  ${[0, 1, 2, 3].map(i => rect(540 + i * 20, 318 - i * 10, 120, 30, "#ffffff", colors.purple, 10)).join("")}
  ${rect(840, 128, 320, 245, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${text(1000, 170, "Next-token distribution", "label")}
  ${barChart(900, 210, ["Dinesh", ".", "from", "AI"], [0.62, 0.16, 0.10, 0.05])}
  ${text(1000, 382, "sample token, append to prefix", "muted")}
  ${line(350, 250, 448, 250, colors.blue, 4, "arrow-blue")}
  ${line(748, 250, 840, 250, colors.purple, 4, "arrow-purple")}
  ${arrowPath("M1000 373 C930 505 355 505 345 260", colors.green, "arrow-green", 3)}
  ${text(610, 492, "The generated token becomes part of the next input context.", "subtitle")}
  `),

  "transformer-rich-scaled-dot-product": svg(1280, 640, `
  ${text(40, 50, "Scaled dot-product attention as matrix operations", "title", "start")}
  ${text(40, 78, "QK^T creates pairwise relevance scores; masking removes illegal positions; softmax turns scores into weights; V supplies the returned information.", "subtitle", "start")}
  ${rect(40, 122, 1180, 420, "#fbfdff", colors.border, 22, 'class="panel"')}
  ${text(130, 165, "Q", "label")}
  ${matrix(72, 200, [[0.8, 0.2, 0.5], [0.1, 0.9, 0.4], [0.3, 0.6, 0.7]], { cell: 34, gap: 5, palette: "blue" })}
  ${text(280, 165, "K^T", "label")}
  ${matrix(222, 200, [[0.7, 0.2, 0.5], [0.4, 0.9, 0.3], [0.1, 0.5, 0.8]], { cell: 34, gap: 5, palette: "green" })}
  ${text(428, 165, "scores", "label")}
  ${matrix(370, 200, [[0.9, 0.4, 0.2], [0.3, 0.8, 0.5], [0.4, 0.6, 0.9]], { cell: 34, gap: 5, palette: "orange", values: true })}
  ${text(580, 165, "mask", "label")}
  ${matrix(522, 200, [[0.9, null, null], [0.3, 0.8, null], [0.4, 0.6, 0.9]], { cell: 34, gap: 5, palette: "orange", values: true })}
  ${text(746, 165, "softmax weights", "label")}
  ${matrix(682, 200, [[1.0, null, null], [0.3, 0.7, null], [0.2, 0.3, 0.5]], { cell: 34, gap: 5, palette: "purple", values: true })}
  ${text(910, 165, "V", "label")}
  ${matrix(858, 200, [[0.6, 0.1, 0.3], [0.2, 0.8, 0.5], [0.4, 0.3, 0.9]], { cell: 34, gap: 5, palette: "blue" })}
  ${text(1080, 165, "output", "label")}
  ${matrix(1030, 200, [[0.6, 0.1, 0.3], [0.3, 0.6, 0.4], [0.4, 0.4, 0.7]], { cell: 34, gap: 5, palette: "green" })}
  ${line(188, 258, 220, 258, colors.blue, 3, "arrow-blue")}
  ${line(338, 258, 368, 258, colors.blue, 3, "arrow-blue")}
  ${line(490, 258, 520, 258, colors.orange, 3, "arrow-orange")}
  ${line(640, 258, 680, 258, colors.purple, 3, "arrow-purple")}
  ${line(804, 258, 856, 258, colors.purple, 3, "arrow-purple")}
  ${line(974, 258, 1028, 258, colors.green, 3, "arrow-green")}
  ${lines(428, 430, ["scale by", "sqrt(d_k)"], "muted", "middle", 18)}
  ${lines(580, 430, ["mask illegal", "future/pad cells"], "muted", "middle", 18)}
  ${lines(746, 430, ["softmax", "rows sum to 1"], "muted", "middle", 18)}
  ${lines(1080, 430, ["weighted", "value vectors"], "muted", "middle", 18)}
  `),

  "transformer-rich-multi-head": svg(1280, 650, `
  ${text(40, 50, "Multi-head attention: several relationship maps at once", "title", "start")}
  ${text(40, 78, "Each head gets its own projections, learns a different attention pattern, then the heads are concatenated and projected.", "subtitle", "start")}
  ${rect(50, 135, 190, 350, colors.blueSoft, colors.blue, 20, 'filter="url(#soft-shadow)"')}
  ${text(145, 178, "token states X", "label")}
  ${matrix(86, 220, [[0.8, 0.2, 0.4], [0.2, 0.9, 0.6], [0.4, 0.3, 0.7], [0.5, 0.6, 0.2]], { cell: 28, gap: 5, palette: "blue" })}
  ${[0, 1, 2].map((i) => {
    const x = 340 + i * 230;
    const label = ["local syntax", "entity link", "topic focus"][i];
    const data = [
      [[0.9, 0.6, 0.1], [0.4, 0.9, 0.5], [0.1, 0.5, 0.9]],
      [[0.8, 0.2, 0.7], [0.1, 0.9, 0.2], [0.7, 0.2, 0.8]],
      [[0.4, 0.8, 0.5], [0.5, 0.7, 0.6], [0.6, 0.8, 0.9]],
    ][i];
    const palette = ["purple", "green", "orange"][i];
    return `${rect(x, 135, 170, 350, "#fbfdff", colors.border, 20, 'class="panel"')}
${text(x + 85, 178, `head ${i + 1}`, "label")}
${text(x + 85, 204, label, "muted")}
${matrix(x + 42, 248, data, { cell: 28, gap: 6, palette, values: true })}
${rect(x + 30, 390, 110, 48, heat((i + 1) / 3, palette), i === 0 ? colors.purple : i === 1 ? colors.green : colors.orange, 12)}
${text(x + 85, 420, "head output", "small")}`;
  }).join("\n")}
  ${rect(1040, 180, 180, 250, colors.greenSoft, colors.green, 20, 'filter="url(#soft-shadow)"')}
  ${text(1130, 226, "concat", "label")}
  ${text(1130, 254, "+ W_O", "label")}
  ${matrix(1080, 300, [[0.8, 0.3], [0.5, 0.7], [0.2, 0.9]], { cell: 30, gap: 6, palette: "green" })}
  ${line(240, 300, 340, 300, colors.blue, 3, "arrow-blue")}
  ${line(240, 310, 570, 310, colors.blue, 3, "arrow-blue")}
  ${line(240, 320, 800, 320, colors.blue, 3, "arrow-blue")}
  ${line(510, 420, 1040, 270, colors.purple, 3, "arrow-purple")}
  ${line(740, 420, 1040, 300, colors.green, 3, "arrow-green")}
  ${line(970, 420, 1040, 330, colors.orange, 3, "arrow-orange")}
  `),

  "transformer-rich-decoder-block": svg(1280, 600, `
  ${text(40, 50, "Decoder-only Transformer block with residual highways", "title", "start")}
  ${text(40, 78, "Pre-norm stabilizes the computation; residual paths preserve the token stream while attention and the MLP transform it.", "subtitle", "start")}
  ${rect(50, 150, 170, 90, colors.blueSoft, colors.blue, 18)}
  ${lines(135, 185, ["token state", "x"], "label")}
  ${rect(295, 150, 130, 90, colors.graySoft, colors.gray, 18)}
  ${text(360, 203, "LayerNorm", "label")}
  ${rect(500, 115, 250, 160, colors.purpleSoft, colors.purple, 20, 'filter="url(#soft-shadow)"')}
  ${text(625, 154, "masked self-attention", "label")}
  ${matrix(548, 185, [[0.9, null, null], [0.4, 0.8, null], [0.2, 0.5, 0.9]], { cell: 28, gap: 5, palette: "purple" })}
  ${rect(835, 150, 150, 90, colors.greenSoft, colors.green, 18)}
  ${lines(910, 184, ["residual add", "x + attn"], "label")}
  ${rect(50, 360, 170, 90, colors.greenSoft, colors.green, 18)}
  ${lines(135, 394, ["updated", "token state"], "label")}
  ${rect(295, 360, 130, 90, colors.graySoft, colors.gray, 18)}
  ${text(360, 413, "LayerNorm", "label")}
  ${rect(500, 340, 250, 130, colors.orangeSoft, colors.orange, 20, 'filter="url(#soft-shadow)"')}
  ${lines(625, 386, ["feed-forward network", "GELU / SwiGLU MLP"], "label")}
  ${rect(835, 360, 150, 90, colors.greenSoft, colors.green, 18)}
  ${lines(910, 394, ["residual add", "block output"], "label")}
  ${line(220, 195, 295, 195)}
  ${line(425, 195, 500, 195)}
  ${line(750, 195, 835, 195, colors.purple, 3, "arrow-purple")}
  ${arrowPath("M135 240 C135 300 910 300 910 240", colors.green, "arrow-green", 3)}
  ${line(910, 240, 135, 360, colors.green, 0, "arrow-green", 'opacity="0"')}
  ${line(985, 195, 1040, 195, colors.green, 3, "arrow-green")}
  ${arrowPath("M1040 195 C1130 195 1130 405 985 405", colors.green, "arrow-green", 3)}
  ${line(220, 405, 295, 405)}
  ${line(425, 405, 500, 405)}
  ${line(750, 405, 835, 405, colors.orange, 3, "arrow-orange")}
  ${arrowPath("M135 450 C135 520 910 520 910 450", colors.green, "arrow-green", 3)}
  ${text(1125, 306, "stack this block L times", "label")}
  `),

  "transformer-rich-family-variants": svg(1280, 720, `
  ${text(40, 50, "Transformer families differ by allowed information flow", "title", "start")}
  ${text(40, 78, "The core block is similar; the mask and cross-attention wiring determine whether the model embeds, generates, or maps one sequence to another.", "subtitle", "start")}
  ${rect(46, 126, 360, 520, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${rect(460, 126, 360, 520, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${rect(874, 126, 360, 520, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${text(226, 170, "Encoder-only", "label")}
  ${text(640, 170, "Decoder-only", "label")}
  ${text(1054, 170, "Encoder-decoder", "label")}
  ${matrix(120, 222, [[0.9,0.5,0.4,0.6],[0.4,0.9,0.6,0.5],[0.5,0.4,0.9,0.7],[0.6,0.5,0.4,0.9]], { cell: 34, gap: 5, palette: "blue" })}
  ${text(226, 420, "bidirectional mask", "muted")}
  ${lines(226, 476, ["BERT-style", "classification, embeddings", "retrieval"], "small")}
  ${matrix(534, 222, [[0.9,null,null,null],[0.4,0.9,null,null],[0.2,0.6,0.9,null],[0.3,0.2,0.7,0.9]], { cell: 34, gap: 5, palette: "purple" })}
  ${text(640, 420, "causal lower triangle", "muted")}
  ${lines(640, 476, ["GPT-style", "generation, chat", "code, agents"], "small")}
  ${matrix(934, 222, [[0.9,0.4,0.5],[0.4,0.9,0.6],[0.5,0.5,0.9]], { cell: 32, gap: 5, palette: "blue" })}
  ${matrix(1082, 222, [[0.9,null,null],[0.5,0.9,null],[0.2,0.4,0.9]], { cell: 32, gap: 5, palette: "purple" })}
  ${line(1046, 278, 1082, 278, colors.orange, 3, "arrow-orange")}
  ${text(1054, 420, "encoder memory + causal decoder", "muted")}
  ${lines(1054, 476, ["T5 / BART-style", "translation", "summarization"], "small")}
  `),

  "transformer-rich-kv-cache": svg(1280, 620, `
  ${text(40, 50, "KV cache: keep old keys and values, compute only the new step", "title", "start")}
  ${text(40, 78, "Prefill builds the cache for the prompt. Each decode step appends one K/V row and queries the accumulated cache.", "subtitle", "start")}
  ${rect(54, 135, 250, 360, colors.blueSoft, colors.blue, 20, 'filter="url(#soft-shadow)"')}
  ${text(179, 178, "Prefill prompt", "label")}
  ${["my", "name", "is", "Dinesh"].map((v, i) => token(92, 220 + i * 54, 90, 38, v)).join("")}
  ${text(240, 245, "compute K,V", "muted")}
  ${text(240, 299, "compute K,V", "muted")}
  ${text(240, 353, "compute K,V", "muted")}
  ${text(240, 407, "compute K,V", "muted")}
  ${rect(420, 120, 360, 390, colors.purpleSoft, colors.purple, 20, 'filter="url(#soft-shadow)"')}
  ${text(600, 164, "Per-layer KV cache", "label")}
  ${text(510, 204, "K rows", "small")}
  ${text(690, 204, "V rows", "small")}
  ${matrix(470, 230, [[0.8,0.2,0.3],[0.5,0.9,0.4],[0.3,0.4,0.8],[0.7,0.5,0.2]], { cell: 30, gap: 5, palette: "purple" })}
  ${matrix(650, 230, [[0.6,0.1,0.5],[0.2,0.8,0.3],[0.4,0.5,0.9],[0.7,0.2,0.4]], { cell: 30, gap: 5, palette: "green" })}
  ${rect(920, 135, 270, 360, "#fbfdff", colors.border, 20, 'class="panel"')}
  ${text(1055, 178, "Decode next token", "label")}
  ${token(965, 225, 92, 42, ".", colors.orangeSoft, colors.orange)}
  ${text(1095, 252, "q_new,k_new,v_new", "muted", "start")}
  ${line(1055, 285, 1055, 345, colors.orange, 3, "arrow-orange")}
  ${rect(960, 350, 190, 54, colors.greenSoft, colors.green, 14)}
  ${lines(1055, 374, ["q_new attends to", "cached K,V"], "small")}
  ${line(304, 315, 420, 315, colors.blue, 4, "arrow-blue")}
  ${line(780, 315, 920, 377, colors.purple, 4, "arrow-purple")}
  ${arrowPath("M1055 405 C1055 560 600 560 600 512", colors.green, "arrow-green", 4)}
  ${text(600, 560, "append k_new,v_new; cache grows with context length", "subtitle")}
  `),
};

for (const [name, content] of Object.entries(diagrams)) {
  const svgPath = join(outDir, `${name}.svg`);
  const pdfPath = join(outDir, `${name}.pdf`);
  const pngPath = join(outDir, `${name}.png`);
  writeFileSync(svgPath, content);
  execFileSync("rsvg-convert", ["-f", "pdf", "-o", pdfPath, svgPath]);
  execFileSync("rsvg-convert", ["-f", "png", "-w", "2560", "-o", pngPath, svgPath]);
  console.log(`rendered ${name}.svg/.pdf/.png`);
}
