from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File

from fastapi.middleware.cors import (
    CORSMiddleware
)

from analysis.contract_analyzer import (
    analyze_contract
)

from analysis.contract_comparison import (
    compare_contracts
)

import shutil
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

app = FastAPI(
    title="Legal Document Intelligence System"
)

@app.on_event("startup")
def on_startup():
    logger.info("App startup completed")
    logger.info("Port binding completed")

# -------------------------------
# CORS CONFIGURATION
# -------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

# -------------------------------
# UPLOAD DIRECTORY
# -------------------------------

UPLOAD_DIR = "uploads"

if os.path.isfile(UPLOAD_DIR):

    raise RuntimeError(
        "'uploads' exists as a file. Delete it and create a folder."
    )

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

# -------------------------------
# ROOT
# -------------------------------

@app.get("/")
def root():

    return {
        "message":
        "Legal AI Running"
    }


@app.get("/health")
def health():

    return {
        "status":
        "healthy"
    }

# -------------------------------
# ANALYZE CONTRACT
# -------------------------------

@app.post("/analyze")
async def analyze_document(

    file: UploadFile = File(...)
):

    filename = os.path.basename(
        file.filename or "uploaded_file.pdf"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:

        result = analyze_contract(
            file_path
        )

    finally:

        if os.path.exists(
            file_path
        ):

            os.remove(
                file_path
            )

    return result

# -------------------------------
# COMPARE CONTRACTS
# -------------------------------

@app.post("/compare")
async def compare_documents(

    contract_a: UploadFile = File(...),

    contract_b: UploadFile = File(...)
):

    filename_a = os.path.basename(
        contract_a.filename
        or "contract_a.pdf"
    )

    filename_b = os.path.basename(
        contract_b.filename
        or "contract_b.pdf"
    )

    path_a = os.path.join(
        UPLOAD_DIR,
        filename_a
    )

    path_b = os.path.join(
        UPLOAD_DIR,
        filename_b
    )

    with open(
        path_a,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            contract_a.file,
            buffer
        )

    with open(
        path_b,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            contract_b.file,
            buffer
        )

    try:

        result_a = analyze_contract(
            path_a
        )

        result_b = analyze_contract(
            path_b
        )

        comparison = compare_contracts(
            result_a,
            result_b
        )

    finally:

        if os.path.exists(path_a):
            os.remove(path_a)

        if os.path.exists(path_b):
            os.remove(path_b)

    return {

        "contract_a":
            result_a["file_name"],

        "contract_b":
            result_b["file_name"],

        "comparison":
            comparison
    }