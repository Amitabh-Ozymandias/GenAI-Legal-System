import os


def save_report(
    report_text,
    file_name="executive_summary.txt"
):

    os.makedirs(
        "reports",
        exist_ok=True
    )

    report_path = os.path.join(
        "reports",
        file_name
    )

    with open(
        report_path,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(report_text)

    return report_path