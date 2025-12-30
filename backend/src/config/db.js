import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "mindvault";

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

let client;
let db;

export async function connectDb() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function getCollection(name) {
  const database = await connectDb();
  return database.collection(name);
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
