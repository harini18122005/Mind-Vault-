"use client";

export default function NotesList({ notes, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading notes...</p>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No notes yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
            {note.score && (
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Match: {(note.score * 100).toFixed(1)}%
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-3 line-clamp-3">{note.content}</p>

          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
