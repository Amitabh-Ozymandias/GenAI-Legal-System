import fitz


def extract_pdf_text(pdf_path):

    doc = fitz.open(pdf_path)

    pages = []

    for page in doc:

        pages.append(
            page.get_text()
        )

    doc.close()

    return "\n".join(pages)