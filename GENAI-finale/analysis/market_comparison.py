import json
import logging

from sklearn.metrics.pairwise import cosine_similarity


_model = None
_standards_embeddings_cache = {}

def get_model():
    global _model
    if _model is None:
        logger = logging.getLogger("uvicorn")
        logger.info("[LAZY LOAD] SentenceTransformer model loaded lazily on first request")
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )
    return _model


def get_standard_embedding(clause_type, standard_clause):
    global _standards_embeddings_cache
    if clause_type not in _standards_embeddings_cache:
        _standards_embeddings_cache[clause_type] = get_model().encode(
            [standard_clause],
            convert_to_numpy=True
        )
    return _standards_embeddings_cache[clause_type]


import os

_standards_cache = None

def load_standards():
    global _standards_cache
    if _standards_cache is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(base_dir, "data", "standards", "market_standards.json")
        with open(json_path, "r", encoding="utf-8") as file:
            _standards_cache = json.load(file)
    return _standards_cache


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

    clause_embedding = get_model().encode(
        [clause_text],
        convert_to_numpy=True
    )

    standard_embedding = get_standard_embedding(clause_type, standard_clause)

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