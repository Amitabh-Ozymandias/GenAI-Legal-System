import re


def split_into_clauses(text):
    """
    Split contract text into logical clauses based on common
    legal-document heading patterns.

    Returns:
    [
        {
            "title": "...",
            "content": "..."
        }
    ]
    """

    text = text.replace("\r\n", "\n")

    heading_pattern = re.compile(
        r"(?m)^("
        r"\d+(\.\d+)*[\s\.\:]+[A-Za-z0-9][^\n]*|"   # 1. Definitions / 2.1 Payment Terms / 1.0 General
        r"(ARTICLE|SECTION|CLAUSE)\s+[IVXLC0-9]+(\.[0-9]+)*[^\n]*|" # ARTICLE I / SECTION 2.3 / CLAUSE 5
        r"[A-Z][A-Z\s]{3,}$"                        # TERMINATION RIGHTS
        r")"
    )

    matches = list(heading_pattern.finditer(text))

    clauses = []

    if not matches:
        clauses.append(
            {
                "title": "FULL_DOCUMENT",
                "content": text.strip()
            }
        )
        return clauses

    for i in range(len(matches)):

        start = matches[i].start()

        end = (
            matches[i + 1].start()
            if i + 1 < len(matches)
            else len(text)
        )

        clause_text = text[start:end].strip()

        lines = clause_text.split("\n")

        title = lines[0].strip()

        content = "\n".join(lines[1:]).strip()
        if not content:
            content = title

        clauses.append(
            {
                "title": title,
                "content": content
            }
        )

    return clauses