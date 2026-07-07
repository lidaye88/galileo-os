/* ============================================
 * Galileo OS · 图标渲染器
 * icon-render.js
 *
 * 把数据中的 emoji icon 替换为 <img> 图片引用。
 * 图片位于 assets/icons/{type}-{key}.svg，可自行替换。
 *
 * 用法：
 *   <script src="icon-render.js"></script>
 *   IconRender.getHTML("agents", "production-scheduling", "📊")
 *   → '<img src="assets/icons/agents-production-scheduling.svg" ...>'
 *
 *   IconRender.getHTML("apps", "mes", "MES")
 *   → 'MES'（文字缩写保持原样）
 * ============================================ */
(function () {
  "use strict";

  // 判断是否 emoji（含 variation selector）
  var EMOJI_RE = /[\u2600-\u27bf\u2702-\u27b0\uFE0F\U0001F1E0-\U0001F1FF\U0001F300-\U0001F5FF\U0001F600-\U0001F64F\U0001F680-\U0001F6FF\U0001F700-\U0001FAFF]/;

  function isEmoji(str) {
    return EMOJI_RE.test(String(str || ""));
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 核心函数：返回 icon 的 HTML
  // type: "agents" / "skills" / ...
  // key: "production-scheduling"
  // icon: 原始 icon 值（emoji 或文字）
  function getHTML(type, key, icon) {
    icon = icon || "";
    if (isEmoji(icon)) {
      // emoji → 渲染图片（图片不存在时浏览器会自动忽略 alt）
      var src = "assets/icons/" + esc(type) + "-" + esc(key) + ".svg";
      return '<img src="' + src + '" alt="' + esc(icon) + '" class="icon-img" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'icon-fallback\')">';
    }
    // 非 emoji（文字缩写如 MES）→ 保持文字
    return esc(icon);
  }

  // 便捷：只传 icon 值，自动判断（详情页用，不生成图片）
  function getText(icon) {
    return esc(icon);
  }

  window.IconRender = { getHTML: getHTML, getText: getText, isEmoji: isEmoji };
})();
