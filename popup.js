document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("collect").addEventListener("click", async () => {
    try {
      // Query the active tab in the last focused browser window
      let [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

      if (!activeTab?.url || activeTab.url.startsWith("chrome://")) {
        alert("No valid active tab found.");
        console.error("No valid active tab found.");
        return;
      }

      // Query all tabs and filter out unwanted URLs
      let tabs = await chrome.tabs.query({});
      let urls = tabs
        .map(tab => tab.url)
        .filter(url => url && !url.includes("notebooklm.google.com") && !url.startsWith("chrome://"));

      // Find the Notebook LM tab
      let notebookTab = tabs.find(tab => tab.url.includes("notebooklm.google.com"));

      if (!notebookTab) {
        alert("Notebook LM tab not found!");
        console.error("Notebook LM tab not found!");
        return;
      }

      // Inject content.js dynamically
      chrome.scripting.executeScript({
        target: { tabId: notebookTab.id },
        files: ["content.js"]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error injecting script:", chrome.runtime.lastError.message);
          alert("Failed to inject content script. Check the console for details.");
          return;
        }

        // Send the message only after successful injection
        chrome.tabs.sendMessage(notebookTab.id, { type: "ADD_SOURCES", urls }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            alert("Failed to send message. Check the console for details.");
          } else {
            console.log("Message sent successfully. Response:", response);
          }
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Check the console for details.");
    }
  });
});
