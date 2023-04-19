chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "textPolishr",
    title: "Improve with TextPolishr",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "textPolishr") {
    chrome.tabs.sendMessage(tab.id, { selectedText: info.selectionText });
  }
});
