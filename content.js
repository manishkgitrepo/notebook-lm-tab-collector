console.log("Minimal content script loaded.");
console.log("Content script loaded and listening for messages.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.type === "ADD_SOURCES") {
    console.log("Received sources to add:", message.urls);

    const addSourceManually = async (url) => {
      try {
        console.log(`Processing URL: ${url}`);
        const addSourceButton = document.querySelector('[aria-label="Add source"]');
        if (!addSourceButton) throw new Error("Add source button not found.");
        console.log("Clicking 'Add source' button...");
        addSourceButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        const websiteButton = document.querySelector('button[aria-label="Website"]');
        if (!websiteButton) throw new Error("Website button not found.");
        console.log("Clicking 'Website' button...");
        websiteButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        const inputField = document.querySelector('input[type="url"], input[type="text"]');
        if (!inputField) throw new Error("Input field not found.");
        console.log("Entering URL into input field...");
        inputField.value = url;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));

        const insertButton = document.querySelector('button[aria-label="Insert"], button[type="submit"]');
        if (!insertButton) throw new Error("Insert button not found.");
        console.log("Clicking 'Insert' button...");
        insertButton.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Successfully added source for URL: ${url}`);
      } catch (error) {
        console.error(`Error adding source for URL ${url}:`, error.message);
      }
    };

    (async () => {
      for (const url of message.urls) {
        await addSourceManually(url);
      }
      console.log("All sources processed.");
      sendResponse({ status: "Completed adding sources." });
    })();

    // Return true to indicate the response will be sent asynchronously
    return true;
  } else {
    console.warn("Unknown message type received:", message.type);
  }
});