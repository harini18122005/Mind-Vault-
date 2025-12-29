# 🧠 MindVault

> AI-powered semantic note-taking app that understands the meaning behind your thoughts

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![OpenAI](https://img.shields.io/badge/OpenAI-Embeddings-blue?logo=openai)](https://openai.com/)

---

## 📌 What is MindVault?

A smart note-taking app that uses **AI embeddings** and **vector search** to find notes by meaning. Search "peaceful evening memories" and find notes about "sunset at the beach" — even with zero matching words.

---

## ✨ Features

- ✍️ Create & save personal notes
- 🧠 AI-powered semantic search
- ⚡ Instant relevant results
- 🏷️ Auto-generated tags (optional)

---

## 🧱 Tech Stack

**Frontend:** Next.js 15 + React + Tailwind CSS  
**Backend:** Node.js + Express.js + OpenAI API  
**Database:** MongoDB Atlas with Vector Search

---

## 💡 How It Works

1. **Add Note** → OpenAI converts to vector → Store in MongoDB
2. **Search** → Query to vector → Find similar notes → Return results

---

## 📁 Structure

```
mindvault/
├── frontend/    # Next.js app
├── backend/     # Express server
└── README.md
```

---

## 🚀 Quick Start

```bash
# Clone and install
git clone <repo-url> && cd mindvault
cd backend && npm install
cd ../frontend && npm install

# Configure environment
# Create backend/.env with MONGODB_URI and OPENAI_API_KEY
# Create frontend/.env.local with NEXT_PUBLIC_API_URL

# Run
cd backend && npm start        # Terminal 1
cd frontend && npm run dev     # Terminal 2
```

Visit `http://localhost:3000`

---

## 🎯 Hackathon Details

**Track:** JavaScript/TypeScript (Next.js + Node.js)  
**Category:** Productivity / AI

## 📄 License

MIT

---

✨ **Built with AI, designed for humans** ✨

*Transform simple notes into meaningful knowledge*
