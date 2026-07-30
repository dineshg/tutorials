export const siteBaseUrl = "/tutorials/";

export const rootDocuments = [
  {
    id: "home",
    source: "index.html",
    route: "/",
    label: "Book home",
    kind: "home",
  },
  {
    id: "content-map",
    source: "content-map.html",
    route: "/content-map",
    label: "Reading guide and concept map",
    kind: "map",
  },
];

export const parts = [
  {
    id: "part1",
    label: "Part I - Enterprise AI Delivery",
    fullLabel: "Part I - Enterprise AI Delivery Lifecycle",
    folder: "part1-enterprise-ai-delivery",
    accent: "blue",
    documents: [
      ["index.html", "Part overview"],
      ["01-business-pain-to-ai-lead.html", "1. From business pain to AI lead"],
      ["02-intake-package.html", "2. The intake package"],
      ["03-ai-lead-response.html", "3. AI lead response document"],
      ["04-kickoff-meeting.html", "4. Pilot kickoff meeting"],
      ["05-seven-days-after-kickoff.html", "5. Seven days after kickoff"],
      ["06-architecture-reference-design.html", "6. Architecture reference design"],
      ["07-hld-service-selection.html", "7. HLD and service selection"],
      ["08-after-hld-next-steps.html", "8. After HLD: next steps"],
      ["09-architecture-review.html", "9. Architecture review"],
      ["10-hld-to-lld-sprint-plan.html", "10. HLD to LLD and sprint plan"],
      ["11-provisioning-services-scale.html", "11. Provisioning, services, scale"],
    ],
  },
  {
    id: "part2",
    label: "Part II - Backend, Platform & Security",
    fullLabel: "Part II - Backend, Platform & Security",
    folder: "part2-backend-platform-security",
    accent: "teal",
    documents: [
      ["index.html", "Part overview"],
      ["01-fastapi-uvicorn-basics.html", "1. FastAPI and Uvicorn basics"],
      ["02-http-methods.html", "2. HTTP methods"],
      ["03-fastapi-request-mapping.html", "3. FastAPI request mapping"],
      ["04-pydantic-data-models.html", "4. Pydantic data models"],
      ["04-concurrency-user-isolation.html", "5. Concurrency and user isolation"],
      ["05-background-tasks-and-retries.html", "6. Background tasks and retries"],
      ["06-sso-oauth2-oidc-primer.html", "7. SSO, OAuth 2.0, and OIDC primer"],
      ["07-oidc-oauth2-pkce-fastapi.html", "8. OIDC, OAuth 2.0, and PKCE in FastAPI"],
      ["08-registering-new-users.html", "9. First login and user provisioning"],
      ["09-authentication-deep-dive.html", "10. Authentication deep dive"],
      ["15-modern-auth-additions.html", "11. Passkeys, DPoP, mTLS, and token exchange"],
      ["10-enduser-vs-workload-identity.html", "12. End-user vs workload identity"],
      ["12-tenant-iam-ad-groups.html", "13. Tenant isolation, IAM, and groups"],
      ["11-gcp-workload-identity.html", "14. GCP workload identity"],
      ["13-external-service-integration.html", "15. Cross-cloud service integration"],
      ["14-github-governance.html", "16. GitHub governance and CI"],
    ],
  },
  {
    id: "part3",
    label: "Part III - Agent Protocols",
    fullLabel: "Part III - Agent Protocols & Integration",
    folder: "part3-agent-protocols",
    accent: "violet",
    documents: [
      ["index.html", "Part overview"],
      ["01-mcp-fundamentals.html", "1. MCP fundamentals"],
      ["02-mcp-discovery-remote-auth.html", "2. MCP discovery, remote transport, and auth"],
      ["03-mcp-enterprise-pattern.html", "3. MCP enterprise pattern"],
      ["04-mcp-2025-update.html", "4. MCP protocol evolution"],
      ["05-a2a-protocol.html", "5. A2A protocol 1.0"],
      ["06-javascript-typescript-primer.html", "6. JavaScript and TypeScript primer"],
      ["07-langchain-langgraph-flowise.html", "7. LangChain, LangGraph, and Flowise"],
    ],
  },
  {
    id: "part4",
    label: "Part IV - ML Foundations",
    fullLabel: "Part IV - Machine Learning Foundations",
    folder: "part4-ml-foundations",
    accent: "amber",
    documents: [
      ["index.html", "Part overview"],
      ["01-introduction-pytorch.html", "1. PyTorch foundations"],
      ["02-ml-as-geometry.html", "2. Machine learning as geometry"],
      ["03-linear-regression.html", "3. Linear regression"],
      ["04-linear-classification.html", "4. Linear classification"],
      ["05-trees-bagging-boosting.html", "5. Trees, bagging, and boosting"],
    ],
  },
  {
    id: "part5",
    label: "Part V - Deep Learning & LLMs",
    fullLabel: "Part V - Deep Learning & Large Language Models",
    folder: "part5-deep-learning-and-llms",
    accent: "coral",
    documents: [
      ["index.html", "Part overview"],
      ["01-ffn-concepts.html", "1. Feed-forward network concepts"],
      ["02-ffn-training-debugging.html", "2. FFN training and debugging"],
      ["03-ffn-canonical-merged.html", "3. FFN single-chapter reference"],
      ["04-cnn-convolution.html", "4. CNN convolution"],
      ["05-cnn-architecture.html", "5. CNN architecture"],
      ["06-cnn-pytorch-implementation.html", "6. CNN PyTorch implementation"],
      ["07-cnn-dropout-train-eval.html", "7. CNN dropout and train/eval"],
      ["08-forecasting-sequence-data.html", "8. Forecasting and sequence data"],
      ["09-autoregressive-linear-model.html", "9. Autoregressive linear model"],
      ["10-recurrent-neural-networks.html", "10. Recurrent neural networks"],
      ["11-transformers-and-attention.html", "11. Transformers and attention"],
      ["12-llm-fine-tuning.html", "12. LLM fine-tuning"],
      ["13-modern-llm-alignment-orpo-grpo.html", "13. Modern LLM post-training"],
    ],
    extraItems: [
      {
        after: "10-recurrent-neural-networks.html",
        label: "Interactive lab: animated RNN",
        href: "/labs/rnn",
      },
    ],
  },
  {
    id: "part6",
    label: "Part VI - Appendices",
    fullLabel: "Part VI - Appendices",
    folder: "part6-appendices",
    accent: "slate",
    documents: [
      ["index.html", "Part overview"],
      ["01-lead-ds-interview-talk-track.html", "A. Lead DS interview talk track"],
      ["02-classification-latex-print.html", "B. Classification LaTeX source"],
    ],
  },
];

export const documents = [
  ...rootDocuments,
  ...parts.flatMap((part) =>
    part.documents.map(([file, label]) => {
      const source = `${part.folder}/${file}`;
      const basename =
        file === "index.html"
          ? "/overview"
          : `/${file.replace(/\.html$/, "")}`;
      return {
        id: file === "index.html" ? `${part.folder}/index` : source.replace(/\.html$/, ""),
        source,
        route: `/${part.folder}${basename}`,
        label,
        kind: file === "index.html" ? "part" : "chapter",
        partId: part.id,
        partLabel: part.fullLabel,
        accent: part.accent,
        nativeMarkdown:
          source === "part6-appendices/01-lead-ds-interview-talk-track.html"
            ? "part6-appendices/01-lead-ds-interview-talk-track.md"
            : null,
      };
    }),
  ),
];

export const labRoute = {
  source: "part5-deep-learning-and-llms/10-rnn-animated-tutorial.html",
  route: "/labs/rnn",
  legacyRoute:
    "/part5-deep-learning-and-llms/10-rnn-animated-tutorial.html",
};

export const routeBySource = new Map([
  ...documents.map((document) => [document.source, document.route]),
  [labRoute.source, labRoute.route],
  [
    "part6-appendices/01-lead-ds-interview-talk-track.md",
    "/part6-appendices/01-lead-ds-interview-talk-track",
  ],
]);
