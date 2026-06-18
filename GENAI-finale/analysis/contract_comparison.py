def compare_contracts(

    contract_a,

    contract_b

):

    clauses_a = {}

    clauses_b = {}

    for clause in contract_a["clauses"]:

        clause_type = clause[
            "classification"
        ].get(
            "clause_type",
            "other"
        )

        clauses_a[
            clause_type
        ] = clause

    for clause in contract_b["clauses"]:

        clause_type = clause[
            "classification"
        ].get(
            "clause_type",
            "other"
        )

        clauses_b[
            clause_type
        ] = clause

    all_clause_types = set(
        clauses_a.keys()
    ).union(
        clauses_b.keys()
    )

    comparison_results = []

    for clause_type in all_clause_types:

        clause_a = clauses_a.get(
            clause_type
        )

        clause_b = clauses_b.get(
            clause_type
        )

        comparison_results.append({

            "clause_type":
                clause_type,

            "contract_a":
                clause_a["content"]
                if clause_a
                else "Not Present",

            "contract_b":
                clause_b["content"]
                if clause_b
                else "Not Present"
        })

    return comparison_results