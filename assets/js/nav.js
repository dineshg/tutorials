/* ==========================================================================
   Enterprise AI, Agents & Applied ML — book navigation injector.
   Loaded at the END of <body> on every chapter page. It builds a fixed
   header + collapsible left sidebar, then applies the shared editorial and
   rendering conventions used throughout the book. Chapter content remains
   intact inside the .tr-main column.
   ========================================================================== */
(function () {
  // ---------- 1. Resolve where assets live (relative to this <script>) -----
  var thisScript = document.currentScript;
  var assetBase = thisScript.src.replace(/assets\/js\/nav\.js.*$/, "");
  // assetBase ends with "/" pointing at the book root.

  // ---------- 1b. Load highlight.js so every code block on every page gets
  //               uniform, VS-Code-style colourful syntax highlighting.
  //               GitHub light/dark themes auto-switch with prefers-color-scheme.
  //               Any pre-loaded Prism or stale hljs stylesheet is neutralised
  //               so there is exactly ONE highlighter active at all times. ---

  // Kill any Prism stylesheets already in <head> (pages that had inline Prism refs).
  document.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
    if (/prism/i.test(l.href) || /atom-one/i.test(l.href) || /vs2015/i.test(l.href)) {
      l.disabled = true;
      l.parentNode && l.parentNode.removeChild(l);
    }
  });

  function addHljsStylesheet(href, media) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    if (media) link.media = media;
    document.head.appendChild(link);
  }
  addHljsStylesheet(assetBase + "assets/vendor/highlight.js/11.9.0/styles/github.min.css",
                    "(prefers-color-scheme: light)");
  addHljsStylesheet(assetBase + "assets/vendor/highlight.js/11.9.0/styles/github-dark.min.css",
                    "(prefers-color-scheme: dark)");

  function decorateCodeBlocks() {
    // Silence Prism if it loaded anyway
    if (window.Prism) { window.Prism.highlightAll = function(){}; }

    // Normalise: any bare <pre> without a child <code> gets wrapped in <code>
    // so the same CSS, copy button, and optional highlighter can handle every
    // chapter consistently.
    document.querySelectorAll("pre").forEach(function (pre) {
      if (pre.querySelector("code")) return;
      var raw = pre.innerHTML;
      var code = document.createElement("code");
      code.innerHTML = raw;
      pre.innerHTML = "";
      pre.appendChild(code);
    });

    document.querySelectorAll("pre code").forEach(function (block) {
      // Older chapters contain hand-inserted token spans and inline colours.
      // Convert those blocks back to source text before highlighting so one
      // highlighter and one palette own every code sample in the book.
      var hasManualTokens = block.querySelector(
        "span.keyword,span.string,span.comment,span.function,span.tok-kw,span.tok-str,span.tok-com,span.tok-fn,span.tok-num,span.tok-typ,span.kw,span.str,span.com,span.fn,span.typ,span[class^='hljs-'],span[class*=' hljs-']"
      );
      if (hasManualTokens || block.querySelector("span[style]")) {
        var sourceText = block.textContent;
        block.textContent = sourceText;
        block.classList.remove("hl", "hljs");
        block.removeAttribute("data-highlighted");
      }

      if (window.hljs) {
        try { window.hljs.highlightElement(block); } catch (e) { /* ignore */ }
      }

      // ------ Add language label + copy button header above each <pre> ------
      var pre = block.parentElement;
      if (!pre || pre.tagName !== "PRE" || pre.dataset.hljsDecorated) return;
      pre.dataset.hljsDecorated = "1";

      // Detect language
      var lang = "";
      var classSources = [block, pre];
      classSources.forEach(function (node) {
        node.classList.forEach(function (c) {
          if (c.startsWith("language-")) lang = c.replace("language-", "").toUpperCase();
          if (c === "sql-code") lang = "SQL";
          if (c === "code" && !lang) lang = "CODE";
        });
      });
      if (!lang && pre.dataset && pre.dataset.lang) lang = pre.dataset.lang.toUpperCase();
      if (!lang && block.result) lang = (block.result.language || "").toUpperCase();
      if (!lang || lang === "CODE") lang = inferLanguage(block.innerText || block.textContent || lang);
      if (!lang) lang = "CODE";

      // Friendly label map
      var labels = {
        "PYTHON":"Python","JS":"JavaScript","JAVASCRIPT":"JavaScript",
        "TYPESCRIPT":"TypeScript","TS":"TypeScript","BASH":"Shell","SH":"Shell",
        "JSON":"JSON","YAML":"YAML","HTTP":"HTTP","SQL":"SQL",
        "CSS":"CSS","HTML":"HTML","TEXT":"Plain text","PLAINTEXT":"Plain text","CODE":"Code"
      };
      var displayLang = labels[lang] || lang;

      // Build header bar
      var bar = document.createElement("div");
      bar.className = "tr-code-bar";
      bar.innerHTML =
        '<span class="tr-code-lang">' + displayLang + '</span>' +
        '<button class="tr-copy-btn" aria-label="Copy code">Copy</button>';

      pre.parentNode.insertBefore(bar, pre);

      bar.querySelector(".tr-copy-btn").addEventListener("click", function () {
        var btn = this;
        var text = block.innerText || block.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = "Copy"; }, 1200);
        }).catch(function () {
          btn.textContent = "Copy";
        });
      });
    });
  }

  var hljsScript = document.createElement("script");
  hljsScript.src = assetBase + "assets/vendor/highlight.js/11.9.0/lib/common.min.js";
  hljsScript.defer = true;
  hljsScript.onload = decorateCodeBlocks;
  hljsScript.onerror = decorateCodeBlocks;
  document.head.appendChild(hljsScript);

  // ---------- 2. Book table of contents (kept here so every page sees it) --
  var BOOK = [
    { id: "part1", title: "Part I — Enterprise AI Delivery Lifecycle",
      tag: "delivery-leadership", folder: "part1-enterprise-ai-delivery",
      chapters: [
        ["index.html",                          "Part overview"],
        ["01-business-pain-to-ai-lead.html",    "1. From business pain to AI lead"],
        ["02-intake-package.html",              "2. The intake package"],
        ["03-ai-lead-response.html",            "3. AI lead response document"],
        ["04-kickoff-meeting.html",             "4. Pilot kickoff meeting"],
        ["05-seven-days-after-kickoff.html",    "5. Seven days after kickoff"],
        ["06-architecture-reference-design.html","6. Architecture reference design"],
        ["07-hld-service-selection.html",       "7. HLD and service selection"],
        ["08-after-hld-next-steps.html",        "8. After HLD: next steps"],
        ["09-architecture-review.html",         "9. Architecture review"],
        ["10-hld-to-lld-sprint-plan.html",      "10. HLD → LLD and sprint plan"],
        ["11-provisioning-services-scale.html", "11. Provisioning, services, scale"]
      ]},
    { id: "part2", title: "Part II — Backend, Platform & Security",
      tag: "platform-engineering", folder: "part2-backend-platform-security",
      chapters: [
        ["index.html",                            "Part overview"],
        ["01-fastapi-uvicorn-basics.html",        "1. FastAPI & Uvicorn basics"],
        ["02-http-methods.html",                  "2. HTTP methods"],
        ["03-fastapi-request-mapping.html",       "3. FastAPI request mapping"],
        ["04-pydantic-data-models.html",          "4. Pydantic data models"],
        ["04-concurrency-user-isolation.html",    "5. Concurrency & user isolation"],
        ["05-background-tasks-and-retries.html",  "6. Background tasks & retries"],
        ["06-sso-oauth2-oidc-primer.html",        "7. SSO / OAuth2 / OIDC primer"],
        ["07-oidc-oauth2-pkce-fastapi.html",      "8. OIDC + OAuth2 + PKCE in FastAPI"],
        ["08-registering-new-users.html",         "9. First login & user provisioning"],
        ["09-authentication-deep-dive.html",      "10. Authentication deep dive"],
        ["15-modern-auth-additions.html",         "11. Modern auth additions (Passkeys, DPoP, mTLS)"],
        ["10-enduser-vs-workload-identity.html",  "12. End-user vs workload identity"],
        ["12-tenant-iam-ad-groups.html",          "13. Tenant isolation, IAM, AD groups"],
        ["11-gcp-workload-identity.html",         "14. GCP workload identity"],
        ["13-external-service-integration.html",  "15. Cross-cloud service integration"],
        ["14-github-governance.html",             "16. GitHub governance & CI"]
      ]},
    { id: "part3", title: "Part III — Agent Protocols & Integration",
      tag: "agents-mcp-a2a", folder: "part3-agent-protocols",
      chapters: [
        ["index.html",                          "Part overview"],
        ["01-mcp-fundamentals.html",            "1. MCP fundamentals"],
        ["02-mcp-discovery-remote-auth.html",   "2. MCP discovery, remote, auth"],
        ["03-mcp-enterprise-pattern.html",      "3. MCP enterprise pattern"],
        ["04-mcp-2025-update.html",             "4. MCP protocol evolution (2025–2026)"],
        ["05-a2a-protocol.html",                "5. A2A protocol 1.0"],
        ["06-javascript-typescript-primer.html","6. JavaScript & TypeScript primer"],
        ["07-langchain-langgraph-flowise.html", "7. LangChain → LangGraph → Flowise"]
      ]},
    { id: "part4", title: "Part IV — ML Foundations",
      tag: "classical-ml", folder: "part4-ml-foundations",
      chapters: [
        ["index.html",                  "Part overview"],
        ["01-introduction-pytorch.html","1. PyTorch foundations"],
        ["02-ml-as-geometry.html",      "2. ML as geometry"],
        ["03-linear-regression.html",   "3. Linear regression"],
        ["04-linear-classification.html","4. Linear classification"],
        ["05-trees-bagging-boosting.html","5. Trees, bagging & boosting"]
      ]},
    { id: "part5", title: "Part V — Deep Learning & LLMs",
      tag: "neural-nets-llms", folder: "part5-deep-learning-and-llms",
      chapters: [
        ["index.html",                          "Part overview"],
        ["01-ffn-concepts.html",                "1. FFN concepts"],
        ["02-ffn-training-debugging.html",      "2. FFN training & debugging"],
        ["03-ffn-canonical-merged.html",        "3. FFN single-chapter reference"],
        ["04-cnn-convolution.html",             "4. CNN — convolution"],
        ["05-cnn-architecture.html",            "5. CNN — architecture"],
        ["06-cnn-pytorch-implementation.html",  "6. CNN — PyTorch implementation"],
        ["07-cnn-dropout-train-eval.html",      "7. CNN — dropout & train/eval deep dive"],
        ["08-forecasting-sequence-data.html",   "8. Forecasting & sequence data"],
        ["09-autoregressive-linear-model.html", "9. Autoregressive linear model"],
        ["10-recurrent-neural-networks.html",   "10. Recurrent neural networks"],
        ["11-transformers-and-attention.html",  "11. Transformers & attention"],
        ["12-llm-fine-tuning.html",             "12. LLM fine-tuning"],
        ["13-modern-llm-alignment-orpo-grpo.html","13. Modern LLM alignment: ORPO, GRPO, KTO"]
      ]},
    { id: "part6", title: "Part VI — Appendices",
      tag: "reference", folder: "part6-appendices",
      chapters: [
        ["index.html",                                  "Part overview"],
        ["01-lead-ds-interview-talk-track.html",        "A. Lead DS interview talk track"],
        ["02-classification-latex-print.html",          "B. Classification (LaTeX print)"]
      ]}
  ];

  // Concise editorial purpose for every canonical chapter. The previous and
  // next titles come from BOOK, which keeps the visible chapter bridge aligned
  // with the sidebar and pager without duplicating the reading order.
  var CHAPTER_PURPOSES = {
    "part1-enterprise-ai-delivery/01-business-pain-to-ai-lead.html":
      "Turn an unstructured business complaint into a bounded AI opportunity with clear ownership.",
    "part1-enterprise-ai-delivery/02-intake-package.html":
      "Define the evidence, constraints, stakeholders, and decisions required before solution design starts.",
    "part1-enterprise-ai-delivery/03-ai-lead-response.html":
      "Convert intake evidence into a reviewable proposal: scope, metrics, risks, controls, architecture, and asks.",
    "part1-enterprise-ai-delivery/04-kickoff-meeting.html":
      "Use the response document to secure decisions, expose assumptions, and establish accountable owners.",
    "part1-enterprise-ai-delivery/05-seven-days-after-kickoff.html":
      "Translate kickoff decisions into the first week of artifacts, experiments, gates, and team ownership.",
    "part1-enterprise-ai-delivery/06-architecture-reference-design.html":
      "Follow one request through the reference system, including identity, tenancy, storage, and asynchronous work.",
    "part1-enterprise-ai-delivery/07-hld-service-selection.html":
      "Choose services at HLD level, record tradeoffs, and separate reversible choices from enterprise constraints.",
    "part1-enterprise-ai-delivery/08-after-hld-next-steps.html":
      "Sequence approvals, detailed design, backlog preparation, and dependency work after the HLD is drafted.",
    "part1-enterprise-ai-delivery/09-architecture-review.html":
      "Run the formal review and turn comments into explicit approval conditions, owners, and evidence.",
    "part1-enterprise-ai-delivery/10-hld-to-lld-sprint-plan.html":
      "Decompose architecture into vertical slices, stories, acceptance criteria, and a buildable sprint plan.",
    "part1-enterprise-ai-delivery/11-provisioning-services-scale.html":
      "Make the design deployable through provisioning tickets, capacity assumptions, latency budgets, and scaling choices.",

    "part2-backend-platform-security/01-fastapi-uvicorn-basics.html":
      "Establish the Python web-server runtime and the smallest complete FastAPI request/response loop.",
    "part2-backend-platform-security/02-http-methods.html":
      "Separate resource identity from operation intent by learning the semantics and safety properties of HTTP methods.",
    "part2-backend-platform-security/03-fastapi-request-mapping.html":
      "Trace one raw HTTP message into typed path, query, header, and body parameters in FastAPI.",
    "part2-backend-platform-security/04-pydantic-data-models.html":
      "Build from ordinary classes and dataclasses to validated Pydantic boundary contracts.",
    "part2-backend-platform-security/04-concurrency-user-isolation.html":
      "Combine async execution, backpressure, and tenant-scoped data access without sharing request state.",
    "part2-backend-platform-security/05-background-tasks-and-retries.html":
      "Move slow work outside the request while preserving durability, idempotency, retry safety, and tenant context.",
    "part2-backend-platform-security/06-sso-oauth2-oidc-primer.html":
      "Separate the SSO experience, OAuth authorization, OIDC authentication, sessions, and API access tokens.",
    "part2-backend-platform-security/07-oidc-oauth2-pkce-fastapi.html":
      "Follow Authorization Code plus PKCE from the browser through token validation and stable backend identity.",
    "part2-backend-platform-security/08-registering-new-users.html":
      "Turn a verified external identity into a race-safe local user and governed tenant membership.",
    "part2-backend-platform-security/09-authentication-deep-dive.html":
      "Compare authentication mechanisms and validate JWT or opaque access tokens at the correct trust boundary.",
    "part2-backend-platform-security/15-modern-auth-additions.html":
      "Extend the core auth model with passkeys, sender-constrained tokens, mTLS, and token exchange.",
    "part2-backend-platform-security/10-enduser-vs-workload-identity.html":
      "Keep human identity, application authorization, cloud IAM, and workload credentials in distinct lanes.",
    "part2-backend-platform-security/12-tenant-iam-ad-groups.html":
      "Apply the identity lanes to tenant bootstrap, group gating, and data-isolation policy.",
    "part2-backend-platform-security/11-gcp-workload-identity.html":
      "Implement the identity and tenancy model with GCP projects, service accounts, storage, networking, and deployment.",
    "part2-backend-platform-security/13-external-service-integration.html":
      "Cross a cloud trust boundary with managed secrets or federated workload identity, then bound reliability and data risk.",
    "part2-backend-platform-security/14-github-governance.html":
      "Enforce engineering policy through rulesets, required checks, trusted runners, scanning, and auditable merges.",

    "part3-agent-protocols/01-mcp-fundamentals.html":
      "Learn MCP through the three server primitives: tools, resources, and prompts.",
    "part3-agent-protocols/02-mcp-discovery-remote-auth.html":
      "Connect MCP clients and servers across process and network boundaries with discovery and authorization.",
    "part3-agent-protocols/03-mcp-enterprise-pattern.html":
      "Apply MCP behind a FastAPI host while preserving downstream identity, policy, and audit boundaries.",
    "part3-agent-protocols/04-mcp-2025-update.html":
      "Understand how the 2025 protocol matured and why the 2026 stateless core changes deployment and extension design.",
    "part3-agent-protocols/05-a2a-protocol.html":
      "Move from agent-to-tool integration to interoperable agent-to-agent delegation, task lifecycle, and artifacts.",
    "part3-agent-protocols/06-javascript-typescript-primer.html":
      "Build the JavaScript and TypeScript foundation needed to read and implement the following orchestration examples.",
    "part3-agent-protocols/07-langchain-langgraph-flowise.html":
      "Progress from linear runnable transforms to stateful graphs and then to visual workflow composition.",

    "part4-ml-foundations/01-introduction-pytorch.html":
      "Establish tensors, autograd, modules, optimizers, and the training-loop vocabulary used by every later model.",
    "part4-ml-foundations/02-ml-as-geometry.html":
      "See examples as points and models as geometric functions that fit values or separate classes.",
    "part4-ml-foundations/03-linear-regression.html":
      "Implement the complete supervised-learning loop for a continuous target using a linear model and MSE.",
    "part4-ml-foundations/04-linear-classification.html":
      "Change the target, output interpretation, loss, and metrics to solve binary classification.",
    "part4-ml-foundations/05-trees-bagging-boosting.html":
      "Contrast differentiable linear models with split-based learners, then reduce variance or bias through ensembles.",

    "part5-deep-learning-and-llms/01-ffn-concepts.html":
      "Add hidden layers and nonlinear activations so a model can learn boundaries a single linear unit cannot.",
    "part5-deep-learning-and-llms/02-ffn-training-debugging.html":
      "Train feed-forward networks reliably with batches, devices, evaluation metrics, and debugging tools.",
    "part5-deep-learning-and-llms/03-ffn-canonical-merged.html":
      "Provide the FFN concept and training path as one optional publication-style reference chapter.",
    "part5-deep-learning-and-llms/04-cnn-convolution.html":
      "Replace flattening with local, shared filters that preserve image structure.",
    "part5-deep-learning-and-llms/05-cnn-architecture.html":
      "Stack channels, filters, activations, pooling, and downsampling into a complete visual hierarchy.",
    "part5-deep-learning-and-llms/06-cnn-pytorch-implementation.html":
      "Translate CNN shape arithmetic and architecture choices into reusable PyTorch modules.",
    "part5-deep-learning-and-llms/07-cnn-dropout-train-eval.html":
      "Explain stochastic regularization and why model behavior changes between training and evaluation.",
    "part5-deep-learning-and-llms/08-forecasting-sequence-data.html":
      "Turn ordered observations into leakage-safe windows, horizons, baselines, and backtests.",
    "part5-deep-learning-and-llms/09-autoregressive-linear-model.html":
      "Implement and evaluate the simplest learned sequence baseline before introducing recurrent memory.",
    "part5-deep-learning-and-llms/10-recurrent-neural-networks.html":
      "Replace a fixed lookback with recurrent state, then address memory failure with GRU and LSTM gates.",
    "part5-deep-learning-and-llms/11-transformers-and-attention.html":
      "Replace a single recurrent bottleneck with learned lookup over token states, leading to causal GPT generation.",
    "part5-deep-learning-and-llms/12-llm-fine-tuning.html":
      "Adapt a pretrained Transformer with SFT and parameter-efficient methods, then evaluate the result.",
    "part5-deep-learning-and-llms/13-modern-llm-alignment-orpo-grpo.html":
      "Compare preference and reward-based objectives after supervised adaptation and choose an alignment strategy.",

    "part6-appendices/01-lead-ds-interview-talk-track.html":
      "Synthesize delivery, platform, agent, and model concepts into a timed interview narrative.",
    "part6-appendices/02-classification-latex-print.html":
      "Provide a print-oriented source companion for the classification material."
  };

  // ---------- 3. Detect current page from window.location ------------------
  var pathParts = window.location.pathname.split("/").filter(Boolean);
  var currentFolder = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : "";
  var currentFile   = pathParts.length >= 1 ? pathParts[pathParts.length - 1] : "index.html";
  if (!currentFile) currentFile = "index.html";

  // ---------- 4. Build header ---------------------------------------------
  var header = document.createElement("header");
  header.className = "tr-header";
  header.innerHTML =
    '<button class="tr-toggle" aria-label="Toggle navigation">☰ Menu</button>' +
    '<a class="tr-brand" href="' + assetBase + 'index.html">' +
      '<span class="tr-brand-mark">TR</span>' +
      '<span>Enterprise AI, Agents &amp; Applied ML</span>' +
    '</a>' +
    '<span class="tr-spacer"></span>' +
    '<span class="tr-meta">tutorial book</span>';

  // ---------- 5. Build sidebar --------------------------------------------
  var sidebar = document.createElement("aside");
  sidebar.className = "tr-sidebar";
  var sb = '<h3 style="margin-top:0">Book</h3>' +
           '<ul><li><a href="' + assetBase + 'index.html">Home / Table of contents</a></li>' +
           '<li><a href="' + assetBase + 'content-map.html">Reading guide and concept map</a></li></ul>';
  BOOK.forEach(function (part) {
    sb += '<h3>' + escapeHtml(part.title) + '</h3><ul>';
    part.chapters.forEach(function (c) {
      var href = assetBase + part.folder + "/" + c[0];
      var isActive =
        currentFolder === part.folder &&
        currentFile === c[0];
      sb += '<li><a href="' + href + '"' +
            (isActive ? ' class="tr-active"' : '') +
            '>' + escapeHtml(c[1]) + '</a></li>';
    });
    sb += '</ul>';
  });
  sidebar.innerHTML = sb;

  // ---------- 6. Build the layout shell. We move the existing <body>
  //              children into .tr-content so each chapter's markup is kept. -
  var existing = [];
  while (document.body.firstChild) existing.push(document.body.removeChild(document.body.firstChild));

  document.body.appendChild(header);

  var layout = document.createElement("div");
  layout.className = "tr-layout";

  layout.appendChild(sidebar);

  var main = document.createElement("main");
  main.className = "tr-main";

  var content = document.createElement("div");
  content.className = "tr-content";

  // Breadcrumbs
  var crumbs = document.createElement("div");
  crumbs.className = "tr-crumbs";
  var partInfo = BOOK.filter(function (p) { return p.folder === currentFolder; })[0];
  if (partInfo) {
    crumbs.innerHTML =
      '<a href="' + assetBase + 'index.html">Home</a> · ' +
      '<a href="' + assetBase + partInfo.folder + '/index.html">' + escapeHtml(partInfo.title) + '</a>';
    content.appendChild(crumbs);
  }

  existing.forEach(function (n) { content.appendChild(n); });

  decorateChapterStructure(content, partInfo, currentFile);
  normalizeEquationBlocks(content);
  decorateTables(content);
  decorateImages(content);

  // Shared TeX rendering for chapters that contain math but do not ship their
  // own KaTeX/MathJax setup. This keeps equations out of code-block styling
  // and makes newer pages follow the same math behavior as the older ML pages.
  renderGlobalMathIfNeeded(content);

  // Pager
  if (partInfo) {
    var idx = -1;
    partInfo.chapters.forEach(function (c, i) { if (c[0] === currentFile) idx = i; });
    if (idx >= 0) {
      var pager = document.createElement("nav");
      pager.className = "tr-pager";
      var prev = idx > 0 ? partInfo.chapters[idx - 1] : null;
      var next = idx < partInfo.chapters.length - 1 ? partInfo.chapters[idx + 1] : null;
      if (prev) {
        pager.innerHTML +=
          '<a href="' + assetBase + partInfo.folder + '/' + prev[0] + '">' +
            '<span class="tr-pager-label">← Previous</span>' +
            '<span class="tr-pager-title">' + escapeHtml(prev[1]) + '</span>' +
          '</a>';
      } else {
        pager.innerHTML += '<span></span>';
      }
      if (next) {
        pager.innerHTML +=
          '<a class="tr-pager-next" href="' + assetBase + partInfo.folder + '/' + next[0] + '">' +
            '<span class="tr-pager-label">Next →</span>' +
            '<span class="tr-pager-title">' + escapeHtml(next[1]) + '</span>' +
          '</a>';
      } else {
        pager.innerHTML += '<span></span>';
      }
      content.appendChild(pager);
    }
  }

  // Footer
  var footer = document.createElement("footer");
  footer.className = "tr-footer";
  footer.innerHTML =
    'Enterprise AI, Agents &amp; Applied ML — practical notes, examples, and reference material.';
  content.appendChild(footer);

  main.appendChild(content);
  layout.appendChild(main);
  document.body.appendChild(layout);

  // ---------- 7. Mobile toggle --------------------------------------------
  var toggle = header.querySelector(".tr-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    sidebar.classList.toggle("tr-open");
  });

  // ---------- 8. Helpers ---------------------------------------------------
  function decorateChapterStructure(root, part, file) {
    if (!root) return;

    var usedIds = {};
    root.querySelectorAll("[id]").forEach(function (node) {
      usedIds[node.id] = true;
    });

    var headings = Array.prototype.slice.call(root.querySelectorAll("h2"));
    headings.forEach(function (heading) {
      if (heading.id) return;
      var base = slugify(heading.textContent) || "section";
      var id = base;
      var suffix = 2;
      while (usedIds[id]) id = base + "-" + suffix++;
      heading.id = id;
      usedIds[id] = true;
    });

    if (!part || file === "index.html") return;

    var index = -1;
    part.chapters.forEach(function (chapter, i) {
      if (chapter[0] === file) index = i;
    });
    if (index < 0) return;

    var key = part.folder + "/" + file;
    var current = part.chapters[index];
    var previous = index > 1 ? part.chapters[index - 1] : null;
    var next = index < part.chapters.length - 1 ? part.chapters[index + 1] : null;
    var purpose = CHAPTER_PURPOSES[key];
    var h1 = root.querySelector("h1");

    if (h1 && purpose) {
      var bridge = document.createElement("aside");
      bridge.className = "tr-chapter-flow";
      bridge.setAttribute("aria-label", "Chapter progression");

      var previousHtml = previous
        ? '<a href="' + assetBase + part.folder + "/" + previous[0] + '">' +
            escapeHtml(previous[1]) + "</a>"
        : "The part overview and prerequisites";
      var nextHtml = next
        ? '<a href="' + assetBase + part.folder + "/" + next[0] + '">' +
            escapeHtml(next[1]) + "</a>"
        : "The end of this part";

      bridge.innerHTML =
        '<div><span class="tr-flow-label">Builds on</span><span class="tr-flow-value">' +
          previousHtml + "</span></div>" +
        '<div><span class="tr-flow-label">Chapter focus</span><span class="tr-flow-value">' +
          escapeHtml(purpose) + "</span></div>" +
        '<div><span class="tr-flow-label">Leads to</span><span class="tr-flow-value">' +
          nextHtml + "</span></div>";

      var hero = h1.closest(".hero, .part-header");
      (hero || h1).insertAdjacentElement("afterend", bridge);
    }

    var hasLocalToc = root.querySelector(".toc, .quicknav, .toc-links, .tr-auto-toc");
    if (!hasLocalToc && headings.length >= 4) {
      var toc = document.createElement("details");
      toc.className = "tr-auto-toc";
      var list = headings.map(function (heading) {
        return '<li><a href="#' + escapeHtml(heading.id) + '">' +
          escapeHtml(heading.textContent.trim()) + "</a></li>";
      }).join("");
      toc.innerHTML = "<summary>Chapter contents</summary><ol>" + list + "</ol>";

      var bridgeNode = root.querySelector(".tr-chapter-flow");
      if (bridgeNode) bridgeNode.insertAdjacentElement("afterend", toc);
      else if (h1) h1.insertAdjacentElement("afterend", toc);
    }
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function renderGlobalMathIfNeeded(root) {
    if (!root) return;

    var pageAlreadyOwnsMath =
      document.querySelector('script[src*="katex"], script[src*="MathJax"], script[src*="mathjax"]') ||
      root.querySelector(".katex, mjx-container");
    if (pageAlreadyOwnsMath) return;

    var text = collectRenderableText(root);
    var hasTeX = /(\\\(|\\\[|\$\$|(^|[\s(])\$[^$\n]{1,240}\$)/m.test(text);
    if (!hasTeX) return;

    normalizeBackslashesInsideMath(root);

    window.MathJax = window.MathJax || {};
    window.MathJax.tex = Object.assign({
      inlineMath: [["\\(", "\\)"], ["$", "$"]],
      displayMath: [["\\[", "\\]"], ["$$", "$$"]],
      processEscapes: true
    }, window.MathJax.tex || {});
    window.MathJax.options = Object.assign({
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    }, window.MathJax.options || {});

    function typeset() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([root]).catch(function () {});
      }
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      typeset();
      return;
    }

    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-chtml.js";
    script.async = true;
    script.onload = typeset;
    document.head.appendChild(script);
  }

  function normalizeEquationBlocks(root) {
    if (!root) return;

    root.querySelectorAll("pre").forEach(function (pre) {
      var text = (pre.textContent || "").trim();
      if (!text) return;

      var className = (pre.className + " " +
        (pre.querySelector("code") ? pre.querySelector("code").className : "")).toLowerCase();
      var declaredMath = /\blanguage-(tex|latex|math)\b/.test(className);
      var delimitedDisplay =
        (text.startsWith("$$") && text.endsWith("$$")) ||
        (text.startsWith("\\[") && text.endsWith("\\]"));
      var delimitedInlineBlock =
        !text.startsWith("$$") && text.startsWith("$") && text.endsWith("$");
      var containsTeX = /\\(?:begin|beta|cdot|dfrac|exp|frac|lambda|left|log|mathbb|mathcal|mathbf|mathrm|mid|operatorname|prod|quad|right|sigma|sqrt|sum|text|theta)\b|[_^]\{/.test(text);

      if (!declaredMath && !(containsTeX && (delimitedDisplay || delimitedInlineBlock))) return;

      var expression = text;
      if (delimitedInlineBlock) {
        expression = "\\[" + text.slice(1, -1).trim() + "\\]";
      } else if (!delimitedDisplay) {
        expression = "\\[" + text + "\\]";
      }

      var math = document.createElement("div");
      math.className = "math tr-math-display";
      math.textContent = expression;
      pre.replaceWith(math);
    });
  }

  function decorateImages(root) {
    if (!root) return;
    root.querySelectorAll("img").forEach(function (img) {
      if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");

      if (img.closest("figure, .figure, a, pre, code")) return;

      var parent = img.parentNode;
      if (!parent) return;

      var figure = document.createElement("figure");
      figure.className = "tr-auto-figure";
      parent.insertBefore(figure, img);
      figure.appendChild(img);

      var alt = (img.getAttribute("alt") || "").trim();
      if (alt && !/^(image|figure|diagram|photo)$/i.test(alt)) {
        var caption = document.createElement("figcaption");
        caption.textContent = alt;
        figure.appendChild(caption);
      }
    });
  }

  function decorateTables(root) {
    if (!root) return;
    root.querySelectorAll("table").forEach(function (table) {
      if (table.closest(".tr-table-scroll")) return;
      var parent = table.parentNode;
      if (!parent) return;
      var wrapper = document.createElement("div");
      wrapper.className = "tr-table-scroll";
      parent.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function inferLanguage(text) {
    var sample = String(text || "").trim();
    if (!sample) return "";
    if (/^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+https?:\/\//m.test(sample) ||
        /^Authorization:\s*Bearer\b/m.test(sample)) return "HTTP";
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|WITH)\b/im.test(sample)) return "SQL";
    if (/^\s*[{[]/.test(sample) && /["']?[A-Za-z0-9_-]+["']?\s*:/.test(sample)) return "JSON";
    if (/\b(from\s+[\w.]+\s+import|import\s+[\w.,{}\s]+\s+from|def\s+\w+\(|class\s+\w+|async\s+def)\b/.test(sample)) return "PYTHON";
    if (/\b(const|let|var|function|interface|type)\s+\w+|=>|console\.log/.test(sample)) return "JAVASCRIPT";
    if (/^\s*(pip|npm|npx|uvicorn|python|node|docker|gcloud|kubectl)\b/m.test(sample)) return "BASH";
    return "";
  }

  function collectRenderableText(root) {
    var ignored = { SCRIPT:1, STYLE:1, TEXTAREA:1, PRE:1, CODE:1, NOSCRIPT:1 };
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || ignored[parent.tagName]) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var out = "";
    while (walker.nextNode()) out += walker.currentNode.nodeValue + "\n";
    return out;
  }

  function normalizeBackslashesInsideMath(root) {
    var ignored = { SCRIPT:1, STYLE:1, TEXTAREA:1, PRE:1, CODE:1, NOSCRIPT:1 };
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || ignored[parent.tagName]) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.indexOf("\\\\") === -1) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      node.nodeValue = normalizeMathText(node.nodeValue);
    });
  }

  function normalizeMathText(text) {
    var out = "", i = 0, mode = null;
    function escaped(s, idx) {
      var count = 0;
      for (var j = idx - 1; j >= 0 && s[j] === "\\"; j--) count++;
      return count % 2 === 1;
    }
    while (i < text.length) {
      if (!mode) {
        if (text.startsWith("$$", i)) { mode = "$$"; out += "$$"; i += 2; continue; }
        if (text.startsWith("\\[", i)) { mode = "\\]"; out += "\\["; i += 2; continue; }
        if (text.startsWith("\\(", i)) { mode = "\\)"; out += "\\("; i += 2; continue; }
        if (text[i] === "$" && !escaped(text, i)) { mode = "$"; out += "$"; i++; continue; }
        out += text[i++];
        continue;
      }
      if ((mode === "$$" && text.startsWith("$$", i) && !escaped(text, i)) ||
          (mode === "\\]" && text.startsWith("\\]", i)) ||
          (mode === "\\)" && text.startsWith("\\)", i))) {
        out += mode === "$$" ? "$$" : mode;
        i += mode === "$$" ? 2 : 2;
        mode = null;
        continue;
      }
      if (mode === "$" && text[i] === "$" && !escaped(text, i)) {
        out += "$";
        i++;
        mode = null;
        continue;
      }
      if (text[i] === "\\" && text[i + 1] === "\\") {
        out += "\\";
        i += 2;
        continue;
      }
      out += text[i++];
    }
    return out;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
