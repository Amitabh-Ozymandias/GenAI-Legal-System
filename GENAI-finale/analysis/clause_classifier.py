def classify_clause(
    title,
    content
):
    title_lower = title.lower()
    content_lower = content[:400].lower()

    mappings = [
        ("termination", "termination"),
        ("confidentiality", "confidentiality"),
        ("confidential", "confidentiality"),
        ("payment", "payment_terms"),
        ("fee", "payment_terms"),
        ("governing", "governing_law"),
        ("jurisdiction", "governing_law"),
        ("dispute", "governing_law"),
        ("liability", "limitation_of_liability"),
        ("indemnity", "indemnity"),
        ("indemnification", "indemnity"),
        ("intellectual", "ip_ownership"),
        ("ip ", "ip_ownership"),
        ("ownership", "ip_ownership"),
        ("data protection", "data_protection"),
        ("privacy", "data_protection"),
        ("force majeure", "force_majeure"),
        ("entire agreement", "entire_agreement"),
        ("warranty", "warranties"),
        ("warranties", "warranties")
    ]

    for keyword, clause_type in mappings:
        if keyword in title_lower:
            return {
                "clause_type": clause_type,
                "confidence": 0.95,
                "status": "classified"
            }

    for keyword, clause_type in mappings:
        if keyword in content_lower:
            return {
                "clause_type": clause_type,
                "confidence": 0.80,
                "status": "classified"
            }

    return {
        "clause_type": "other",
        "confidence": 0.5,
        "status": "classified"
    }