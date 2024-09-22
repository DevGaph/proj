document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners for buttons
    document.getElementById('createGroup').addEventListener('click', createGroup);
    document.getElementById('saveSession').addEventListener('click', saveSession);
    loadTabGroups();
});

// Function to create a new tab group
function createGroup() {
    const groupName = prompt('Enter a name for the new group:');
    if (groupName) {
        chrome.storage.sync.get('tabGroups', function(data) {
            const tabGroups = data.tabGroups || [];
            tabGroups.push({ name: groupName, tabs: [] });
            chrome.storage.sync.set({ tabGroups: tabGroups }, loadTabGroups);
        });
    }
}

// Function to save the current session as a tab group
function saveSession() {
    chrome.tabs.query({}, function(tabs) {
        const sessionName = prompt('Enter a name for this session:');
        if (sessionName) {
            chrome.storage.sync.get('tabGroups', function(data) {
                const tabGroups = data.tabGroups || [];
                tabGroups.push({
                    name: sessionName,
                    tabs: tabs.map(tab => ({ title: tab.title, url: tab.url }))
                });
                chrome.storage.sync.set({ tabGroups: tabGroups }, loadTabGroups);
            });
        }
    });
}

// Function to load and display tab groups
function loadTabGroups() {
    chrome.storage.sync.get('tabGroups', function(data) {
        const tabGroups = data.tabGroups || [];
        const container = document.getElementById('tabGroups');
        container.innerHTML = '';

        tabGroups.forEach((group, index) => {
            const groupElement = document.createElement('div');
            groupElement.className = 'tab-group';

            // Create group header
            const groupHeader = document.createElement('h3');
            groupHeader.textContent = group.name;
            groupElement.appendChild(groupHeader);

            // Create delete group button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Group';
            deleteButton.addEventListener('click', () => deleteGroup(index));
            groupElement.appendChild(deleteButton);

            // Create open all tabs button
            const openButton = document.createElement('button');
            openButton.textContent = 'Open All Tabs';
            openButton.addEventListener('click', () => openAllTabs(index));
            groupElement.appendChild(openButton);

            // List all tabs in the group
            group.tabs.forEach(tab => {
                const tabElement = document.createElement('div');
                tabElement.className = 'tab-item';
                const tabLink = document.createElement('a');
                tabLink.href = tab.url;
                tabLink.target = '_blank';
                tabLink.textContent = tab.title;
                tabElement.appendChild(tabLink);
                groupElement.appendChild(tabElement);
            });

            container.appendChild(groupElement);
        });
    });
}

// Function to delete a tab group
function deleteGroup(index) {
    chrome.storage.sync.get('tabGroups', function(data) {
        const tabGroups = data.tabGroups || [];
        tabGroups.splice(index, 1);
        chrome.storage.sync.set({ tabGroups: tabGroups }, loadTabGroups);
    });
}

// Function to open all tabs in a group
function openAllTabs(index) {
    chrome.storage.sync.get('tabGroups', function(data) {
        const tabGroups = data.tabGroups || [];
        const group = tabGroups[index];
        group.tabs.forEach(tab => {
            chrome.tabs.create({ url: tab.url });
        });
    });
}
