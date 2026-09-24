<div align="center">

# 🔐 IntegraChain

### Blockchain-Powered Digital Document Integrity & Verification System

**Verify • Detect • Protect**

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SHA-256](https://img.shields.io/badge/SHA--256-Cryptographic_Hashing-6C3483?style=for-the-badge)](https://en.wikipedia.org/wiki/SHA-2)
[![Blockchain](https://img.shields.io/badge/Blockchain-Integrity-121212?style=for-the-badge)](https://en.wikipedia.org/wiki/Blockchain)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/)

</div>

---

## 📌 Introduction

**IntegraChain** is a cybersecurity web application designed to verify the integrity of digital documents using **SHA-256 cryptographic hashing** and **blockchain technology**.

It helps identify whether a document has been modified after its original integrity record was created.

---

## 🌐 Overview

IntegraChain generates a unique **cryptographic fingerprint** for every document.

The generated hash is associated with an integrity record. During verification, the document is hashed again and the new hash is compared with the stored value.

```text
Document → SHA-256 → Integrity Record → Verification → Result
```

This provides a simple approach to **document integrity verification and tamper detection**.

---

## 🎯 Objectives

| Objective | Description |
|-----------|-------------|
| 🔐 **Data Integrity** | Protect the integrity of digital documents |
| 🔎 **Verification** | Verify documents using cryptographic hashes |
| ⚠️ **Tamper Detection** | Identify changes made to document contents |
| ⛓️ **Blockchain Records** | Maintain tamper-evident integrity information |
| 🌐 **Web Interface** | Provide a simple and accessible verification system |

---

## ⚙️ How IntegraChain Works

The application follows a straightforward verification process:

**01** → 📄 **Upload Document**  
The user uploads a digital document.

**02** → 🔐 **Generate Hash**  
IntegraChain generates a SHA-256 hash from the document.

**03** → ⛓️ **Record Integrity**  
The document's integrity information is recorded.

**04** → 🔎 **Verify Document**  
The user uploads the document again when verification is required.

**05** → ⚖️ **Compare Hashes**  
The newly generated hash is compared with the stored hash.

**06** → ✅ / ⚠️ **Verification Result**

```text
                    📄 Document
                         │
                         ▼
                  🔐 SHA-256 Hash
                         │
                         ▼
                ⛓️ Integrity Record
                         │
                         ▼
                🔎 Verification
                         │
                  ┌──────┴──────┐
                  ▼             ▼
              Same Hash     Different Hash
                  │             │
                  ▼             ▼
              ✅ VERIFIED    ⚠️ MODIFIED
```

---

## 🏗️ Project Architecture

```text
┌─────────────────────────────────┐
│          👤 USER / CLIENT       │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│        🌐 WEB APPLICATION       │
│           FRONTEND UI           │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         🐍 PYTHON BACKEND       │
│             FASTAPI             │
└────────────────┬────────────────┘
                 │
          ┌──────┴──────┐
          ▼             ▼
┌────────────────┐ ┌─────────────────┐
│ 🔐 SHA-256     │ │ ⛓️ BLOCKCHAIN   │
│    HASHING     │ │    RECORDS      │
└────────────────┘ └────────┬────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ 🔎 VERIFICATION  │
                  └──────────────────┘
```

---

## 🔄 System Workflow

```text
        📄 DOCUMENT UPLOAD
                │
                ▼
       🔐 SHA-256 HASHING
                │
                ▼
      ⛓️ INTEGRITY RECORD
                │
                ▼
       🔎 DOCUMENT VERIFY
                │
                ▼
         ⚖️ HASH COMPARE
                │
          ┌─────┴─────┐
          ▼           ▼
       MATCH       DIFFERENT
          │           │
          ▼           ▼
    ✅ VERIFIED   ⚠️ MODIFIED
```

---

## 🛡️ Security Approach

IntegraChain uses **cryptographic hashing** to create a unique representation of document contents.

The SHA-256 hash acts as a digital fingerprint. If even a small part of the document changes, its resulting hash will change.

The system compares the newly generated hash with the previously stored integrity record to identify possible modifications.

> **Same Hash = Content Integrity Maintained**  
> **Different Hash = Possible Modification Detected**

---

## 🧩 Core Technologies

| Technology | Role |
|------------|------|
| 🐍 **Python** | Backend application logic |
| ⚡ **FastAPI** | REST API and backend framework |
| 🔐 **SHA-256** | Cryptographic document hashing |
| ⛓️ **Blockchain** | Integrity record management |
| 🌐 **HTML / CSS / JavaScript** | Frontend interface |
| 🗄️ **SQLite** | Data storage |
| 🚀 **Uvicorn** | Application server |
| 🐙 **GitHub** | Version control & collaboration |

---

## 🎯 Project Goal

The goal of **IntegraChain** is to demonstrate how **cryptographic hashing and blockchain concepts** can be combined to create a practical system for:

- Digital document integrity
- Document verification
- Tamper detection
- Secure integrity records

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/tanvikhanekar21/IntegraChain.git
cd IntegraChain
```

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
```

### 3️⃣ Activate the Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 4️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 5️⃣ Start the Application

```bash
uvicorn main:app --reload
```

Open the local URL displayed by Uvicorn in your browser.

---

## 🧪 Example Use Case

Imagine an important digital document that needs to be verified.

```text
📄 Original Document
        │
        ▼
   🔐 SHA-256 Hash
        │
        ▼
⛓️ Integrity Record
        │
        ▼
📄 Document Submitted Again
        │
        ▼
   🔐 New SHA-256 Hash
        │
        ▼
      ⚖️ Compare
       /       \
      /         \
   MATCH      DIFFERENT
     │             │
     ▼             ▼
 ✅ VERIFIED   ⚠️ MODIFIED
```

A matching hash indicates that the document content has remained unchanged.

A different hash indicates that the document may have been modified.

---

## 🔐 Security Concepts

IntegraChain demonstrates practical cybersecurity concepts including:

- 🔐 **Cryptographic Hashing**
- 🛡️ **Data Integrity**
- ⛓️ **Blockchain Technology**
- 🔎 **Document Verification**
- ⚠️ **Tamper Detection**
- 🔒 **Secure Record Keeping**

---

## 🎓 Project Purpose

IntegraChain was developed as an academic **BSc Cyber Security project** to demonstrate the practical application of:

**Cybersecurity • Cryptography • Blockchain • Web Development • API Development**

The project provides a practical example of using modern security concepts to address digital document integrity challenges.

---

## 🔮 Future Enhancements

The project can be extended with:

- 👤 User authentication & authorization
- ☁️ Cloud storage integration
- 📊 Document verification history
- 🔗 Public verification links
- 🔔 Real-time tampering alerts
- 🧾 Digital signatures
- 📱 Enhanced mobile responsiveness
- 🌐 Production-ready backend deployment

---

## ⚠️ Disclaimer

> **IntegraChain is an academic project developed for educational, learning, and demonstration purposes.**

The application should undergo additional security testing, validation, and hardening before being used with sensitive documents or in a production environment.

---

## 👩‍💻 Project Team

### BSc Cyber Security Academic Project

| Team Member |
|-------------|
| **Tanvi Khanekar**❤️ |
| **Gauri Somwanshi**❤️ |

---

## 📜 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for complete details.

---

## ⭐ Support

If you find **IntegraChain** useful or interesting:

⭐ **Star** the repository  
🍴 **Fork** the project  
💡 **Suggest** improvements  
🐛 **Report** issues

---

<div align="center">

## 🔐 IntegraChain

### **Verify. Detect. Protect.**

**Built with ❤️ for Cybersecurity**

</div>
