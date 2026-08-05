from config import get_model

def generate_executive_summary(
    contract_analysis
):
    clauses = contract_analysis.get("clauses", [])
    clause_count = len(clauses)
    overall_risk = contract_analysis.get("overall_risk", 0)

    high_risk_clauses = [
        f"- {c['title']} ({c.get('classification', {}).get('clause_type', 'other')}): Risk {c.get('risk', {}).get('overall_risk_score', 'N/A')}/10 - {c.get('risk', {}).get('reason', '')}"
        for c in clauses if c.get("risk", {}).get("overall_risk_score", 0) >= 6
    ]

    prompt = f"""
You are an expert legal counsel. Write a clear, professional Executive Summary for a contract review based on the following analysis data.

Total Clauses Analyzed: {clause_count}
Overall Risk Score: {overall_risk} / 10

Key Risk Areas Identified:
{chr(10).join(high_risk_clauses[:10]) if high_risk_clauses else 'No critical high-risk clauses detected.'}

Format the summary with headings:
- Overview
- Key Risks & Exposure
- Recommendations / Next Steps

Keep it concise, professional, and actionable.
"""

    try:
        model = get_model()
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        print(f"Executive summary LLM generation failed: {e}")

    risk_level = "High" if overall_risk >= 7 else "Medium" if overall_risk >= 4 else "Low"
    return f"""EXECUTIVE SUMMARY

This contract was analyzed for legal risk, classification, and market alignment.

Total Clauses Analyzed: {clause_count}
Overall Risk Score: {overall_risk} / 10 ({risk_level} Risk)

Key Findings:
• Contract structure parsed into {clause_count} distinct clauses.
• Identified {len(high_risk_clauses)} clause(s) requiring legal review or negotiation.
• Market standard comparison completed across legal and operational terms.
"""