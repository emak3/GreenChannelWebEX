chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!message || !message.action) {
    return;
  }

  if (message.action === "openPopout") {
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
  }

  if (message.action === "resizePopoutTo169") {
    var tab = sender && sender.tab;
    if (!tab || tab.windowId == null) {
      sendResponse({ ok: false });
      return false;
    }
    var iw = message.innerWidth;
    var ih = message.innerHeight;
    if (!iw || !ih) {
      sendResponse({ ok: false });
      return false;
    }
    var targetInnerW = 960;
    var targetInnerH = 540;
    var windowId = tab.windowId;
    chrome.windows.get(windowId, function (win) {
      if (chrome.runtime.lastError || !win) {
        sendResponse({ ok: false });
        return;
      }
      var chromeW = Math.max(0, win.width - iw);
      var chromeH = Math.max(0, win.height - ih);
      chrome.windows.update(
        windowId,
        {
          width: targetInnerW + chromeW,
          height: targetInnerH + chromeH,
        },
        function () {
          if (chrome.runtime.lastError) {
            sendResponse({ ok: false });
          } else {
            sendResponse({ ok: true });
          }
        }
      );
    });
    return true;
  }
});
