import json

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def load_standards():

    with open(
        "data/standards/market_standards.json",
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def compare_clause(
    clause_text,
    clause_type
):

    standards = load_standards()

    if clause_type not in standards:

        return {
            "comparison": "unknown",
            "similarity_score": 0
        }

    standard_clause = standards[
        clause_type
    ]["standard"]

    clause_embedding = model.encode(
        [clause_text],
        convert_to_numpy=True
    )

    standard_embedding = model.encode(
        [standard_clause],
        convert_to_numpy=True
    )

    similarity = cosine_similarity(
        clause_embedding,
        standard_embedding
    )[0][0]

    if similarity >= 0.85:

        verdict = "market_standard"

    elif similarity >= 0.65:

        verdict = "unusual"

    else:

        verdict = "unfavourable"

    return {
        "comparison": verdict,
        "similarity_score": round(
            float(similarity),
            3
        )
    }