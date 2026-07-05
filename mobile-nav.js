/* ============================================
 * Galileo OS · 移动端汉堡菜单
 * mobile-nav.js
 *
 * 在窄屏（≤768px）时，给导航栏注入汉堡按钮 + 抽屉菜单。
 * 宽屏自动隐藏。纯 JS 注入，不污染 HTML。
 * ============================================ */
(function () {
  "use strict";
  if (window.matchMedia && !window.matchMedia("(max-width: 768px)").matches) {
    // 宽屏：监听变化，但不立即注入
  }

  // 防重复
  if (document.getElementById("mobile-nav-toggle")) return;

  function init() {
    var nav = document.querySelector("nav.nav, nav#topNav");
    if (!nav) return;

    // 找到 nav-links 和 nav-cta
    var navLinks = nav.querySelector(".nav-links");
    var navCta = nav.querySelector(".nav-cta");
    if (!navLinks && !navCta) return;

    // 收集导航链接
    var links = [];
    if (navLinks) {
      navLinks.querySelectorAll("a").forEach(function (a) {
        links.push({ href: a.getAttribute("href"), text: a.textContent.trim() });
      });
    }
    var ctaBtns = [];
    if (navCta) {
      navCta.querySelectorAll("a, button").forEach(function (b) {
        ctaBtns.push(b.outerHTML);
      });
    }

    // 汉堡按钮（注入到 nav-inner）
    var toggle = document.createElement("button");
    toggle.id = "mobile-nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "打开菜单");
    toggle.innerHTML =
      '<span class="mn-bar"></span><span class="mn-bar"></span><span class="mn-bar"></span>';
    var navInner = nav.querySelector(".nav-inner") || nav;
    navInner.appendChild(toggle);

    // 抽屉
    var drawer = document.createElement("div");
    drawer.id = "mobile-nav-drawer";
    var itemsHtml = links.map(function (l) {
      return '<a href="' + l.href + '" class="mn-link">' + l.text + "</a>";
    }).join("");
    var ctaHtml = ctaBtns.map(function (h) {
      // 替换 btn-sm 为 btn-lg 让按钮在抽屉里更大
      return '<div class="mn-cta">' + h.replace(/btn-sm/g, "btn-lg full") + "</div>";
    }).join("");
    drawer.innerHTML =
      '<div class="mn-head">' +
        '<span class="mn-title">Galileo OS</span>' +
        '<button type="button" class="mn-close" aria-label="关闭">×</button>' +
      "</div>" +
      '<nav class="mn-links">' + itemsHtml + "</nav>" +
      '<div class="mn-ctas">' + ctaHtml + "</div>";
    document.body.appendChild(drawer);

    // 遮罩
    var overlay = document.createElement("div");
    overlay.id = "mobile-nav-overlay";
    document.body.appendChild(overlay);

    // 交互
    function open() {
      drawer.classList.add("show");
      overlay.classList.add("show");
      toggle.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function close() {
      drawer.classList.remove("show");
      overlay.classList.remove("show");
      toggle.classList.remove("active");
      document.body.style.overflow = "";
    }
    toggle.addEventListener("click", function () {
      drawer.classList.contains("show") ? close() : open();
    });
    overlay.addEventListener("click", close);
    drawer.querySelector(".mn-close").addEventListener("click", close);
    // 点击链接后关闭
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    // ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
