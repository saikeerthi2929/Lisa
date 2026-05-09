let editingIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    loadBookmarks();

    document.getElementById('add-note-btn').addEventListener('click', () => {
        editingIndex = -1;
        document.getElementById('modal-title').innerText = "Create New Note";
        document.getElementById('note-title-input').value = "";
        document.getElementById('note-content-input').value = "";
        document.getElementById('note-modal').style.display = 'flex';
    });

    document.getElementById('save-note-btn').addEventListener('click', saveNote);
});

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('lisa_notes') || '[]');

    // Seed with mock if actually empty (first time)
    if (savedNotes.length === 0 && !localStorage.getItem('lisa_notes_seeded')) {
        savedNotes.push({ title: "Self Defense - Sec 96 IPC", body: "The right of private defense extends to causing death in certain cases.", date: "Feb 4, 2026" });
        localStorage.setItem('lisa_notes', JSON.stringify(savedNotes));
        localStorage.setItem('lisa_notes_seeded', 'true');
    }

    const container = document.getElementById('notes-list');

    if (savedNotes.length === 0) {
        container.innerHTML = `<div class="card" style="text-align:center; padding: 40px; border-style: dashed;">
            <p class="text-muted">No personal notes yet. Start by creating one!</p>
        </div>`;
        return;
    }

    container.innerHTML = savedNotes.map((note, idx) => `
        <div class="card" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <h3 class="serif-font">${note.title}</h3>
                <span class="text-muted" style="font-size: 0.8rem;">${note.date}</span>
            </div>
            <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">${note.body}</p>
            <div style="margin-top: 20px; display: flex; gap: 12px; border-top: 1px solid var(--border-color); paddingTop: 16px;">
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="editNote(${idx})">
                    <span class="material-symbols-rounded" style="font-size:1rem;">edit</span> Edit
                </button>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; color: var(--danger);" onclick="deleteNote(${idx})">
                    <span class="material-symbols-rounded" style="font-size:1rem;">delete</span> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function saveNote() {
    const title = document.getElementById('note-title-input').value.trim();
    const body = document.getElementById('note-content-input').value.trim();

    if (!title || !body) {
        alert("Please fill in both title and content.");
        return;
    }

    let notes = JSON.parse(localStorage.getItem('lisa_notes') || '[]');
    const noteObj = {
        title,
        body,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    if (editingIndex > -1) {
        notes[editingIndex] = noteObj;
    } else {
        notes.unshift(noteObj);
    }

    localStorage.setItem('lisa_notes', JSON.stringify(notes));
    closeNoteModal();
    loadNotes();
}

function editNote(idx) {
    const notes = JSON.parse(localStorage.getItem('lisa_notes') || '[]');
    const note = notes[idx];
    if (!note) return;

    editingIndex = idx;
    document.getElementById('modal-title').innerText = "Edit Note";
    document.getElementById('note-title-input').value = note.title;
    document.getElementById('note-content-input').value = note.body;
    document.getElementById('note-modal').style.display = 'flex';
}

function deleteNote(idx) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    let notes = JSON.parse(localStorage.getItem('lisa_notes') || '[]');
    notes.splice(idx, 1);
    localStorage.setItem('lisa_notes', JSON.stringify(notes));
    loadNotes();
}

function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
}

window.editNote = editNote;
window.deleteNote = deleteNote;
window.closeNoteModal = closeNoteModal;

function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('lisa_bookmarks') || '[]');
    const container = document.getElementById('bookmarks-list');

    if (bookmarks.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align:center; padding: 20px;">No saved bookmarks yet.</p>`;
        return;
    }

    container.innerHTML = bookmarks.map(b => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <p style="font-weight: 600; font-size: 0.9rem;">${b.name}</p>
                <small class="text-muted">${b.type.toUpperCase()} • ${b.date}</small>
            </div>
            <button class="btn btn-secondary" style="padding: 4px; border:none; background:none;" onclick="removeBookmark('${b.id}')">
                <span class="material-symbols-rounded" style="color: var(--danger); font-size: 1.2rem;">delete</span>
            </button>
        </div>
    `).join('');
}

function removeBookmark(id) {
    let bookmarks = JSON.parse(localStorage.getItem('lisa_bookmarks') || '[]');
    bookmarks = bookmarks.filter(b => b.id !== id);
    localStorage.setItem('lisa_bookmarks', JSON.stringify(bookmarks));
    loadBookmarks();
}

window.removeBookmark = removeBookmark;
