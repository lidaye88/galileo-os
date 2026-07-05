/* ============================================
 * Galileo OS · 准入弹窗系统
 * 对应 PRD 第 6-8 章：登录/注册/邀请码/咨询 闭环
 *
 * 状态机：
 *   clickUse(能力名)
 *     ├─ 未登录 → showLogin()  → 登录成功 → showInvite()
 *     └─ 已登录 → showInvite() → 校验通过 → showSuccess()
 *                                    └─ 无邀请码 → showContact()
 *
 * 用法：
 *   <script src="auth-modal.js"></script>
 *   GalileoAuth.init();                          // 初始化（注入弹窗 DOM）
 *   GalileoAuth.clickUse("排产算法 Skill");        // 触发使用流程
 *   GalileoAuth.showLogin();                     // 直接打开登录
 *   GalileoAuth.showInvite("Agent名");            // 直接打开邀请码
 *   GalileoAuth.showContact("能力名");            // 直接打开咨询
 * ============================================ */

window.GalileoAuth = (function () {
  var KEFU = "https://work.weixin.qq.com/kfid/kfc6e28eb8ad6d63cf7";
  var STORAGE_KEY = "galileo_auth_state";

  // 内存状态（模拟登录态）
  var state = {
    loggedIn: false,
    user: null,        // { phone, name, role }
    inviteVerified: false,
    pendingTarget: null // 当前要使用的能力名
  };

  // 从 localStorage 恢复（演示用，真实环境换 token）
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.loggedIn) { state.loggedIn = true; state.user = saved.user; }
  } catch (e) {}

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ loggedIn: state.loggedIn, user: state.user })); } catch (e) {}
  }

  /* ---------- DOM 注入 ---------- */
  function init() {
    if (document.getElementById("auth-overlay")) return; // 已初始化
    var overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal" id="auth-modal"></div>';
    document.body.appendChild(overlay);

    // 点遮罩关闭
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    // ESC 关闭
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function open() { init(); document.getElementById("auth-overlay").classList.add("show"); document.body.style.overflow = "hidden"; }
  function close() { var o = document.getElementById("auth-overlay"); if (o) o.classList.remove("show"); document.body.style.overflow = ""; }

  /* ---------- 渲染登录/注册 ---------- */
  function showLogin(target) {
    state.pendingTarget = target || state.pendingTarget;
    renderLogin("login");
    open();
  }

  function renderLogin(mode) {
    var modal = document.getElementById("auth-modal");
    var isLogin = mode === "login";

    modal.innerHTML =
      '<button class="modal-close" onclick="GalileoAuth.close()">×</button>' +
      '<div class="modal-header">' +
        '<div class="modal-icon">🔐</div>' +
        '<h3>' + (isLogin ? '登录到 Galileo OS' : '注册账号') + '</h3>' +
        '<p>' + (isLogin ? '登录后即可申请使用「' + esc(state.pendingTarget || '能力') + '」' : '注册后可浏览全部能力详情，申请使用') + '</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="auth-tabs">' +
          '<button class="auth-tab ' + (isLogin ? 'active' : '') + '" onclick="GalileoAuth._switch(\'login\')">登录</button>' +
          '<button class="auth-tab ' + (!isLogin ? 'active' : '') + '" onclick="GalileoAuth._switch(\'register\')">注册</button>' +
        '</div>' +

        (isLogin ?
          // 登录表单
          '<form onsubmit="return GalileoAuth._doLogin(event)">' +
            '<div class="form-group">' +
              '<label class="form-label">手机号</label>' +
              '<input class="form-input" type="tel" name="phone" placeholder="请输入手机号" required maxlength="11">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">验证码</label>' +
              '<div class="input-with-btn">' +
                '<input class="form-input" type="text" name="code" placeholder="短信验证码" required maxlength="6">' +
                '<button type="button" class="btn-send-code" onclick="GalileoAuth._sendCode(this)">获取验证码</button>' +
              '</div>' +
            '</div>' +
            '<button type="submit" class="btn btn-accent btn-lg full" style="margin-top:8px;">登录</button>' +
          '</form>'
        :
          // 注册表单
          '<form onsubmit="return GalileoAuth._doRegister(event)">' +
            '<div class="invite-note" style="margin-bottom:20px;background:var(--accent-50);border:1px solid var(--accent-500);">' +
              '<span class="invite-note-icon">🎟️</span>' +
              '<div>注册后使用能力需<strong>邀请码</strong>。还没有邀请码？<a href="' + KEFU + '" target="_blank" rel="noopener" style="color:var(--accent-600);font-weight:600;">点击联系客服获取 →</a></div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">手机号 <span style="color:#B91C1C;">*</span></label>' +
              '<input class="form-input" type="tel" name="phone" placeholder="用于登录和客服联系" required maxlength="11">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">验证码 <span style="color:#B91C1C;">*</span></label>' +
              '<div class="input-with-btn">' +
                '<input class="form-input" type="text" name="code" placeholder="短信验证码" required maxlength="6">' +
                '<button type="button" class="btn-send-code" onclick="GalileoAuth._sendCode(this)">获取验证码</button>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">姓名（选填）</label>' +
              '<input class="form-input" type="text" name="name" placeholder="如何称呼您">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">企业名称（选填）</label>' +
              '<input class="form-input" type="text" name="company" placeholder="您所在的企业">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">您的身份</label>' +
              '<div class="role-select">' +
                '<button type="button" class="role-chip" data-role="企业用户" onclick="GalileoAuth._pickRole(this)">工业企业</button>' +
                '<button type="button" class="role-chip" data-role="OPC" onclick="GalileoAuth._pickRole(this)">OPC 合作伙伴</button>' +
                '<button type="button" class="role-chip" data-role="开发者" onclick="GalileoAuth._pickRole(this)">开发者</button>' +
                '<button type="button" class="role-chip" data-role="设备供应商" onclick="GalileoAuth._pickRole(this)">设备供应商</button>' +
                '<button type="button" class="role-chip" data-role="服务商" onclick="GalileoAuth._pickRole(this)">服务商</button>' +
              '</div>' +
            '</div>' +
            '<button type="submit" class="btn btn-accent btn-lg full" style="margin-top:8px;">注册</button>' +
          '</form>'
        ) +

        '<div class="divider-or">其他方式</div>' +
        '<div class="third-auth">' +
          '<button class="third-auth-btn" title="微信登录（即将开放）" onclick="GalileoAuth._tip(\'微信登录即将开放\')">💬</button>' +
          '<button class="third-auth-btn" title="企业微信（即将开放）" onclick="GalileoAuth._tip(\'企业微信登录即将开放\')">🏢</button>' +
          '<button class="third-auth-btn" title="飞书（即将开放）" onclick="GalileoAuth._tip(\'飞书登录即将开放\')">🦜</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<p class="form-footer">登录即代表同意 <a href="#" onclick="return false">服务协议</a> 与 <a href="#" onclick="return false">隐私政策</a></p>' +
      '</div>';
  }

  /* ---------- 渲染邀请码 ---------- */
  function showInvite(target) {
    state.pendingTarget = target || state.pendingTarget;
    var modal = document.getElementById("auth-modal") || (init(), document.getElementById("auth-modal"));
    modal.innerHTML =
      '<button class="modal-close" onclick="GalileoAuth.close()">×</button>' +
      '<div class="modal-header">' +
        '<div class="modal-icon">🎟️</div>' +
        '<h3>输入邀请码后使用</h3>' +
        '<p>当前能力正在邀约开放中。请输入平台、OPC 合作伙伴或商务人员提供的邀请码。</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form onsubmit="return GalileoAuth._doInvite(event)">' +
          '<div class="form-group">' +
            '<label class="form-label">邀请码</label>' +
            '<input class="form-input" type="text" name="invite" placeholder="请输入邀请码" required style="text-align:center;font-size:18px;letter-spacing:0.2em;text-transform:uppercase;">' +
          '</div>' +
          '<div id="invite-error" style="display:none;color:#B91C1C;font-size:13px;margin:-8px 0 12px;"></div>' +
          '<button type="submit" class="btn btn-accent btn-lg full">确认使用</button>' +
        '</form>' +
        '<div class="invite-note">' +
          '<span class="invite-note-icon">💡</span>' +
          '<div>没有邀请码？<a href="#" onclick="GalileoAuth.showContact(state.pendingTarget);return false" style="color:var(--accent-600);font-weight:500;">联系客服咨询开通</a>，我们会安排商务与您对接。</div>' +
        '</div>' +
      '</div>';
    open();
  }

  /* ---------- 渲染成功 ---------- */
  function showSuccess(target) {
    var t = target || state.pendingTarget || "能力";
    var modal = document.getElementById("auth-modal");
    modal.innerHTML =
      '<button class="modal-close" onclick="GalileoAuth.close()">×</button>' +
      '<div class="modal-header">' +
        '<div class="modal-success-icon">✅</div>' +
        '<h3>申请已提交</h3>' +
        '<p>「' + esc(t) + '」的使用申请已收到，我们会尽快为您开通。客服将通过您预留的联系方式与您对接。</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="invite-note">' +
          '<span class="invite-note-icon">⚡</span>' +
          '<div>如果需求较急，可以<a href="' + KEFU + '" target="_blank" rel="noopener" style="color:var(--accent-600);font-weight:500;">扫码添加客服企业微信</a>，加速开通。</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-outline btn-lg full" onclick="GalileoAuth.close()">完成</button>' +
      '</div>';
    state.inviteVerified = true;
  }

  /* ---------- 渲染咨询留资 ---------- */
  function showContact(target) {
    state.pendingTarget = target || state.pendingTarget;
    var modal = document.getElementById("auth-modal") || (init(), document.getElementById("auth-modal"));
    modal.innerHTML =
      '<button class="modal-close" onclick="GalileoAuth.close()">×</button>' +
      '<div class="modal-header">' +
        '<div class="modal-icon">💬</div>' +
        '<h3>联系商务咨询</h3>' +
        '<p>告诉我们您的需求，商务团队会尽快与您联系，协助您开通「' + esc(state.pendingTarget || '能力') + '」。</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<form onsubmit="return GalileoAuth._doContact(event)">' +
          '<div class="form-group">' +
            '<label class="form-label">姓名 <span style="color:#B91C1C;">*</span></label>' +
            '<input class="form-input" type="text" name="name" required placeholder="联系人姓名"' + (state.user && state.user.name ? ' value="' + esc(state.user.name) + '"' : '') + '>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">手机号 <span style="color:#B91C1C;">*</span></label>' +
            '<input class="form-input" type="tel" name="phone" required placeholder="便于客服回访"' + (state.user && state.user.phone ? ' value="' + esc(state.user.phone) + '"' : '') + '>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">企业名称 <span style="color:#B91C1C;">*</span></label>' +
            '<input class="form-input" type="text" name="company" required placeholder="您所在的企业">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">您的身份 <span style="color:#B91C1C;">*</span></label>' +
            '<div class="role-select">' +
              '<button type="button" class="role-chip" onclick="GalileoAuth._pickRole(this)">工业企业</button>' +
              '<button type="button" class="role-chip" onclick="GalileoAuth._pickRole(this)">OPC 合作伙伴</button>' +
              '<button type="button" class="role-chip" onclick="GalileoAuth._pickRole(this)">开发者</button>' +
              '<button type="button" class="role-chip" onclick="GalileoAuth._pickRole(this)">设备供应商</button>' +
              '<button type="button" class="role-chip" onclick="GalileoAuth._pickRole(this)">服务商</button>' +
            '</div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">需求描述（选填）</label>' +
            '<textarea class="form-input" name="desc" rows="3" placeholder="补充说明您的具体需求" style="resize:vertical;font-family:inherit;"></textarea>' +
          '</div>' +
          '<input type="hidden" name="interest" value="' + esc(state.pendingTarget || '') + '">' +
          '<button type="submit" class="btn btn-accent btn-lg full">提交咨询</button>' +
        '</form>' +
      '</div>';
    open();
  }

  /* ---------- 业务动作 ---------- */
  // 核心：点击使用的主入口（PRD 10.1 / 10.2 流程）
  function clickUse(target) {
    init();
    state.pendingTarget = target;
    if (!state.loggedIn) {
      showLogin(target);  // 未登录 → 登录
    } else {
      showInvite(target); // 已登录 → 邀请码
    }
  }

  // 登录提交（演示版：验证码 000000 通过）
  function _doLogin(e) {
    e.preventDefault();
    var f = e.target;
    var phone = f.phone.value.trim();
    var code = f.code.value.trim();
    if (!/^1\d{10}$/.test(phone)) { _tip("请输入正确的手机号"); return false; }
    if (code.length < 4) { _tip("请输入验证码"); return false; }
    // 模拟登录成功
    state.loggedIn = true;
    state.user = { phone: phone, name: "", role: "" };
    persist();
    // PRD 6.4：登录后自动进入邀请码校验
    showInvite(state.pendingTarget);
    return false;
  }

  // 注册提交
  function _doRegister(e) {
    e.preventDefault();
    var f = e.target;
    var phone = f.phone.value.trim();
    var code = f.code.value.trim();
    if (!/^1\d{10}$/.test(phone)) { _tip("请输入正确的手机号"); return false; }
    if (code.length < 4) { _tip("请输入验证码"); return false; }
    state.loggedIn = true;
    state.user = { phone: phone, name: f.name.value.trim(), role: "" };
    persist();
    // PRD 6.4：注册成功后自动进入邀请码
    showInvite(state.pendingTarget);
    return false;
  }

  // 邀请码提交（演示版：GALILEO-xxx 通用码，或 DEMO-xxx 通过）
  function _doInvite(e) {
    e.preventDefault();
    var input = e.target.invite.value.trim().toUpperCase();
    var errBox = document.getElementById("invite-error");
    errBox.style.display = "none";

    if (!input) {
      errBox.textContent = "请输入邀请码";
      errBox.style.display = "block";
      return false;
    }
    // 模拟校验规则（PRD 7.3）
    var valid = /^(GALILEO|DEMO|OPC)-[A-Z0-9]{4,}$/.test(input);
    if (!valid) {
      errBox.textContent = "邀请码无效，请检查后重试，或联系客服获取开通方式";
      errBox.style.display = "block";
      return false;
    }
    // 校验通过
    state.inviteVerified = true;
    showSuccess(state.pendingTarget);
    return false;
  }

  // 咨询提交
  function _doContact(e) {
    e.preventDefault();
    showSuccess(state.pendingTarget);
    return false;
  }

  // 发送验证码（演示版：倒计时）
  function _sendCode(btn) {
    if (btn.disabled) return;
    var phone = btn.closest(".modal-body").querySelector('input[name="phone"]');
    if (phone && !/^1\d{10}$/.test(phone.value.trim())) {
      _tip("请先输入正确的手机号");
      return;
    }
    var sec = 60;
    btn.disabled = true;
    btn.textContent = sec + "s 后重试";
    var t = setInterval(function () {
      sec--;
      btn.textContent = sec + "s 后重试";
      if (sec <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = "获取验证码"; }
    }, 1000);
    _tip("验证码已发送（演示版任意数字可通过）");
  }

  // 角色选择
  function _pickRole(btn) {
    var siblings = btn.parentNode.querySelectorAll(".role-chip");
    siblings.forEach(function (s) { s.classList.remove("selected"); });
    btn.classList.add("selected");
  }

  // 切换登录/注册
  function _switch(mode) { renderLogin(mode); }

  // 轻提示
  function _tip(msg) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;top:24px;left:50%;transform:translateX(-50%);background:var(--ink-900);color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:2000;box-shadow:0 8px 24px rgba(0,0,0,0.2);opacity:0;transition:opacity .3s;";
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; });
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 300); }, 2200);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // 退出登录
  function logout() {
    state.loggedIn = false;
    state.user = null;
    state.inviteVerified = false;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  // 是否已登录
  function isLoggedIn() { return state.loggedIn; }

  return {
    init: init,
    clickUse: clickUse,
    showLogin: showLogin,
    showInvite: showInvite,
    showContact: showContact,
    showSuccess: showSuccess,
    close: close,
    logout: logout,
    isLoggedIn: isLoggedIn,
    // 内部方法（供 onclick 调用）
    _doLogin: _doLogin,
    _doRegister: _doRegister,
    _doInvite: _doInvite,
    _doContact: _doContact,
    _sendCode: _sendCode,
    _pickRole: _pickRole,
    _switch: _switch,
    _tip: _tip,
    _state: state
  };
})();

// 自动初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.GalileoAuth.init);
} else {
  window.GalileoAuth.init();
}
