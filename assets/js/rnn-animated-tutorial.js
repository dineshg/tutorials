(function () {
  "use strict";

  const scenes = [
    {
      title: "Opening: what are we trying to do?",
      caption: "We show a sequence one word at a time and ask the network to predict what comes next.",
      visual: "opening",
      equation: "",
      narration: "Hi, I am Maya. Let us build one of the simplest language models ever created: the Recurrent Neural Network, or RNN. The goal is simple. We show it a sequence of words, one word at a time, and ask it to predict what comes next. If it can keep predicting the next word correctly, then it can generate language."
    },
    {
      title: "Humans see words; machines need numbers",
      caption: "A neural network cannot process the word 'name' directly. It needs numerical inputs.",
      visual: "humanMachine",
      narration: "Humans naturally read words. We see meaning immediately. But a neural network cannot read the word name directly. It can only operate on numbers. So the first challenge is converting language into a numerical form the network can process."
    },
    {
      title: "First step: a word dictionary",
      caption: "A token ID is only an index. It does not contain meaning.",
      visual: "dictionary",
      narration: "The simplest first step is a dictionary. Every word gets an ID number. My might become 201, name might become 412, is might become 87, and Dinesh might become 18032. The important point is that 412 does not mean name. It simply points to a row in a table."
    },
    {
      title: "Why words become tokens",
      caption: "Words are human units. Tokens are machine-friendly text pieces.",
      visual: "tokens",
      narration: "Real systems usually go beyond whole words. They break text into tokens. A token might be a whole word, part of a word, or a small text fragment. This helps with rare names, new words, misspellings, and words the model has never seen as complete units."
    },
    {
      title: "The sentence becomes token IDs",
      caption: "'my name is Dinesh' becomes a sequence of discrete symbols.",
      visual: "ids",
      narration: "Our sentence, my name is Dinesh, becomes a sequence of token IDs: 201, 412, 87, and 18032. These are the symbols the model will process. They are not yet meaning. They are addresses."
    },
    {
      title: "IDs become embeddings",
      caption: "Embedding lookup selects a row from a learned table.",
      visual: "embedding",
      equation: "x_t = E[id_t]",
      narration: "IDs alone are not enough. The model wants a vector of features. So we use an embedding table. If token name has ID 412, we select row 412. That row becomes the input vector x t. This is an embedding lookup. It is literally selecting a row from a learned matrix."
    },
    {
      title: "What an embedding means",
      caption: "Meaning is learned in vectors, not stored in the raw ID.",
      visual: "embeddingMeaning",
      narration: "At the beginning of training, embedding vectors are random. As the model learns, tokens used in similar contexts move into related regions of vector space. Meaning is not in the ID. Meaning gradually emerges in the embedding vector."
    },
    {
      title: "Enter the RNN: a memory machine",
      caption: "The RNN cell combines current input with previous hidden memory.",
      visual: "rnnCell",
      narration: "Now we are ready for the RNN. The new word enters as an embedding vector, x t. The memory from the previous step enters as h t minus one. The cell combines those two signals and produces a new hidden state, h t. That hidden state is the RNN memory of what it has seen so far."
    },
    {
      title: "The Elman RNN equation",
      caption: "The simplest RNN mixes new input and old memory, then squashes the result.",
      visual: "equation",
      equation: "h_t = tanh(W_x x_t + W_h h_{t-1} + b)",
      narration: "Here is the simplest RNN equation, often called the Elman RNN. The new hidden state is tanh of the input contribution plus the previous-memory contribution plus a bias."
    },
    {
      title: "Intuition behind each term",
      caption: "Each term has a job: current word, old memory, shift, and stability.",
      visual: "equationParts",
      narration: "The term W x times x t asks what the current word contributes. The term W h times h t minus one asks what should be carried from the past. The bias shifts the result. Tanh keeps the hidden state in a stable bounded range."
    },
    {
      title: "Shapes remove ambiguity",
      caption: "Every matrix shape is determined by the vector it maps from and to.",
      visual: "shapes",
      narration: "Suppose the embedding has 256 numbers and the hidden state has 512 numbers. Then W x maps 256 to 512, so it is 512 by 256. W h maps the old hidden state to the new hidden state, so it is 512 by 512."
    },
    {
      title: "Unrolling through time",
      caption: "The same RNN cell and same weights are reused at every time step.",
      visual: "unroll",
      narration: "We do not build a different network for every word. We reuse the same RNN cell again and again. My gives h one. Name uses h one and gives h two. Is gives h three. Dinesh gives h four. This repeated use is what makes the network recurrent."
    },
    {
      title: "The initial hidden state",
      caption: "h0 is usually zeros, meaning the model begins with no prior memory.",
      visual: "h0",
      narration: "To start the sequence, we need an initial hidden state called h zero. In the simplest case, it is a vector of zeros. Some systems learn it, but zero is the cleanest mental model."
    },
    {
      title: "Build hidden states step by step",
      caption: "word -> ID -> embedding -> RNN cell -> new hidden state",
      visual: "stepBuild",
      narration: "Let us walk through the sentence. The word my becomes a token ID, then an embedding x one. The RNN combines x one with h zero and produces h one. Then name becomes x two, combines with h one, and produces h two. The hidden state is always the latest summary."
    },
    {
      title: "What hidden state really means",
      caption: "Each hidden state is a compressed vector summary of the prefix so far.",
      visual: "hiddenSummary",
      narration: "Hidden states are summaries. h one summarizes my. h two summarizes my name. h three summarizes my name is. h four summarizes my name is Dinesh. The summary is not stored as text. It is stored as a vector."
    },
    {
      title: "Next-token prediction output layer",
      caption: "The hidden state becomes one logit score per vocabulary item.",
      visual: "outputLayer",
      equation: "z_t = W_y h_t + b_y",
      narration: "The hidden state tells us what the model currently knows. To predict the next word, we apply an output layer. It produces one score for every vocabulary item. If the vocabulary has 20000 tokens, the output has 20000 logits."
    },
    {
      title: "Softmax turns scores into probabilities",
      caption: "Logits are raw scores. Softmax converts them into probabilities that sum to one.",
      visual: "softmax",
      equation: "p_t = softmax(z_t)",
      narration: "Softmax converts arbitrary scores into a probability distribution. After softmax, all probabilities add up to one. The token with the highest probability is the model best guess for the next word."
    },
    {
      title: "Next-token training examples",
      caption: "The target sequence is the input sequence shifted one step to the left.",
      visual: "trainingPairs",
      narration: "At every step, we ask the model to predict the next word. After seeing my, the correct answer is name. After seeing my name, the correct answer is is. After seeing my name is, the correct answer is Dinesh. After the full sentence, the answer is an end token."
    },
    {
      title: "Loss: how the model knows it was wrong",
      caption: "Cross-entropy is small when the correct next word gets high probability.",
      visual: "loss",
      equation: "L = sum_t CE(p_t, y_t)",
      narration: "To train the network, we compare its predicted probabilities to the correct next word using cross entropy. If the model gives high probability to the correct word, loss is small. If it gives low probability, loss is large. We add this loss over time steps."
    },
    {
      title: "Backpropagation Through Time",
      caption: "The red learning signal flows backward through the unrolled network.",
      visual: "bptt",
      narration: "The loss sends an error signal backward through the network. Because the RNN was unrolled across time, the error also flows backward across time. This is Backpropagation Through Time, or BPTT. It updates embeddings, recurrent weights, output weights, and biases."
    },
    {
      title: "Why shared weights matter",
      caption: "The model learns one sequence-processing rule instead of memorizing each position.",
      visual: "sharedWeights",
      narration: "One reason RNNs are elegant is that the same weights are reused at every time step. The model learns general sequence-processing rules, rather than memorizing separate parameters for position one, position two, and position three."
    },
    {
      title: "Padding and batching",
      caption: "Short sequences are padded, and PAD positions are masked out of the loss.",
      visual: "padding",
      narration: "During training, we process many sequences in a batch. Batches need rectangular tensors, so shorter sentences get padded with a PAD token. The model may compute something there, but the loss mask ignores those positions."
    },
    {
      title: "Common confusion: steps vs hidden size",
      caption: "Sequence length and hidden size are different concepts.",
      visual: "confusion",
      narration: "Sequence length tells us how many time steps we process. Hidden size tells us how many numbers are inside each hidden state. Ten time steps does not mean ten neurons. A 512-dimensional hidden state does not mean 512 words."
    },
    {
      title: "Generation: how a trained RNN writes text",
      caption: "Predict one token, append it, and repeat.",
      visual: "generation",
      narration: "Once trained, the RNN can generate. Start with a prompt like my. The model predicts name. Append name and run again. Then it predicts is. Then Dinesh. Then an end token. Generation is predict, append, repeat."
    },
    {
      title: "Why RNNs were important",
      caption: "They introduced learned memory moving through time.",
      visual: "timeline",
      narration: "RNNs were a major breakthrough because they introduced learned memory that moves through time. They were foundational for language modeling, sequence labeling, speech, and translation."
    },
    {
      title: "Why RNNs struggle",
      caption: "One hidden vector must carry the whole past.",
      visual: "struggle",
      narration: "RNNs also struggle. They must compress the entire past into one hidden state. As sequences get longer, important information from the distant past can fade away. This is the long-term dependency problem."
    },
    {
      title: "Vanishing and exploding gradients",
      caption: "Repeated multiplication through time can shrink or amplify gradients.",
      visual: "gradients",
      narration: "During backpropagation, gradients are multiplied repeatedly as they travel through time. If they become too small, they vanish. If they become too large, they explode. This is one reason basic RNNs are hard to train on very long sequences."
    },
    {
      title: "Final summary",
      caption: "words -> tokens -> IDs -> embeddings -> hidden states -> logits -> probabilities -> loss -> BPTT",
      visual: "summary",
      narration: "Let us summarize. Humans start with words. The machine breaks text into tokens. Tokens become IDs. IDs select embedding vectors. The RNN processes those vectors one at a time and carries hidden memory forward. The output layer produces logits. Softmax produces next-token probabilities. Loss compares prediction to truth, and backpropagation through time updates the model."
    }
  ];

  const canvas = document.getElementById("rnn-canvas");
  const titleEl = document.getElementById("scene-title");
  const captionEl = document.getElementById("scene-caption");
  const narrationEl = document.getElementById("scene-narration");
  const equationEl = document.getElementById("scene-equation");
  const countEl = document.getElementById("scene-count");
  const timeEl = document.getElementById("scene-time");
  const progressEl = document.getElementById("scene-progress");
  const sliderEl = document.getElementById("scene-slider");
  const playButton = document.getElementById("play-pause");
  const voiceButton = document.getElementById("voice-toggle");
  const audioStatusEl = document.getElementById("audio-status");

  if (!window.BABYLON) {
    titleEl.textContent = "Babylon.js did not load";
    narrationEl.textContent = "The animation engine could not be loaded. Check your network connection and reload the page.";
    return;
  }

  const palette = {
    blue: new BABYLON.Color3(0.22, 0.74, 0.97),
    blueDark: new BABYLON.Color3(0.05, 0.32, 0.75),
    green: new BABYLON.Color3(0.13, 0.77, 0.38),
    purple: new BABYLON.Color3(0.64, 0.46, 0.96),
    red: new BABYLON.Color3(0.94, 0.27, 0.27),
    amber: new BABYLON.Color3(0.94, 0.63, 0.12),
    slate: new BABYLON.Color3(0.15, 0.21, 0.32),
    white: new BABYLON.Color3(0.96, 0.98, 1)
  };

  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, antialias: true });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.02, 0.04, 0.08, 1);

  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.45, 14, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 22;
  camera.wheelDeltaPercentage = 0.02;

  new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene).intensity = 0.72;
  const key = new BABYLON.DirectionalLight("key", new BABYLON.Vector3(-0.4, -0.8, -0.5), scene);
  key.position = new BABYLON.Vector3(7, 10, 7);
  key.intensity = 1.2;

  const glow = new BABYLON.GlowLayer("glow", scene);
  glow.intensity = 0.55;

  const root = new BABYLON.TransformNode("lesson-root", scene);
  const active = [];
  const pulses = [];
  const mats = {};
  const narrationAudio = new Audio();
  let current = 0;
  let playing = false;
  let narrationOn = false;
  let audioReady = false;
  let sceneStart = performance.now();
  let sceneDuration = durationFor(scenes[0]);
  narrationAudio.preload = "metadata";

  function mat(name, color, emissive) {
    if (mats[name]) return mats[name];
    const m = new BABYLON.StandardMaterial(name, scene);
    m.diffuseColor = color;
    m.specularColor = new BABYLON.Color3(0.25, 0.28, 0.34);
    m.emissiveColor = emissive ? color.scale(0.55) : color.scale(0.06);
    mats[name] = m;
    return m;
  }

  function add(mesh) {
    mesh.parent = root;
    active.push(mesh);
    return mesh;
  }

  function clearActive() {
    pulses.length = 0;
    while (active.length) {
      const obj = active.pop();
      obj.dispose(false, true);
    }
  }

  function makeTextTexture(text, options) {
    const width = options.width || 1024;
    const height = options.height || 256;
    const texture = new BABYLON.DynamicTexture("textTexture", { width, height }, scene, true);
    texture.hasAlpha = true;
    const ctx = texture.getContext();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = options.background || "rgba(15,23,42,0.88)";
    if (options.background !== "transparent") roundRect(ctx, 0, 0, width, height, options.radius || 34);
    ctx.fillStyle = options.color || "#f8fafc";
    ctx.font = `${options.weight || 700} ${options.size || 46}px Inter, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    wrapText(ctx, text, width / 2, height / 2, width - 52, (options.size || 46) * 1.25);
    texture.update();
    return texture;
  }

  function label(text, x, y, z, options = {}) {
    const width = options.w || 3.2;
    const height = options.h || 0.78;
    const plane = BABYLON.MeshBuilder.CreatePlane("label", { width, height }, scene);
    plane.position.set(x, y, z);
    const m = new BABYLON.StandardMaterial("labelMat", scene);
    m.diffuseTexture = makeTextTexture(text, {
      width: 1024,
      height: 256,
      color: options.color || "#f8fafc",
      background: options.background || "rgba(15,23,42,0.88)",
      size: options.size || 42,
      weight: options.weight || 750
    });
    m.diffuseTexture.hasAlpha = true;
    m.useAlphaFromDiffuseTexture = true;
    m.emissiveColor = new BABYLON.Color3(0.8, 0.86, 1);
    m.backFaceCulling = false;
    plane.material = m;
    return add(plane);
  }

  function box(text, x, y, z, colorName, options = {}) {
    const width = options.w || 1.55;
    const height = options.h || 0.68;
    const depth = options.d || 0.16;
    const mesh = BABYLON.MeshBuilder.CreateBox("box", { width, height, depth }, scene);
    mesh.position.set(x, y, z);
    mesh.material = mat(`${colorName}-mat`, palette[colorName] || palette.blue, options.glow);
    add(mesh);
    label(text, x, y, z - depth / 2 - 0.025, {
      w: width * 0.94,
      h: height * 0.72,
      background: "transparent",
      color: options.textColor || "#ffffff",
      size: options.size || 34
    });
    return mesh;
  }

  function sphere(name, x, y, z, colorName, radius = 0.16) {
    const mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: radius * 2, segments: 32 }, scene);
    mesh.position.set(x, y, z);
    mesh.material = mat(`${colorName}-glow`, palette[colorName] || palette.blue, true);
    return add(mesh);
  }

  function line(name, points, colorName, radius = 0.03) {
    const tube = BABYLON.MeshBuilder.CreateTube(name, { path: points, radius, tessellation: 16 }, scene);
    tube.material = mat(`${colorName}-line`, palette[colorName] || palette.blue, true);
    return add(tube);
  }

  function pulse(points, colorName, delay = 0, speed = 0.22) {
    const mesh = sphere("pulse", points[0].x, points[0].y, points[0].z, colorName, 0.11);
    pulses.push({ mesh, points, delay, speed });
    return mesh;
  }

  function renderScene(index) {
    clearActive();
    current = Math.max(0, Math.min(index, scenes.length - 1));
    const item = scenes[current];
    sceneDuration = durationFor(item);
    sceneStart = performance.now();

    titleEl.textContent = item.title;
    captionEl.textContent = item.caption;
    narrationEl.textContent = item.narration;
    countEl.textContent = `Scene ${current + 1} / ${scenes.length}`;
    sliderEl.value = String(current);
    equationEl.hidden = !item.equation;
    equationEl.textContent = item.equation || "";

    label(item.title, 0, 3.45, 0, { w: 8.6, h: 0.72, size: 32, background: "rgba(15,23,42,0.70)" });
    drawVisual(item.visual);
    if (narrationOn) prepareNarrationForScene(playing);
    else {
      stopNarration();
      setAudioStatus("Recorded narration is off.");
    }
  }

  function drawVisual(name) {
    if (name === "opening") return visualOpening();
    if (name === "humanMachine") return visualHumanMachine();
    if (name === "dictionary") return visualDictionary();
    if (name === "tokens") return visualTokens();
    if (name === "ids") return visualIds();
    if (name === "embedding") return visualEmbedding();
    if (name === "embeddingMeaning") return visualEmbeddingMeaning();
    if (name === "rnnCell") return visualRnnCell();
    if (name === "equation") return visualEquation();
    if (name === "equationParts") return visualEquationParts();
    if (name === "shapes") return visualShapes();
    if (name === "unroll") return visualUnroll();
    if (name === "h0") return visualH0();
    if (name === "stepBuild") return visualStepBuild();
    if (name === "hiddenSummary") return visualHiddenSummary();
    if (name === "outputLayer") return visualOutputLayer();
    if (name === "softmax") return visualSoftmax();
    if (name === "trainingPairs") return visualTrainingPairs();
    if (name === "loss") return visualLoss();
    if (name === "bptt") return visualBptt();
    if (name === "sharedWeights") return visualSharedWeights();
    if (name === "padding") return visualPadding();
    if (name === "confusion") return visualConfusion();
    if (name === "generation") return visualGeneration();
    if (name === "timeline") return visualTimeline();
    if (name === "struggle") return visualStruggle();
    if (name === "gradients") return visualGradients();
    return visualSummary();
  }

  function visualOpening() {
    ["my", "name", "is", "Dinesh", "?"].forEach((w, i) => box(w, -3.6 + i * 1.8, 0.65, 0, i === 4 ? "amber" : "blue", { glow: i === 4, w: 1.35 }));
    label("Can a machine guess the next word?", 0, -0.65, 0, { w: 6.4, h: 0.7, size: 36, background: "rgba(9,105,218,0.22)" });
    pulsePath([[-3.6, 0.05, 0], [-1.8, 0.05, 0], [0, 0.05, 0], [1.8, 0.05, 0], [3.6, 0.05, 0]], "blue");
  }

  function visualHumanMachine() {
    box("human", -3.6, 0.9, 0, "green", { w: 1.6, h: 0.75 });
    box("words", -3.6, -0.2, 0, "blue", { w: 1.8 });
    box("machine", 3.6, 0.9, 0, "purple", { w: 1.8, h: 0.75 });
    box("numbers", 3.6, -0.2, 0, "amber", { w: 2.0 });
    label("I need numbers.", 3.6, -1.15, 0, { w: 3.2, h: 0.62, size: 32, background: "rgba(130,80,223,0.25)" });
    line("bridge", [v(-2.6, -0.2, 0), v(2.6, -0.2, 0)], "blue");
    pulsePath([[-2.6, -0.2, 0], [2.6, -0.2, 0]], "blue");
  }

  function visualDictionary() {
    label("dictionary: word -> ID", 0, 1.75, 0, { w: 4.2, h: 0.65, size: 34 });
    const rows = [["my", "201"], ["name", "412"], ["is", "87"], ["Dinesh", "18032"]];
    rows.forEach((row, i) => {
      const y = 0.85 - i * 0.7;
      box(row[0], -1.25, y, 0, i === 1 ? "green" : "blue", { w: 1.55 });
      box(row[1], 1.25, y, 0, i === 1 ? "green" : "amber", { w: 1.55 });
      line("dict-line", [v(-0.45, y, 0), v(0.45, y, 0)], "purple");
    });
    label("ID = label, not meaning", 0, -2.15, 0, { w: 4.5, h: 0.62, size: 34, background: "rgba(191,135,0,0.23)" });
  }

  function visualTokens() {
    box("Dinesh", -3.3, 0.9, 0, "blue", { w: 1.6 });
    box("unbelievable", -0.7, 0.9, 0, "blue", { w: 2.3 });
    box("qq", 2.2, 0.9, 0, "blue", { w: 1.1 });
    ["un", "believe", "able"].forEach((w, i) => box(w, -1.7 + i, -0.25, 0, "green", { w: i === 1 ? 1.45 : 0.9 }));
    ["q", "q"].forEach((w, i) => box(w, 1.85 + i * 0.7, -0.25, 0, "green", { w: 0.55 }));
    label("human words -> machine tokens", 0, -1.55, 0, { w: 5.3, h: 0.66, size: 34 });
  }

  function visualIds() {
    const words = ["my", "name", "is", "Dinesh"];
    const ids = ["201", "412", "87", "18032"];
    words.forEach((w, i) => {
      const x = -3.0 + i * 2;
      box(w, x, 0.9, 0, "blue", { w: 1.25 });
      box(ids[i], x, -0.55, 0, "amber", { w: 1.3 });
      line("drop", [v(x, 0.55, 0), v(x, -0.2, 0)], "blue");
      pulsePath([[x, 0.55, 0], [x, -0.2, 0]], "blue", i * 0.12);
    });
    label("[201, 412, 87, 18032]", 0, -1.65, 0, { w: 4.6, h: 0.62, size: 34 });
  }

  function visualEmbedding() {
    label("E: vocabulary x embedding_dimension", 0, 2.05, 0, { w: 6.0, h: 0.62, size: 32 });
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 9; c++) {
        const color = r === 2 ? "green" : "slate";
        const cube = BABYLON.MeshBuilder.CreateBox("matrix-cell", { width: 0.34, height: 0.20, depth: 0.08 }, scene);
        cube.position.set(-1.55 + c * 0.39, 0.95 - r * 0.28, 0);
        cube.material = mat(`${color}-mat`, palette[color], r === 2);
        add(cube);
      }
    }
    box("ID 412", -3.15, 0.35, 0, "amber", { w: 1.4 });
    label("select row 412", 2.65, 0.35, 0, { w: 2.4, h: 0.55, size: 30, background: "rgba(26,127,55,0.22)" });
    vectorBars(0, -1.25, 9, "green");
    line("lookup", [v(-2.4, 0.35, 0), v(-1.55, 0.39, 0)], "amber");
    line("row-to-vector", [v(1.85, 0.39, 0), v(0.8, -1.0, 0)], "green");
  }

  function visualEmbeddingMeaning() {
    box("name", -1.6, 0.75, 0, "green", { w: 1.1 });
    box("word", -0.6, 0.2, 0, "green", { w: 1.1 });
    box("dog", 2.35, -0.65, 0, "amber", { w: 1.1 });
    sphere("name-point", -1.6, -0.25, 0, "green", 0.18);
    sphere("word-point", -0.6, -0.55, 0, "green", 0.18);
    sphere("dog-point", 2.35, -1.15, 0, "amber", 0.18);
    line("close", [v(-1.6, -0.25, 0), v(-0.6, -0.55, 0)], "green", 0.025);
    line("far", [v(-0.6, -0.55, 0), v(2.35, -1.15, 0)], "amber", 0.018);
    label("similar contexts move vectors closer", 0, 1.85, 0, { w: 5.8, h: 0.62, size: 32 });
  }

  function visualRnnCell() {
    drawCell(0, 0, "RNN cell");
    box("x_t", 0, -2.2, 0, "blue", { w: 1.15, glow: true });
    box("h_{t-1}", -3.0, 0, 0, "green", { w: 1.45, glow: true });
    box("h_t", 3.0, 0, 0, "green", { w: 1.15, glow: true });
    line("input-flow", [v(0, -1.85, 0), v(0, -0.65, 0)], "blue");
    line("memory-flow", [v(-2.25, 0, 0), v(-0.95, 0, 0)], "green");
    line("new-memory-flow", [v(0.95, 0, 0), v(2.25, 0, 0)], "green");
    pulsePath([[0, -1.85, 0], [0, -0.65, 0]], "blue");
    pulsePath([[-2.25, 0, 0], [-0.95, 0, 0], [0.95, 0, 0], [2.25, 0, 0]], "green", 0.25);
  }

  function visualEquation() {
    label("h_t = tanh(W_x x_t + W_h h_{t-1} + b)", 0, 0.95, 0, { w: 7.6, h: 0.9, size: 38, background: "rgba(15,23,42,0.92)" });
    drawCell(0, -0.65, "tanh");
    box("new input", -2.8, -1.75, 0, "blue", { w: 1.8 });
    box("old memory", 2.8, -1.75, 0, "green", { w: 1.9 });
    line("eq1", [v(-2.0, -1.55, 0), v(-0.6, -0.95, 0)], "blue");
    line("eq2", [v(2.0, -1.55, 0), v(0.6, -0.95, 0)], "green");
  }

  function visualEquationParts() {
    const items = [
      ["W_x x_t", "current word", -3.2, "blue"],
      ["W_h h_{t-1}", "old memory", -1.05, "green"],
      ["b", "shift", 1.05, "amber"],
      ["tanh", "stable range", 3.2, "purple"]
    ];
    items.forEach(([top, bottom, x, color]) => {
      box(top, x, 0.7, 0, color, { w: 1.75, glow: true });
      label(bottom, x, -0.15, 0, { w: 1.85, h: 0.5, size: 26, background: "rgba(15,23,42,0.72)" });
    });
    pulsePath([[-4.1, 0.7, 0], [-2.25, 0.7, 0], [-0.1, 0.7, 0], [2.2, 0.7, 0], [4.0, 0.7, 0]], "purple");
  }

  function visualShapes() {
    const items = [
      ["x_t", "R^256", -3.1, 1.0, "blue"],
      ["h_t", "R^512", -1.05, 1.0, "green"],
      ["W_x", "512 x 256", 1.05, 1.0, "purple"],
      ["W_h", "512 x 512", 3.1, 1.0, "amber"],
      ["b", "R^512", 0, -0.7, "slate"]
    ];
    items.forEach(([a, b, x, y, color]) => {
      box(a, x, y, 0, color, { w: 1.25 });
      label(b, x, y - 0.72, 0, { w: 1.55, h: 0.48, size: 26, background: "rgba(15,23,42,0.72)" });
    });
    label("Shapes are not decoration. They are the contract.", 0, -2.15, 0, { w: 6.2, h: 0.62, size: 32 });
  }

  function visualUnroll() {
    const words = ["my", "name", "is", "Dinesh"];
    words.forEach((w, i) => {
      const x = -3.45 + i * 2.3;
      box(w, x, -1.5, 0, "blue", { w: 1.25 });
      drawSmallCell(x, 0, `cell ${i + 1}`);
      box(`h${i + 1}`, x + 0.82, 0.82, 0, "green", { w: 0.85 });
      line("input-up", [v(x, -1.15, 0), v(x, -0.45, 0)], "blue");
      if (i < words.length - 1) line("hidden-wire", [v(x + 0.85, 0, 0), v(x + 1.45, 0, 0)], "green");
    });
    label("same W_x and W_h at every step", 0, 2.0, 0, { w: 5.2, h: 0.6, size: 32, background: "rgba(26,127,55,0.22)" });
    pulsePath([[-3.45, 0, 0], [-1.15, 0, 0], [1.15, 0, 0], [3.45, 0, 0]], "green");
  }

  function visualH0() {
    box("h0", -1.5, 0.3, 0, "green", { w: 1.1, glow: true });
    vectorBars(1.2, 0.3, 8, "slate");
    label("usually zeros", 1.2, -0.65, 0, { w: 2.3, h: 0.55, size: 30 });
    label("sometimes learned", 1.2, -1.35, 0, { w: 2.5, h: 0.55, size: 30, background: "rgba(130,80,223,0.22)" });
    line("h0-line", [v(-0.9, 0.3, 0), v(0.0, 0.3, 0)], "green");
  }

  function visualStepBuild() {
    const stages = ["word", "ID", "embedding", "RNN", "h"];
    stages.forEach((s, i) => box(s, -3.8 + i * 1.9, 0.7, 0, i === 2 ? "blue" : i === 4 ? "green" : "purple", { w: 1.35 }));
    label("my -> 201 -> x1 -> combine with h0 -> h1", 0, -0.65, 0, { w: 7.2, h: 0.62, size: 32 });
    pulsePath([[-3.8, 0.7, 0], [-1.9, 0.7, 0], [0, 0.7, 0], [1.9, 0.7, 0], [3.8, 0.7, 0]], "blue");
  }

  function visualHiddenSummary() {
    [["h1", "my"], ["h2", "my name"], ["h3", "my name is"], ["h4", "my name is Dinesh"]].forEach((item, i) => {
      const y = 1.2 - i * 0.75;
      box(item[0], -2.6, y, 0, "green", { w: 0.9 });
      label(item[1], 0.8, y, 0, { w: 4.6, h: 0.55, size: 30, background: "rgba(26,127,55,0.20)" });
      line("summary", [v(-2.1, y, 0), v(-1.55, y, 0)], "green");
    });
    label("hidden state = compressed vector summary", 0, -2.1, 0, { w: 5.8, h: 0.62, size: 32 });
  }

  function visualOutputLayer() {
    box("h_t", -3.1, 0.3, 0, "green", { w: 1.1, glow: true });
    box("W_y h_t + b_y", -0.6, 0.3, 0, "purple", { w: 2.35 });
    box("logits", 2.0, 0.3, 0, "amber", { w: 1.25 });
    ["name", "is", "Dinesh", "dog"].forEach((w, i) => label(w, 3.6, 1.0 - i * 0.45, 0, { w: 1.55, h: 0.36, size: 24, background: "rgba(15,23,42,0.7)" }));
    pulsePath([[-2.55, 0.3, 0], [-1.5, 0.3, 0], [0.6, 0.3, 0], [1.4, 0.3, 0], [2.75, 0.3, 0]], "purple");
  }

  function visualSoftmax() {
    const words = [["name", 0.78], ["is", 0.52], ["dog", 0.12], ["hello", 0.26]];
    words.forEach((item, i) => {
      const y = 1.15 - i * 0.68;
      label(item[0], -2.35, y, 0, { w: 1.4, h: 0.42, size: 24, background: "rgba(15,23,42,0.72)" });
      const bar = BABYLON.MeshBuilder.CreateBox("prob", { width: 3.4 * item[1], height: 0.26, depth: 0.12 }, scene);
      bar.position.set(-0.25 + (3.4 * item[1]) / 2, y, 0);
      bar.material = mat(i === 0 ? "green-glow" : "purple-glow", i === 0 ? palette.green : palette.purple, true);
      add(bar);
      label(`${Math.round(item[1] * 100)}%`, 2.65, y, 0, { w: 0.9, h: 0.36, size: 22, background: "transparent" });
    });
    label("probabilities sum to 1", 0, -1.9, 0, { w: 4.2, h: 0.58, size: 30 });
  }

  function visualTrainingPairs() {
    const pairs = [["my", "name"], ["my name", "is"], ["my name is", "Dinesh"], ["my name is Dinesh", "EOS"]];
    pairs.forEach((p, i) => {
      const y = 1.35 - i * 0.72;
      label(p[0], -1.8, y, 0, { w: 3.0, h: 0.48, size: 26, background: "rgba(9,105,218,0.22)" });
      label(p[1], 1.85, y, 0, { w: 1.8, h: 0.48, size: 26, background: "rgba(26,127,55,0.24)" });
      line("pair", [v(-0.25, y, 0), v(0.9, y, 0)], "purple");
    });
    label("input prefix -> next-token target", 0, -2.0, 0, { w: 5.0, h: 0.55, size: 30 });
  }

  function visualLoss() {
    visualSoftmax();
    box("true target: name", 0, -2.35, 0, "red", { w: 2.4, glow: true });
    line("loss-red", [v(0, -2.0, 0), v(-0.2, 1.15, 0)], "red", 0.022);
    pulsePath([[0, -2.0, 0], [-0.2, 1.15, 0]], "red");
  }

  function visualBptt() {
    visualUnroll();
    label("loss", 3.45, 1.75, 0, { w: 1.2, h: 0.5, size: 26, background: "rgba(207,34,46,0.28)" });
    pulsePath([[3.45, 1.4, 0], [3.45, 0, 0], [1.15, 0, 0], [-1.15, 0, 0], [-3.45, 0, 0]], "red", 0, 0.35);
  }

  function visualSharedWeights() {
    ["W_x", "W_h", "W_y"].forEach((w, i) => box(w, -2.2 + i * 2.2, 1.0, 0, i === 1 ? "green" : "purple", { w: 1.1, glow: true }));
    [0, 1, 2, 3].forEach((_, i) => drawSmallCell(-3.3 + i * 2.2, -0.55, "cell"));
    label("reused at every time step", 0, -2.0, 0, { w: 4.6, h: 0.6, size: 32, background: "rgba(26,127,55,0.23)" });
    pulsePath([[-3.3, -0.55, 0], [-1.1, -0.55, 0], [1.1, -0.55, 0], [3.3, -0.55, 0]], "green");
  }

  function visualPadding() {
    const rows = [
      ["my", "name", "is", "Dinesh", "PAD", "PAD"],
      ["hello", "PAD", "PAD", "PAD", "PAD", "PAD"],
      ["I", "am", "here", "now", "PAD", "PAD"]
    ];
    rows.forEach((row, r) => {
      row.forEach((w, c) => box(w, -3.6 + c * 1.42, 1.2 - r * 0.85, 0, w === "PAD" ? "slate" : "blue", { w: 1.05, h: 0.45, size: 22 }));
    });
    label("PAD positions are masked out of the loss", 0, -1.95, 0, { w: 5.8, h: 0.58, size: 30, background: "rgba(207,34,46,0.22)" });
  }

  function visualConfusion() {
    box("sequence length", -2.2, 0.85, 0, "blue", { w: 2.45 });
    box("10 steps", -2.2, -0.05, 0, "blue", { w: 1.55 });
    box("hidden size", 2.2, 0.85, 0, "green", { w: 2.15 });
    box("512 features", 2.2, -0.05, 0, "green", { w: 1.95 });
    label("different axes, different meanings", 0, -1.55, 0, { w: 5.6, h: 0.62, size: 32 });
  }

  function visualGeneration() {
    const words = ["my", "name", "is", "Dinesh", "EOS"];
    words.forEach((w, i) => box(w, -3.6 + i * 1.8, 0.55, 0, i === 0 ? "blue" : "green", { w: 1.25 }));
    label("predict -> append -> repeat", 0, -0.95, 0, { w: 4.4, h: 0.65, size: 34, background: "rgba(26,127,55,0.23)" });
    pulsePath([[-3.6, 0.55, 0], [-1.8, 0.55, 0], [0, 0.55, 0], [1.8, 0.55, 0], [3.6, 0.55, 0]], "green", 0, 0.24);
  }

  function visualTimeline() {
    const items = [["fixed window", "slate"], ["RNN", "green"], ["LSTM / GRU", "amber"], ["attention", "purple"], ["Transformer", "blue"]];
    items.forEach((item, i) => {
      const x = -4 + i * 2;
      box(item[0], x, 0.4, 0, item[1], { w: 1.55, h: 0.58, size: 23 });
      if (i < items.length - 1) line("timeline", [v(x + 0.8, 0.4, 0), v(x + 1.2, 0.4, 0)], "blue");
    });
    label("RNNs made learned memory explicit", 0, -1.2, 0, { w: 5.1, h: 0.6, size: 32 });
  }

  function visualStruggle() {
    const xs = [-3.6, -2.2, -0.8, 0.6, 2.0, 3.4];
    xs.forEach((x, i) => {
      const radius = Math.max(0.07, 0.22 - i * 0.025);
      sphere("memory", x, 0.4, 0, "green", radius);
      if (i < xs.length - 1) line("fade", [v(x, 0.4, 0), v(xs[i + 1], 0.4, 0)], "green", Math.max(0.012, 0.05 - i * 0.006));
    });
    box("early fact", -3.6, 1.25, 0, "amber", { w: 1.4 });
    label("one hidden vector must carry the whole past", 0, -1.2, 0, { w: 6.2, h: 0.6, size: 32, background: "rgba(191,135,0,0.20)" });
  }

  function visualGradients() {
    label("vanishing", -2.4, 1.45, 0, { w: 2.0, h: 0.52, size: 28, background: "rgba(207,34,46,0.22)" });
    [0, 1, 2, 3, 4].forEach((i) => sphere("vanish", -3.4 + i * 0.5, 0.65, 0, "red", 0.20 - i * 0.03));
    label("exploding", 2.4, 1.45, 0, { w: 2.0, h: 0.52, size: 28, background: "rgba(207,34,46,0.22)" });
    [0, 1, 2, 3, 4].forEach((i) => sphere("explode", 1.2 + i * 0.55, 0.65, 0, "red", 0.08 + i * 0.035));
    label("gradients multiply through time", 0, -1.25, 0, { w: 5.3, h: 0.62, size: 32 });
  }

  function visualSummary() {
    const items = ["words", "tokens", "IDs", "embeddings", "hidden states", "logits", "softmax", "loss", "BPTT"];
    items.forEach((w, i) => {
      const x = -4.2 + (i % 5) * 2.1;
      const y = i < 5 ? 0.75 : -0.75;
      box(w, x, y, 0, i < 3 ? "blue" : i < 5 ? "green" : i < 7 ? "purple" : "red", { w: 1.55, h: 0.52, size: 22 });
      if (i < items.length - 1) {
        const nextX = -4.2 + ((i + 1) % 5) * 2.1;
        const nextY = i + 1 < 5 ? 0.75 : -0.75;
        line("summary-line", [v(x + 0.8, y, 0), v(nextX - 0.8, nextY, 0)], i < 5 ? "blue" : "red", 0.018);
      }
    });
  }

  function drawCell(x, y, text) {
    const cell = BABYLON.MeshBuilder.CreateBox("rnn-cell", { width: 1.85, height: 1.18, depth: 0.35 }, scene);
    cell.position.set(x, y, 0);
    cell.material = mat("cell-mat", palette.purple, true);
    add(cell);
    label(text, x, y, -0.2, { w: 1.55, h: 0.45, size: 28, background: "transparent" });
  }

  function drawSmallCell(x, y, text) {
    const cell = BABYLON.MeshBuilder.CreateBox("small-cell", { width: 1.15, height: 0.8, depth: 0.26 }, scene);
    cell.position.set(x, y, 0);
    cell.material = mat("cell-mat", palette.purple, true);
    add(cell);
    label(text, x, y, -0.16, { w: 0.98, h: 0.34, size: 20, background: "transparent" });
  }

  function vectorBars(cx, cy, count, colorName) {
    for (let i = 0; i < count; i++) {
      const h = 0.28 + (Math.sin(i * 1.7) + 1) * 0.18;
      const bar = BABYLON.MeshBuilder.CreateBox("vector-bar", { width: 0.16, height: h, depth: 0.12 }, scene);
      bar.position.set(cx - (count - 1) * 0.12 + i * 0.24, cy, 0);
      bar.material = mat(`${colorName}-bar`, palette[colorName] || palette.green, true);
      add(bar);
    }
  }

  function pulsePath(raw, colorName, delay = 0, speed = 0.22) {
    const points = raw.map((p) => v(p[0], p[1], p[2]));
    line("pulse-line", points, colorName, 0.018);
    pulse(points, colorName, delay, speed);
  }

  function v(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  function updatePulses(now) {
    const t = now / 1000;
    pulses.forEach((p) => {
      const local = ((t * p.speed + p.delay) % 1 + 1) % 1;
      const pos = pointOnPath(p.points, local);
      p.mesh.position.copyFrom(pos);
      const s = 0.85 + Math.sin(t * 8) * 0.16;
      p.mesh.scaling.set(s, s, s);
    });
  }

  function pointOnPath(points, t) {
    if (points.length === 1) return points[0].clone();
    const total = points.length - 1;
    const scaled = t * total;
    const index = Math.min(Math.floor(scaled), total - 1);
    const local = scaled - index;
    return BABYLON.Vector3.Lerp(points[index], points[index + 1], local);
  }

  function durationFor(item) {
    return Math.max(9000, Math.min(18000, item.narration.length * 72));
  }

  function audioPath(index) {
    return `../assets/audio/rnn-narration/scene-${String(index + 1).padStart(2, "0")}.mp3`;
  }

  function setAudioStatus(message) {
    if (audioStatusEl) audioStatusEl.textContent = message;
  }

  function stopNarration() {
    narrationAudio.pause();
    narrationAudio.removeAttribute("src");
    narrationAudio.load();
    narrationAudio.dataset.scene = "";
    narrationAudio.dataset.autoplay = "false";
    audioReady = false;
  }

  function playNarration() {
    if (!narrationOn || !audioReady) return;
    narrationAudio.play()
      .then(() => setAudioStatus("Recorded narration is playing. Timing follows the human voice."))
      .catch(() => {
        playing = false;
        playButton.textContent = "Play";
        setAudioStatus("Browser blocked audio autoplay. Click Play again after enabling narration.");
      });
  }

  function prepareNarrationForScene(autoplay) {
    audioReady = false;
    narrationAudio.pause();
    narrationAudio.currentTime = 0;
    narrationAudio.dataset.scene = String(current);
    narrationAudio.dataset.autoplay = autoplay ? "true" : "false";
    narrationAudio.src = audioPath(current);
    narrationAudio.load();
    setAudioStatus("Loading recorded narration for this scene...");
  }

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  function tickUi(now) {
    const useAudioClock = narrationOn && audioReady && Number.isFinite(narrationAudio.duration) && narrationAudio.duration > 0;
    const duration = useAudioClock ? narrationAudio.duration * 1000 : sceneDuration;
    const elapsed = useAudioClock ? narrationAudio.currentTime * 1000 : now - sceneStart;
    const progress = Math.max(0, Math.min(1, elapsed / duration));
    progressEl.style.width = `${progress * 100}%`;
    timeEl.textContent = `${formatTime(elapsed)} / ${formatTime(duration)}`;
    if (playing && !useAudioClock && elapsed >= sceneDuration) {
      if (current < scenes.length - 1) renderScene(current + 1);
      else {
        playing = false;
        playButton.textContent = "Play";
      }
    }
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    const start = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((ln, i) => ctx.fillText(ln, x, start + i * lineHeight));
  }

  document.getElementById("prev-scene").addEventListener("click", () => renderScene(current - 1));
  document.getElementById("next-scene").addEventListener("click", () => renderScene(current + 1));
  playButton.addEventListener("click", () => {
    playing = !playing;
    sceneStart = performance.now();
    playButton.textContent = playing ? "Pause" : "Play";
    if (playing && narrationOn) {
      if (audioReady) playNarration();
      else prepareNarrationForScene(true);
    }
    if (!playing) narrationAudio.pause();
  });
  voiceButton.addEventListener("click", () => {
    narrationOn = !narrationOn;
    voiceButton.textContent = narrationOn ? "Narration On" : "Narration Off";
    if (narrationOn) {
      prepareNarrationForScene(playing);
    } else {
      stopNarration();
      setAudioStatus("Recorded narration is off.");
    }
  });
  sliderEl.addEventListener("input", () => renderScene(Number(sliderEl.value)));
  window.addEventListener("resize", () => engine.resize());
  narrationAudio.addEventListener("loadedmetadata", () => {
    if (narrationAudio.dataset.scene !== String(current)) return;
    audioReady = true;
    if (Number.isFinite(narrationAudio.duration) && narrationAudio.duration > 0) {
      sceneDuration = narrationAudio.duration * 1000;
      sceneStart = performance.now();
    }
    setAudioStatus("Recorded narration loaded. Click Play to hear the human-style voice.");
    if (narrationAudio.dataset.autoplay === "true") playNarration();
  });
  narrationAudio.addEventListener("error", () => {
    if (narrationAudio.dataset.scene !== String(current)) return;
    audioReady = false;
    sceneDuration = durationFor(scenes[current]);
    sceneStart = performance.now();
    setAudioStatus("No MP3 exists for this scene yet. Generate narration files before using audio.");
  });
  narrationAudio.addEventListener("ended", () => {
    if (!narrationOn || !playing) return;
    if (current < scenes.length - 1) renderScene(current + 1);
    else {
      playing = false;
      playButton.textContent = "Play";
    }
  });

  engine.runRenderLoop(() => {
    const now = performance.now();
    updatePulses(now);
    tickUi(now);
    scene.render();
  });

  renderScene(0);
}());
