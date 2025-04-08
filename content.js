console.log("Content script loaded and listening for messages.");

// Utility function to wait for an element to appear
const waitForElement = async (selector, timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await new Promise(resolve => setTimeout(resolve, 100)); // Retry every 100ms
  }
  console.warn(`Element with selector "${selector}" not found within ${timeout}ms.`);
  return null;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADD_SOURCES") {
    const addSourceManually = async (url) => {
      try {
        console.log(`Processing URL: ${url}`);

        // Wait for and click the "Add source" button
        const addSourceButton = await waitForElement('[aria-label="Add source"]');
        if (!addSourceButton) {
          console.warn(`Skipping URL ${url}: 'Add source' button not found.`);
          return;
        }
        console.log("Clicking 'Add source' button...");
        addSourceButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Wait for and click the "Website" button
        const websiteSpan = Array.from(document.querySelectorAll('span')).find(
          el => el.textContent.trim() === 'Website'
        );
        if (!websiteSpan) {
          console.warn(`Skipping URL ${url}: 'Website' button not found.`);
          return;
        }
        console.log("Clicking 'Website' button...");
        websiteSpan.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Wait for the input field and enter the URL
        const input = await waitForElement('input[formcontrolname="newUrl"]');
        if (!input) {
          console.warn(`Skipping URL ${url}: Input field not found.`);
          return;
        }
        console.log("Entering URL into input field...");
        input.focus();
        input.value = url;

        // Dispatch input event to trigger Angular’s change detection
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Wait for a short delay after entering the URL
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Wait for and click the "Insert" button
        const insertBtn = Array.from(document.querySelectorAll('button')).find(
          el => el.textContent.trim() === 'Insert'
        );
        if (!insertBtn) {
          console.warn(`Skipping URL ${url}: 'Insert' button not found.`);
          return;
        }
        console.log("Clicking 'Insert' button...");
        insertBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Successfully added source for URL: ${url}`);
      } catch (error) {
        console.error(`Error adding source for URL ${url}:`, error.message);
      }
    };

    (async () => {
      console.log("Starting to process URLs...", message.urls);
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