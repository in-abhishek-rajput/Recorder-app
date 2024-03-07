// sk - vOrujDT5aqodVquUftVVT3BlbkFJnhBtsAPdsKp2GcWzeFGx;

let recognition;
let isManualStop = false;
let textOutput = document.getElementById("output");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let resetButton = document.getElementById("resetButton");
let formatButton = document.getElementById("formatButton");
let copyButton = document.getElementById("copyButton");

function startRecording() {
  startButton.disabled = true;
  isManualStop = false;
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.onresult = function (event) {
    let transcript = event.results[0][0].transcript;
    textOutput.innerHTML += transcript + " "; // Append the new text
    toggleButtons();
  };
  recognition.onend = function () {
    if (!isManualStop) {
      startRecording();
    }
  };
  recognition.start();
}

function stopRecording() {
  isManualStop = true;
  startButton.disabled = false;
  recognition.stop();
  formatButton.style.display = "inline-block"; // Show Format Text button
  copyButton.style.display = "none"; // Hide Copy Text button
}

function resetText() {
  textOutput.innerHTML = "";
  toggleButtons();
}

function copyText() {
  let textToCopy = textOutput.innerHTML.trim();
  if (textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(function () {
        alert("Text copied to clipboard!");
      })
      .catch(function (error) {
        console.error("Error copying text to clipboard:", error);
      });
  }
}

function formatText() {
  let textToFormat = textOutput.innerHTML.trim();
  if (textToFormat) {
    sendToChatGPT(textToFormat);
  }
}

async function sendToChatGPT(text) {
  const apiKey = "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";
  const apiUrl = "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayFormattedText(data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function displayFormattedText(formattedText) {
  textOutput.innerHTML = formattedText;
  copyButton.style.display = "inline-block"; // Show Copy Text button
  formatButton.style.display = "none"; // Hide Format Text button
  alert("Formatted Text:\n" + formattedText);
}

function toggleButtons() {
  resetButton.style.display =
    textOutput.innerHTML.trim() !== "" ? "inline-block" : "none";
}
