// Check if script is already initialized
if (!window.notebookCollectorInitialized) {
  window.notebookCollectorInitialized = true;
  console.log("Content script loaded and listening for messages.");

  ((window) => {
    const hideUI = () => {
      const style = document.createElement('style');
      style.id = 'notebook-collector-styles';
      style.textContent = `
        .cdk-overlay-container { visibility: hidden !important; }
        * { outline: none !important; }
        .mat-dialog-container { opacity: 0 !important; transition: none !important; }
      `;
      document.head.appendChild(style);
    };

    const showUI = () => {
      const styleElement = document.getElementById('notebook-collector-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };

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

            // Programmatically trigger click without focusing
            const clickElement = (element) => {
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              element.dispatchEvent(clickEvent);
            };

            // Wait for and click the "Add source" button
            const addSourceButton = await waitForElement('[aria-label="Add source"]');
            if (!addSourceButton) {
              console.warn(`Skipping URL ${url}: 'Add source' button not found.`);
              return;
            }

            // Click without visual feedback
            addSourceButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));

            // Determine which button to click based on the URL
            let buttonLabel = url.includes("youtube.com") ? "YouTube" : "Website";
            const targetButton = Array.from(document.querySelectorAll('span')).find(
              el => el.textContent.trim() === buttonLabel
            );
            if (!targetButton) {
              console.warn(`Skipping URL ${url}: '${buttonLabel}' button not found.`);
              return;
            }
            clickElement(targetButton);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Wait for the input field and enter the URL
            const input = await waitForElement('input[formcontrolname="newUrl"]');
            if (!input) {
              console.warn(`Skipping URL ${url}: Input field not found.`);
              return;
            }
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
            clickElement(insertBtn);
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Successfully added source for URL: ${url}`);
          } catch (error) {
            console.error(`Error adding source for URL ${url}:`, error.message);
          }
        };

        (async () => {
          try {
            hideUI(); // Hide UI at the start
            const totalUrls = message.urls.length;
            let processedUrls = 0;

            for (const url of message.urls) {
              await addSourceManually(url);
              processedUrls++;
              chrome.runtime.sendMessage({
                type: "PROGRESS_UPDATE",
                progress: { processed: processedUrls, total: totalUrls }
              });
            }
          } catch (error) {
            console.error("Error processing URLs:", error);
          } finally {
            showUI(); // Always show UI after completion or error
            console.log("All sources processed.");
            sendResponse({ status: "Completed adding sources." });
          }
        })();
        return true;
      } else {
        console.warn("Unknown message type received:", message.type);
      }
    });
  })(window);
}