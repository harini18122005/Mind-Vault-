import { Router } from "express";
import { getCollection } from "../config/db.js";

const router = Router();

// List notes
router.get("/", async (_req, res, next) => {
  try {
    const notesCol = await getCollection("notes");
    const notes = await notesCol
      .find({}, { projection: { title: 1, content: 1, tags: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();
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

    const doc = {
      title: String(title).trim(),
      content: String(content).trim(),
      tags: Array.isArray(tags) ? tags.map(String) : [],
      embedding: null, // to be filled after OpenAI integration
      createdAt: new Date(),
    };

    const notesCol = await getCollection("notes");
    const result = await notesCol.insertOne(doc);
    res.status(201).json({ id: result.insertedId, ...doc });
  } catch (err) {
    next(err);
  }
});

export default router;
