import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const client = new OpenAI({ apiKey });

export async function generateEmbedding(text) {
  const input = (text || "").toString();
  const { data } = await client.embeddings.create({ model: embeddingModel, input });
  const [first] = data;
  if (!first?.embedding) throw new Error("No embedding returned from OpenAI");
  return first.embedding;
}
