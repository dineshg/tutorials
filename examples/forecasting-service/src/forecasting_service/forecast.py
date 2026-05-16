from __future__ import annotations


def naive_forecast(history: list[float], horizon: int) -> list[float]:
    if not history:
        raise ValueError("history must not be empty")
    return [history[-1]] * horizon


def mean_absolute_error(actual: list[float], predicted: list[float]) -> float:
    if len(actual) != len(predicted):
        raise ValueError("actual and predicted lengths must match")
    return sum(abs(a - p) for a, p in zip(actual, predicted)) / len(actual)


def retraining_needed(recent_mae: float, baseline_mae: float, tolerance: float = 1.25) -> bool:
    return recent_mae > baseline_mae * tolerance
