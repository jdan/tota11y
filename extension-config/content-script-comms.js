function toggleTota11y(payload, sendResponse) {
    const tota11yToolbar = document.getElementById("tota11y-toolbar");

    if (!tota11yToolbar) {
        sendResponse({ type: "activate_tota11y"});
        return;
    }

    const tota11yWindows = [...document.querySelectorAll(".tota11y")];

    [...tota11yWindows, tota11yToolbar].forEach(element => {
        element.style.display = payload.showTota11y ? "block" : "none";
    });

    sendResponse({ type: "tota11y_toggle_success" });
}

if (chrome && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case "toggle_tota11y":
                toggleTota11y(request.payload, sendResponse);
                break;

            case "check_for_tota11y_toolbar": {
                const tota11yToolbar = document.getElementById("tota11y-toolbar");

                // If the tota11y toolbar has been loaded at least once and it's visible
                // let the popup window know so that the checkbox in the popup gets checked if it's not.
                if (tota11yToolbar && tota11yToolbar.style.display !== "none") {
                    sendResponse({ type: "ensure_checkbox_checked"});
                }
                break;
            }

            default:
                break;
        }
    });
}
