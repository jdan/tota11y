/**
 * Determines whether or not to toggle the t0ta11y widget on the page.
 * This is driven by the UI in the popup for the extension.
 *
 * @param {Object} payload Payload for the request from the browser extension on whether or not to toggle tota11y.
 * @param {boolean} payload.showTota11y Whether or not to toggle the tota11y toolbar loaded/soon to be loaded in the page.
 * @param {Object} sendResponse callback to send a response back to the sender (see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)
 */
function toggleTota11y(payload, sendResponse) {
    const tota11yToolbar = document.getElementById("tota11y-toolbar");

    if (!tota11yToolbar) {
        // This is the first time the user is requesting the use of tota11y, so load
        // the tota11y script.
        sendResponse({ type: "activate_tota11y"});
        return;
    }

    const tota11yWindows = [...document.querySelectorAll(".tota11y")];

    // The tota11y script is already loaded so now decided whether to show or hide
    // the tota11y widgets.
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
