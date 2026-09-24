# 🔐 IntegraChain
### Blockchain-Powered Digital Document Integrity & Verification System

> **Verify. Detect. Protect.**  
> A lightweight cybersecurity system that combines **SHA-256 hashing** and **blockchain technology** to verify digital document integrity and detect unauthorized modifications.

---

## 📌 Overview

**IntegraChain** is a cybersecurity-focused web application designed to protect the integrity of digital documents.

Digital files can be modified after they are created or shared. IntegraChain addresses this problem by generating a unique **SHA-256 cryptographic hash** for a document and recording its integrity information on a blockchain.

When a document needs to be verified, the system calculates its hash again and compares it with the previously recorded blockchain data.

If the hashes match, the document is considered **unchanged**.

If the hashes are different, the system can identify that the document has been **modified or tampered with**.

---

## 🎯 Objectives

- 🔒 Protect digital document integrity
- 🔍 Detect unauthorized file modifications
- 🧾 Generate unique SHA-256 document fingerprints
- ⛓️ Store verification records using blockchain concepts
- ✅ Provide a simple document verification workflow
- 🛡️ Demonstrate practical cybersecurity concepts

---

## ⚙️ How IntegraChain Works

The system follows a simple verification process:

```text
             📄 Digital Document
                     │
                     ▼
              SHA-256 Hashing
                     │
                     ▼
            Unique File Hash
                     │
                     ▼
             Blockchain Record
                     │
                     ▼
              🔐 Verification
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Hash Matches          Hash Differs
          │                     │
          ▼                     ▼
    ✅ File Intact         ⚠️ Tampering
    / Verified             Detected

## 🧩 Key Features

### 🔐 SHA-256 Hashing

Generates a cryptographic fingerprint for every uploaded document.

### ⛓️ Blockchain-Based Integrity Records

Uses blockchain concepts to maintain a tamper-evident record of document information.

### 🔎 Document Verification

Allows users to verify whether a document matches its previously recorded integrity information.

### ⚠️ Tamper Detection

Detects changes by comparing the current file hash with the stored hash.

### 🌐 Web-Based Interface

Provides a simple interface for interacting with the document integrity system.

### 🛡️ Cybersecurity Focused

Demonstrates practical cybersecurity concepts including:

- 🔐 Cryptographic hashing
- 🛡️ Data integrity
- ⛓️ Blockchain
- 🔎 File verification
- ⚠️ Tamper detection
- 🔒 Secure record keeping

---

## 🏗️ Project Architecture

```text
┌───────────────────────────────┐
│          User / Client        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Web Application         │
│        / Frontend UI          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Backend / API          │
│           Python              │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌────────────────┐
│ SHA-256 Hash │  │   Blockchain   │
│  Generation  │  │ Integrity Data │
└──────────────┘  └────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Verification │
                  └──────────────┘
```

---

## 🔄 System Workflow

```text
       📄 Upload Document
                │
                ▼
        🔐 Generate SHA-256
                │
                ▼
       ⛓️ Store Integrity Data
                │
                ▼
          🔎 Verify Document
                │
        ┌───────┴────────┐
        ▼                ▼
   Hash Matches      Hash Differs
        │                │
        ▼                ▼
   ✅ Verified       ⚠️ Tampering
                       Detected
```

---

## 🛡️ Security Approach

IntegraChain uses cryptographic hashing and blockchain-based records to provide a mechanism for verifying whether a digital document has remained unchanged.

A document is processed using the **SHA-256 hashing algorithm**, producing a unique hash value that represents its content. During verification, the document is hashed again and the resulting value is compared with the previously stored integrity record.

```text
Original Document
       │
       ▼
   SHA-256 Hash
       │
       ▼
Blockchain Integrity Record
       │
       │
       ▼
Document Submitted for Verification
       │
       ▼
   SHA-256 Hash
       │
       ▼
    Compare
    /     \
   /       \
Same       Different
 │            │
 ▼            ▼
✅ Valid     ⚠️ Modified
```

---

## 💡 Core Technologies

| Technology | Purpose |
|------------|---------|
| 🐍 Python | Backend application logic |
| ⚡ FastAPI | REST API and backend framework |
| 🔐 SHA-256 | Cryptographic document hashing |
| ⛓️ Blockchain | Integrity record management |
| 🌐 HTML/CSS/JavaScript | Frontend interface |
| 🗄️ SQLite | Data storage |
| 🚀 Uvicorn | ASGI application server |
| 🐙 GitHub | Version control and collaboration |

---

## 🎯 Project Goal

The primary goal of **IntegraChain** is to demonstrate how cryptographic hashing and blockchain concepts can be combined to create a system for **digital document integrity verification and tamper detection**.

> **Verify. Detect. Protect. 🔐**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tanvikhanekar21/IntegraChain.git
cd IntegraChain
```

### 2. Create & Activate Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Application

```bash
uvicorn main:app --reload
```

Open the local URL displayed by Uvicorn in your browser.

---

## 🧪 Example Use Case

1. 📄 Upload a document.
2. 🔐 Generate its SHA-256 hash.
3. ⛓️ Store the integrity record.
4. 🔎 Upload the document again for verification.
5. Compare the new hash with the stored hash.

**Same hash → ✅ Document verified**

**Different hash → ⚠️ Possible modification detected**

---

## 🔐 Security Concepts

IntegraChain demonstrates:

- 🔐 SHA-256 cryptographic hashing
- 🛡️ Digital data integrity
- ⛓️ Blockchain-based records
- ⚠️ Tamper detection
- 🔎 Document verification

---

## 🎓 Project Purpose

IntegraChain is an academic **BSc Cyber Security project** demonstrating the practical use of blockchain and cryptographic hashing for digital document integrity and tamper detection.

---

## 🔮 Future Enhancements

- 👤 User authentication
- ☁️ Cloud storage integration
- 📊 Verification history
- 🔗 Public verification links
- 🔔 Tampering alerts
- 🧾 Digital signatures
- 📱 Improved mobile support
- 🌐 Production backend deployment

---

## ⚠️ Disclaimer

IntegraChain is developed for **academic, learning, and demonstration purposes**. Further security testing and hardening are recommended before production use.

---

## 👩‍💻 Project Team

**BSc Cyber Security Academic Project**

- **Tanvi Khanekar** ❤️
- **Gauri Somwanshi** ❤️

---

## 📜 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

## ⭐ Support

If you find IntegraChain useful:

⭐ Star the repository  
🍴 Fork the project  
💡 Suggest improvements  
🐛 Report issues
