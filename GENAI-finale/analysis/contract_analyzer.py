from ingestion.pdf_parser import extract_pdf_text
from ingestion.docx_parser import extract_docx_text
from ingestion.clause_splitter import split_into_clauses

from analysis.clause_classifier import classify_clause
from analysis.risk_analyzer import analyze_risk
from analysis.market_comparison import compare_clause
from analysis.executive_summary import (
    generate_executive_summary
)

import os


def extract_text(file_path):

    extension = os.path.splitext(
        file_path
    )[1].lower()

    if extension == ".pdf":

        return extract_pdf_text(
            file_path
        )

    elif extension == ".docx":

        return extract_docx_text(
            file_path
        )

    raise ValueError(
        f"Unsupported file type: {extension}"
    )


def analyze_contract(file_path):

    text = extract_text(
        file_path
    )

    clauses = split_into_clauses(
        text
    )

    analyzed_clauses = []

    risk_scores = []

    for clause in clauses:

        title = clause["title"]

        content = clause["content"]

        classification = classify_clause(
            title,
            content
        )

        clause_type = classification.get(
            "clause_type",
            "other"
        )

        risk = analyze_risk(
            title,
            content,
            clause_type
        )

        comparison = compare_clause(
            content,
            clause_type
        )

        analyzed_clause = {
            "title": title,
            "content": content,
            "classification": classification,
            "risk": risk,
            "market_comparison": comparison
        }

        analyzed_clauses.append(
            analyzed_clause
        )

        risk_scores.append(
            risk.get(
                "overall_risk_score",
                0
            )
        )

    overall_risk = 0

    if risk_scores:

        overall_risk = round(
            sum(risk_scores)
            / len(risk_scores),
            2
        )

    summary_input = {
        "overall_risk": overall_risk,
        "clauses": analyzed_clauses
    }

    executive_summary = (
        generate_executive_summary(
            summary_input
        )
    )

    return {
        "file_name": os.path.basename(
            file_path
        ),
        "overall_risk": overall_risk,
        "total_clauses": len(
            analyzed_clauses
        ),
        "clauses": analyzed_clauses,
        "executive_summary":
            executive_summary
    }