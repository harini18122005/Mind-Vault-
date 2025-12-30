import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
import searchRouter from "./routes/search.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mindvault-backend" });
});

// API routes
app.use("/api/notes", notesRouter);
app.use("/api/search", searchRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`MindVault backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
