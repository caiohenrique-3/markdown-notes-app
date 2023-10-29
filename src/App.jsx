// components
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

// data
import { data } from "./data";

// dependencies
import { useEffect, useState } from "react";
import Split from "react-split";
import { nanoid } from "nanoid";

// css
import "./styles/index.css";
import "react-mde/lib/styles/css/react-mde-all.css";

export default function App() {
  // Using a function returning a value makes
  // the State not re-initialize every App() re-render
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || [],
  );
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || "",
  );

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    const input = document.activeElement;

    setNotes((oldNotes) =>
      oldNotes.map((oldNote) =>
        oldNote.id === currentNoteId ? { ...oldNote, body: text } : oldNote
      )
    );

    if (currentNoteId !== notes[0].id) {
      const indexToShift = notes.findIndex((note) => note.id === currentNoteId);

      const newArray = [...notes];
      const noteToShift = newArray.splice(indexToShift, 1);
      newArray.unshift(noteToShift[0]);

      setNotes(newArray);
    }

    input.focus();
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    const newArray = notes.filter((note) => note.id !== noteId);

    setNotes(newArray);
  }

  function findCurrentNote() {
    return notes.find((note) => {
      return note.id === currentNoteId;
    }) || notes[0];
  }

  // Every time there's a change in the notes array,
  // save it to the local storage.
  useEffect(() => {
    const notesInString = JSON.stringify(notes);
    localStorage.setItem("notes", notesInString);
  }, [notes]);

  return (
    <main>
      {notes.length > 0
        ? (
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {currentNoteId &&
              notes.length > 0 &&
              (
                <Editor
                  currentNote={findCurrentNote()}
                  updateNote={updateNote}
                />
              )}
          </Split>
        )
        : (
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>
        )}
    </main>
  );
}
