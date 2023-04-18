function showApiKeyContainer() {
  document.getElementById("api-key-container").style.display = "block";
  document.getElementById("improved-text-container").style.display = "none";
}

function showImprovedTextContainer(improvedText) {
  document.getElementById("api-key-container").style.display = "none";
  document.getElementById("improved-text-container").style.display = "block";
  document.getElementById("improved-text").textContent = improvedText;
}

document.getElementById("api-key-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const apiKey = document.getElementById("api-key-input").value;
  chrome.storage.sync.set({ apiKey: apiKey }, function () {
    alert("API Key saved.");
    showImprovedTextContainer("");
  });
});

chrome.storage.sync.get("apiKey", function (data) {
  if (data.apiKey) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getImprovedText" }, function (response) {
        if (response) {
          showImprovedTextContainer(response.improvedText);
        } else {
          showApiKeyContainer();
        }
      });
    });
  } else {
    showApiKeyContainer();
  }
});
