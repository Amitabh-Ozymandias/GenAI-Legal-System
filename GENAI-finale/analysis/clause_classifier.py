def classify_clause(
    title,
    content
):

    title = title.lower()

    mappings = {
        "termination": "termination",
        "confidentiality": "confidentiality",
        "payment": "payment_terms",
        "governing": "governing_law",
        "liability": "limitation_of_liability",
        "indemnity": "indemnity",
        "intellectual": "ip_ownership",
        "ownership": "ip_ownership"
    }

    for keyword, clause_type in mappings.items():

        if keyword in title:

            return {
                "clause_type": clause_type,
                "confidence": 1.0,
                "status": "mock"
            }

    return {
        "clause_type": "other",
        "confidence": 0.5,
        "status": "mock"
    }