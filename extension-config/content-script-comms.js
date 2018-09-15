if (chrome && chrome.runtime) {
  let tota11yToolbar;

  chrome.runtime.onMessage.addListener(({ isTota11yEnabled }) => {
      if (!tota11yToolbar) {
          tota11yToolbar = document.getElementById("tota11y-toolbar");
      }

      const tota11yWindows = [...document.querySelectorAll(".tota11y")];

      [...tota11yWindows, tota11yToolbar].forEach(element => {
          element.style.display = isTota11yEnabled ? "block" : "none";
      });
  });
}
