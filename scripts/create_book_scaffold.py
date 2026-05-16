#!/usr/bin/env python3
"""Create the Quarto book scaffold and meaningful starter chapters."""

from __future__ import annotations

from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]
BOOK = ROOT / "book"


PARTS = [
    (
        "00-orientation",
        "Orientation: From Notebook to Enterprise AI System",
        [
            ("00-who-this-book-is-for.qmd", "Who This Book Is For", "orientation"),
            ("01-industry-ai-delivery-map.qmd", "The Industry AI Delivery Map", "delivery-map"),
            ("02-running-case-study.qmd", "The Running Case Study: Enterprise Document Q&A Assistant", "case-study"),
            ("03-how-to-use-this-book.qmd", "How to Use This Book", "how-to-use"),
        ],
    ),
    (
        "01-ml-foundations",
        "ML Foundations for Industry Data Scientists",
        [
            ("01-what-ml-is-doing.qmd", "What Machine Learning Is Really Doing", "ml"),
            ("02-linear-regression.qmd", "Linear Regression: The First Useful Model", "linear-regression"),
            ("03-logistic-regression-classification.qmd", "Logistic Regression and Classification", "classification"),
            ("04-trees-forests-boosting-xgboost.qmd", "Trees, Random Forests, Bagging, Boosting, and XGBoost", "trees"),
            ("05-model-evaluation-experiment-design.qmd", "Model Evaluation and Experiment Design", "model-evaluation"),
            ("06-leakage-baselines-error-analysis.qmd", "Data Leakage, Baselines, and Error Analysis", "leakage"),
            ("07-feature-engineering-production.qmd", "Feature Engineering in Production", "features"),
            ("08-data-contracts-quality.qmd", "Data Contracts and Data Quality", "data-contracts"),
        ],
    ),
    (
        "02-deep-learning",
        "Deep Learning Foundations",
        [
            ("09-neural-networks-foundations.qmd", "From Logistic Regression to Neural Networks", "nn"),
            ("10-pytorch-training.qmd", "Training Neural Networks in PyTorch", "pytorch"),
            ("11-debugging-training.qmd", "Debugging Neural Network Training", "debug-training"),
            ("12-cnns.qmd", "CNNs for Image and Spatial Data", "cnn"),
            ("13-sequence-models-forecasting.qmd", "Sequence Models and Forecasting", "sequence"),
            ("14-transformers-attention.qmd", "Transformers and Attention", "transformers"),
            ("15-embeddings-representation-learning.qmd", "Embeddings and Representation Learning", "embeddings"),
        ],
    ),
    (
        "03-llm-applications",
        "Modern LLM Application Development",
        [
            ("16-llm-vs-traditional-ml.qmd", "How LLM Applications Differ from Traditional ML", "llm-vs-ml"),
            ("17-production-prompting.qmd", "Prompting for Production Systems", "prompting"),
            ("18-structured-outputs-tool-calling.qmd", "Structured Outputs and Tool Calling", "tool-calling"),
            ("19-rag.qmd", "Retrieval-Augmented Generation", "rag"),
            ("20-llm-evaluation.qmd", "LLM Evaluation", "llm-eval"),
            ("21-fine-tuning.qmd", "Fine-Tuning LLMs", "fine-tuning"),
            ("22-alignment-methods.qmd", "Alignment Methods: SFT, DPO, ORPO, KTO, GRPO, and RLAIF", "alignment"),
            ("23-cost-latency-model-selection.qmd", "Cost, Latency, and Model Selection", "cost"),
        ],
    ),
    (
        "04-backend-engineering",
        "Backend Engineering for Data Scientists",
        [
            ("24-backend-basics.qmd", "Why Data Scientists Need Backend Basics", "backend"),
            ("25-http-apis-fastapi.qmd", "HTTP, APIs, and FastAPI", "fastapi"),
            ("26-model-inference-api.qmd", "Building a Model Inference API", "inference-api"),
            ("27-background-jobs-async.qmd", "Background Jobs and Async Workflows", "jobs"),
            ("28-concurrency-isolation-scale.qmd", "Concurrency, Isolation, and Scale", "scale"),
            ("29-docker-deployment.qmd", "Docker and Deployment Basics", "docker"),
            ("30-observability.qmd", "Observability for ML and AI APIs", "observability"),
        ],
    ),
    (
        "05-security-governance",
        "Security, Identity, and Governance",
        [
            ("31-enterprise-identity.qmd", "Enterprise Identity Basics", "identity"),
            ("32-oauth-oidc-pkce-jwt-sso.qmd", "OAuth2, OIDC, PKCE, JWTs, and SSO", "oauth"),
            ("33-fastapi-oidc.qmd", "Securing a FastAPI App with OIDC", "fastapi-oidc"),
            ("34-end-user-vs-workload-identity.qmd", "End-User Identity vs Workload Identity", "workload-identity"),
            ("35-multi-tenant-data-access.qmd", "Multi-Tenant Data Access", "multi-tenant"),
            ("36-llm-security-threat-modelling.qmd", "LLM Security and Threat Modelling", "llm-security"),
            ("37-ai-risk-management-governance.qmd", "AI Risk Management and Governance", "governance"),
            ("38-github-governance-secure-development.qmd", "GitHub Governance and Secure Development", "github"),
        ],
    ),
    (
        "06-agentic-systems",
        "Agentic Systems and Protocols",
        [
            ("39-agents.qmd", "What Agents Are and Are Not", "agents"),
            ("40-tool-calling-tool-safety.qmd", "Tool Calling and Tool Safety", "tool-safety"),
            ("41-mcp-fundamentals.qmd", "MCP Fundamentals", "mcp"),
            ("42-mcp-enterprise.qmd", "MCP in the Enterprise", "mcp-enterprise"),
            ("43-agent-to-agent-protocols.qmd", "Agent-to-Agent Protocols", "a2a"),
            ("44-frameworks-langchain-langgraph-flowise.qmd", "LangChain, LangGraph, Flowise, and When to Avoid Frameworks", "frameworks"),
            ("45-agent-evaluation-observability.qmd", "Agent Evaluation and Observability", "agent-eval"),
        ],
    ),
    (
        "07-enterprise-delivery",
        "Enterprise AI Delivery Lifecycle",
        [
            ("46-business-pain-to-ai-opportunity.qmd", "From Business Pain to AI Opportunity", "business-pain"),
            ("47-ai-intake-package.qmd", "AI Intake Package", "intake"),
            ("48-ai-lead-response-document.qmd", "AI Lead Response Document", "lead-response"),
            ("49-kickoff-meeting.qmd", "Kickoff Meeting", "kickoff"),
            ("50-first-seven-days.qmd", "The First Seven Days After Kickoff", "seven-days"),
            ("51-architecture-reference-design.qmd", "Architecture Reference Design", "architecture"),
            ("52-hld-service-selection.qmd", "HLD Service Selection", "hld"),
            ("53-hld-to-lld-sprint-plan.qmd", "HLD to LLD and Sprint Plan", "lld"),
            ("54-architecture-review.qmd", "Architecture Review", "architecture-review"),
            ("55-provisioning-scaling-rollout-support.qmd", "Provisioning, Scaling, Rollout, and Support", "rollout"),
        ],
    ),
    (
        "08-projects",
        "End-to-End Projects",
        [
            ("56-churn-prediction-api.qmd", "Project 1: Churn Prediction API", "project-churn"),
            ("57-enterprise-document-qa.qmd", "Project 2: Enterprise Document Q&A Assistant", "project-rag"),
            ("58-agentic-support-ticket-triage.qmd", "Project 3: Agentic Support Ticket Triage", "project-agent"),
            ("59-forecasting-service-monitoring.qmd", "Project 4: Forecasting Service with Monitoring", "project-forecast"),
        ],
    ),
]

APPENDICES = [
    ("glossary.qmd", "Glossary"),
    ("acronyms.qmd", "Acronyms"),
    ("adr-template.qmd", "Architecture Decision Record Template"),
    ("ai-intake-template.qmd", "AI Intake Template"),
    ("ai-lead-response-template.qmd", "AI Lead Response Template"),
    ("hld-template.qmd", "HLD Template"),
    ("lld-template.qmd", "LLD Template"),
    ("sprint-planning-template.qmd", "Sprint Planning Template"),
    ("security-review-checklist.qmd", "Security Review Checklist"),
    ("model-evaluation-checklist.qmd", "Model Evaluation Checklist"),
    ("rag-evaluation-checklist.qmd", "RAG Evaluation Checklist"),
    ("launch-checklist.qmd", "LLM Application Launch Checklist"),
    ("data-contract-template.qmd", "Data Contract Template"),
    ("risk-register-template.qmd", "Risk Register Template"),
    ("post-launch-review-template.qmd", "Post-Launch Review Template"),
    ("interview-prep.qmd", "Interview Preparation Notes"),
    ("further-reading.qmd", "Further Reading"),
    ("changelog.qmd", "Change Log"),
]


SPECIFIC = {
    "model-evaluation": {
        "concepts": [
            "Separate train, validation, and test data before tuning.",
            "Use cross-validation for small independent datasets and time-based splits for forecasting or event streams.",
            "Report confusion matrix, precision, recall, F1, ROC-AUC, PR-AUC, calibration, and threshold trade-offs when they matter.",
            "Tie machine learning metrics to a business key performance indicator (KPI), such as retained revenue or analyst review hours saved.",
            "Maintain golden datasets and error analysis notes so future releases can be compared honestly.",
        ],
        "visual": "../../assets/generated/ml/confusion-matrix-example.svg",
        "alt": "Confusion matrix explaining true positives, false positives, true negatives, and false negatives for a churn model.",
        "example": """```python
from dataclasses import dataclass

@dataclass
class Costs:
    false_positive: float = 5.0
    false_negative: float = 80.0

def expected_cost(y_true: list[int], scores: list[float], threshold: float, costs: Costs) -> float:
    predictions = [int(score >= threshold) for score in scores]
    fp = sum(pred == 1 and actual == 0 for pred, actual in zip(predictions, y_true))
    fn = sum(pred == 0 and actual == 1 for pred, actual in zip(predictions, y_true))
    return fp * costs.false_positive + fn * costs.false_negative

y = [0, 0, 1, 1, 1]
scores = [0.10, 0.55, 0.40, 0.70, 0.90]
for threshold in [0.3, 0.5, 0.7]:
    print(threshold, expected_cost(y, scores, threshold, Costs()))
```""",
    },
    "rag": {
        "concepts": [
            "RAG connects a language model to external knowledge at answer time instead of trying to store all knowledge in model weights.",
            "The production pipeline includes parsing, chunking, metadata, embeddings, vector or hybrid search, reranking, answer generation, citations, and evaluation.",
            "Document-level permissions must be applied before text reaches the prompt.",
            "Stale documents, duplicate chunks, weak metadata, and poor citation rules are common failure modes.",
            "RAG should be evaluated at retrieval level and answer level, not only with user satisfaction.",
        ],
        "visual": "../../assets/generated/llm/rag-pipeline.svg",
        "alt": "RAG pipeline showing ingest, chunk, embed, retrieve, and answer with citations.",
    },
    "llm-security": {
        "concepts": [
            "Prompt injection is user or document text that tries to override system intent.",
            "Indirect prompt injection can enter through retrieved documents, tickets, webpages, or emails.",
            "Insecure output handling happens when model text is trusted as code, SQL, HTML, or policy.",
            "Excessive agency and insecure tool use turn model mistakes into real-world side effects.",
            "Red teaming, scoped tools, approval gates, audit logs, and monitoring are production controls.",
        ],
        "visual": "../../assets/generated/security/llm-threat-model.svg",
        "alt": "Threat model for LLM applications showing user input, retrieved documents, tools, and logs.",
    },
    "mcp": {
        "version_note": "This chapter describes Model Context Protocol (MCP) concepts using the public specification pages referenced in Further Reading. MCP changes quickly; check the official specification before implementing production systems.",
        "concepts": [
            "MCP standardizes how an LLM host connects to external tools, resources, and prompts through MCP clients and servers.",
            "Servers expose tools for actions, resources for context, prompts for reusable templates, and protocol metadata for capability negotiation.",
            "Sampling allows servers to request model completions through the client in supported implementations.",
            "Elicitation can let a server request missing information from a user through the client when supported by the specification version in use.",
            "MCP is not an authorization model by itself; production servers still need authentication, scopes, input validation, and audit logs.",
        ],
        "visual": "../../assets/generated/agents/mcp-client-server-flow.svg",
        "alt": "MCP flow showing host, client, server, external system, and audit logs.",
    },
    "oauth": {
        "version_note": "OAuth and OpenID Connect implementation details change across identity providers. Use official provider documentation and validate issuer, audience, expiry, and key rotation behaviour.",
        "concepts": [
            "OAuth2 is an authorization framework; OpenID Connect (OIDC) adds authentication and identity claims.",
            "Proof Key for Code Exchange (PKCE) protects public clients during authorization-code exchange.",
            "JSON Web Tokens (JWTs) must be validated for signature, issuer, audience, expiry, and relevant claims.",
            "Access tokens authorize API calls; ID tokens identify the authenticated user; refresh tokens renew sessions under provider policy.",
            "Groups, scopes, tenants, and claims become authorization inputs inside enterprise APIs.",
        ],
        "visual": "../../assets/generated/security/oidc-pkce-flow.svg",
        "alt": "OIDC Authorization Code with PKCE flow from browser to identity provider to protected API.",
    },
    "project-churn": {
        "visual": "../../assets/generated/backend/inference-api-architecture.svg",
        "alt": "Churn prediction API architecture showing client, FastAPI, model, response, and logs.",
    },
}


def list_md(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def chapter_text(title: str, key: str) -> str:
    data = SPECIFIC.get(key, {})
    objectives = data.get(
        "objectives",
        [
            f"explain the role of {title.lower()} in production AI delivery",
            "connect the concept to enterprise constraints",
            "identify the main implementation and governance risks",
        ],
    )
    concepts = data.get(
        "concepts",
        [
            "Start with the business decision the system needs to support.",
            "Separate notebook exploration from repeatable production behaviour.",
            "Define inputs, outputs, owners, tests, and operational failure modes.",
            "Make security, monitoring, and maintainability explicit design concerns.",
        ],
    )
    visual = data.get("visual", "../../assets/generated/enterprise/document-qa-architecture.svg")
    alt = data.get("alt", "Enterprise document Q&A assistant architecture showing documents, ingestion, retrieval, LLM answer generation, and audit logging.")
    version = ""
    if "version_note" in data:
        version = f"""
::: {{.callout-note}}
Version note

{data["version_note"]}
:::
"""
    example = data.get(
        "example",
        """```python
def production_question(notebook_step: str) -> str:
    return f"What has to be repeatable, observable, and secure when {notebook_step} moves to production?"

print(production_question("a model prediction"))
```""",
    )
    return dedent(
        f"""\
        # {title}

        {version}
        ## What you will learn

        By the end of this chapter, you will be able to:

        {list_md(objectives)}

        ## Why this matters in industry

        In a notebook, you can focus on whether an idea works. In production, you also need stable inputs, reliable outputs, monitoring, rollback, ownership, and tests. In an enterprise, you must additionally consider identity, access control, audit evidence, change control, procurement, and support.

        This chapter explains how {title.lower()} fits into that wider delivery system.

        ## Mental model

        Treat every AI capability as a service with a contract. The model is only one component. The surrounding system decides who can use it, what data it can see, how failures are handled, and how the organisation knows whether it is still working.

        ## Core concepts

        {list_md(concepts)}

        ## Running example: Enterprise Document Q&A Assistant

        In the document Q&A assistant, employees ask questions about internal policies, project notes, architecture decisions, and operating procedures. The assistant must answer from approved documents, cite sources, respect document-level access control, and leave enough evidence for audit and improvement.

        For this chapter, ask: what would break if this topic were handled only as a notebook experiment?

        ## Practical example

        {example}

        ## Visual explanation

        ![{alt}]({visual})

        ## Common mistakes

        - Optimising a local metric without checking the business workflow.
        - Treating a prototype as production because it worked once.
        - Ignoring identity, data boundaries, and auditability until late delivery.
        - Shipping without a regression set or operational runbook.

        ## Production considerations

        - Scale: estimate request volume, data size, and peak usage.
        - Latency: separate interactive paths from batch or background work.
        - Cost: track compute, storage, tokens, and human review effort.
        - Security: validate inputs, enforce identity, and minimise privileges.
        - Monitoring: log request IDs, model versions, prompt versions, errors, latency, and quality signals.
        - Governance: record decisions, approvals, risks, and release evidence.
        - Maintainability: keep examples small, tested, and documented.

        ## Checklist

        - [ ] The problem is tied to a real workflow and measurable outcome.
        - [ ] Inputs and outputs are defined.
        - [ ] Evaluation covers quality and business risk.
        - [ ] Security and identity assumptions are explicit.
        - [ ] Monitoring and support ownership are defined.
        - [ ] The implementation can be tested without private credentials.

        ## Key takeaways

        - Production AI is a system, not a model file.
        - Enterprise delivery requires identity, controls, observability, and support.
        - Evaluation must include business impact and failure analysis.
        - Reusable contracts and checklists reduce delivery risk.
        - The running document Q&A assistant is the reference case study for the book.

        ## Exercises

        - Beginner exercise: describe how this topic appears in a notebook prototype.
        - Intermediate exercise: list the production controls needed before release.
        - Advanced exercise: write a short review checklist for an architecture review.

        ## Further reading

        - [Quarto books](https://quarto.org/docs/books/)
        - [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
        - [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
        - [Model Context Protocol specification](https://modelcontextprotocol.io/specification/)
        """
    )


def write_quarto_config() -> None:
    chapters: list[str] = ["index.qmd"]
    for part_dir, part_title, files in PARTS:
        chapters.append(f"{part_dir}/index.qmd")
        chapters.extend(f"{part_dir}/{file}" for file, _, _ in files)
    chapters.append("appendices/index.qmd")
    chapters.extend(f"appendices/{file}" for file, _ in APPENDICES)
    chapter_lines = "\n".join(f"      - {chapter}" for chapter in chapters)
    text = f"""project:
  type: book
  output-dir: _book

book:
  title: "From Data Scientist to Production AI Lead"
  subtitle: "Building ML, LLM, and Agentic Systems for Real Enterprise Delivery"
  author: "Dinesh Gamage"
  date: today
  search: true
  page-navigation: true
  chapters:
{chapter_lines}

format:
  html:
    theme: cosmo
    toc: true
    code-copy: true
    number-sections: true
    mermaid:
      theme: default
  pdf:
    documentclass: scrreprt

execute:
  freeze: auto
"""
    (BOOK / "_quarto.yml").write_text(text, encoding="utf-8")


def write_index() -> None:
    text = dedent(
        """\
        # From Data Scientist to Production AI Lead

        This book teaches industry data scientists how to move beyond notebooks and build real AI systems.

        You will learn how to:

        - understand core machine learning and deep learning methods
        - evaluate models properly
        - build APIs around models
        - design Retrieval-Augmented Generation (RAG) and Large Language Model (LLM) applications
        - secure AI systems with enterprise identity
        - understand agents, tools, and Model Context Protocol (MCP)
        - deploy, monitor, and govern AI systems
        - lead an enterprise AI project from business pain to production rollout

        The running example throughout the book is an enterprise document Q&A assistant. Employees waste time searching policies, project documents, architecture notes, meeting summaries, and operating procedures. The organisation wants a secure AI assistant that can answer questions using internal documents while respecting access control.

        ![Enterprise document Q&A assistant architecture showing documents, ingestion, retrieval, LLM answer generation, and audit logging.](../assets/generated/enterprise/document-qa-architecture.svg)

        ## How to read this book

        | Path | Reader | Sequence |
        |---|---|---|
        | Path A | Data scientist becoming production-ready | Part 0 -> Part I -> Part II -> Part III -> Part IV -> Projects |
        | Path B | AI lead / senior data scientist | Part 0 -> Part III -> Part V -> Part VI -> Part VII |
        | Path C | Backend/ML engineer | Part 0 -> Part IV -> Part V -> Part III -> Part VI |
        | Path D | Interview preparation | ML Foundations -> Deep Learning -> LLM Applications -> Backend Basics -> Appendices |

        ## Repository status

        The legacy static HTML tutorial remains in the repository while this Quarto source becomes the maintainable authoring layer.
        """
    )
    (BOOK / "index.qmd").write_text(text, encoding="utf-8")


def part_intro(part_title: str) -> str:
    return dedent(
        f"""\
        # {part_title}

        This part contains the chapters for **{part_title}**.

        Read these chapters with the running enterprise document Q&A assistant in mind: every concept should eventually help you design, build, secure, evaluate, or operate a production AI system.

        ## Part checklist

        - [ ] Understand the core vocabulary.
        - [ ] Connect each concept to a production workflow.
        - [ ] Identify evaluation and security risks.
        - [ ] Capture open questions for the project appendices.
        """
    )


def appendix_text(title: str) -> str:
    if title == "Glossary":
        return glossary()
    if title == "Acronyms":
        return acronyms()
    if "Template" in title or "Checklist" in title:
        return template(title)
    return dedent(
        f"""\
        # {title}

        ## Purpose

        This appendix provides practical reference material for industry AI delivery.

        ## Notes

        - Keep this appendix concise and operational.
        - Prefer stable official references.
        - Update dated material during release reviews.
        """
    )


def glossary() -> str:
    terms = {
        "AI lead": "The person accountable for turning an AI opportunity into a designed, evaluated, governed, and supportable delivery plan.",
        "agent": "A system that uses a model-driven loop to decide actions, often with tools, memory, state, and approval gates.",
        "API": "Application Programming Interface; a contract that lets software systems exchange requests and responses.",
        "audit log": "A tamper-aware record of who did what, when, against which data or system.",
        "baseline": "A simple reference method used to prove that a complex model adds value.",
        "batch inference": "Predictions produced on a schedule or dataset rather than one request at a time.",
        "calibration": "How closely predicted probabilities match observed frequencies.",
        "chunking": "Splitting documents into retrieval-sized passages with metadata.",
        "CI/CD": "Continuous Integration and Continuous Delivery; automated checks and release workflows.",
        "data contract": "A documented agreement about data schema, meaning, quality, ownership, and change rules.",
        "data leakage": "Using information during training or evaluation that would not be available at prediction time.",
        "embedding": "A numeric vector representation of text, images, users, or items.",
        "feature store": "A managed system for sharing, versioning, and serving machine learning features.",
        "fine-tuning": "Updating model weights on task-specific data.",
        "golden dataset": "A trusted evaluation set used for regression testing and release gates.",
        "HLD": "High-Level Design; an architecture-level description of the system and major choices.",
        "LLD": "Low-Level Design; implementation-level design for components, interfaces, and data flows.",
        "inference": "Using a trained model to produce predictions or responses.",
        "JWT": "JSON Web Token; a signed token format commonly used for claims.",
        "LLM": "Large Language Model; a model trained to process and generate language-like token sequences.",
        "MCP": "Model Context Protocol; a protocol for connecting LLM applications to tools, resources, and prompts.",
        "model registry": "A system for storing model versions, metadata, approvals, and deployment status.",
        "OIDC": "OpenID Connect; an identity layer on top of OAuth2.",
        "OAuth2": "An authorization framework for delegated access.",
        "PKCE": "Proof Key for Code Exchange; a protection for authorization-code flows in public clients.",
        "prompt injection": "Input that attempts to override the intended instructions of an LLM application.",
        "RAG": "Retrieval-Augmented Generation; generating answers using retrieved external context.",
        "reranking": "Reordering retrieved candidates using a stronger scoring model or heuristic.",
        "service account": "A non-human identity used by workloads or automation.",
        "SSO": "Single Sign-On; a central identity experience across applications.",
        "tenant isolation": "Controls that prevent one customer, department, or group from accessing another's data.",
        "vector database": "A data store optimized for similarity search over embeddings.",
        "workload identity": "An identity assigned to software workloads rather than end users.",
    }
    rows = "\n".join(f"| {term} | {definition} |" for term, definition in terms.items())
    return f"# Glossary\n\n| Term | Practical definition |\n|---|---|\n{rows}\n"


def acronyms() -> str:
    rows = [
        ("A2A", "Agent-to-Agent"),
        ("ACL", "Access Control List"),
        ("ADR", "Architecture Decision Record"),
        ("API", "Application Programming Interface"),
        ("CI/CD", "Continuous Integration / Continuous Delivery"),
        ("DPO", "Direct Preference Optimization"),
        ("GRPO", "Group Relative Policy Optimization"),
        ("HLD", "High-Level Design"),
        ("JWT", "JSON Web Token"),
        ("KPI", "Key Performance Indicator"),
        ("KTO", "Kahneman-Tversky Optimization"),
        ("LLD", "Low-Level Design"),
        ("LLM", "Large Language Model"),
        ("MCP", "Model Context Protocol"),
        ("OIDC", "OpenID Connect"),
        ("ORPO", "Odds Ratio Preference Optimization"),
        ("PKCE", "Proof Key for Code Exchange"),
        ("RAG", "Retrieval-Augmented Generation"),
        ("RLAIF", "Reinforcement Learning from AI Feedback"),
        ("RLHF", "Reinforcement Learning from Human Feedback"),
        ("SFT", "Supervised Fine-Tuning"),
        ("SSO", "Single Sign-On"),
    ]
    body = "\n".join(f"| {a} | {b} |" for a, b in rows)
    return f"# Acronyms\n\n| Acronym | Meaning |\n|---|---|\n{body}\n"


def template(title: str) -> str:
    return dedent(
        f"""\
        # {title}

        ## Purpose

        Use this template during enterprise AI delivery. Copy the sections into your project workspace and fill them in with project-specific evidence.

        ## Status

        Proposed / In Review / Accepted / Rejected / Superseded

        ## Context

        What problem are we solving? Who is affected? What decision or review does this support?

        ## Owners

        | Role | Name | Responsibility |
        |---|---|---|
        | Sponsor |  | Business ownership |
        | AI lead |  | Technical delivery |
        | Security reviewer |  | Security and identity |
        | Data owner |  | Data access and quality |
        | Support owner |  | Operations |

        ## Requirements

        - Business outcome:
        - Users:
        - Data sources:
        - Access requirements:
        - Compliance constraints:
        - Non-functional requirements:
        - Success metrics:

        ## Options Considered

        | Option | Pros | Cons | Decision |
        |---|---|---|---|
        |  |  |  |  |

        ## Decision or Checklist

        - [ ] Scope is clear.
        - [ ] Risks are documented.
        - [ ] Evaluation evidence is defined.
        - [ ] Security controls are documented.
        - [ ] Support model is defined.
        - [ ] Review date is set.

        ## Consequences

        What becomes easier or harder because of this decision?

        ## Review Date

        When should this be revisited?
        """
    )


def write_book() -> None:
    BOOK.mkdir(exist_ok=True)
    write_quarto_config()
    write_index()
    for part_dir, part_title, files in PARTS:
        folder = BOOK / part_dir
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "index.qmd").write_text(part_intro(part_title), encoding="utf-8")
        for filename, title, key in files:
            (folder / filename).write_text(chapter_text(title, key), encoding="utf-8")
    app_dir = BOOK / "appendices"
    app_dir.mkdir(parents=True, exist_ok=True)
    (app_dir / "index.qmd").write_text(part_intro("Appendices"), encoding="utf-8")
    for filename, title in APPENDICES:
        (app_dir / filename).write_text(appendix_text(title), encoding="utf-8")


if __name__ == "__main__":
    write_book()
    print(f"Created Quarto book scaffold under {BOOK.relative_to(ROOT)}")
