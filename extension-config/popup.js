function getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const activeTab = tabs.find(t => t.active);

          resolve(activeTab);
      });
    });
}

function activateTota11y() {
    console.log("activating tota11y...");
    chrome.tabs.executeScript(null, { file: "tota11y.min.js" });
    console.log("tota11y has been activated.");
}

const tota11yToggler = document.getElementById("tota11y-toggler")

tota11yToggler.addEventListener("click", async event => {
    const activeTab = await getActiveTab();

    if (!activeTab) {
        return;
    }

    const message = { type: "toggle_tota11y", payload: { showTota11y: event.target.checked } };

    chrome.tabs.sendMessage(activeTab.id, message, response => {
        switch (response.type) {
            case "activate_tota11y":
                activateTota11y();
                break;

            default:
                console.log("Page responded with", response);
                break;
        }
    });
});

(async () => {
    // If the toolbar is already active, ensure the checkbox is checked in the popup.
    // This is required as the popup is recreated every time it is opened.
    const activeTab = await getActiveTab();

    if (!activeTab) {
        return;
    }

    const message = { type: "check_for_tota11y_toolbar" };

    chrome.tabs.sendMessage(activeTab.id, message, response => {
        switch (response.type) {
            case "ensure_checkbox_checked":
                tota11yToggler.checked = true;
                break;

            default:
                console.log("Page responded with", response);
                break;
        }
    });
})();
