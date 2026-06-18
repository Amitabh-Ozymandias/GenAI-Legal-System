from config import model

from chatbot.retriever import retrieve_context


def ask_contract_question(
    question,
    vector_store
):

    context_chunks = retrieve_context(
        question,
        vector_store,
        k=5
    )

    context = "\n\n".join(
        context_chunks
    )

    prompt = f"""
You are a legal contract assistant.

Answer the user's question using ONLY
the provided contract context.

If the answer is not present,
say:

'The contract does not provide enough information.'

CONTRACT CONTEXT:

{context}

QUESTION:

{question}
"""

    response = model.generate_content(
        prompt
    )

    return response.text