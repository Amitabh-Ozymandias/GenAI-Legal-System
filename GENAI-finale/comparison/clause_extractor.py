def get_clause_by_type(
    clauses,
    target_type
):

    matching_clauses = []

    for clause in clauses:

        if (
            clause.get(
                "clause_type"
            )
            == target_type
        ):

            matching_clauses.append(
                clause
            )

    return matching_clauses