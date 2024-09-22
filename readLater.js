document.addEventListener('DOMContentLoaded', function() {
    const saveCurrentPageBtn = document.getElementById('saveCurrentPage');
    const readingList = document.getElementById('readingList');
  
    chrome.runtime.sendMessage({action: "checkAuth"}, function(response) {
      if (!response.isAuthenticated || (response.selectedFeature !== 'readLater' && response.selectedFeature !== 'all')) {
        window.location.href = 'auth.html';
        return;
      }
  
      loadReadingList();
      saveCurrentPageBtn.addEventListener('click', saveCurrentPage);
    });
  
    function saveCurrentPage() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const page = {
          url: tabs[0].url,
          title: tabs[0].title,
          date: new Date().toISOString()
        };
  
        chrome.storage.sync.get('readLater', function(data) {
          const readLater = data.readLater || [];
          readLater.push(page);
          chrome.storage.sync.set({readLater: readLater}, loadReadingList);
        });
      });
    }
  
    function loadReadingList() {
      chrome.storage.sync.get('readLater', function(data) {
        const readLater = data.readLater || [];
        readingList.innerHTML = '';
        readLater.forEach((page, index) => {
          const pageElement = document.createElement('div');
          pageElement.className = 'read-later-item';
          pageElement.innerHTML = `
            <h3><a href="${page.url}" target="_blank">${page.title}</a></h3>
            <small>${new Date(page.date).toLocaleString()}</small>
            <button class="remove-page" data-index="${index}">Remove</button>
          `;
          readingList.appendChild(pageElement);
        });
  
        document.querySelectorAll('.remove-page').forEach(btn => {
          btn.addEventListener('click', removePage);
        });
      });
    }
  
    function removePage(event) {
      const index = event.target.getAttribute('data-index');
      chrome.storage.sync.get('readLater', function(data) {
        const readLater = data.readLater || [];
        readLater.splice(index, 1);
        chrome.storage.sync.set({readLater: readLater}, loadReadingList);
      });
    }
  });