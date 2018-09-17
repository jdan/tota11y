function getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const activeTab = tabs.find(t => t.active);

          resolve(activeTab);
      });
    });
}

function activateTota11y() {
    console.log('activating tota11y...');
    chrome.tabs.executeScript(null, { file: "tota11y.js" });
    console.log('t0ta11y has been activated.');
}

document.getElementById("tota11y-toggler").addEventListener("click", async event => {
    const activeTab = await getActiveTab();

    if (!activeTab) {
        return;
    }

    const showTota11y = event.target.checked;
    const message = { type: 'toggle_tota11y', payload: { showTota11y } };

    chrome.tabs.sendMessage(activeTab.id, message, response => {
        switch(response.type) {
            case 'activate_tota11y':
                activateTota11y();
                break;

            default:
                console.log("Page responded with", response);
        }
    });
});
