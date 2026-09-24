from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.database import initialize_database
from app.blockchain import Blockchain
from app.hashing import generate_sha256

from app.utils import (
    is_allowed_file,
    sanitize_filename,
    save_uploaded_file,
    generate_qr_code
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # FastAPI startup/shutdown event handlers are deprecated; use lifespan
    # context manager instead of @app.on_event(...).
    initialize_database()
    try:
        yield
    finally:
        # Keep the app lifecycle explicit and future-proof.
        pass


app = FastAPI(
    title="Blockchain-Based Data Integrity and Document Verification System",
    description="Cybersecurity project using SHA-256, SQLite and Custom Blockchain",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"
app.mount(
    "/css",
    StaticFiles(directory=FRONTEND_DIR / "css"),
    name="css"
)
app.mount(
    "/js",
    StaticFiles(directory=FRONTEND_DIR / "js"),
    name="js"
)


blockchain = Blockchain()

MAX_FILE_SIZE = 10 * 1024 * 1024


@app.get("/")
def home():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/upload.html")
def upload_page():
    return FileResponse(FRONTEND_DIR / "upload.html")


@app.get("/verify.html")
def verify_page():
    return FileResponse(FRONTEND_DIR / "verify.html")


@app.get("/blockchain.html")
def blockchain_page():
    return FileResponse(FRONTEND_DIR / "blockchain.html")


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a file."
        )

    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed: PDF, TXT, JPG, JPEG, PNG."
            )
        )

    file_content = await file.read()

    if len(file_content) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 10 MB."
        )

    safe_filename = sanitize_filename(file.filename)

    file_hash = generate_sha256(file_content)

    existing_document = blockchain.find_by_hash(file_hash)

    if existing_document:

        return {
            "success": True,
            "already_registered": True,
            "message": "This exact file is already registered.",
            "document_id": existing_document["document_id"],
            "block_index": existing_document["block_index"],
            "file_name": existing_document["file_name"],
            "file_hash": existing_document["file_hash"],
            "timestamp": existing_document["timestamp"]
        }

    save_uploaded_file(
        file_content,
        safe_filename
    )

    block = blockchain.add_block(
        safe_filename,
        file_hash
    )

    return {
        "success": True,
        "already_registered": False,
        "message": "File successfully registered in blockchain.",
        **block
    }


@app.post("/verify")
async def verify_file(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a file."
        )

    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type."
        )

    file_content = await file.read()

    if len(file_content) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    safe_filename = sanitize_filename(file.filename)

    current_hash = generate_sha256(file_content)

    exact_match = blockchain.find_by_hash(current_hash)

    if exact_match:

        return {
            "status": "VERIFIED",
            "message": (
                "The file is original and has not been modified."
            ),
            "document_id": exact_match["document_id"],
            "file_name": exact_match["file_name"],
            "file_hash": current_hash,
            "timestamp": exact_match["timestamp"]
        }

    filename_match = blockchain.find_by_filename(
        safe_filename
    )

    if filename_match:

        return {
            "status": "TAMPERED",
            "message": (
                "The file does not match the original record "
                "and may have been modified."
            ),
            "file_name": safe_filename,
            "original_hash": filename_match["file_hash"],
            "current_hash": current_hash
        }

    return {
        "status": "NOT FOUND",
        "message": (
            "No record of this file exists in the blockchain."
        ),
        "file_name": safe_filename
    }


@app.get("/blockchain")
def get_blockchain():

    blocks = blockchain.get_all_blocks()

    return {
        "total_blocks": len(blocks),
        "blocks": blocks
    }


@app.get("/validate-blockchain")
def validate_blockchain():

    return blockchain.validate_chain()


@app.get("/qr/{document_id}")
def get_qr(document_id: str):

    document = blockchain.find_by_document_id(
        document_id
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    qr_path = generate_qr_code(document_id)

    return FileResponse(
        qr_path,
        media_type="image/png",
        filename=f"{document_id}.png"
    )