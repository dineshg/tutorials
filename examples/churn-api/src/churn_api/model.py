from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass(frozen=True)
class CustomerFeatures:
    monthly_spend: float
    support_tickets: int
    tenure_months: int
    contract_type: str


def churn_probability(features: CustomerFeatures) -> float:
    contract_risk = 0.8 if features.contract_type == "monthly" else -0.4
    logit = (
        -1.8
        + 0.035 * features.support_tickets
        + 0.010 * max(0.0, 80.0 - features.monthly_spend)
        - 0.025 * features.tenure_months
        + contract_risk
    )
    return 1.0 / (1.0 + math.exp(-logit))


def classify_churn(probability: float, threshold: float = 0.45) -> bool:
    return probability >= threshold
