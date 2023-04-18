chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.request === "getSelectedText") {
    const selectedText = window.getSelection().toString();
    sendResponse({ selectedText: selectedText });
  }
});
