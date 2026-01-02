import { Router } from "express";
import { getAllNotes, createNote } from "../config/mockDb.js";
import { generateEmbedding } from "../services/openai.js";

const router = Router();

// List notes
router.get("/", async (_req, res, next) => {
  try {
    const notes = getAllNotes();
    res.json({ data: notes });
  } catch (err) {
    next(err);
  }
});

// Create note
router.post("/", async (req, res, next) => {
  try {
    const { title, content, tags = [] } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    // Generate embedding for semantic search (optional - skip if OpenAI unavailable)
    let embedding = null;
    try {
      embedding = await generateEmbedding(content);
    } catch (embErr) {
      console.warn("Embedding generation failed (likely quota issue), saving note without embedding:", embErr.message);
    }

    const doc = {
      title: String(title).trim(),
      content: String(content).trim(),
      tags: Array.isArray(tags) ? tags.map(String) : [],
      ...(embedding && { embedding }),
    };

    const note = createNote(doc);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

export default router;
