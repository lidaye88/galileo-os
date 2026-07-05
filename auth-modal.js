/* ============================================
 * Galileo OS · 准入弹窗系统
 *
 * 当前为邀请注册制（暂未开放公开注册）：
 *   - 全站「登录」按钮 → showLogin() 打开登录弹窗
 *   - 登录弹窗两个 Tab：
 *       · 登录：手机号+验证码（演示版，需管理员开通后可用）
 *       · 提交申请：填写信息 → 存 localStorage → 后台审核 → 线下开通
 *   - 申请记录在 admin.html「申请留言」视图查看
 *
 * 用法：
 *   <script src="auth-modal.js"></script>
 *   GalileoAuth.init();              // 初始化（注入弹窗 DOM）
 *   GalileoAuth.showLogin();         // 打开登录弹窗
 *   GalileoAuth.showLogin('能力名'); // 带 pendingTarget
 * ============================================ */

window.GalileoAuth = (function () {
  var KEFU = "https://work.weixin.qq.com/kfid/kfc6e28eb8ad6d63cf7";
  var STORAGE_KEY = "galileo_auth_state";
  var LS_APPS = "galileo_applications";   // 申请记录（后台读取）

  // 内存状态（模拟登录态）
  var state = {
    loggedIn: false,
    user: null,        // { phone, name, role }
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
        '<h3>' + (isLogin ? '登录到 Galileo OS' : '申请试用') + '</h3>' +
        '<p>' + (isLogin
          ? '登录后即可使用平台能力' + (state.pendingTarget ? '（当前：' + esc(state.pendingTarget) + '）' : '')
          : '平台为非开放注册。登记您的试用需求，资源就绪后我们会短信通知您开通。') + '</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="auth-tabs">' +
          '<button class="auth-tab ' + (isLogin ? 'active' : '') + '" onclick="GalileoAuth._switch(\'login\')">登录</button>' +
          '<button class="auth-tab ' + (!isLogin ? 'active' : '') + '" onclick="GalileoAuth._switch(\'apply\')">申请试用</button>' +
        '</div>' +

        (isLogin ?
          // ===== 登录表单 =====
          '<div class="invite-note" style="margin-bottom:20px;background:#FEF3C7;border:1px solid #FCD34D;">' +
            '<span class="invite-note-icon">💡</span>' +
            '<div>平台为<strong>非开放注册</strong>，登录需管理员开通。还没有账号？<a href="#" onclick="GalileoAuth._switch(\'apply\');return false" style="color:var(--accent-600);font-weight:600;">点此申请试用 →</a></div>' +
          '</div>' +
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
          // ===== 申请试用登记表单（无需邀请码，直接登记）=====
          '<div class="invite-note" style="margin-bottom:20px;background:var(--accent-50);border:1px solid var(--accent-500);">' +
            '<span class="invite-note-icon">🚀</span>' +
            '<div>平台当前为<strong>非开放注册</strong>。填写下方信息登记试用需求，我们会在资源就绪后通过短信主动联系您开通。</div>' +
          '</div>' +
          '<form onsubmit="return GalileoAuth._doApply(event)">' +
            '<div class="form-group">' +
              '<label class="form-label">姓名 <span style="color:#B91C1C;">*</span></label>' +
              '<input class="form-input" type="text" name="name" required placeholder="如何称呼您">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">手机号 <span style="color:#B91C1C;">*</span></label>' +
              '<input class="form-input" type="tel" name="phone" required placeholder="用于接收开通通知（短信）" maxlength="11">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">企业名称 <span style="color:#B91C1C;">*</span></label>' +
              '<input class="form-input" type="text" name="company" required placeholder="您所在的企业">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">您的身份 <span style="color:#B91C1C;">*</span></label>' +
              '<div class="role-select">' +
                '<button type="button" class="role-chip" data-role="工业企业" onclick="GalileoAuth._pickRole(this)">工业企业</button>' +
                '<button type="button" class="role-chip" data-role="OPC 合作伙伴" onclick="GalileoAuth._pickRole(this)">OPC 合作伙伴</button>' +
                '<button type="button" class="role-chip" data-role="开发者" onclick="GalileoAuth._pickRole(this)">开发者</button>' +
                '<button type="button" class="role-chip" data-role="设备供应商" onclick="GalileoAuth._pickRole(this)">设备供应商</button>' +
                '<button type="button" class="role-chip" data-role="服务商" onclick="GalileoAuth._pickRole(this)">服务商</button>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">想使用的能力（选填）</label>' +
              '<input class="form-input" type="text" name="interest" placeholder="如：MES、排产 Agent、设备预测维护…"' + (state.pendingTarget ? ' value="' + esc(state.pendingTarget) + '"' : '') + '>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">需求描述（选填）</label>' +
              '<textarea class="form-input" name="desc" rows="3" placeholder="简单描述您的场景或痛点，便于我们精准对接" style="resize:vertical;font-family:inherit;"></textarea>' +
            '</div>' +
            '<button type="submit" class="btn btn-accent btn-lg full" style="margin-top:8px;">提交试用申请</button>' +
          '</form>'
        ) +
      '</div>' +
      '<div class="modal-footer">' +
        '<p class="form-footer">提交即代表同意 <a href="agreement.html" target="_blank">服务协议</a> 与 <a href="privacy.html" target="_blank">隐私政策</a></p>' +
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

  /* ---------- 渲染申请成功页 ---------- */
  function showApplySuccess(rec) {
    var modal = document.getElementById("auth-modal");
    modal.innerHTML =
      '<button class="modal-close" onclick="GalileoAuth.close()">×</button>' +
      '<div class="modal-header">' +
        '<div class="modal-success-icon">✅</div>' +
        '<h3>申请已提交</h3>' +
        '<p>' + esc(rec.name) + '，试用申请已登记！我们会在 <strong>资源就绪后</strong> 通过短信（' + esc(rec.phone) + '）通知您开通，请保持手机畅通。</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="invite-note">' +
          '<span class="invite-note-icon">⚡</span>' +
          '<div>需求比较急？可以<a href="' + KEFU + '" target="_blank" rel="noopener" style="color:var(--accent-600);font-weight:500;">点击联系客服企业微信</a>，加速开通。</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-outline btn-lg full" onclick="GalileoAuth.close()">完成</button>' +
      '</div>';
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
  // 核心：点击使用的主入口
  function clickUse(target) {
    init();
    state.pendingTarget = target;
    showLogin(target);  // 统一打开登录弹窗
  }

  // 登录提交（演示版：验证码任意 4 位通过）
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
    _tip("登录成功");
    close();
    return false;
  }

  // 提交申请（替代原 _doRegister）
  function _doApply(e) {
    e.preventDefault();
    var f = e.target;
    var name = f.name.value.trim();
    var phone = f.phone.value.trim();
    var company = f.company.value.trim();
    var roleEl = f.querySelector('.role-chip.selected');
    var role = roleEl ? roleEl.dataset.role || roleEl.textContent : '';
    var interest = f.interest ? f.interest.value.trim() : (state.pendingTarget || '');
    var desc = f.desc ? f.desc.value.trim() : '';

    if (!name) { _tip("请填写姓名"); return false; }
    if (!/^1\d{10}$/.test(phone)) { _tip("请输入正确的手机号"); return false; }
    if (!company) { _tip("请填写企业名称"); return false; }
    if (!role) { _tip("请选择您的身份"); return false; }

    // 生成试用申请记录，存 localStorage（后台读取）
    var rec = {
      id: "a_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name,
      phone: phone,
      company: company,
      role: role,
      interest: interest,
      desc: desc,
      createdAt: new Date().toISOString(),
      status: "pending"   // pending / contacted / opened / ignored
    };
    var arr = [];
    try { arr = JSON.parse(localStorage.getItem(LS_APPS) || "[]"); } catch (err) {}
    arr.unshift(rec);
    try { localStorage.setItem(LS_APPS, JSON.stringify(arr)); } catch (err) {}

    showApplySuccess(rec);
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

  // 切换登录/注册（离开 apply 时重置邀请码状态）
  function _switch(mode) {
    if (mode !== "apply") {
      // 切到登录页：保留验证状态以便切回，但不强制清空
    }
    renderLogin(mode);
  }

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
    _doApply: _doApply,
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
