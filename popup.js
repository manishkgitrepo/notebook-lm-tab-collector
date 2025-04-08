document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("collect").addEventListener("click", async () => {
    try {
      // Query the active tab in the last focused browser window
      let [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

      if (!activeTab || !activeTab.url) {
        alert("No active tab found or the active tab has no URL.");
        console.error("No active tab found or the active tab has no URL.");
        return;
      }

      console.log("Active tab:", activeTab);

      // Ensure the active tab is not a Chrome internal page
      if (activeTab.url.startsWith("chrome://")) {
        alert("Cannot interact with Chrome internal pages.");
        console.error("Cannot interact with Chrome internal pages.");
        return;
      }

      // Proceed with your logic (e.g., finding notebooklm.google.com tab)
      let tabs = await chrome.tabs.query({});
      let urls = tabs
        .map(tab => tab.url)
        .filter(url => url && !url.includes("notebooklm.google.com") && !url.startsWith("chrome://"));

      let notebookTab = tabs.find(tab => tab.url.includes("notebooklm.google.com"));

      if (!notebookTab) {
        alert("Notebook LM tab not found!");
        console.error("Notebook LM tab not found!");
        return;
      }

      console.log("Target Notebook LM tab:", notebookTab);

      // Ensure the tab URL matches the permissions in the manifest
      if (!notebookTab.url.startsWith("https://notebooklm.google.com/")) {
        alert("Notebook LM tab URL does not match the required permissions.");
        console.error("Notebook LM tab URL does not match the required permissions.");
        return;
      }

      // Inject content.js dynamically
      try {
        chrome.scripting.executeScript({
          target: { tabId: notebookTab.id },
          files: ["content.js"]
        }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error injecting script:", chrome.runtime.lastError.message);
            alert("Failed to inject content script. Check the console for details.");
            return;
          }

          console.log("Script injected successfully into tab ID:", notebookTab.id);

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
        console.error("Failed to inject content.js:", error);
        alert("Failed to inject content.js. Check the console for details.");
        return;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Check the console for details.");
    }
  });
});
