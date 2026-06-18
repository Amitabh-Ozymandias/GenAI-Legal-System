from config import get_model


def compare_contract_clauses(
    clause_type,
    contract_data
):

    comparison_text = ""

    for contract in contract_data:

        comparison_text += (
            f"\nCONTRACT: "
            f"{contract['contract_name']}\n\n"
        )

        comparison_text += (
            contract["clause_text"]
        )

        comparison_text += "\n\n"

    prompt = f"""
You are a legal due diligence expert.

Compare the following
{clause_type} clauses.

For each contract:

1. Summarize the clause.
2. Identify strengths.
3. Identify weaknesses.
4. Identify unusual terms.

Then provide an overall comparison.

Return readable text.

{comparison_text}
"""

    response = get_model().generate_content(
        prompt
    )

    return response.text