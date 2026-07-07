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

  // 判断是否 emoji（用 codePointAt 检测，最可靠）
  function isEmoji(str) {
    str = String(str || "");
    for (var i = 0; i < str.length; i++) {
      var cp = str.codePointAt(i);
      // 基本多文种平面内的符号区
      if (cp >= 0x2600 && cp <= 0x27BF) return true;   // 杂项符号 ☀✂✅
      if (cp >= 0x2190 && cp <= 0x21FF) return true;   // 箭头 ←↑→
      if (cp >= 0x2300 && cp <= 0x23FF) return true;   // 技术符号 ⌘⌚
      if (cp >= 0x25A0 && cp <= 0x25FF) return true;   // 几何图形 ■●
      if (cp >= 0x2B00 && cp <= 0x2BFF) return true;   // 补充箭头/符号 ⬀⬡
      if (cp === 0xFE0F) return true;                   // variation selector
      // 补充平面（emoji 主体区）
      if (cp >= 0x1F1E0 && cp <= 0x1F1FF) return true;  // 旗帜
      if (cp >= 0x1F300 && cp <= 0x1FAFF) return true;  // 所有 emoji 补充平面
      // 处理 surrogate pair：如果是高代理项，跳过下一个字符
      if (cp >= 0xD800 && cp <= 0xDBFF) i++;
    }
    return false;
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
