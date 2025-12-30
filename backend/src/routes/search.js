import { Router } from "express";
import { getCollection } from "../config/db.js";

const router = Router();

// Placeholder search using simple text matching; will be replaced with vector search
router.post("/", async (req, res, next) => {
  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: "query is required" });

    const notesCol = await getCollection("notes");
    const results = await notesCol
      .find({ content: { $regex: query, $options: "i" } }, {
        projection: { title: 1, content: 1, tags: 1, createdAt: 1 },
      })
      .limit(10)
      .toArray();

    res.json({ query, count: results.length, data: results, note: "vector search coming next" });
  } catch (err) {
    next(err);
  }
});

export default router;
