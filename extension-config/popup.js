document.getElementById("tota11y-enabler").addEventListener("click", e => {
  const isTota11yEnabled = e.currentTarget.checked;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs.find(t => t.active);

    if (!activeTab) {
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, { isTota11yEnabled }, response => {
      console.dir(response);
    });
  });
});