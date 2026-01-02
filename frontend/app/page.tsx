"use client";

import { useState, useEffect } from "react";
import CreateNoteForm from "@/components/CreateNoteForm";
import SearchNotes from "@/components/SearchNotes";
import NotesList from "@/components/NotesList";
import { fetchNotes } from "@/lib/api";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load all notes on mount
  useEffect(() => {
    setMounted(true);
    loadAllNotes();
  }, []);

  const loadAllNotes = async () => {
    try {
      setLoadingNotes(true);
      const data = await fetchNotes();
      setNotes(data.data || []);
      setSearchResults(null);
      setHasSearched(false);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
    setSearchResults(null);
    setHasSearched(false);
  };

  const handleSearchResults = (result) => {
    setSearchResults(result);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setHasSearched(false);
  };

  const displayNotes = searchResults?.data || notes;
  const displayLoading = loadingNotes;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              🧠 MindVault
            </h1>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            🧠 MindVault
          </h1>
          <p className="text-gray-600 text-sm mt-1">Semantic note-taking powered by AI</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Form */}
          <aside className="lg:col-span-1">
            <CreateNoteForm onNoteCreated={handleNoteCreated} />
          </aside>

          {/* Main: Search & Notes */}
          <section className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <SearchNotes onResultsChange={handleSearchResults} />
            </div>

            {/* Search Results Info */}
            {hasSearched && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-green-800 font-semibold">
                    Found {searchResults?.count || 0} matching notes
                  </p>
                  {searchResults?.note && (
                    <p className="text-sm text-green-700 mt-1">{searchResults.note}</p>
                  )}
                </div>
                <button
                  onClick={handleClearSearch}
                  className="text-green-600 hover:text-green-800 font-semibold text-sm"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Notes List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {hasSearched ? "Search Results" : "All Notes"}
              </h2>
              <NotesList notes={displayNotes} isLoading={displayLoading} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="mb-2">✨ Built with AI, designed for humans</p>
          <p className="text-sm">Transform simple notes into meaningful knowledge</p>
        </div>
      </footer>
    </div>
  );
}
