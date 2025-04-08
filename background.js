chrome.runtime.onInstalled.addListener(() => {
  console.log("Notebook LM Tab Collector installed.");
});

chrome.action.onClicked.addListener(async () => {
  try {
    let tabs = await chrome.tabs.query({});
    let notebookTab = tabs.find(tab => tab.url.includes("notebooklm.google.com"));

    if (notebookTab) {
      let urls = tabs.map(tab => tab.url);
      chrome.tabs.sendMessage(notebookTab.id, { type: "ADD_SOURCES", urls }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
          console.log("Message sent successfully:", response);
        }
      });
    } else {
      console.log("Notebook LM tab not found.");
    }
  } catch (error) {
    console.error("Unexpected error in background script:", error);
  }
});
