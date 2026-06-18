from config import model

from analysis.json_parser import extract_json


def local_risk_analysis(
    clause_type
):

    risk_map = {

        "termination": 7,

        "limitation_of_liability": 8,

        "indemnity": 8,

        "ip_ownership": 7,

        "payment_terms": 6,

        "confidentiality": 5,

        "governing_law": 3,

        "other": 4
    }

    score = risk_map.get(
        clause_type,
        4
    )

    if score >= 8:

        level = "High"

    elif score >= 5:

        level = "Medium"

    else:

        level = "Low"

    return {

        "financial_risk": score,

        "legal_risk": score,

        "operational_risk": max(
            score - 1,
            1
        ),

        "reputational_risk": max(
            score - 2,
            1
        ),

        "overall_risk_score": score,

        "risk_level": level,

        "reason":
            f"Local risk model for {clause_type}",

        "source":
            "local"
    }


def analyze_risk(
    clause_title,
    clause_content,
    clause_type
):

    prompt = f"""
You are a senior legal risk analyst.

Analyze the following contract clause.

Clause Type:
{clause_type}

Clause Title:
{clause_title}

Clause Content:
{clause_content[:3000]}

Evaluate:

1. Financial Risk (0-10)
2. Legal Risk (0-10)
3. Operational Risk (0-10)
4. Reputational Risk (0-10)

Calculate:

overall_risk_score

Return ONLY JSON.

Example:

{{
    "financial_risk": 7,
    "legal_risk": 8,
    "operational_risk": 5,
    "reputational_risk": 4,
    "overall_risk_score": 6.0,
    "risk_level": "Medium",
    "reason": "Broad indemnity obligations create legal exposure."
}}
"""

    try:

        response = model.generate_content(
            prompt
        )

        parsed = extract_json(
            response.text
        )

        parsed["source"] = "gemini"

        return parsed

    except Exception as e:

        print(
            f"Gemini failed: {e}"
        )

        return local_risk_analysis(
            clause_type
        )