import { Router } from "express";
import { getCollection } from "../config/db.js";
import { generateEmbedding } from "../services/openai.js";

const router = Router();
const indexName = process.env.VECTOR_INDEX_NAME || "notes_vector_index";

// Vector search powered by MongoDB Atlas Vector Search
router.post("/", async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.body || {};
    if (!query) return res.status(400).json({ error: "query is required" });

    let embedding;
    try {
      embedding = await generateEmbedding(query);
    } catch (embErr) {
      console.warn("Embedding generation failed, using regex fallback:", embErr.message);
      // Fall through to regex search below
    }
    const notesCol = await getCollection("notes");

    // If no embedding, skip vector search and use regex directly
    if (!embedding) {
      const fallback = await notesCol
        .find({ content: { $regex: query, $options: "i" } }, {
          projection: { title: 1, content: 1, tags: 1, createdAt: 1 },
        })
        .limit(Number(limit) || 10)
        .toArray();

      return res.json({
        query,
        count: fallback.length,
        data: fallback,
        note: "OpenAI quota exceeded; used regex search fallback",
      });
    }

    // Use $vectorSearch; if not available (local Mongo), fall back to regex search
    const pipeline = [
      {
        $vectorSearch: {
          index: indexName,
          path: "embedding",
          queryVector: embedding,
          numCandidates: Math.max(50, Number(limit) * 5 || 50),
          limit: Number(limit) || 10,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          tags: 1,
          createdAt: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    let results;
    try {
      results = await notesCol.aggregate(pipeline).toArray();
    } catch (vectorErr) {
      // Fallback for non-Atlas local dev: regex search
      const fallback = await notesCol
        .find({ content: { $regex: query, $options: "i" } }, {
          projection: { title: 1, content: 1, tags: 1, createdAt: 1 },
        })
        .limit(Number(limit) || 10)
        .toArray();

      return res.json({
        query,
        count: fallback.length,
        data: fallback,
        note: "Vector search unavailable (likely local dev); used regex fallback",
        error: vectorErr.message,
      });
    }

    res.json({ query, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
});

export default router;
