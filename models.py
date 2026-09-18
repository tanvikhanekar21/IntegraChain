from pydantic import BaseModel


class BlockchainBlock(BaseModel):
    block_index: int
    document_id: str
    timestamp: str
    file_name: str
    file_hash: str
    previous_hash: str
    current_hash: str


class BlockchainValidationResponse(BaseModel):
    valid: bool
    message: str