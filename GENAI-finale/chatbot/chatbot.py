from config import get_model

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

    try:
        response = get_model().generate_content(
            prompt
        )
        if response and response.text:
            return response.text.strip()
        return "The contract does not provide enough information."
    except Exception as e:
        print(f"Chat model error: {e}")
        return f"Unable to answer query due to AI service issue: {str(e)}"