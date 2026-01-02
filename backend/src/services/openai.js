import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

// Lazy-init client so the server can boot without a key; routes will still error if key is missing.
const client = apiKey ? new OpenAI({ apiKey }) : null;

export async function generateEmbedding(text) {
  if (!apiKey || !client) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  const input = (text || "").toString();
  const { data } = await client.embeddings.create({ model: embeddingModel, input });
  const [first] = data;
  if (!first?.embedding) throw new Error("No embedding returned from OpenAI");
  return first.embedding;
}
