import hashlib


def generate_sha256(file_content: bytes) -> str:
    """Generate SHA-256 hash for file content."""

    return hashlib.sha256(file_content).hexdigest()