/* ==========================================================================
   Tutorial Refined — book navigation injector.
   Loaded at the END of <body> on every chapter page. It builds a fixed
   header + collapsible left sidebar without modifying the chapter's own
   inline content/styles. The page's existing content remains intact and
   appears inside the .tr-main column.
   ========================================================================== */
(function () {
  // ---------- 1. Resolve where assets live (relative to this <script>) -----
  var thisScript = document.currentScript;
  var assetBase = thisScript.src.replace(/assets\/js\/nav\.js.*$/, "");
  // assetBase ends with "/" pointing at the book root.

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
        ["04-concurrency-user-isolation.html",    "4. Concurrency & user isolation"],
        ["05-background-tasks-and-retries.html",  "5. Background tasks & retries"],
        ["06-sso-oauth2-oidc-primer.html",        "6. SSO / OAuth2 / OIDC primer"],
        ["07-oidc-oauth2-pkce-fastapi.html",      "7. OIDC + OAuth2 + PKCE in FastAPI"],
        ["08-registering-new-users.html",         "8. Registering new users"],
        ["09-authentication-deep-dive.html",      "9. Authentication deep dive"],
        ["10-enduser-vs-workload-identity.html",  "10. End-user vs workload identity"],
        ["11-gcp-workload-identity.html",         "11. GCP workload identity"],
        ["12-tenant-iam-ad-groups.html",          "12. Tenant isolation, IAM, AD groups"],
        ["13-external-service-integration.html",  "13. External service integration"],
        ["14-github-governance.html",             "14. GitHub governance & CI"],
        ["15-modern-auth-additions.html",         "15. Modern auth additions (Passkeys, DPoP, mTLS)"]
      ]},
    { id: "part3", title: "Part III — Agent Protocols & Integration",
      tag: "agents-mcp-a2a", folder: "part3-agent-protocols",
      chapters: [
        ["index.html",                          "Part overview"],
        ["01-mcp-fundamentals.html",            "1. MCP fundamentals"],
        ["02-mcp-discovery-remote-auth.html",   "2. MCP discovery, remote, auth"],
        ["03-mcp-enterprise-pattern.html",      "3. MCP enterprise pattern"],
        ["04-mcp-2025-update.html",             "4. MCP 2025 update (Streamable HTTP, OAuth, elicitation) (NEW)"],
        ["05-a2a-protocol.html",                "5. A2A protocol"],
        ["06-javascript-typescript-primer.html","6. JavaScript & TypeScript primer"],
        ["07-langchain-langgraph-flowise.html", "7. LangChain → LangGraph → Flowise"]
      ]},
    { id: "part4", title: "Part IV — ML Foundations",
      tag: "classical-ml", folder: "part4-ml-foundations",
      chapters: [
        ["index.html",                  "Part overview"],
        ["01-introduction-pytorch.html","1. Introduction to PyTorch"],
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
        ["03-ffn-canonical-merged.html",        "3. FFN canonical (merged release edition)"],
        ["04-cnn-convolution.html",             "4. CNN — convolution"],
        ["05-cnn-architecture.html",            "5. CNN — architecture"],
        ["06-cnn-pytorch-implementation.html",  "6. CNN — PyTorch implementation"],
        ["07-cnn-dropout-train-eval.html",      "7. CNN — dropout & train/eval"],
        ["08-forecasting-sequence-data.html",   "8. Forecasting & sequence data"],
        ["09-autoregressive-linear-model.html", "9. Autoregressive linear model"],
        ["10-recurrent-neural-networks.html",   "10. Recurrent neural networks"],
        ["11-transformers-and-attention.html",  "11. Transformers & attention (NEW)"],
        ["12-llm-fine-tuning.html",             "12. LLM fine-tuning"],
        ["13-modern-llm-alignment-orpo-grpo.html","13. Modern LLM alignment: ORPO, GRPO, KTO (NEW)"]
      ]},
    { id: "part6", title: "Part VI — Appendices",
      tag: "reference", folder: "part6-appendices",
      chapters: [
        ["index.html",                                  "Part overview"],
        ["01-lead-ds-interview-talk-track.html",        "A. Lead DS interview talk track"],
        ["02-classification-latex-print.html",          "B. Classification (LaTeX print)"]
      ]}
  ];

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
    '<span class="tr-meta">datascience_tutorial · v1.0</span>';

  // ---------- 5. Build sidebar --------------------------------------------
  var sidebar = document.createElement("aside");
  sidebar.className = "tr-sidebar";
  var sb = '<h3 style="margin-top:0">Book</h3>' +
           '<ul><li><a href="' + assetBase + 'index.html">Home / Table of contents</a></li>' +
           '<li><a href="' + assetBase + 'README.md">README</a></li></ul>';
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
  //              children into .tr-content so original markup is preserved. -
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
    'Tutorial Refined — built from the original /pytorch tutorials. ' +
    'Original content preserved verbatim; new chapters marked “(NEW)” add latest methods.';
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
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
