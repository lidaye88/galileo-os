/* ============================================
 * Galileo OS · 全站在线客服侧边栏
 * customer-service.js
 *
 * 参考	idmakers.cn 客服侧边栏
 * 功能：右侧悬浮 4 个操作按钮
 *   - 在线咨询（企业微信客服，新窗打开）
 *   - 申请邀请码（企业微信客服）
 *   - 电话咨询（400 热线，移动端直接拨打）
 *   - 返回顶部（滚动超过 400px 才出现）
 * 全部通过 JS 动态注入，不污染 HTML。
 * ============================================ */
(function () {
  "use strict";

  var KEFU_URL = "https://work.weixin.qq.com/kfid/kfc6e28eb8ad6d63cf7";
  var HOTLINE = "400-058-0097";
  var HOTLINE_TEL = "4000580097";

  // 防止重复注入
  if (document.getElementById("cs-widget")) return;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // SVG 图标
  var ICON = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    invite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    top: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'
  };

  // 构建侧边栏 DOM
  var widget = document.createElement("div");
  widget.id = "cs-widget";
  widget.innerHTML =
    '<div class="cs-rail">' +
      // 主按钮：在线咨询
      '<a href="' + KEFU_URL + '" target="_blank" rel="noopener" class="cs-btn cs-btn-primary" data-cs="consult">' +
        '<span class="cs-btn-icon">' + ICON.chat + '</span>' +
        '<span class="cs-btn-label">在线咨询</span>' +
      '</a>' +
      // 申请邀请码
      '<a href="' + KEFU_URL + '" target="_blank" rel="noopener" class="cs-btn" data-cs="invite">' +
        '<span class="cs-btn-icon">' + ICON.invite + '</span>' +
        '<span class="cs-btn-label">申请邀请码</span>' +
      '</a>' +
      // 电话咨询
      '<a href="tel:' + HOTLINE_TEL + '" class="cs-btn" data-cs="phone">' +
        '<span class="cs-btn-icon">' + ICON.phone + '</span>' +
        '<span class="cs-btn-label">电话咨询</span>' +
      '</a>' +
      // 返回顶部
      '<button type="button" class="cs-btn cs-btn-top" data-cs="top" aria-label="返回顶部">' +
        '<span class="cs-btn-icon">' + ICON.top + '</span>' +
        '<span class="cs-btn-label">顶部</span>' +
      '</button>' +
    '</div>' +
    // 电话浮窗（hover/点击 400 时展示完整号码）
    '<div class="cs-popover" id="cs-popover">' +
      '<div class="cs-pop-arrow"></div>' +
      '<div class="cs-pop-title">客服热线</div>' +
      '<a href="tel:' + HOTLINE_TEL + '" class="cs-pop-number">' + esc(HOTLINE) + '</a>' +
      '<div class="cs-pop-sub">工作时间 9:00–18:00（工作日）</div>' +
      '<div class="cs-pop-divider">或扫码加企业微信</div>' +
      '<a href="' + KEFU_URL + '" target="_blank" rel="noopener" class="cs-pop-wechat">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 11.5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-6.5 6c-3.6 0-6.5-2.4-6.5-5.4 0-1.7 1-3.2 2.6-4.2-.3-.8-.5-1.7-.5-2.4 0-.3.2-.5.5-.5.2 0 .4.1.5.3.4.9.9 1.6 1.4 2.1.8-.2 1.6-.3 2.5-.3.4 0 .8 0 1.2.1.6-2.3 3-4 5.8-4 3.3 0 6 2.3 6 5.2 0 1.5-.7 2.8-1.9 3.7.3.7.8 1.4 1.2 1.9.1.2.2.3.2.5 0 .3-.2.5-.5.5-.6 0-1.4-.2-2.1-.6-.9.4-1.9.6-2.9.6-.3 0-.6 0-.9-.1"/></svg>' +
        '点击进入企业微信客服' +
      '</a>' +
    '</div>';

  // 注入样式（避免依赖外部 CSS）
  var css =
    '#cs-widget{position:fixed;right:16px;bottom:24px;z-index:9998;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}' +
    '.cs-rail{display:flex;flex-direction:column;gap:8px;align-items:flex-end}' +
    '.cs-btn{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:60px;height:60px;background:#fff;border:1px solid #E2E5E8;border-radius:14px;cursor:pointer;text-decoration:none;color:#4E5660;box-shadow:0 4px 12px rgba(15,20,25,.06);transition:all .25s cubic-bezier(.2,.7,.3,1);padding:0;font-family:inherit}' +
    '.cs-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,20,25,.12);border-color:#00D9A3;color:#008060}' +
    '.cs-btn-icon{width:22px;height:22px;display:flex;align-items:center;justify-content:center;margin-bottom:2px}' +
    '.cs-btn-icon svg{width:22px;height:22px}' +
    '.cs-btn-label{font-size:10.5px;font-weight:500;line-height:1;letter-spacing:.02em}' +
    // 主按钮强调色
    '.cs-btn-primary{background:linear-gradient(135deg,#008060 0%,#00B886 100%);color:#fff;border-color:transparent}' +
    '.cs-btn-primary:hover{background:linear-gradient(135deg,#009975 0%,#00CCA0 100%);color:#fff;transform:translateY(-2px)}' +
    // 在线咨询主按钮上的红点
    '.cs-btn-primary::after{content:"";position:absolute;top:8px;right:9px;width:8px;height:8px;background:#FF4D4F;border:2px solid #fff;border-radius:50%;animation:csPulse 2s infinite}' +
    '@keyframes csPulse{0%{box-shadow:0 0 0 0 rgba(255,77,79,.5)}70%{box-shadow:0 0 0 8px rgba(255,77,79,0)}100%{box-shadow:0 0 0 0 rgba(255,77,79,0)}}' +
    // 返回顶部按钮默认隐藏
    '.cs-btn-top{opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .3s,transform .3s}' +
    '#cs-widget.cs-show-top .cs-btn-top{opacity:1;transform:translateY(0);pointer-events:auto}' +
    // 电话浮窗
    '.cs-popover{position:absolute;right:72px;bottom:88px;width:230px;background:#fff;border:1px solid #E2E5E8;border-radius:14px;box-shadow:0 12px 36px rgba(15,20,25,.16);padding:18px 18px 16px;opacity:0;transform:translateX(8px) scale(.96);pointer-events:none;transition:all .25s cubic-bezier(.2,.7,.3,1)}' +
    '#cs-widget.cs-pop-show .cs-popover{opacity:1;transform:translateX(0) scale(1);pointer-events:auto}' +
    '.cs-pop-arrow{position:absolute;right:-7px;bottom:30px;width:12px;height:12px;background:#fff;border-right:1px solid #E2E5E8;border-top:1px solid #E2E5E8;transform:rotate(45deg)}' +
    '.cs-pop-title{font-size:12px;color:#7A828D;letter-spacing:.04em;margin-bottom:6px}' +
    '.cs-pop-number{display:block;font-size:22px;font-weight:700;color:#0F1419;text-decoration:none;letter-spacing:-.01em;font-family:"SF Mono","JetBrains Mono",monospace}' +
    '.cs-pop-number:hover{color:#008060}' +
    '.cs-pop-sub{font-size:11.5px;color:#7A828D;margin-top:6px}' +
    '.cs-pop-divider{font-size:11.5px;color:#9BA3AD;margin:12px 0 8px;padding-top:10px;border-top:1px dashed #E2E5E8}' +
    '.cs-pop-wechat{display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;background:#07C160;color:#fff;border-radius:8px;font-size:12.5px;font-weight:500;text-decoration:none;transition:background .2s}' +
    '.cs-pop-wechat:hover{background:#06AE56}' +
    // 移动端
    '@media (max-width:768px){' +
      '.cs-btn{width:50px;height:50px;border-radius:12px}' +
      '.cs-btn-icon{width:20px;height:20px;margin-bottom:1px}' +
      '.cs-btn-icon svg{width:20px;height:20px}' +
      '.cs-btn-label{font-size:9.5px}' +
      '#cs-widget{right:10px;bottom:16px}' +
      '.cs-popover{right:60px;bottom:78px;width:200px;padding:14px}' +
      '.cs-pop-number{font-size:19px}' +
    '}';

  var style = document.createElement("style");
  style.id = "cs-widget-style";
  style.textContent = css;
  document.head.appendChild(style);
  document.body.appendChild(widget);

  // 交互逻辑
  var phoneBtn = widget.querySelector('[data-cs="phone"]');
  var topBtn = widget.querySelector('[data-cs="top"]');

  // 电话按钮：桌面端展示浮窗，移动端直接拨打（a href=tel 已处理）
  var popTimer = null;
  function showPop() {
    clearTimeout(popTimer);
    widget.classList.add("cs-pop-show");
  }
  function hidePop() {
    popTimer = setTimeout(function () { widget.classList.remove("cs-pop-show"); }, 200);
  }
  phoneBtn.addEventListener("mouseenter", showPop);
  phoneBtn.addEventListener("mouseleave", hidePop);
  var popover = document.getElementById("cs-popover");
  popover.addEventListener("mouseenter", showPop);
  popover.addEventListener("mouseleave", hidePop);
  // 桌面端点击电话按钮也切换浮窗（移动端则走 tel: 拨打）
  phoneBtn.addEventListener("click", function (e) {
    // 移动端不阻止（让它拨打），桌面端阻止并展示浮窗
    if (window.matchMedia && window.matchMedia("(min-width: 768px)").matches) {
      e.preventDefault();
      widget.classList.toggle("cs-pop-show");
    }
  });

  // 返回顶部
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 滚动控制返回顶部按钮显隐
  function onScroll() {
    if (window.scrollY > 400) widget.classList.add("cs-show-top");
    else widget.classList.remove("cs-show-top");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 暴露 API（便于其他脚本调用）
  window.GalileoCS = {
    openConsult: function () { window.open(KEFU_URL, "_blank", "noopener"); },
    hotline: HOTLINE
  };
})();
