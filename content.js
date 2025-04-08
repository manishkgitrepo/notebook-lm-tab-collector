console.log("Content script loaded and listening for messages.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "ADD_SOURCES") {

    const addSourceManually = async (url) => {
      try {
        console.log(`Processing URL: ${url}`);

        // Find and click the "Add source" button
        const addSourceButton = document.querySelector('[aria-label="Add source"]');
        if (!addSourceButton) throw new Error("Add source button not found.");
        console.log("Clicking 'Add source' button...");
        addSourceButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find and click the "Website" button using text content
        const websiteSpan = Array.from(document.querySelectorAll('span')).find(
          el => el.textContent.trim() === 'Website'
        );
        if (!websiteSpan) throw new Error("'Website' button not found.");
        console.log("Clicking 'Website' button...");
        websiteSpan.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find the input field and enter the URL
        const input = document.querySelector('input[formcontrolname="newUrl"]');
        if (!input) throw new Error("Input field with formcontrolname='newUrl' not found.");
        console.log("Entering URL into input field...");
        input.focus();
        input.value = url;

        // Dispatch input event to trigger Angular’s change detection
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Wait for a short delay after entering the URL
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find and click the "Insert" button using text content
        const insertBtn = Array.from(document.querySelectorAll('button')).find(
          el => el.textContent.trim() === 'Insert'
        );
        if (!insertBtn) throw new Error("'Insert' button not found.");
        console.log("Clicking 'Insert' button...");
        insertBtn.click();
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