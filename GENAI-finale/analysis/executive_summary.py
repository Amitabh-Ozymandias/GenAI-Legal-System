def generate_executive_summary(
    contract_analysis
):

    clause_count = len(
        contract_analysis.get(
            "clauses",
            []
        )
    )

    overall_risk = contract_analysis.get(
        "overall_risk",
        0
    )

    return f"""
EXECUTIVE SUMMARY

This contract was successfully processed using
the development mock analyzer.

Total Clauses Analysed: {clause_count}

Overall Risk Score: {overall_risk}

Key Findings:

• Contract structure successfully detected.
• Clauses successfully classified.
• Risk scores successfully generated.
• Market comparison completed.

NOTE:
This summary was generated using mock logic
because Gemini analysis is currently disabled
or API quota is unavailable.
"""