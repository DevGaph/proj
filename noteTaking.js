document.addEventListener('DOMContentLoaded', function() {
    const noteContent = document.getElementById('noteContent');
    const saveNoteBtn = document.getElementById('saveNote');
    const notesList = document.getElementById('notesList');
  
    chrome.runtime.sendMessage({action: "checkAuth"}, function(response) {
      if (!response.isAuthenticated || (response.selectedFeature !== 'noteTaking' && response.selectedFeature !== 'all')) {
        window.location.href = 'auth.html';
        return;
      }
  
      loadNotes();
      saveNoteBtn.addEventListener('click', saveNote);
    });
  
    function saveNote() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const note = {
          content: noteContent.value,
          url: tabs[0].url,
          title: tabs[0].title,
          date: new Date().toISOString()
        };
  
        chrome.storage.sync.get('notes', function(data) {
          const notes = data.notes || [];
          notes.push(note);
          chrome.storage.sync.set({notes: notes}, function() {
            noteContent.value = '';
            loadNotes();
          });
        });
      });
    }
  
    function loadNotes() {
      chrome.storage.sync.get('notes', function(data) {
        const notes = data.notes || [];
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
          const noteElement = document.createElement('div');
          noteElement.className = 'note-item';
          noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${new Date(note.date).toLocaleString()}</small>
            <button class="delete-note" data-index="${index}">Delete</button>
          `;
          notesList.appendChild(noteElement);
        });
  
        document.querySelectorAll('.delete-note').forEach(btn => {
          btn.addEventListener('click', deleteNote);
        });
      });
    }
  
    function deleteNote(event) {
      const index = event.target.getAttribute('data-index');
      chrome.storage.sync.get('notes', function(data) {
        const notes = data.notes || [];
        notes.splice(index, 1);
        chrome.storage.sync.set({notes: notes}, loadNotes);
      });
    }
  });