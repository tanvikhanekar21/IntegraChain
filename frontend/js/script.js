// ==========================================
// API CONFIGURATION (unchanged)
// ==========================================

// Use the backend serving this page, with a local fallback when opened directly.
const API_BASE_URL = window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : window.location.origin;


// ==========================================
// SAFE DOM HELPERS (no server strings in innerHTML)
// ==========================================

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
}

function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function shortHash(value) {
    const text = String(value);
    return text.length > 28 ? text.slice(0, 14) + "…" + text.slice(-10) : text;
}

function copyButton(value) {
    const btn = el("button", "copy-btn", "Copy");
    btn.type = "button";
    btn.setAttribute("aria-label", "Copy value to clipboard");
    btn.addEventListener("click", function () {
        navigator.clipboard.writeText(String(value)).then(function () {
            btn.textContent = "Copied";
        }).catch(function () {
            btn.textContent = "Copy failed";
        }).finally(function () {
            setTimeout(function () { btn.textContent = "Copy"; }, 1500);
        });
    });
    return btn;
}

function hashBox(label, value, copyable) {
    const box = el("div", "hash-box");
    const head = el("div", "hash-label");
    head.appendChild(el("span", "", label));
    if (copyable) head.appendChild(copyButton(value));
    box.appendChild(head);
    box.appendChild(el("div", "hash-text", value));
    return box;
}

function statusCard(className, icon, label, message, explain) {
    const card = el("div", "result-card " + className);
    const head = el("div", "result-head");
    const iconNode = el("span", "result-icon", icon);
    iconNode.setAttribute("aria-hidden", "true");
    head.appendChild(iconNode);
    head.appendChild(el("div", "result-label", label));
    card.appendChild(head);
    if (message) card.appendChild(el("p", "", message));
    if (explain) card.appendChild(el("p", "explain", explain));
    return card;
}

function showCard(container, card) {
    clearNode(container);
    container.appendChild(card);
}

function setBusy(button, busy, idleText, busyText) {
    if (!button) return;
    button.disabled = busy;
    clearNode(button);
    if (busy) {
        const spin = el("span", "spinner");
        spin.setAttribute("aria-hidden", "true");
        button.appendChild(spin);
        button.appendChild(document.createTextNode(busyText));
    } else {
        button.textContent = idleText;
    }
}


// ==========================================
// FILE PICKER (name display, drag & drop, clear)
// Keeps ids: uploadFile / selectedFile, verifyFile / verifySelectedFile
// ==========================================

function setupFilePicker(inputId, infoId) {
    const input = document.getElementById(inputId);
    const info = document.getElementById(infoId);
    if (!input || !info) return;

    function render() {
        clearNode(info);
        if (input.files.length === 0) return;

        const file = input.files[0];
        const ext = (file.name.split(".").pop() || "file").toUpperCase().slice(0, 4);

        const chip = el("div", "file-chip");
        chip.appendChild(el("div", "file-icon", ext));

        const meta = el("div", "file-meta");
        meta.appendChild(el("strong", "", file.name));
        meta.appendChild(el("span", "", (file.type || ext + " file") + " · " + formatSize(file.size)));
        chip.appendChild(meta);

        const remove = el("button", "btn outline sm", "Remove");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove selected file " + file.name);
        remove.addEventListener("click", function () {
            input.value = "";
            render();
        });
        chip.appendChild(remove);

        info.appendChild(chip);
    }

    input.addEventListener("change", render);

    const zone = input.closest(".upload-area");
    if (zone) {
        ["dragenter", "dragover"].forEach(function (name) {
            zone.addEventListener(name, function (event) {
                event.preventDefault();
                zone.classList.add("dragover");
            });
        });
        ["dragleave", "drop"].forEach(function (name) {
            zone.addEventListener(name, function (event) {
                event.preventDefault();
                zone.classList.remove("dragover");
            });
        });
        zone.addEventListener("drop", function (event) {
            if (event.dataTransfer && event.dataTransfer.files.length > 0) {
                input.files = event.dataTransfer.files;
                render();
            }
        });
    }
}

setupFilePicker("uploadFile", "selectedFile");
setupFilePicker("verifyFile", "verifySelectedFile");


// ==========================================
// UPLOAD DOCUMENT  (POST /upload, FormData "file")
// ==========================================

const uploadForm = document.getElementById("uploadForm");

if (uploadForm) {

    uploadForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const file = document.getElementById("uploadFile").files[0];
        const resultContainer = document.getElementById("uploadResult");
        const button = document.getElementById("uploadBtn");

        if (!file) {
            showCard(resultContainer, statusCard("not-found", "!", "No file selected", "Please select a file."));
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setBusy(button, true, "Register Document", "Processing Document...");
        showCard(resultContainer, statusCard(
            "", "…", "Processing Document...",
            "Generating SHA-256 hash and creating blockchain record."
        ));

        try {

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Upload failed.");
            }

            const card = statusCard("success", "✓", "DOCUMENT REGISTERED", data.message);
            card.appendChild(hashBox("Document ID", data.document_id, true));
            card.appendChild(hashBox("SHA-256 Hash", data.file_hash, true));
            card.appendChild(hashBox("Block Number", data.block_index, false));
            card.appendChild(hashBox("Registered At", data.timestamp, false));

            const qr = el("a", "btn primary", "View QR Code");
            qr.href = `${API_BASE_URL}/qr/${data.document_id}`;
            qr.target = "_blank";
            qr.rel = "noopener";
            card.appendChild(qr);

            showCard(resultContainer, card);

        } catch (error) {

            showCard(resultContainer, statusCard(
                "tampered", "✕", "Upload Failed", error.message
            ));

        } finally {

            setBusy(button, false, "Register Document", "");

        }
    });
}


// ==========================================
// VERIFY DOCUMENT  (POST /verify, FormData "file")
// ==========================================

const verifyForm = document.getElementById("verifyForm");

if (verifyForm) {

    verifyForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const file = document.getElementById("verifyFile").files[0];
        const resultContainer = document.getElementById("verifyResult");
        const button = document.getElementById("verifyBtn");

        if (!file) {
            showCard(resultContainer, statusCard("not-found", "!", "No file selected", "Please select a file to verify."));
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setBusy(button, true, "Verify Document", "Verifying Document...");
        showCard(resultContainer, statusCard(
            "", "…", "Verifying Document...",
            "Comparing the SHA-256 fingerprint with blockchain records."
        ));

        try {

            const response = await fetch(`${API_BASE_URL}/verify`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Verification failed.");
            }

            let resultClass = "not-found";
            let icon = "?";
            let title = data.status;
            let explain = "No registered record was found for this document.";

            if (data.status === "VERIFIED") {
                resultClass = "verified";
                icon = "✓";
                title = "VERIFIED";
                explain = "The current file matches the registered hash. It has not been modified.";
            } else if (data.status === "TAMPERED") {
                resultClass = "tampered";
                icon = "⚠";
                title = "TAMPERED";
                explain = "The current hash differs from the original hash. The file has been changed since registration.";
            } else if (data.status === "NOT FOUND") {
                title = "NOT FOUND";
            }

            const card = statusCard(resultClass, icon, title, data.message, explain);

            const currentHash = data.current_hash || data.file_hash;
            if (currentHash) card.appendChild(hashBox("Current Hash", currentHash, true));
            if (data.original_hash) card.appendChild(hashBox("Original Hash", data.original_hash, true));

            showCard(resultContainer, card);

        } catch (error) {

            showCard(resultContainer, statusCard(
                "tampered", "✕", "Verification Failed", error.message
            ));

        } finally {

            setBusy(button, false, "Verify Document", "");

        }
    });
}


// ==========================================
// BLOCKCHAIN EXPLORER
// ==========================================

let chainBlocks = [];

function setStat(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
}

function hashRow(label, value) {
    const row = el("div", "block-row");
    row.appendChild(el("div", "block-label", label));
    const val = el("div", "block-value hash-value", shortHash(value));
    val.title = String(value);
    row.appendChild(val);
    row.appendChild(copyButton(value));
    return row;
}

function textRow(label, value) {
    const row = el("div", "block-row");
    row.appendChild(el("div", "block-label", label));
    row.appendChild(el("div", "block-value", value));
    row.appendChild(document.createElement("span"));
    return row;
}

function renderBlocks() {
    const container = document.getElementById("blockchainContainer");
    if (!container) return;

    const searchInput = document.getElementById("blockSearch");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const visible = chainBlocks.filter(function (block) {
        if (!query) return true;
        return [block.file_name, block.document_id, block.file_hash, block.previous_hash, block.current_hash]
            .some(function (field) { return String(field).toLowerCase().includes(query); });
    });

    clearNode(container);

    if (chainBlocks.length === 0) {
        container.appendChild(statusCard(
            "", "⬡", "No Blocks Found",
            "Register a document to create the first blockchain block."
        ));
        return;
    }

    if (visible.length === 0) {
        container.appendChild(statusCard("not-found", "?", "No matching blocks", "Try a different file name, document ID or hash."));
        return;
    }

    visible.forEach(function (block) {

        const isGenesis = Number(block.block_index) === 0 || /^0+$/.test(String(block.previous_hash));
        const card = el("article", "block-card" + (isGenesis ? " genesis" : ""));

        const header = el("div", "block-header");
        header.appendChild(el("strong", "", isGenesis ? "Genesis Block" : "Block #" + block.block_index));
        header.appendChild(el("span", "", block.timestamp));
        card.appendChild(header);

        const body = el("div", "block-body");
        body.appendChild(textRow("Block #", block.block_index));
        body.appendChild(textRow("File Name", block.file_name));
        body.appendChild(hashRow("Document ID", block.document_id));
        body.appendChild(hashRow("File SHA-256 Hash", block.file_hash));
        body.appendChild(hashRow("Previous Hash", block.previous_hash));
        body.appendChild(hashRow("Current Block Hash", block.current_hash));
        card.appendChild(body);

        container.appendChild(card);
    });
}

async function loadBlockchain() {

    const container = document.getElementById("blockchainContainer");
    if (!container) return;

    clearNode(container);
    container.appendChild(el("div", "loading", "Loading blockchain records..."));

    try {

        const response = await fetch(`${API_BASE_URL}/blockchain`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Could not load blockchain.");
        }

        chainBlocks = data.blocks;

        const latest = chainBlocks.length > 0 ? chainBlocks[chainBlocks.length - 1] : null;
        const documents = new Set(chainBlocks.map(function (b) { return b.document_id; }).filter(Boolean));

        setStat("statBlocks", chainBlocks.length);
        setStat("statLatest", latest ? "#" + latest.block_index : "–");
        setStat("statDocs", documents.size);

        renderBlocks();

    } catch (error) {

        chainBlocks = [];
        clearNode(container);
        container.appendChild(statusCard("tampered", "✕", "Unable to Load Blockchain", error.message));

    }
}

async function validateBlockchain() {

    const resultContainer = document.getElementById("validationResult");
    if (!resultContainer) return;

    showCard(resultContainer, statusCard(
        "", "…", "Validating Blockchain...", "Checking hashes and block connections."
    ));

    try {

        const response = await fetch(`${API_BASE_URL}/validate-blockchain`);
        const data = await response.json();

        const card = statusCard(
            data.valid ? "verified" : "tampered",
            data.valid ? "✓" : "⚠",
            data.valid ? "BLOCKCHAIN VALID" : "BLOCKCHAIN INVALID",
            data.message
        );
        showCard(resultContainer, card);
        setStat("statStatus", data.valid ? "Valid" : "Invalid");

    } catch (error) {

        showCard(resultContainer, statusCard("tampered", "✕", "Validation Failed", error.message));

    }
}

const validateBtn = document.getElementById("validateBtn");
const refreshBtn = document.getElementById("refreshBtn");
const blockSearch = document.getElementById("blockSearch");

if (validateBtn) validateBtn.addEventListener("click", validateBlockchain);
if (refreshBtn) refreshBtn.addEventListener("click", loadBlockchain);
if (blockSearch) blockSearch.addEventListener("input", renderBlocks);


// ==========================================
// AUTOMATICALLY LOAD BLOCKCHAIN
// ==========================================

if (document.getElementById("blockchainContainer")) {
    loadBlockchain();
}
