document.addEventListener('DOMContentLoaded', function() {
    const featureButtons = document.querySelectorAll('#featureSelection button');
    const subscribeAllBtn = document.getElementById('subscribeAll');
    const selectionMessage = document.getElementById('selectionMessage');
  
    featureButtons.forEach(button => {
      button.addEventListener('click', selectFeature);
    });
  
    subscribeAllBtn.addEventListener('click', subscribeAll);
  
    function selectFeature(event) {
      const selectedFeature = event.target.id;
      chrome.storage.sync.get('currentUser', function(data) {
        const currentUser = data.currentUser;
        if (currentUser) {
          chrome.storage.sync.get('users', function(userData) {
            const users = userData.users || {};
            if (!users[currentUser]) {
              users[currentUser] = {};
            }
            users[currentUser].selectedFeature = selectedFeature;
            chrome.storage.sync.set({ users: users }, function() {
              selectionMessage.textContent = `You've selected ${selectedFeature}. Enjoy!`;
              setTimeout(() => {
                window.location.href = `${selectedFeature}.html`;
              }, 2000);
            });
          });
        }
      });
    }
  
    function subscribeAll() {
      chrome.storage.sync.get('currentUser', function(data) {
        const currentUser = data.currentUser;
        if (currentUser) {
          chrome.storage.sync.get('users', function(userData) {
            const users = userData.users || {};
            if (!users[currentUser]) {
              users[currentUser] = {};
            }
            users[currentUser].selectedFeature = 'all';
            chrome.storage.sync.set({ users: users }, function() {
              selectionMessage.textContent = 'You\'ve subscribed to all features. Enjoy!';
              setTimeout(() => {
                window.location.href = 'popup.html';
              }, 2000);
            });
          });
        }
      });
    }
  });
  