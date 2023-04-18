const API_URL = "https://api.openai.com/v1/engines/text-davinci-003/completions";
const API_KEY = "";

async function getImprovedText(text) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Please improve the following text: ${text}`,
        max_tokens: 100,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching improved text:", response.statusText, errorData);
      return "";
    }

    const data = await response.json();
    console.log("Data:", data);

    return data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : "";
  } catch (error) {
    console.error("Error fetching improved text:", error);
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
