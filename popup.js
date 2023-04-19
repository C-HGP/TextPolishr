const API_URL = "https://api.openai.com/v1/engines/text-davinci-002/completions";
const API_KEY = localStorage.getItem("apiKey");

async function getImprovedText(text) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Please improve the following text: ${text}\nImproved text: `,
        max_tokens: 100,
        n: 1,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching improved text:", response.statusText, errorData);
      return "";
    }

    const data = await response.json();
    console.log("Data:", data);

    const improvedText = data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : "";
    const improvedTextWithoutPrompt = improvedText.replace("Improved text:", "").trim();
    return improvedTextWithoutPrompt;
  } catch (error) {
    console.error("Error fetching improved text:", error);
    showErrorModal("An error occurred while processing the text. Please try again.");
    return "";
  }
}

$(document).ready(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { request: "getSelectedText" }, (response) => {
      if (response && response.selectedText) {
        $("#originalText").val(response.selectedText);
      }
    });

    if (!API_KEY) {
      $("#apiKeyModal").show();
    }

    $("#saveApiKey").click(() => {
      const apiKey = $("#apiKeyInput").val();
      if (apiKey) {
        localStorage.setItem("apiKey", apiKey);
        location.reload();
      } else {
        alert("Please enter a valid API key.");
      }
    });
  });

  $("#openSettingsModal").click(openSettingsModal);
  $("#closeSettingsModal").click(closeSettingsModal);

  $("#updateApiKey").click(() => {
    const apiKey = $("#settingsApiKeyInput").val();
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
      location.reload();
    } else {
      alert("Please enter a valid API key.");
    }
  });

  $("#textPolishrForm").on("submit", async (event) => {
    event.preventDefault();
    const originalText = $("#originalText").val();
    if (originalText) {
      const improvedText = await getImprovedText(originalText);
      $("#improvedText").val(improvedText);
    }
  });
});

function showErrorModal(message) {
  $("#errorMessage").text(message);
  $("#errorModal").show();
}

function updateProgressBar(percentage) {
  $("#progressBar").css("width", percentage + "%");
}

$("#closeErrorModal").click(() => {
  $("#errorModal").hide();
});

function openSettingsModal() {
  $("#settingsApiKeyInput").val(localStorage.getItem("apiKey"));
  $("#settingsModal").show();
}

function closeSettingsModal() {
  $("#settingsModal").hide();
}

$("#textPolishrForm").on("submit", async (event) => {
  event.preventDefault();
  const originalText = $("#originalText").val();

  if (!originalText.trim()) {
    showErrorModal("Please enter text to improve.");
    return;
  }

  $("#progressBarContainer").show();
  updateProgressBar(50);

  const improvedText = await getImprovedText(originalText);

  updateProgressBar(100);

  if (improvedText) {
    $("#improvedText").val(improvedText);
  } else {
    showErrorModal("An error occurred while processing the text. Please try again.");
  }

  $("#progressBarContainer").hide();
  updateProgressBar(0);
});
