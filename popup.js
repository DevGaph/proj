document.addEventListener('DOMContentLoaded', function() {
    const featureButtons = document.getElementById('featureButtons');
    const logoutBtn = document.getElementById('logoutBtn');
  
    chrome.runtime.sendMessage({action: "checkAuth"}, function(response) {
      if (!response.isAuthenticated) {
        window.location.href = 'auth.html';
        return;
      }
  
      const features = ['tabManager', 'screenCapture', 'noteTaking', 'readLater'];
      features.forEach(feature => {
        if (response.selectedFeature === 'all' || response.selectedFeature === feature) {
          const button = document.createElement('button');
          button.id = feature;
          button.textContent = feature.charAt(0).toUpperCase() + feature.slice(1).replace(/([A-Z])/g, ' $1');
          button.addEventListener('click', () => { window.location.href = `${feature}.html`; });
          featureButtons.appendChild(button);
        }
      });
    });
  
    logoutBtn.addEventListener('click', function() {
      chrome.storage.sync.set({currentUser: null}, function() {
        window.location.href = 'auth.html';
      });
    });
  });