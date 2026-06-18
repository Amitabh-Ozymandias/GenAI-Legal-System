import json
import re


def extract_json(response_text):

    response_text = response_text.strip()

    response_text = re.sub(
        r"^```json",
        "",
        response_text,
        flags=re.IGNORECASE
    )

    response_text = re.sub(
        r"```$",
        "",
        response_text
    )

    response_text = response_text.strip()

    return json.loads(response_text)