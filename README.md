# Notebook LM Tab Collector

Notebook LM Tab Collector is a Chrome extension that collects the URLs of all open tabs in your browser and adds them as sources to Google Notebook LM.

## Features

- Collects all open tab URLs in the browser.
- Filters out `notebooklm.google.com` and `chrome://` URLs.
- Dynamically injects a content script to interact with the Notebook LM interface.
- Automates the process of adding sources to Notebook LM.
- Beautifully styled popup interface for a better user experience.

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the project directory.

## Usage

1. Open the tabs you want to add as sources in your browser.
2. Ensure you have a tab open with `https://notebooklm.google.com`.
3. Click on the extension icon in the toolbar to open the popup.
4. Click the **Add Tabs to Notebook LM** button.
5. The extension will automatically add the URLs as sources to Notebook LM.

## File Structure

- **popup.html**: The HTML file for the extension's popup interface.
- **pop.css**: Stylesheet for the popup interface.
- **popup.js**: Handles the logic for querying tabs and injecting the content script.
- **background.js**: Manages background tasks for the extension.
- **content.js**: Automates interactions with the Notebook LM interface.
- **manifest.json**: The configuration file for the Chrome extension.

## Permissions

The extension requires the following permissions:
- `tabs`: To query open tabs in the browser.
- `activeTab`: To interact with the active tab.
- `scripting`: To dynamically inject scripts into tabs.
- `host_permissions`: To access `https://notebooklm.google.com/*`.

## Known Issues

- If the "Add source" or "Insert" buttons are not found, the extension will log a warning and skip the URL.
- Ensure the Notebook LM tab is open and accessible before using the extension.

## Styling

The popup interface has been styled using `pop.css` to provide a clean and modern look:
- **Header**: Displays the extension name.
- **Description**: Provides instructions for the user.
- **Button**: Styled with hover and active states for better interactivity.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.