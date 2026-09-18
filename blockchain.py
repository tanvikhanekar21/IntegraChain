import hashlib

from datetime import datetime
from uuid import uuid4

from app.database import get_connection


class Blockchain:

    def calculate_block_hash(
        self,
        block_index,
        document_id,
        timestamp,
        file_name,
        file_hash,
        previous_hash
    ):
        """Generate SHA-256 hash for a blockchain block."""

        block_data = (
            f"{block_index}"
            f"{document_id}"
            f"{timestamp}"
            f"{file_name}"
            f"{file_hash}"
            f"{previous_hash}"
        )

        return hashlib.sha256(
            block_data.encode("utf-8")
        ).hexdigest()


    def get_last_block(self):
        """Return the latest block."""

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT * FROM blockchain
            ORDER BY block_index DESC
            LIMIT 1
        """)

        block = cursor.fetchone()

        connection.close()

        return dict(block) if block else None


    def add_block(self, file_name, file_hash):
        """Create and store a new blockchain block."""

        last_block = self.get_last_block()

        if last_block is None:
            block_index = 0
            previous_hash = "0"
        else:
            block_index = last_block["block_index"] + 1
            previous_hash = last_block["current_hash"]

        document_id = str(uuid4())

        timestamp = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        current_hash = self.calculate_block_hash(
            block_index,
            document_id,
            timestamp,
            file_name,
            file_hash,
            previous_hash
        )

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO blockchain (
                block_index,
                document_id,
                timestamp,
                file_name,
                file_hash,
                previous_hash,
                current_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            block_index,
            document_id,
            timestamp,
            file_name,
            file_hash,
            previous_hash,
            current_hash
        ))

        connection.commit()
        connection.close()

        return {
            "block_index": block_index,
            "document_id": document_id,
            "timestamp": timestamp,
            "file_name": file_name,
            "file_hash": file_hash,
            "previous_hash": previous_hash,
            "current_hash": current_hash
        }


    def get_all_blocks(self):
        """Return all blockchain blocks."""

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                block_index,
                document_id,
                timestamp,
                file_name,
                file_hash,
                previous_hash,
                current_hash
            FROM blockchain
            ORDER BY block_index ASC
        """)

        rows = cursor.fetchall()

        connection.close()

        return [dict(row) for row in rows]


    def find_by_hash(self, file_hash):
        """Find document using its SHA-256 hash."""

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT * FROM blockchain
            WHERE file_hash = ?
            LIMIT 1
        """, (file_hash,))

        row = cursor.fetchone()

        connection.close()

        return dict(row) if row else None


    def find_by_filename(self, file_name):
        """Find the latest document record using filename."""

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT * FROM blockchain
            WHERE file_name = ?
            ORDER BY block_index DESC
            LIMIT 1
        """, (file_name,))

        row = cursor.fetchone()

        connection.close()

        return dict(row) if row else None


    def find_by_document_id(self, document_id):
        """Find document using document ID."""

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT * FROM blockchain
            WHERE document_id = ?
            LIMIT 1
        """, (document_id,))

        row = cursor.fetchone()

        connection.close()

        return dict(row) if row else None


    def validate_chain(self):
        """Validate all blockchain blocks."""

        blocks = self.get_all_blocks()

        if not blocks:
            return {
                "valid": True,
                "message": "Blockchain is empty but valid."
            }

        for index, block in enumerate(blocks):

            calculated_hash = self.calculate_block_hash(
                block["block_index"],
                block["document_id"],
                block["timestamp"],
                block["file_name"],
                block["file_hash"],
                block["previous_hash"]
            )

            if calculated_hash != block["current_hash"]:
                return {
                    "valid": False,
                    "message": (
                        f"Tampering detected in block "
                        f"{block['block_index']}."
                    )
                }

            if index == 0:

                if block["previous_hash"] != "0":
                    return {
                        "valid": False,
                        "message": "Genesis block is invalid."
                    }

            else:

                previous_block = blocks[index - 1]

                if (
                    block["previous_hash"]
                    != previous_block["current_hash"]
                ):
                    return {
                        "valid": False,
                        "message": (
                            f"Blockchain connection broken "
                            f"at block {block['block_index']}."
                        )
                    }

        return {
            "valid": True,
            "message": "Blockchain is valid. No tampering detected."
        }