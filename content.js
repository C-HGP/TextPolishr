let improvedText = "";

function processSelectedText(selectedText, apiKey) {
  // Send selectedText to ChatGPT with apiKey and receive improvedText
  // Store the improvedText in a variable to be used when the popup is opened
  improvedText = "Improved version of the selected text"; // Replace this with actual improved text from ChatGPT
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getImprovedText") {
    sendResponse({ improvedText: improvedText });
  } else if (request.text) {
    chrome.storage.sync.get("apiKey", function (data) {
      if (data.apiKey) {
        processSelectedText(request.text, data.apiKey);
      } else {
        console.error("TextPolishr: API Key not found");
      }
    });
  }
});
