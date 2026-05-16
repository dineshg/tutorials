#!/usr/bin/env python3
"""Add deeper theory and production notes to high-priority chapters."""

from __future__ import annotations

from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]


ENHANCEMENTS = {
    "book/01-ml-foundations/05-model-evaluation-experiment-design.qmd": """\
        ## Deeper theory: what each metric is really measuring

        Accuracy is the fraction of correct predictions. It is useful only when classes are reasonably balanced and the cost of each error is similar. In fraud detection, churn prediction, defect detection, and safety review, accuracy can be actively misleading because the rare class is usually the class the business cares about.

        Precision answers: when the model predicts positive, how often is it right? Recall answers: of all real positives, how many did the model catch? F1 is the harmonic mean of precision and recall, so it punishes a model that does well on one and poorly on the other.

        Receiver Operating Characteristic Area Under the Curve (ROC-AUC) measures ranking quality across false-positive-rate thresholds. Precision-Recall Area Under the Curve (PR-AUC) is often more informative for imbalanced positive classes because it focuses on positive predictions. Calibration asks whether predicted probabilities mean what they say: among cases scored near 0.8, about 80% should be positive.

        ![Train validation test split showing train, validation, and test sections.](../../assets/generated/ml/train-validation-test-split.svg)

        ![ROC curve example showing threshold trade-offs.](../../assets/generated/ml/roc-curve-example.svg)

        ![Precision recall curve example for an imbalanced classifier.](../../assets/generated/ml/precision-recall-curve-example.svg)

        ## Stakeholder evaluation report

        A practical evaluation report should include:

        - the decision being supported
        - the data window and split strategy
        - baseline performance
        - chosen threshold and why
        - confusion matrix at the operating threshold
        - business cost or value estimate
        - top error categories with examples
        - known risks, caveats, and release recommendation
        """,
    "book/01-ml-foundations/06-leakage-baselines-error-analysis.qmd": """\
        ## Deeper theory: leakage patterns

        Data leakage happens when training or evaluation uses information that would not be available at prediction time. Target leakage uses a feature that is a proxy for the label, such as `cancellation_date` in a churn model. Temporal leakage trains on future information, such as using next month's payment status to predict this month's default. Split leakage puts near-duplicate entities in both train and test sets.

        Baselines protect against fake sophistication. A churn model should beat simple rules such as "customers with more than three support tickets are high risk." A forecasting model should beat the naive forecast and seasonal naive forecast. A document classifier should beat keyword rules before a deep model is justified.

        Error analysis turns metrics into action. Slice errors by customer segment, time, data source, labeler, language, document type, and confidence band. The goal is not only to measure failure but to decide whether the next improvement is data quality, labels, features, model class, threshold, or product workflow.
        """,
    "book/02-deep-learning/10-pytorch-training.qmd": """\
        ## PyTorch training pattern

        A production-quality training example should have these separable pieces:

        - `Dataset`: owns how one example is loaded and transformed.
        - `DataLoader`: batches, shuffles, and parallelises data loading.
        - model class: defines the forward computation.
        - loss function: defines what "bad prediction" means.
        - optimizer: updates parameters using gradients.
        - training loop: runs forward, backward, and update steps.
        - validation loop: runs without gradients and without training-only behaviour.
        - device handling: chooses CPU, CUDA, or Apple Metal Performance Shaders where available.
        - save/load: stores `state_dict`, not arbitrary pickled objects when avoidable.
        - inference function: validates inputs and returns stable outputs.

        ```python
        import torch
        from torch import nn
        from torch.utils.data import DataLoader, TensorDataset

        x = torch.randn(256, 4)
        y = (x[:, 0] + x[:, 1] > 0).float().view(-1, 1)
        loader = DataLoader(TensorDataset(x, y), batch_size=32, shuffle=True)

        model = nn.Sequential(nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 1))
        loss_fn = nn.BCEWithLogitsLoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

        for xb, yb in loader:
            optimizer.zero_grad()
            loss = loss_fn(model(xb), yb)
            loss.backward()
            optimizer.step()
        ```

        For binary classification, prefer `BCEWithLogitsLoss` over `Sigmoid` plus `BCELoss` because it is numerically more stable.
        """,
    "book/02-deep-learning/11-debugging-training.qmd": """\
        ## Training debugging checklist

        If loss does not decrease, overfit a tiny batch first. A model that cannot memorize 16 examples usually has a code, label, shape, loss, or learning-rate bug.

        Common failure modes:

        - exploding gradients: loss becomes `nan` or jumps wildly; lower learning rate, clip gradients, check normalization
        - vanishing gradients: early layers barely update; inspect activations, use residual connections or better initialization
        - overfitting: train loss improves while validation loss degrades; add data, regularization, augmentation, or early stopping
        - underfitting: both train and validation loss are poor; increase capacity, improve features, train longer
        - train/eval mode bug: dropout and batch normalization behave differently in `model.train()` and `model.eval()`
        - tensor shape errors: the model trains but labels and predictions are broadcast incorrectly
        - label bugs: class order, target encoding, or leakage creates fake performance
        - reproducibility gaps: missing seeds, nondeterministic kernels, or unpinned data snapshots
        """,
    "book/02-deep-learning/14-transformers-attention.qmd": """\
        ## Deeper theory: attention and transformers

        Tokenisation converts text into token IDs. Embeddings map token IDs into vectors. Self-attention lets each token compute a weighted mixture of other token representations. The weights come from query-key similarity; the values carry the information being mixed.

        Multi-head attention runs several attention projections in parallel, allowing different heads to attend to different relationships. Positional encodings are needed because plain attention is permutation-invariant: without position information, the model cannot distinguish "dog bites man" from "man bites dog."

        Causal masking prevents a decoder from attending to future tokens during training and generation. Encoder models see the full input and are useful for representation tasks. Decoder models generate left-to-right and are the basis of most chat/completion systems. Encoder-decoder models are useful for sequence-to-sequence tasks such as translation.

        The key-value (KV) cache stores prior attention keys and values during generation so the model does not recompute the entire prefix for every new token. Context windows limit how many tokens can be considered at once. Inference cost grows with model size, generated tokens, prompt length, and attention implementation.

        ![Transformer block diagram showing tokens, attention, MLP, and residual connections.](../../assets/generated/deep-learning/transformer-block.svg)
        """,
    "book/03-llm-applications/20-llm-evaluation.qmd": """\
        ## Evaluation dimensions

        LLM applications need evaluation at multiple layers:

        - retrieval: did the system retrieve the right documents?
        - factuality: is the answer supported by evidence?
        - citation accuracy: do citations point to the exact supporting passage?
        - instruction following: did the model produce the requested structure?
        - safety: did it refuse or constrain unsafe requests?
        - latency and cost: is the experience operationally acceptable?
        - regression: did the new prompt, model, or retriever degrade known cases?

        LLM-as-judge can help scale review, but it is not ground truth. Use clear rubrics, spot-check human review, pairwise comparisons, and release gates. For enterprise systems, keep a golden question set with expected answer criteria and citation requirements.
        """,
    "book/03-llm-applications/21-fine-tuning.qmd": """\
        ## When fine-tuning is the right tool

        Fine-tuning changes model behaviour by updating weights. It is appropriate when you need consistent style, domain-specific task behaviour, or structured transformation patterns that prompting alone cannot reliably achieve.

        Fine-tuning is usually not the right answer for missing facts. If the system needs current enterprise knowledge, use Retrieval-Augmented Generation (RAG). If the behaviour can be fixed with clearer instructions, examples, schemas, or routing, prompt engineering is cheaper and safer.

        Supervised Fine-Tuning (SFT) needs high-quality input-output examples. Low-Rank Adaptation (LoRA) and Quantized LoRA (QLoRA) reduce training cost by adapting small parameter matrices instead of all weights. Preference optimisation methods require preference data and should be evaluated against safety, factuality, and regression sets before deployment.
        """,
    "book/03-llm-applications/22-alignment-methods.qmd": """\
        ## Alignment method map

        Supervised Fine-Tuning (SFT) teaches the model to imitate desired outputs. Reinforcement Learning from Human Feedback (RLHF) trains from human preferences, often through a reward model. Reinforcement Learning from AI Feedback (RLAIF) uses AI-generated preference or critique signals, which can scale review but can also amplify evaluator bias.

        Direct Preference Optimization (DPO) optimises directly from preferred/rejected response pairs without a separate reward model. Odds Ratio Preference Optimization (ORPO) combines supervised learning with an odds-ratio preference term. Kahneman-Tversky Optimization (KTO) uses desirable and undesirable examples without requiring paired comparisons. Group Relative Policy Optimization (GRPO) compares responses within a group and is often discussed for reasoning-oriented training.

        Enterprise teams rarely start here. Most should first use prompting, RAG, structured outputs, evaluation, and workflow controls. Alignment training is justified only when the organisation has enough high-quality data, evaluation discipline, deployment control, and monitoring maturity.
        """,
    "book/04-backend-engineering/25-http-apis-fastapi.qmd": """\
        ## HTTP and FastAPI essentials

        HTTP methods have operational meaning:

        | Method | Typical use | Idempotent? |
        |---|---|---|
        | GET | read a resource | yes |
        | POST | create or execute an action | no, unless designed that way |
        | PUT | replace a resource | yes |
        | PATCH | partially update a resource | usually |
        | DELETE | delete a resource | yes |

        Status codes are part of the API contract. Use `200` for success, `201` for created, `202` for accepted background work, `400` for invalid requests, `401` for unauthenticated, `403` for authenticated but forbidden, `404` for missing resources, and `500` only for unexpected server errors.

        FastAPI uses Pydantic models for request bodies, response models, validation, and OpenAPI documentation. In production, every endpoint should have typed schemas, explicit errors, request IDs, authentication dependencies, and tests.
        """,
    "book/05-security-governance/35-multi-tenant-data-access.qmd": """\
        ## Data isolation theory

        Multi-tenant access control must be enforced at every layer that can expose data: API routes, database queries, vector search metadata filters, background jobs, caches, logs, and exports.

        Tenant ID propagation is not enough by itself. The tenant claim must be validated, mapped to an internal tenant, and used in every data access path. Row-level security in the database provides defence in depth. For RAG systems, document-level Access Control Lists (ACLs) must be applied before chunks are inserted into prompts.

        Test isolation with negative tests: a user from tenant A must not retrieve tenant B rows, vector chunks, files, job statuses, audit logs, or cached answers.

        ![Tenant isolation diagram showing user tenant claim, API policy, tenant-filtered query, and scoped data.](../../assets/generated/security/tenant-isolation.svg)
        """,
    "book/06-agentic-systems/40-tool-calling-tool-safety.qmd": """\
        ## Tool safety controls

        A tool is a capability boundary. Treat every tool call like an API request from an untrusted planner.

        Production controls:

        - schema design: narrow argument types and enumerations
        - argument validation: reject malformed or excessive inputs
        - permission checks: authorize using user and workload identity
        - scoped tools: expose only the minimum actions required
        - dangerous tools: require human approval for irreversible side effects
        - retries: retry only idempotent operations or use idempotency keys
        - result validation: do not blindly trust tool output
        - audit logs: record requested action, arguments, caller, decision, and result

        The model may propose a tool call, but policy code decides whether it is allowed.
        """,
    "book/07-enterprise-delivery/50-first-seven-days.qmd": """\
        ## Day-by-day plan

        | Day | Focus | Output |
        |---|---|---|
        | 1 | Confirm problem and stakeholders | problem statement, users, sponsor, decision owner |
        | 2 | Data and access discovery | source list, owners, sensitivity, access path |
        | 3 | Baseline architecture | first architecture diagram and integration assumptions |
        | 4 | Evaluation and risk design | metrics, golden set plan, threat model, risk register |
        | 5 | Prototype plan | scoped prototype, success criteria, demo path |
        | 6 | Delivery plan | backlog, team roles, milestones, review gates |
        | 7 | Review and sign-off | decision log, next sprint scope, approval conditions |

        The first week should reduce uncertainty, not maximise code volume.
        """,
    "book/08-projects/56-churn-prediction-api.qmd": """\
        ## Example directory

        The runnable starter implementation lives in `examples/churn-api/`.

        It includes:

        - synthetic scoring logic
        - FastAPI request and response schemas
        - `/health` endpoint
        - `/predict` endpoint
        - validation errors
        - tests using `TestClient`
        - Dockerfile

        ```bash
        cd examples/churn-api
        python -m pip install -e ".[test]"
        pytest
        uvicorn churn_api.main:app --reload
        ```

        Production hardening would add model training, persisted model artifacts, model registry metadata, structured logs, drift monitoring, threshold review, authentication, and deployment automation.
        """,
}


def append_once(path: Path, text: str) -> None:
    original = path.read_text(encoding="utf-8")
    marker = text.strip().splitlines()[0]
    if marker in original:
        return
    path.write_text(original.rstrip() + "\n\n" + dedent(text).strip() + "\n", encoding="utf-8")


if __name__ == "__main__":
    for rel, text in ENHANCEMENTS.items():
        append_once(ROOT / rel, text)
    print(f"Enhanced {len(ENHANCEMENTS)} high-priority chapters")
