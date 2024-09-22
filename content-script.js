chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showSavedNotification") {
      showNotification("Page saved for later reading!");
    }
  });
  
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4a90e2;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);
  
    setTimeout