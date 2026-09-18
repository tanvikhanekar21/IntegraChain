// ==========================================
// API CONFIGURATION
// ==========================================

// Use the backend serving this page, with a local fallback when opened directly.
const API_BASE_URL = window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : window.location.origin;



// ==========================================
// UPLOAD FILE NAME DISPLAY
// ==========================================

const uploadFileInput =
    document.getElementById("uploadFile");

const selectedFileText =
    document.getElementById("selectedFile");


if (uploadFileInput && selectedFileText) {

    uploadFileInput.addEventListener(
        "change",
        function () {

            if (this.files.length > 0) {

                selectedFileText.textContent =
                    "Selected: " + this.files[0].name;

            }

        }
    );

}



// ==========================================
// VERIFY FILE NAME DISPLAY
// ==========================================

const verifyFileInput =
    document.getElementById("verifyFile");

const verifySelectedFile =
    document.getElementById("verifySelectedFile");


if (verifyFileInput && verifySelectedFile) {

    verifyFileInput.addEventListener(
        "change",
        function () {

            if (this.files.length > 0) {

                verifySelectedFile.textContent =
                    "Selected: " + this.files[0].name;

            }

        }
    );

}



// ==========================================
// UPLOAD DOCUMENT
// ==========================================

const uploadForm =
    document.getElementById("uploadForm");


if (uploadForm) {

    uploadForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const file =
                document.getElementById("uploadFile").files[0];

            const resultContainer =
                document.getElementById("uploadResult");


            if (!file) {

                resultContainer.innerHTML = `
                    <div class="result-card not-found">
                        <h2>Please select a file.</h2>
                    </div>
                `;

                return;
            }


            const formData = new FormData();

            formData.append("file", file);


            resultContainer.innerHTML = `
                <div class="result-card">
                    <h2>Processing Document...</h2>
                    <p>
                        Generating SHA-256 hash and creating blockchain record.
                    </p>
                </div>
            `;


            try {

                const response = await fetch(
                    `${API_BASE_URL}/upload`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail || "Upload failed."
                    );

                }


                resultContainer.innerHTML = `

                    <div class="result-card success">

                        <div class="result-label">
                            DOCUMENT REGISTERED
                        </div>

                        <p>${data.message}</p>

                        <div class="hash-box">
                            <strong>Document ID:</strong><br>
                            ${data.document_id}
                        </div>

                        <div class="hash-box">
                            <strong>SHA-256 Hash:</strong><br>
                            ${data.file_hash}
                        </div>

                        <div class="hash-box">
                            <strong>Block Number:</strong><br>
                            ${data.block_index}
                        </div>

                        <div class="hash-box">
                            <strong>Registered At:</strong><br>
                            ${data.timestamp}
                        </div>

                        <br>

                        <a
                            class="btn primary"
                            href="${API_BASE_URL}/qr/${data.document_id}"
                            target="_blank"
                        >
                            View QR Code
                        </a>

                    </div>

                `;


            } catch (error) {

                resultContainer.innerHTML = `

                    <div class="result-card tampered">

                        <h2>Upload Failed</h2>

                        <p>${error.message}</p>

                    </div>

                `;

            }

        }
    );

}



// ==========================================
// VERIFY DOCUMENT
// ==========================================

const verifyForm =
    document.getElementById("verifyForm");


if (verifyForm) {

    verifyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const file =
                document.getElementById("verifyFile").files[0];


            const resultContainer =
                document.getElementById("verifyResult");


            if (!file) {

                return;

            }


            const formData = new FormData();

            formData.append("file", file);


            resultContainer.innerHTML = `

                <div class="result-card">

                    <h2>Verifying Document...</h2>

                    <p>
                        Comparing the SHA-256 fingerprint with blockchain records.
                    </p>

                </div>

            `;


            try {

                const response = await fetch(
                    `${API_BASE_URL}/verify`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail || "Verification failed."
                    );

                }


                let resultClass = "not-found";

                let title = data.status;


                if (data.status === "VERIFIED") {

                    resultClass = "verified";

                    title = "✓ VERIFIED";

                }


                if (data.status === "TAMPERED") {

                    resultClass = "tampered";

                    title = "⚠ TAMPERED";

                }


                if (data.status === "NOT FOUND") {

                    resultClass = "not-found";

                    title = "NOT FOUND";

                }


                let extraInformation = "";


                if (data.file_hash) {

                    extraInformation += `

                        <div class="hash-box">

                            <strong>File Hash:</strong><br>

                            ${data.file_hash}

                        </div>

                    `;

                }


                if (data.original_hash) {

                    extraInformation += `

                        <div class="hash-box">

                            <strong>Original Hash:</strong><br>

                            ${data.original_hash}

                        </div>

                    `;

                }


                if (data.current_hash) {

                    extraInformation += `

                        <div class="hash-box">

                            <strong>Current Hash:</strong><br>

                            ${data.current_hash}

                        </div>

                    `;

                }


                resultContainer.innerHTML = `

                    <div class="result-card ${resultClass}">

                        <div class="result-label">
                            ${title}
                        </div>

                        <p>${data.message}</p>

                        ${extraInformation}

                    </div>

                `;


            } catch (error) {

                resultContainer.innerHTML = `

                    <div class="result-card tampered">

                        <h2>Verification Failed</h2>

                        <p>${error.message}</p>

                    </div>

                `;

            }

        }
    );

}



// ==========================================
// LOAD BLOCKCHAIN
// ==========================================

async function loadBlockchain() {

    const container =
        document.getElementById("blockchainContainer");


    if (!container) return;


    container.innerHTML = `
        <div class="loading">
            Loading blockchain records...
        </div>
    `;


    try {

        const response = await fetch(
            `${API_BASE_URL}/blockchain`
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                "Could not load blockchain."
            );

        }


        if (data.blocks.length === 0) {

            container.innerHTML = `

                <div class="result-card">

                    <h2>No Blocks Found</h2>

                    <p>
                        Register a document to create the first blockchain block.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        data.blocks.forEach(function (block) {

            const blockCard =
                document.createElement("div");


            blockCard.className = "block-card";


            blockCard.innerHTML = `

                <div class="block-header">

                    <strong>
                        BLOCK #${block.block_index}
                    </strong>

                    <span>
                        ${block.timestamp}
                    </span>

                </div>


                <div class="block-body">

                    <div class="block-row">

                        <div class="block-label">
                            Document
                        </div>

                        <div class="block-value">
                            ${block.file_name}
                        </div>

                    </div>


                    <div class="block-row">

                        <div class="block-label">
                            Document ID
                        </div>

                        <div class="block-value hash-value">
                            ${block.document_id}
                        </div>

                    </div>


                    <div class="block-row">

                        <div class="block-label">
                            File SHA-256 Hash
                        </div>

                        <div class="block-value hash-value">
                            ${block.file_hash}
                        </div>

                    </div>


                    <div class="block-row">

                        <div class="block-label">
                            Previous Hash
                        </div>

                        <div class="block-value hash-value">
                            ${block.previous_hash}
                        </div>

                    </div>


                    <div class="block-row">

                        <div class="block-label">
                            Current Block Hash
                        </div>

                        <div class="block-value hash-value">
                            ${block.current_hash}
                        </div>

                    </div>

                </div>

            `;


            container.appendChild(blockCard);

        });


    } catch (error) {

        container.innerHTML = `

            <div class="result-card tampered">

                <h2>Unable to Load Blockchain</h2>

                <p>${error.message}</p>

            </div>

        `;

    }

}



// ==========================================
// VALIDATE BLOCKCHAIN
// ==========================================

async function validateBlockchain() {

    const resultContainer =
        document.getElementById("validationResult");


    if (!resultContainer) return;


    resultContainer.innerHTML = `

        <div class="result-card">

            <h2>Validating Blockchain...</h2>

            <p>
                Checking hashes and block connections.
            </p>

        </div>

    `;


    try {

        const response = await fetch(
            `${API_BASE_URL}/validate-blockchain`
        );


        const data = await response.json();


        const resultClass =
            data.valid ? "verified" : "tampered";


        const title =
            data.valid
                ? "✓ BLOCKCHAIN VALID"
                : "⚠ BLOCKCHAIN INVALID";


        resultContainer.innerHTML = `

            <div class="result-card ${resultClass}">

                <div class="result-label">
                    ${title}
                </div>

                <p>${data.message}</p>

            </div>

        `;


    } catch (error) {

        resultContainer.innerHTML = `

            <div class="result-card tampered">

                <h2>Validation Failed</h2>

                <p>${error.message}</p>

            </div>

        `;

    }

}



// ==========================================
// AUTOMATICALLY LOAD BLOCKCHAIN
// ==========================================

if (document.getElementById("blockchainContainer")) {

    loadBlockchain();

}