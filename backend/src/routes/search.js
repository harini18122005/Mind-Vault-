import { Router } from "express";
import { searchNotes } from "../config/mockDb.js";

const router = Router();

// Search notes
router.post("/", async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.body || {};
    if (!query) return res.status(400).json({ error: "query is required" });

    // Use text-based search
    let results = searchNotes(query);
    results = results.slice(0, limit || 10);

    res.json({
      query,
      count: results.length,
      data: results,
      note: "Using text-based search",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
