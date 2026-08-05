def compare_contracts(
    contract_a,
    contract_b
):

    clauses_a = {}
    clauses_b = {}

    for clause in contract_a.get("clauses", []):
        clause_type = clause.get("classification", {}).get("clause_type", "other")
        title = clause.get("title", "")
        content = clause.get("content", "")
        text = f"{title}\n{content}".strip() if title else content.strip()

        if clause_type not in clauses_a:
            clauses_a[clause_type] = []
        clauses_a[clause_type].append(text)

    for clause in contract_b.get("clauses", []):
        clause_type = clause.get("classification", {}).get("clause_type", "other")
        title = clause.get("title", "")
        content = clause.get("content", "")
        text = f"{title}\n{content}".strip() if title else content.strip()

        if clause_type not in clauses_b:
            clauses_b[clause_type] = []
        clauses_b[clause_type].append(text)

    # Priority ordering for clause types
    type_priority = [
        "termination", "limitation_of_liability", "indemnity",
        "ip_ownership", "payment_terms", "confidentiality",
        "governing_law", "data_protection", "force_majeure",
        "entire_agreement", "warranties", "other"
    ]

    all_keys = set(clauses_a.keys()).union(clauses_b.keys())
    all_clause_types = [k for k in type_priority if k in all_keys] + [k for k in sorted(all_keys) if k not in type_priority]

    comparison_results = []

    for clause_type in all_clause_types:
        list_a = clauses_a.get(clause_type)
        list_b = clauses_b.get(clause_type)

        text_a = "\n\n".join(list_a) if list_a else "Not Present"
        text_b = "\n\n".join(list_b) if list_b else "Not Present"

        comparison_results.append({
            "clause_type": clause_type,
            "contract_a": text_a,
            "contract_b": text_b
        })

    return comparison_results