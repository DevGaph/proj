document.addEventListener('DOMContentLoaded', function() {
    const captureBtn = document.getElementById('captureBtn');
    const preview = document.getElementById('preview');
  
    chrome.runtime.sendMessage({action: "checkAuth"}, function(response) {
      if (!response.isAuthenticated || (response.selectedFeature !== 'screenCapture' && response.selectedFeature !== 'all')) {
        window.location.href = 'auth.html';
        return;
      }
  
      captureBtn.addEventListener('click', captureScreen);
    });
  
    function captureScreen() {
      chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.width = '100%';
        preview.innerHTML = '';
        preview.appendChild(img);
  
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'screenshot.png';
        downloadLink.textContent = 'Download Screenshot';
        downloadLink.className = 'download-link';
        preview.appendChild(downloadLink);
      });
    }
  });