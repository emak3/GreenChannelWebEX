chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!message || message.action !== "openPopout") {
    return;
  }
  var url = message.url;
  var width = message.width || 960;
  var height = message.height || 540;
  chrome.windows.create(
    {
      url: url,
      type: "popup",
      width: width,
      height: height,
      focused: true,
    },
    function () {
      if (chrome.runtime.lastError) {
        sendResponse({
          ok: false,
          error: chrome.runtime.lastError.message,
        });
      } else {
        sendResponse({ ok: true });
      }
    }
  );
  return true;
});
