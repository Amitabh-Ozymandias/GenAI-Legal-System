from chatbot.embeddings import (
    generate_embedding
)


def retrieve_context(
    query,
    vector_store,
    k=5
):

    query_embedding = generate_embedding(
        query
    )

    return vector_store.search(
        query_embedding,
        k
    )