#!/usr/bin/env python3
"""Insert chapter-specific coverage notes into the Quarto starter chapters."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


COVERAGE: dict[str, list[str]] = {
    "00-orientation/00-who-this-book-is-for.qmd": [
        "Assumed reader: practical Python user with basic statistics and machine learning exposure.",
        "Primary gap addressed: moving from local analysis to production systems and project leadership.",
        "The book deliberately combines modelling, backend, identity, evaluation, and delivery because enterprise AI failures often happen between those boundaries.",
    ],
    "00-orientation/01-industry-ai-delivery-map.qmd": [
        "A production AI delivery map starts with business pain, then moves through feasibility, data access, baseline, evaluation, architecture, security review, rollout, and support.",
        "The main decision is not model choice; it is whether AI is the right intervention compared with rules, automation, workflow change, or a dashboard.",
        "Every stage should produce evidence: assumptions, risks, owners, metrics, and review decisions.",
    ],
    "00-orientation/02-running-case-study.qmd": [
        "The running case study is a secure enterprise document Q&A assistant.",
        "Core components are ingestion, parsing, chunking, embeddings, vector search, reranking, generation, citations, authentication, access control, logs, evaluation, and rollout.",
        "The system must refuse or qualify answers when retrieved evidence is missing, stale, inaccessible, or contradictory.",
    ],
    "00-orientation/03-how-to-use-this-book.qmd": [
        "Readers building production skill should read foundations before backend and projects.",
        "AI leads can start with LLM applications, security, agents, and delivery lifecycle chapters.",
        "Interview preparation should emphasise explaining trade-offs, not memorising tool names.",
    ],
    "01-ml-foundations/01-what-ml-is-doing.qmd": [
        "Machine learning estimates a function from examples; it does not discover truth outside the data-generating process.",
        "Supervised learning maps features to labels, unsupervised learning finds structure, and reinforcement learning optimises action policies from feedback.",
        "In industry, the key question is whether the learned pattern will remain valid when data, users, incentives, or operations change.",
    ],
    "01-ml-foundations/02-linear-regression.qmd": [
        "Linear regression fits a weighted sum of input features to a numeric target.",
        "Ordinary least squares minimises squared residuals; large outliers can dominate the solution.",
        "Production use requires feature stability, residual checks, error slices, and monitoring for drift.",
    ],
    "01-ml-foundations/03-logistic-regression-classification.qmd": [
        "Logistic regression models log-odds as a linear function of features and maps logits to probabilities with a sigmoid.",
        "The default 0.5 threshold is rarely a business decision; choose thresholds from cost, capacity, and risk.",
        "Classification reports should include confusion matrix, precision, recall, calibration, and segment-level error analysis.",
    ],
    "01-ml-foundations/04-trees-forests-boosting-xgboost.qmd": [
        "Decision trees split feature space into regions; they are interpretable but high variance.",
        "Random forests reduce variance through bagging and feature subsampling.",
        "Gradient boosting and XGBoost build additive trees that correct prior errors, often strong on tabular data but sensitive to leakage and validation design.",
    ],
    "01-ml-foundations/05-model-evaluation-experiment-design.qmd": [
        "Use train/validation/test splits for independent data and time-based splits for temporal prediction.",
        "Use baselines, golden datasets, threshold analysis, calibration, and business KPI translation.",
        "Evaluation is incomplete until major error clusters are inspected and explained to stakeholders.",
    ],
    "01-ml-foundations/06-leakage-baselines-error-analysis.qmd": [
        "Target leakage, temporal leakage, group leakage, and preprocessing leakage can all create fake performance.",
        "Baselines should include naive, business-rule, and previous-production approaches where available.",
        "Error analysis should produce a ranked improvement plan, not just a list of examples.",
    ],
    "01-ml-foundations/07-feature-engineering-production.qmd": [
        "Feature engineering must define calculation time, data freshness, null handling, and ownership.",
        "Training-serving skew happens when training features are computed differently from online inference features.",
        "Feature pipelines need tests for schema, ranges, missingness, cardinality, and leakage.",
    ],
    "01-ml-foundations/08-data-contracts-quality.qmd": [
        "A data contract specifies schema, meaning, freshness, quality thresholds, ownership, and change process.",
        "Quality checks should include completeness, uniqueness, validity, consistency, and distribution drift.",
        "Enterprise teams need escalation paths when upstream data changes break model assumptions.",
    ],
    "02-deep-learning/09-neural-networks-foundations.qmd": [
        "A neural network composes linear transformations with nonlinear activations.",
        "Depth lets networks learn hierarchical representations, but optimisation and generalisation become harder.",
        "A feed-forward network is appropriate for fixed-size inputs; use specialised architectures when data structure matters.",
    ],
    "02-deep-learning/10-pytorch-training.qmd": [
        "PyTorch training should separate dataset, model, loss, optimizer, training loop, validation loop, checkpointing, and inference.",
        "Use `model.train()` during training and `model.eval()` plus `torch.no_grad()` during validation/inference.",
        "Save model `state_dict` with versioned preprocessing metadata so inference can reproduce training assumptions.",
    ],
    "02-deep-learning/11-debugging-training.qmd": [
        "First overfit a tiny batch; failure usually indicates code, label, shape, or loss mismatch.",
        "Exploding gradients, vanishing gradients, and learning-rate issues show up in loss curves and gradient norms.",
        "Reproducibility requires seeds, data versioning, deterministic configuration where practical, and exact environment capture.",
    ],
    "02-deep-learning/12-cnns.qmd": [
        "Convolutional Neural Networks (CNNs) use local receptive fields and weight sharing to exploit spatial structure.",
        "Pooling and strides reduce resolution while increasing receptive field.",
        "Production image models need data consent, augmentation policy, calibration, slice evaluation, and monitoring for camera or input changes.",
    ],
    "02-deep-learning/13-sequence-models-forecasting.qmd": [
        "Sequence models use temporal order; random splits are usually wrong for forecasting.",
        "Naive and seasonal naive baselines are mandatory before complex models.",
        "Forecasting should report horizon-specific metrics and monitor drift, missing data, holidays, and regime changes.",
    ],
    "02-deep-learning/14-transformers-attention.qmd": [
        "Self-attention mixes token representations based on query-key similarity and value aggregation.",
        "Decoder-only transformers use causal masks for next-token prediction.",
        "The Key-Value (KV) cache improves generation efficiency but increases memory use with context length and concurrency.",
    ],
    "02-deep-learning/15-embeddings-representation-learning.qmd": [
        "Embeddings place semantically or behaviourally similar items near each other in vector space.",
        "Embedding quality depends on training objective, domain match, chunking, normalisation, and evaluation task.",
        "In production, embeddings need versioning because changing the embedding model invalidates stored vector indexes.",
    ],
    "03-llm-applications/16-llm-vs-traditional-ml.qmd": [
        "Traditional ML usually predicts a narrow target; LLM systems often generate, retrieve, reason, transform, or call tools.",
        "Prompting changes instructions; retrieval changes context; fine-tuning changes weights; workflows change orchestration.",
        "LLM applications are probabilistic systems that require regression tests, safety checks, cost controls, and fallbacks.",
    ],
    "03-llm-applications/17-production-prompting.qmd": [
        "Production prompts should separate system, developer, user, examples, retrieved context, and output schema.",
        "Prompt versions should be tracked like code because small wording changes can alter behaviour.",
        "Prompt regression tests should include injection attempts, refusal conditions, long-context cases, and format checks.",
    ],
    "03-llm-applications/18-structured-outputs-tool-calling.qmd": [
        "Structured outputs make model responses machine-checkable and easier to test.",
        "Tool schemas should constrain argument types, allowed values, lengths, and permissions.",
        "Never treat tool calls as automatically authorised; policy code must validate both caller and arguments.",
    ],
    "03-llm-applications/19-rag.qmd": [
        "RAG quality depends as much on document processing and retrieval as on the generator model.",
        "Hybrid search combines lexical and vector retrieval; reranking can improve top-k precision.",
        "Citations should point to the exact retrieved evidence and answer generation should refuse unsupported claims.",
    ],
    "03-llm-applications/20-llm-evaluation.qmd": [
        "Golden question sets need expected answer criteria, required citations, allowed uncertainty, and failure labels.",
        "Retrieval metrics and answer metrics should be tracked separately.",
        "LLM-as-judge is useful for scale but should be calibrated against human review and never treated as objective truth.",
    ],
    "03-llm-applications/21-fine-tuning.qmd": [
        "Fine-tuning is best for behaviour, style, and task format; RAG is better for fresh or access-controlled knowledge.",
        "Low-Rank Adaptation (LoRA) and Quantized LoRA (QLoRA) reduce adaptation cost but still require evaluation and deployment discipline.",
        "Fine-tuned models can regress safety, calibration, and general behaviour; release gates must compare against the base model.",
    ],
    "03-llm-applications/22-alignment-methods.qmd": [
        "Supervised Fine-Tuning (SFT) uses demonstrations; preference methods use desirable/undesirable or preferred/rejected outputs.",
        "Direct Preference Optimization (DPO), Odds Ratio Preference Optimization (ORPO), Kahneman-Tversky Optimization (KTO), and Group Relative Policy Optimization (GRPO) differ mainly in data requirements and objective design.",
        "Most enterprise teams should use alignment methods only after simpler prompting, retrieval, evaluation, and workflow controls are exhausted.",
    ],
    "03-llm-applications/23-cost-latency-model-selection.qmd": [
        "Total cost includes input tokens, output tokens, embeddings, vector storage, reranking, retries, evaluation, and human review.",
        "Latency budgets should distinguish first-token latency, total generation time, retrieval time, and background processing.",
        "Model routing can use cheaper models for easy tasks and stronger models for high-risk or ambiguous tasks.",
    ],
    "04-backend-engineering/24-backend-basics.qmd": [
        "A notebook is an exploration environment; a product needs an API, schema, tests, observability, deployment, and support.",
        "The backend owns validation, authentication, authorisation, rate limits, logging, and model-version selection.",
        "A production model should be reachable through a stable interface, not a manually run notebook cell.",
    ],
    "04-backend-engineering/25-http-apis-fastapi.qmd": [
        "HTTP methods, status codes, headers, request bodies, and JSON schemas form the external contract.",
        "FastAPI uses type hints and Pydantic models to validate requests and document OpenAPI schemas.",
        "Production endpoints need explicit errors, request IDs, authentication dependencies, and tests.",
    ],
    "04-backend-engineering/26-model-inference-api.qmd": [
        "An inference API loads a versioned model and preprocessing logic, validates input, predicts, and returns a typed response.",
        "Failures should return controlled errors rather than stack traces.",
        "Tests should cover valid requests, invalid schemas, boundary values, and model-version metadata.",
    ],
    "04-backend-engineering/27-background-jobs-async.qmd": [
        "FastAPI background tasks are suitable for short best-effort work, not durable ingestion pipelines.",
        "Queue-based workers support retries, idempotency keys, dead-letter queues, and job status endpoints.",
        "Use background jobs for ingestion, embeddings, exports, retraining, and long-running evaluation.",
    ],
    "04-backend-engineering/28-concurrency-isolation-scale.qmd": [
        "Concurrency is about many in-flight tasks; parallelism is about simultaneous execution on multiple cores or machines.",
        "Per-request identity must be derived from the request, not global mutable state.",
        "Scale plans should identify bottlenecks such as model latency, database connections, vector search, token limits, and provider rate limits.",
    ],
    "04-backend-engineering/29-docker-deployment.qmd": [
        "Docker images should pin dependencies, avoid secrets, run as non-root where practical, and expose clear health checks.",
        "Deployments need environment-specific configuration, secrets management, rollback, and smoke tests.",
        "The model artifact and application code should be versioned together or referenced through a model registry.",
    ],
    "04-backend-engineering/30-observability.qmd": [
        "Observability includes structured logs, metrics, traces, audit logs, and quality signals.",
        "For AI APIs, log model version, prompt version, retrieval settings, token usage, latency, cost, and safety outcomes.",
        "Dashboards should show service health and model/application quality, not just CPU and memory.",
    ],
    "05-security-governance/31-enterprise-identity.qmd": [
        "Enterprise identity connects users, groups, tenants, devices, service accounts, and policies.",
        "Single Sign-On (SSO) reduces password sprawl but does not by itself solve authorisation.",
        "Applications must translate identity claims into local permissions and audit decisions.",
    ],
    "05-security-governance/32-oauth-oidc-pkce-jwt-sso.qmd": [
        "OAuth2 authorises access; OpenID Connect (OIDC) authenticates users and carries identity claims.",
        "Proof Key for Code Exchange (PKCE) protects public clients from authorization-code interception.",
        "JSON Web Token (JWT) validation must check signature, issuer, audience, expiry, key ID, and claim semantics.",
    ],
    "05-security-governance/33-fastapi-oidc.qmd": [
        "A FastAPI OIDC dependency should validate the token, extract claims, map groups/roles, and enforce route policy.",
        "Local development should use signed test tokens or a dev identity provider, not disabled authentication in production code.",
        "Common mistakes include trusting unsigned tokens, skipping audience checks, and using ID tokens where access tokens are expected.",
    ],
    "05-security-governance/34-end-user-vs-workload-identity.qmd": [
        "End-user identity answers who initiated the action; workload identity answers which service executed it.",
        "Delegated access should preserve user accountability while using service identities for infrastructure access.",
        "Workload identity federation avoids long-lived static secrets and improves auditability.",
    ],
    "05-security-governance/35-multi-tenant-data-access.qmd": [
        "Tenant isolation must apply to databases, vector stores, caches, logs, exports, and background jobs.",
        "Document-level Access Control Lists (ACLs) and vector metadata filters are mandatory for enterprise RAG.",
        "Negative tests should prove that tenant A cannot retrieve tenant B content through any path.",
    ],
    "05-security-governance/36-llm-security-threat-modelling.qmd": [
        "Threats include prompt injection, indirect prompt injection, insecure output handling, sensitive data disclosure, excessive agency, insecure tool use, poisoning, denial of service, supply chain risk, overreliance, and model theft.",
        "Controls include scoped tools, content boundaries, retrieval permissions, output validation, human approval, red teaming, rate limits, and monitoring.",
        "Use OWASP LLM guidance as a starting taxonomy, then tailor to the actual architecture.",
    ],
    "05-security-governance/37-ai-risk-management-governance.qmd": [
        "Governance artifacts include model cards, data cards, risk registers, approval records, evaluation reports, incident playbooks, and change logs.",
        "Human-in-the-loop controls should be attached to specific risks, not added as vague reassurance.",
        "NIST AI RMF helps structure governance around govern, map, measure, and manage activities.",
    ],
    "05-security-governance/38-github-governance-secure-development.qmd": [
        "Secure development requires branch protection, code owners, required reviews, secret scanning, dependency review, and CI enforcement.",
        "AI projects should version prompts, evaluation data, model configs, and infrastructure code.",
        "Release evidence should include tests, security review, evaluation report, deployment plan, and rollback plan.",
    ],
    "06-agentic-systems/39-agents.qmd": [
        "A workflow follows predefined steps; an agent uses a model-driven loop to choose actions within constraints.",
        "Agents may use planning, memory, tools, state, and reflection, but more autonomy increases failure modes.",
        "Do not use agents when deterministic orchestration is clearer, cheaper, safer, and testable.",
    ],
    "06-agentic-systems/40-tool-calling-tool-safety.qmd": [
        "Tools should have narrow schemas, input validation, permission checks, and explicit side-effect categories.",
        "Dangerous or irreversible tools need human approval and audit logs.",
        "Tool results are untrusted input and must be validated before influencing later actions.",
    ],
    "06-agentic-systems/41-mcp-fundamentals.qmd": [
        "MCP includes hosts, clients, servers, tools, resources, prompts, transports, and capability negotiation.",
        "Sampling and elicitation are protocol features that may be available depending on client/server support and specification version.",
        "MCP defines integration shape; authentication, authorisation, and data policy remain system responsibilities.",
    ],
    "06-agentic-systems/42-mcp-enterprise.qmd": [
        "Enterprise MCP servers should expose least-privilege tools with clear ownership, scopes, logging, and rate limits.",
        "Remote MCP needs transport security, authentication, token validation, and tenant-aware authorisation.",
        "Treat each MCP server like a production API with schema contracts and operational runbooks.",
    ],
    "06-agentic-systems/43-agent-to-agent-protocols.qmd": [
        "Agent-to-Agent (A2A) coordination is about agents exchanging tasks, status, messages, and results.",
        "A2A is different from MCP: MCP connects agents to tools and context; A2A coordinates agents with each other.",
        "Production A2A systems need identity, task ownership, timeout behaviour, audit logs, and escalation rules.",
    ],
    "06-agentic-systems/44-frameworks-langchain-langgraph-flowise.qmd": [
        "LangChain provides integration abstractions; LangGraph adds explicit stateful graph orchestration; Flowise provides visual composition.",
        "Frameworks help with speed and ecosystem access but can hide control flow, testing boundaries, and deployment complexity.",
        "Use direct SDKs for simple systems and frameworks when orchestration complexity justifies the abstraction.",
    ],
    "06-agentic-systems/45-agent-evaluation-observability.qmd": [
        "Agent evaluation should test task success, tool correctness, policy compliance, latency, cost, and recovery from bad tool outputs.",
        "Traces should include model decisions, tool calls, arguments, results, approvals, and final outputs.",
        "Regression suites need adversarial cases because agent failures often emerge from multi-step interactions.",
    ],
    "07-enterprise-delivery/46-business-pain-to-ai-opportunity.qmd": [
        "Start with pain, users, workflow, current cost, decision points, and measurable success.",
        "Compare AI against rules, automation, process change, search, dashboarding, and human workflow redesign.",
        "Proceed only when value, data access, risk, ownership, and evaluation path are credible.",
    ],
    "07-enterprise-delivery/47-ai-intake-package.qmd": [
        "A good intake records sponsor, users, workflow, data sources, access needs, compliance constraints, success metrics, timeline, owners, reviewers, and support model.",
        "The intake should expose unknowns early rather than selling a predetermined solution.",
        "Missing data owner, unclear success metric, or no support owner are delivery risks.",
    ],
    "07-enterprise-delivery/48-ai-lead-response-document.qmd": [
        "The AI lead response should state recommended approach, assumptions, risks, architecture summary, data requirements, evaluation plan, delivery phases, effort, open questions, and required decisions.",
        "It should separate what is known, what is assumed, and what needs executive or architecture review.",
        "The document should be short enough for sponsors and precise enough for engineering planning.",
    ],
    "07-enterprise-delivery/49-kickoff-meeting.qmd": [
        "A kickoff aligns sponsor, users, data owners, security, architecture, delivery team, and support.",
        "The meeting should produce decisions, action owners, decision log, RACI, and follow-up summary.",
        "Avoid turning kickoff into solution theatre before access, evaluation, and risk assumptions are known.",
    ],
    "07-enterprise-delivery/50-first-seven-days.qmd": [
        "The first week should reduce uncertainty around problem, data, architecture, evaluation, risk, prototype, delivery plan, and sign-off.",
        "Daily outputs should be concrete artifacts, not generic status updates.",
        "A good first week prevents weeks of building against unclear success criteria.",
    ],
    "07-enterprise-delivery/51-architecture-reference-design.qmd": [
        "A reference design should include data flow, identity flow, sequence diagrams, threat model, deployment view, observability, and operational ownership.",
        "For document Q&A, show ingestion path and query-time path separately.",
        "Architecture should document alternatives and rejected options through Architecture Decision Records (ADRs).",
    ],
    "07-enterprise-delivery/52-hld-service-selection.qmd": [
        "High-Level Design (HLD) service selection should compare managed services, self-hosted services, cost, latency, data residency, security, and team skills.",
        "Do not choose a vector database, model provider, or orchestration framework without evaluation criteria.",
        "Record service dependencies, quotas, failure modes, and procurement/security approval needs.",
    ],
    "07-enterprise-delivery/53-hld-to-lld-sprint-plan.qmd": [
        "Low-Level Design (LLD) converts architecture into interfaces, schemas, tasks, tests, and deployment steps.",
        "Sprint planning should separate discovery, integration, evaluation, security, and hardening work.",
        "Definition of done should include tests, documentation, observability, and review evidence.",
    ],
    "07-enterprise-delivery/54-architecture-review.qmd": [
        "Architecture review should test assumptions, not just approve diagrams.",
        "Bring decision records, data flow, identity flow, threat model, evaluation plan, rollout plan, and open risks.",
        "Capture approval conditions and owners immediately after the review.",
    ],
    "07-enterprise-delivery/55-provisioning-scaling-rollout-support.qmd": [
        "Rollout requires environments, CI/CD, service accounts, secrets, monitoring, pilot users, rollback, support, incident response, and post-launch review.",
        "Scaling plans should include provider quotas, vector search latency, model latency, queue depth, and cost ceilings.",
        "Support ownership must be explicit before pilot expansion.",
    ],
    "08-projects/56-churn-prediction-api.qmd": [
        "The project should include synthetic data, baseline, evaluation, threshold tuning, FastAPI serving, tests, Dockerfile, and monitoring notes.",
        "Use business-cost thresholding instead of default 0.5 classification.",
        "Production hardening includes model registry, drift monitoring, authentication, and retraining process.",
    ],
    "08-projects/57-enterprise-document-qa.qmd": [
        "The project should implement ingestion, chunking, embeddings, retrieval, citations, ACL filtering, evaluation set, and rollout plan.",
        "Mock or local modes should avoid paid API dependency in tests.",
        "The main safety property is that inaccessible document text never reaches the model prompt.",
    ],
    "08-projects/58-agentic-support-ticket-triage.qmd": [
        "The project should classify tickets, retrieve policy, draft a response, decide escalation, require human approval, and log tool use.",
        "Sending or closing tickets should be a gated side effect.",
        "Evaluation should test category accuracy, escalation recall, policy grounding, and unsafe automation prevention.",
    ],
    "08-projects/59-forecasting-service-monitoring.qmd": [
        "The project should use time-series splits, naive baseline, horizon-specific evaluation, forecast API or batch job, drift monitoring, and retraining trigger.",
        "Do not random-split temporal data for final evaluation.",
        "Production monitoring should track forecast error by horizon and segment.",
    ],
}


def insert_coverage(path: Path, bullets: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    if "## Chapter-specific coverage" in text:
        return
    section = "\n## Chapter-specific coverage\n\n" + "\n".join(f"- {bullet}" for bullet in bullets) + "\n"
    marker = "\n## Further reading"
    if marker in text:
        text = text.replace(marker, section + marker, 1)
    else:
        text = text.rstrip() + "\n" + section
    path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    for rel, bullets in COVERAGE.items():
        insert_coverage(ROOT / "book" / rel, bullets)
    print(f"Inserted chapter-specific coverage into {len(COVERAGE)} chapters")
