import logging

class VectorStore:

    def __init__(self):
        import faiss
        logger = logging.getLogger("uvicorn")
        logger.info("[LAZY LOAD] FAISS library imported and index initialized")

        self.dimension = 384

        self.index = faiss.IndexFlatL2(
            self.dimension
        )

        self.documents = []

    def add_document(
        self,
        text,
        embedding
    ):
        import numpy as np

        embedding = np.array(
            [embedding],
            dtype=np.float32
        )

        self.index.add(
            embedding
        )

        self.documents.append(
            text
        )

    def search(
        self,
        query_embedding,
        k=5
    ):
        import numpy as np

        query_embedding = np.array(
            [query_embedding],
            dtype=np.float32
        )

        distances, indices = self.index.search(
            query_embedding,
            k
        )

        results = []

        for idx in indices[0]:

            if idx < len(self.documents):

                results.append(
                    self.documents[idx]
                )

        return results