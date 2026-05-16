from __future__ import annotations


def classify_ticket(text: str) -> str:
    lower = text.lower()
    if "security" in lower or "breach" in lower:
        return "security_escalation"
    if "refund" in lower or "billing" in lower:
        return "billing"
    return "general_support"


def draft_response(text: str, approved: bool = False) -> dict[str, str | bool]:
    category = classify_ticket(text)
    response = f"Draft response for {category}: thank you, we are reviewing your request."
    return {"category": category, "draft": response, "send_allowed": approved}
