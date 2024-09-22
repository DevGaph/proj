document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const authMessage = document.getElementById('authMessage');
  
    loginBtn.addEventListener('click', handleAuth);
    registerBtn.addEventListener('click', handleAuth);
  
    function handleAuth(event) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const isLogin = event.target.id === 'loginBtn';
  
      if (!email || !password) {
        authMessage.textContent = 'Please enter both email and password.';
        return;
      }
  
      // In a real-world scenario, you would send this data to a server for authentication
      // For this example, we'll use chrome.storage to simulate user accounts
      chrome.storage.sync.get('users', function(data) {
        const users = data.users || {};
        if (isLogin) {
          if (users[email] && users[email].password === password) {
            chrome.storage.sync.set({currentUser: email}, function() {
              window.location.href = 'feature-select.html';
            });
          } else {
            authMessage.textContent = 'Invalid email or password.';
          }
        } else {
          if (users[email]) {
            authMessage.textContent = 'Email already registered.';
          } else {
            users[email] = {password: password, selectedFeature: null};
            chrome.storage.sync.set({users: users, currentUser: email}, function() {
              window.location.href = 'feature-select.html';
            });
          }
        }
      });
    }
  });