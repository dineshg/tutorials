#!/usr/bin/env python3
"""Generate deterministic local educational assets for the book.

The generated figures are intentionally simple SVGs. They avoid remote image
dependencies and can be rebuilt without private credentials, paid APIs, or
large binary toolchains.
"""

from __future__ import annotations

import math
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "generated"


def ensure_dirs() -> None:
    for name in [
        "ml",
        "deep-learning",
        "llm",
        "backend",
        "security",
        "agents",
        "enterprise",
    ]:
        (OUT / name).mkdir(parents=True, exist_ok=True)


def write_svg(path: Path, body: str, width: int = 960, height: int = 540) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img">
  <rect width="{width}" height="{height}" fill="#ffffff"/>
  <style>
    .title {{ font: 700 28px system-ui, -apple-system, Segoe UI, sans-serif; fill: #111827; }}
    .label {{ font: 600 17px system-ui, -apple-system, Segoe UI, sans-serif; fill: #1f2937; }}
    .small {{ font: 14px system-ui, -apple-system, Segoe UI, sans-serif; fill: #4b5563; }}
    .box {{ fill: #f8fafc; stroke: #334155; stroke-width: 2; rx: 12; }}
    .blue {{ fill: #dbeafe; stroke: #2563eb; }}
    .green {{ fill: #dcfce7; stroke: #16a34a; }}
    .orange {{ fill: #ffedd5; stroke: #ea580c; }}
    .red {{ fill: #fee2e2; stroke: #dc2626; }}
    .purple {{ fill: #ede9fe; stroke: #7c3aed; }}
    .line {{ stroke: #334155; stroke-width: 3; fill: none; }}
    .thin {{ stroke: #94a3b8; stroke-width: 1.5; fill: none; }}
    .arrow {{ marker-end: url(#arrow); }}
  </style>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L10,3 L0,6 Z" fill="#334155"/>
    </marker>
  </defs>
{body}
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def curve_asset(path: Path, title: str, fn, y_label: str = "activation") -> None:
    width, height = 960, 540
    left, top, plot_w, plot_h = 100, 95, 760, 350
    points = []
    xs = [(-6 + 12 * i / 160) for i in range(161)]
    ys = [fn(x) for x in xs]
    y_min = min(min(ys), -1.1)
    y_max = max(max(ys), 1.1)
    for x, y in zip(xs, ys):
        px = left + (x + 6) / 12 * plot_w
        py = top + (y_max - y) / (y_max - y_min) * plot_h
        points.append(f"{px:.1f},{py:.1f}")
    zero_y = top + (y_max - 0) / (y_max - y_min) * plot_h
    zero_x = left + (0 + 6) / 12 * plot_w
    body = f"""
  <text x="48" y="48" class="title">{title}</text>
  <line x1="{left}" y1="{top + plot_h}" x2="{left + plot_w}" y2="{top + plot_h}" class="line"/>
  <line x1="{left}" y1="{top}" x2="{left}" y2="{top + plot_h}" class="line"/>
  <line x1="{left}" y1="{zero_y:.1f}" x2="{left + plot_w}" y2="{zero_y:.1f}" class="thin"/>
  <line x1="{zero_x:.1f}" y1="{top}" x2="{zero_x:.1f}" y2="{top + plot_h}" class="thin"/>
  <polyline points="{' '.join(points)}" fill="none" stroke="#2563eb" stroke-width="5"/>
  <text x="{left + plot_w - 20}" y="{top + plot_h + 40}" text-anchor="end" class="small">input x</text>
  <text x="{left - 65}" y="{top + 20}" class="small">{y_label}</text>
  <text x="110" y="500" class="small">Generated locally from a deterministic mathematical function.</text>
"""
    write_svg(path, body, width, height)


def boxes_asset(path: Path, title: str, boxes: list[tuple[str, str]], colors: list[str] | None = None) -> None:
    colors = colors or ["blue", "green", "orange", "purple", "red"]
    gap = 28
    box_w = (820 - gap * (len(boxes) - 1)) / len(boxes)
    y = 210
    body = f'<text x="48" y="58" class="title">{title}</text>\n'
    for i, (label, note) in enumerate(boxes):
        x = 70 + i * (box_w + gap)
        cls = colors[i % len(colors)]
        body += f'  <rect x="{x:.1f}" y="{y}" width="{box_w:.1f}" height="120" class="box {cls}"/>\n'
        body += f'  <text x="{x + box_w / 2:.1f}" y="{y + 48}" text-anchor="middle" class="label">{label}</text>\n'
        body += f'  <text x="{x + box_w / 2:.1f}" y="{y + 82}" text-anchor="middle" class="small">{note}</text>\n'
        if i < len(boxes) - 1:
            body += f'  <line x1="{x + box_w:.1f}" y1="{y + 60}" x2="{x + box_w + gap - 6:.1f}" y2="{y + 60}" class="line arrow"/>\n'
    write_svg(path, body)


def matrix_asset(path: Path, title: str) -> None:
    body = f"""
  <text x="48" y="58" class="title">{title}</text>
  <text x="405" y="105" class="label">Predicted</text>
  <text x="105" y="285" class="label" transform="rotate(-90 105 285)">Actual</text>
  <rect x="220" y="130" width="170" height="130" class="box green"/>
  <rect x="390" y="130" width="170" height="130" class="box red"/>
  <rect x="220" y="260" width="170" height="130" class="box red"/>
  <rect x="390" y="260" width="170" height="130" class="box green"/>
  <text x="305" y="188" text-anchor="middle" class="label">True negative</text>
  <text x="305" y="222" text-anchor="middle" class="small">correct non-churn</text>
  <text x="475" y="188" text-anchor="middle" class="label">False positive</text>
  <text x="475" y="222" text-anchor="middle" class="small">unneeded action</text>
  <text x="305" y="318" text-anchor="middle" class="label">False negative</text>
  <text x="305" y="352" text-anchor="middle" class="small">missed churn</text>
  <text x="475" y="318" text-anchor="middle" class="label">True positive</text>
  <text x="475" y="352" text-anchor="middle" class="small">saved customer</text>
  <text x="620" y="200" class="small">Precision: of predicted positives, how many were right?</text>
  <text x="620" y="245" class="small">Recall: of actual positives, how many did we catch?</text>
  <text x="620" y="290" class="small">Thresholds trade false positives against false negatives.</text>
"""
    write_svg(path, body)


def split_asset(path: Path, title: str, time_based: bool = False) -> None:
    labels = ["Train", "Validation", "Test"] if not time_based else ["Past train", "Recent validation", "Future test"]
    colors = ["green", "orange", "blue"]
    body = f'<text x="48" y="58" class="title">{title}</text>\n'
    x = 110
    widths = [460, 180, 150]
    for label, width, color in zip(labels, widths, colors):
        body += f'  <rect x="{x}" y="220" width="{width}" height="90" class="box {color}"/>\n'
        body += f'  <text x="{x + width / 2}" y="274" text-anchor="middle" class="label">{label}</text>\n'
        x += width
    body += '  <line x1="110" y1="360" x2="900" y2="360" class="line arrow"/>\n'
    body += '  <text x="900" y="395" text-anchor="end" class="small">data order / time</text>\n'
    write_svg(path, body)


def roc_pr_asset(path: Path, title: str, pr: bool = False) -> None:
    left, top, w, h = 120, 95, 620, 360
    if pr:
        pts = [(0, 0.98), (0.12, 0.9), (0.3, 0.78), (0.55, 0.62), (0.8, 0.48), (1, 0.35)]
        xlab, ylab = "Recall", "Precision"
    else:
        pts = [(0, 0), (0.08, 0.42), (0.22, 0.7), (0.44, 0.86), (0.7, 0.95), (1, 1)]
        xlab, ylab = "False positive rate", "True positive rate"
    coords = " ".join(f"{left + x*w:.1f},{top + (1-y)*h:.1f}" for x, y in pts)
    body = f"""
  <text x="48" y="58" class="title">{title}</text>
  <line x1="{left}" y1="{top+h}" x2="{left+w}" y2="{top+h}" class="line"/>
  <line x1="{left}" y1="{top}" x2="{left}" y2="{top+h}" class="line"/>
  <polyline points="{coords}" fill="none" stroke="#2563eb" stroke-width="5"/>
  <text x="{left+w}" y="{top+h+42}" text-anchor="end" class="small">{xlab}</text>
  <text x="{left-70}" y="{top+20}" class="small">{ylab}</text>
  <text x="790" y="180" class="small">Use curves to choose thresholds,</text>
  <text x="790" y="210" class="small">not just to report a single score.</text>
"""
    write_svg(path, body)


def architecture_assets() -> None:
    boxes_asset(
        OUT / "enterprise" / "document-qa-architecture.svg",
        "Enterprise Document Q&A Assistant",
        [
            ("Documents", "policies, notes"),
            ("Ingestion", "parse + chunk"),
            ("Retriever", "ACL-filtered search"),
            ("LLM", "grounded answer"),
            ("Audit", "logs + eval"),
        ],
    )
    boxes_asset(
        OUT / "llm" / "rag-pipeline.svg",
        "Retrieval-Augmented Generation Pipeline",
        [
            ("Ingest", "parse documents"),
            ("Chunk", "add metadata"),
            ("Embed", "vectors"),
            ("Retrieve", "filter + rank"),
            ("Answer", "cite sources"),
        ],
    )
    boxes_asset(
        OUT / "backend" / "inference-api-architecture.svg",
        "Model Inference API",
        [
            ("Client", "JSON request"),
            ("FastAPI", "validate schema"),
            ("Model", "predict"),
            ("Response", "score + reason"),
            ("Logs", "metrics"),
        ],
    )
    boxes_asset(
        OUT / "security" / "oidc-pkce-flow.svg",
        "OIDC Authorization Code with PKCE",
        [
            ("Browser", "code challenge"),
            ("IdP", "login + consent"),
            ("Token", "code exchange"),
            ("API", "JWT validation"),
            ("Data", "scoped access"),
        ],
    )
    boxes_asset(
        OUT / "agents" / "mcp-client-server-flow.svg",
        "MCP Client-Server Flow",
        [
            ("Host", "LLM app"),
            ("Client", "MCP session"),
            ("Server", "tools/resources"),
            ("System", "API or DB"),
            ("Audit", "tool logs"),
        ],
    )
    boxes_asset(
        OUT / "deep-learning" / "gradient-descent-path.svg",
        "Gradient Descent Path",
        [("Start", "high loss"), ("Gradient", "downhill step"), ("Update", "new weights"), ("Minimum", "lower loss")],
    )
    boxes_asset(
        OUT / "deep-learning" / "loss-surface.svg",
        "Loss Surface",
        [("Weights", "parameters"), ("Loss", "objective"), ("Gradient", "slope"), ("Step", "optimizer")],
    )
    boxes_asset(
        OUT / "deep-learning" / "activation-functions.svg",
        "Common Activation Functions",
        [("Sigmoid", "probability"), ("Tanh", "centered"), ("ReLU", "sparse"), ("Softmax", "classes")],
    )


def generate_all() -> None:
    ensure_dirs()
    curve_asset(OUT / "deep-learning" / "sigmoid-function.svg", "Sigmoid Function", lambda x: 1 / (1 + math.exp(-x)), "probability")
    curve_asset(OUT / "deep-learning" / "tanh-function.svg", "Hyperbolic Tangent", math.tanh)
    curve_asset(OUT / "deep-learning" / "relu-function.svg", "ReLU Function", lambda x: max(0, x), "activation")
    curve_asset(
        OUT / "deep-learning" / "sigmoid-derivative.svg",
        "Sigmoid Derivative",
        lambda x: (1 / (1 + math.exp(-x))) * (1 - (1 / (1 + math.exp(-x)))),
        "gradient",
    )
    curve_asset(OUT / "ml" / "sine-wave-forecasting.svg", "Synthetic Sine Wave for Forecasting", math.sin, "value")
    matrix_asset(OUT / "ml" / "confusion-matrix-example.svg", "Confusion Matrix for a Churn Model")
    split_asset(OUT / "ml" / "train-validation-test-split.svg", "Train / Validation / Test Split")
    split_asset(OUT / "ml" / "time-series-split.svg", "Time-Based Split", time_based=True)
    roc_pr_asset(OUT / "ml" / "roc-curve-example.svg", "ROC Curve Example")
    roc_pr_asset(OUT / "ml" / "precision-recall-curve-example.svg", "Precision-Recall Curve Example", pr=True)
    boxes_asset(
        OUT / "deep-learning" / "neural-network-architecture.svg",
        "Feed-Forward Neural Network",
        [("Inputs", "features"), ("Hidden", "nonlinear layers"), ("Output", "prediction")],
    )
    boxes_asset(
        OUT / "deep-learning" / "convolution-window.svg",
        "Convolution Window",
        [("Image patch", "local pixels"), ("Kernel", "weights"), ("Feature map", "activation")],
    )
    boxes_asset(
        OUT / "deep-learning" / "convolution-padding-stride.svg",
        "Padding and Stride",
        [("Input", "H x W"), ("Padding", "border"), ("Stride", "step size"), ("Output", "feature map")],
    )
    boxes_asset(
        OUT / "deep-learning" / "max-pooling.svg",
        "Max Pooling",
        [("2x2 region", "values"), ("max()", "select largest"), ("pooled map", "smaller")],
    )
    boxes_asset(
        OUT / "deep-learning" / "transformer-block.svg",
        "Transformer Block",
        [("Tokens", "ids"), ("Attention", "context"), ("MLP", "transform"), ("Residuals", "stability")],
    )
    boxes_asset(
        OUT / "deep-learning" / "rnn-unrolled.svg",
        "Unrolled Recurrent Neural Network",
        [("x1", "state h1"), ("x2", "state h2"), ("x3", "state h3"), ("x4", "state h4")],
    )
    boxes_asset(
        OUT / "deep-learning" / "dropout.svg",
        "Dropout During Training",
        [("Layer", "all units"), ("Mask", "drop some"), ("Next layer", "robust features")],
    )
    boxes_asset(
        OUT / "deep-learning" / "softmax-probabilities.svg",
        "Softmax Converts Logits to Probabilities",
        [("Logits", "raw scores"), ("exp + normalize", "softmax"), ("Probabilities", "sum to 1")],
    )
    boxes_asset(
        OUT / "llm" / "tool-calling-flow.svg",
        "Structured Tool Calling",
        [("Prompt", "intent"), ("Schema", "arguments"), ("Tool", "execute"), ("Result", "validate"), ("Answer", "summarize")],
    )
    boxes_asset(
        OUT / "security" / "tenant-isolation.svg",
        "Tenant Isolation",
        [("User", "tenant claim"), ("API", "policy"), ("Query", "tenant filter"), ("Data", "scoped rows")],
    )
    boxes_asset(
        OUT / "security" / "llm-threat-model.svg",
        "LLM Application Threat Model",
        [("User", "prompt"), ("Retrieved docs", "indirect input"), ("Tools", "side effects"), ("Logs", "evidence")],
    )
    boxes_asset(
        OUT / "agents" / "workflow-vs-agent.svg",
        "Workflow vs Agent",
        [("Workflow", "fixed steps"), ("Agent", "model selects"), ("Approval", "human gate"), ("Audit", "trace")],
    )
    boxes_asset(
        OUT / "enterprise" / "ai-delivery-lifecycle.svg",
        "AI Delivery Lifecycle",
        [("Pain", "opportunity"), ("Intake", "requirements"), ("Design", "HLD/LLD"), ("Build", "sprints"), ("Run", "support")],
    )
    architecture_assets()
    book_assets = ROOT / "book" / "assets" / "generated"
    if book_assets.exists():
        shutil.rmtree(book_assets)
    shutil.copytree(OUT, book_assets)


if __name__ == "__main__":
    generate_all()
    print(f"Generated assets under {OUT.relative_to(ROOT)}")
