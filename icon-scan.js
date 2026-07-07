/* ============================================
 * Galileo OS · 列表页图标自动替换
 * icon-scan.js
 *
 * 扫描页面上的 .card-icon / .oc-icon 内的 emoji，
 * 从相邻链接提取 key，替换为 <img> 图片引用。
 * 必须在 icon-render.js 之后加载。
 * ============================================ */
(function () {
  "use strict";

  function init() {
    if (!window.IconRender) return;

    // 找所有 card-icon（含 accent/indigo 变体）
    var icons = document.querySelectorAll('.card-icon, .oc-icon, .detail-hero-icon');
    icons.forEach(function (el) {
      // 跳过已替换的
      if (el.classList.contains('icon-replaced')) return;
      // 跳过已含 img 的
      if (el.querySelector('img')) return;

      var text = el.textContent.trim();
      if (!text) return;
      if (!IconRender.isEmoji(text)) return; // 非 emoji（如 MES/01）跳过

      // 从父容器找详情链接
      var parent = el.parentElement;
      for (var i = 0; i < 5 && parent; i++) {
        var link = parent.querySelector('a[href*="-detail.html?id="]');
        if (link) {
          var href = link.getAttribute('href') || '';
          var m = href.match(/([a-z]+)-detail\.html\?id=([^&"']+)/);
          if (m) {
            var type = m[1].replace('-detail', '');
            var key = m[2];
            el.innerHTML = IconRender.getHTML(type, key, text);
            el.classList.add('icon-replaced');
            return;
          }
        }
        parent = parent.parentElement;
      }

      // 没找到详情链接 → 用通用占位图
      el.innerHTML = '<img src="assets/icons/default.svg" alt="' + text + '" class="icon-img" onerror="this.style.display=\'none\'">';
      el.classList.add('icon-replaced');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
