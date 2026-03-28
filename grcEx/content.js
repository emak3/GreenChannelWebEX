(function () {
  "use strict";

  var HASH_PREFIX = "gch-webex-popout=";
  var FLAG_ATTR = "data-gch-webex-buttons";

  function parsePopoutChannel() {
    var h = window.location.hash || "";
    if (h.charAt(0) === "#") h = h.slice(1);
    var i = h.indexOf(HASH_PREFIX);
    if (i === -1) return null;
    var rest = h.slice(i + HASH_PREFIX.length);
    var end = rest.search(/[&]/);
    if (end !== -1) rest = rest.slice(0, end);
    var n = parseInt(rest, 10);
    if (n >= 1 && n <= 5) return n;
    return null;
  }

  function selectChannel(ch) {
    var pc = document.getElementById("ch" + ch + "-main__pc");
    var sp = document.getElementById("ch" + ch + "-main__sp");
    var labelPc = document.getElementById("ch" + ch + "video");
    var labelSp = document.getElementById("ch" + ch + "video__sp");

    if (pc && isPcTabsVisible()) {
      labelPc && labelPc.click();
      pc.checked = true;
      pc.dispatchEvent(new Event("change", { bubbles: true }));
      pc.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (sp) {
      labelSp && labelSp.click();
      sp.checked = true;
      sp.dispatchEvent(new Event("change", { bubbles: true }));
      sp.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function isPcTabsVisible() {
    var tabs = document.querySelector(".top_tabs .player_ch_tabs");
    if (!tabs) return true;
    var s = window.getComputedStyle(tabs.closest(".top_tabs") || tabs);
    return s.display !== "none" && s.visibility !== "hidden";
  }

  function getChannelLabel(ch) {
    var pc = document.getElementById("ch" + ch + "video");
    var sp = document.getElementById("ch" + ch + "video__sp");
    if (isPcTabsVisible()) {
      return pc || sp;
    }
    return sp || pc;
  }

  /** 配信休止・非視聴可能ch: サイトの disabled または番組名の「休止」で判定 */
  function isChannelOffAir(ch) {
    var label = getChannelLabel(ch);
    if (!label) return true;
    if (label.classList.contains("disabled")) return true;
    var prog = label.querySelector(".p-main__tabs__program_name");
    if (prog && /休止/.test((prog.textContent || "").trim())) return true;
    return false;
  }

  function syncPopoutButtonsState() {
    var nodes = document.querySelectorAll(".gch-webex-popout-btn[data-gch-ch]");
    for (var i = 0; i < nodes.length; i++) {
      var btn = nodes[i];
      var ch = parseInt(btn.getAttribute("data-gch-ch"), 10);
      if (ch < 1 || ch > 5) continue;
      var off = isChannelOffAir(ch);
      btn.disabled = off;
      btn.title = off
        ? ch +
          "ch は配信休止中のため別ウィンドウでは開けません（視聴できないchです）"
        : ch + "ch の配信を別ウィンドウで開きます";
    }
  }

  function debounce(fn, ms) {
    var t = null;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  }

  /** popup の外寸は 16:9 でも、枠・タイトルバーで内側が歪む → 内寸 960×540 になるよう外寸を補正 */
  function scheduleResizePopoutTo169() {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id) {
      return;
    }
    function send() {
      chrome.runtime.sendMessage(
        {
          action: "resizePopoutTo169",
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        },
        function () {
          if (chrome.runtime.lastError) {
            /* 応答不要 */
          }
        }
      );
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(send);
    });
    window.setTimeout(send, 400);
  }

  function applyPopoutMode(ch) {
    document.documentElement.classList.add("gch-webex-popout");
    document.body.classList.add("gch-webex-popout");
    scheduleResizePopoutTo169();
    var attempts = 0;
    var t = setInterval(function () {
      attempts++;
      selectChannel(ch);
      if (attempts >= 25) clearInterval(t);
    }, 120);
  }

  function openPopoutWindow(ch) {
    var u = new URL(window.location.href);
    u.hash = HASH_PREFIX + ch;
    var url = u.toString();
    var name = "gch_webex_ch" + ch;
    var feat =
      "width=960,height=540,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no";

    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id) {
      window.open(url, name, feat);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: "openPopout",
        url: url,
        width: 960,
        height: 540,
      },
      function (res) {
        if (chrome.runtime.lastError || !res || !res.ok) {
          window.open(url, name, feat);
        }
      }
    );
  }

  function makePopoutButton(ch) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gch-webex-popout-btn";
    btn.setAttribute("data-gch-ch", String(ch));
    btn.textContent = "サブウィンドウで開く";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled || isChannelOffAir(ch)) return;
      openPopoutWindow(ch);
    });
    return btn;
  }

  function injectPcRow() {
    var host = document.querySelector(".top_tabs");
    var ref = host && host.querySelector(".player_ch_tabs");
    if (!host || !ref || host.getAttribute(FLAG_ATTR)) return;
    var row = document.createElement("div");
    row.className = "gch-webex-popout-row gch-webex-popout-row--pc";
    for (var ch = 1; ch <= 5; ch++) {
      row.appendChild(makePopoutButton(ch));
    }
    ref.insertAdjacentElement("afterend", row);
    host.setAttribute(FLAG_ATTR, "1");
  }

  function injectSpRows() {
    var wrap = document.querySelector(".top_tabs__sp");
    if (!wrap || wrap.getAttribute(FLAG_ATTR)) return;
    var rows = wrap.querySelectorAll(".player_ch_tabs__sp");
    if (rows.length < 2) return;

    var row1 = document.createElement("div");
    row1.className = "gch-webex-popout-row gch-webex-popout-row--sp2";
    row1.appendChild(makePopoutButton(1));
    row1.appendChild(makePopoutButton(2));
    rows[0].insertAdjacentElement("afterend", row1);

    var row2 = document.createElement("div");
    row2.className = "gch-webex-popout-row gch-webex-popout-row--sp3";
    row2.appendChild(makePopoutButton(3));
    row2.appendChild(makePopoutButton(4));
    row2.appendChild(makePopoutButton(5));
    rows[1].insertAdjacentElement("afterend", row2);

    wrap.setAttribute(FLAG_ATTR, "1");
  }

  var debouncedRefresh = debounce(function () {
    injectPcRow();
    injectSpRows();
    syncPopoutButtonsState();
  }, 200);

  function tryInject() {
    injectPcRow();
    injectSpRows();
    syncPopoutButtonsState();
  }

  var popCh = parsePopoutChannel();
  if (popCh !== null) {
    if (document.querySelector("#player-main-wrap")) {
      applyPopoutMode(popCh);
    }
    return;
  }

  if (!document.querySelector("#player-main-wrap .player_ch_tabs")) {
    return;
  }

  tryInject();

  var obs = new MutationObserver(function () {
    debouncedRefresh();
  });
  var root = document.getElementById("player-main-wrap") || document.body;
  obs.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
    characterData: true,
  });

  window.setTimeout(syncPopoutButtonsState, 500);
  window.setTimeout(syncPopoutButtonsState, 2000);
})();
