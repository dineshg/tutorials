from agent_ticket_triage.triage import draft_response


def test_security_requires_approval() -> None:
    result = draft_response("Possible security breach in account")
    assert result["category"] == "security_escalation"
    assert result["send_allowed"] is False
