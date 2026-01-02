import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFilePath = path.join(__dirname, "../../data/notes.json");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let notesData = [];

// Load notes from file on startup
export function loadNotes() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const data = fs.readFileSync(dbFilePath, "utf-8");
      notesData = JSON.parse(data);
    } else {
      notesData = [];
    }
  } catch (err) {
    console.error("Error loading notes:", err.message);
    notesData = [];
  }
}

// Save notes to file
function saveNotes() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(notesData, null, 2));
  } catch (err) {
    console.error("Error saving notes:", err.message);
  }
}

export function createNote(noteData) {
  const note = {
    _id: Math.random().toString(36).substr(2, 9),
    ...noteData,
    createdAt: new Date().toISOString(),
  };
  notesData.push(note);
  saveNotes();
  return note;
}

export function getAllNotes() {
  return notesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function searchNotes(query) {
  const lowerQuery = query.toLowerCase();
  return notesData.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
  );
}

// Load notes when module is imported
loadNotes();
