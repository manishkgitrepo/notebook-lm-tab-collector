export const closePopupWithDelay = (delay = 500) => {
  setTimeout(() => window.close(), delay);
};

// Add click outside listener
export const addClickOutsideListener = () => {
  chrome.tabs.onActivated.addListener(() => {
    window.close();
  });
};
