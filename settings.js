document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const subscriptionInput = document.getElementById('subscription');
    const darkModeCheckbox = document.getElementById('darkMode');
    const autoSaveCheckbox = document.getElementById('autoSave');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const backToMainBtn = document.getElementById('backToMain');
    const settingsMessage = document.getElementById('settingsMessage');
  
    chrome.runtime.sendMessage({action: "checkAuth"}, function(response) {
      if (!response.isAuthenticated) {
        window.location.href = 'auth.html';
        return;
      }
  
      loadSettings();
      saveSettingsBtn.addEventListener('click', saveSettings);
      backToMainBtn.addEventListener('click', () => { window.location.href = 'popup.html'; });
    });
  
    function loadSettings() {
      chrome.storage.sync.get(['currentUser', 'users', 'settings'], function(data) {
        const currentUser = data.currentUser;
        const userInfo = data.users[currentUser];
        const settings = data.settings || {};
  
        emailInput.value = currentUser;
        subscriptionInput.value = userInfo.selectedFeature === 'all' ? 'Premium' : 'Basic';
        darkModeCheckbox.checked = settings.darkMode || false;
        autoSaveCheckbox.checked = settings.autoSave || false;
  
        if (settings.darkMode) {
          document.body.classList.add('dark-mode');
        }
      });
    }
  
    function saveSettings() {
      const settings = {
        darkMode: darkModeCheckbox.checked,
        autoSave: autoSaveCheckbox.checked
      };
  
      chrome.storage.sync.set({settings: settings}, function() {
        settingsMessage.textContent = 'Settings saved successfully!';
        setTimeout(() => { settingsMessage.textContent = ''; }, 3000);
  
        if (settings.darkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      });
    }
  });