from chatbot.embeddings import (
    generate_embedding
)

from chatbot.vector_store import (
    VectorStore
)


def build_contract_index(
    clauses
):

    vector_store = VectorStore()

    for clause in clauses:

        combined_text = (
            f"{clause['title']}\n\n"
            f"{clause['content']}"
        )

        embedding = generate_embedding(
            combined_text
        )

        vector_store.add_document(
            combined_text,
            embedding
        )

    return vector_store