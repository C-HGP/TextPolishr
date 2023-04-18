chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "textPolishr",
    title: "Improve text with TextPolishr",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "textPolishr") {
    chrome.tabs.sendMessage(tab.id, { text: info.selectionText });
  }
});
