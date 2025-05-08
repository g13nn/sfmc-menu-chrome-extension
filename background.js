// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  // Clear existing menu items
  chrome.contextMenus.removeAll();
  
  // Load saved custom links
  chrome.storage.local.get(['customLinks'], (result) => {
    const customLinks = result.customLinks || [];
    updateContextMenu(customLinks);
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateMenu") {
    updateContextMenu(request.links);
  }
});

// Update context menu with custom links
function updateContextMenu(links) {
  // Clear existing menu items
  chrome.contextMenus.removeAll();
  
  // Add custom links to context menu
  links.forEach(link => {
    if (link.name && link.url) {
      chrome.contextMenus.create({
        id: link.id.toString(),
        title: link.name,
        contexts: ["all"]
      });
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Load custom links
  chrome.storage.local.get(['customLinks'], (result) => {
    const customLinks = result.customLinks || [];
    const link = customLinks.find(l => l.id.toString() === info.menuItemId);
    
    if (link && link.url) {
      chrome.tabs.create({ url: link.url });
    }
  });
}); 