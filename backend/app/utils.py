import os
import re
import uuid
from pathlib import Path

import qrcode


BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
QR_DIR = BASE_DIR / "qrcodes"


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png"
}


def ensure_directories():
    """Create required folders."""

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    QR_DIR.mkdir(parents=True, exist_ok=True)


def is_allowed_file(filename: str) -> bool:
    """Check whether the file extension is allowed."""

    extension = Path(filename).suffix.lower()

    return extension in ALLOWED_EXTENSIONS


def sanitize_filename(filename: str) -> str:
    """Remove unsafe characters from filename."""

    filename = os.path.basename(filename)

    return re.sub(
        r"[^a-zA-Z0-9._-]",
        "_",
        filename
    )


def save_uploaded_file(file_content: bytes, filename: str) -> str:
    """Save uploaded file with a unique filename."""

    ensure_directories()

    safe_name = sanitize_filename(filename)

    unique_name = f"{uuid.uuid4().hex}_{safe_name}"

    file_path = UPLOAD_DIR / unique_name

    with open(file_path, "wb") as file:
        file.write(file_content)

    return str(file_path)


def generate_qr_code(document_id: str) -> str:
    """Generate QR code containing document ID."""

    ensure_directories()

    qr_path = QR_DIR / f"{document_id}.png"

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4
    )

    qr.add_data(document_id)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    image.save(qr_path)

    return str(qr_path)