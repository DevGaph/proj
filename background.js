chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
      users: {},
      currentUser: null,
      tabGroups: [],
      notes: [],
      readLater: [],
      settings: {
        darkMode: false,
        autoSave: false
      }
    });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkAuth") {
      chrome.storage.sync.get(['currentUser', 'users'], (data) => {
        if (data.currentUser && data.users[data.currentUser]) {
          sendResponse({
            isAuthenticated: true,
            selectedFeature: data.users[data.currentUser].selectedFeature
          });
        } else {
          sendResponse({isAuthenticated: false});
        }
      });
      return true; // Indicates we will send a response asynchronously
    }
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get(['currentUser', 'users'], (data) => {
      if (data.currentUser && data.users[data.currentUser]) {
        chrome.tabs.create({url: 'feature-select.html'});
      } else {
        chrome.tabs.create({url: 'auth.html'});
      }
    });
  });
  
  chrome.commands.onCommand.addListener((command) => {
    switch(command) {
      case 'capture_screen':
        captureScreen();
        break;
      case 'save_for_later':
        saveForLater();
        break;
    }
  });
  
  function captureScreen() {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'screenshot.png';
      link.click();
    });
  }
  
  function saveForLater() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      const currentTab = tabs[0];
      chrome.storage.sync.get('readLater', (data) => {
        const readLater = data.readLater || [];
        readLater.push({
          title: currentTab.title,
          url: currentTab.url,
          date: new Date().toISOString()
        });
        chrome.storage.sync.set({readLater: readLater}, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            chrome.tabs.sendMessage(currentTab.id, {action: "showSavedNotification"});
          }
        });
      });
    });
  }