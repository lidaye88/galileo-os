/* ============================================
 * Galileo OS · 内容管理后台核心逻辑
 * admin.js
 *
 * 功能：密码门禁 / CRUD / 宽松代码解析 / localStorage / 导出 data.js
 * 依赖：前台已加载对应 *-data.js（提供 window.XXX_DATA 原始数据）
 * ============================================ */

(function () {
  "use strict";

  /* ============ 配置 ============ */
  // ⚠️ 修改此处即可改后台密码
  var ADMIN_PASSWORD = "galileo2026";
  var LS_OVERRIDES = "galileo_admin_overrides";   // 覆盖数据
  var LS_AUTH = "galileo_admin_auth";              // 登录态
  var LS_LOCK = "galileo_admin_lock";              // 锁定信息
  var LS_KEYS = "galileo_admin_apikeys";           // API 密钥库

  /* ============ 5 种类型注册表（行业实践 / OS 引擎不在后台管理）============ */
  var TYPES = [
    { key: "apps",       gvar: "APPS_DATA",       label: "应用市场",   short: "应用",  detailPage: "app-detail.html",      dataFile: "apps-data.js" },
    { key: "agents",     gvar: "AGENTS_DATA",     label: "Agent 市场", short: "Agent", detailPage: "agent-detail.html",    dataFile: "agents-data.js" },
    { key: "skills",     gvar: "SKILLS_DATA",     label: "Skill 市场", short: "Skill", detailPage: "skill-detail.html",    dataFile: "skills-data.js" },
    { key: "knowledge",  gvar: "KNOWLEDGE_DATA",  label: "知识库",     short: "知识",  detailPage: "knowledge-detail.html", dataFile: "knowledge-data.js" },
    { key: "solutions",  gvar: "SOLUTIONS_DATA",  label: "解决方案",   short: "方案",  detailPage: "solution-detail.html",  dataFile: "solutions-data.js" }
  ];
  function typeOf(key) { return TYPES.filter(function (t) { return t.key === key; })[0]; }
  function getData(t) { return window[t.gvar] || {}; }

  /* ============ 当前状态 ============ */
  var state = {
    currentType: null,    // "apps" | ...
    currentKey: null,     // 选中的条目 key
    mode: "visual",       // "visual" | "code"
    search: ""
  };

  /* ============ localStorage 读写 ============ */
  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(LS_OVERRIDES) || "{}"); }
    catch (e) { return {}; }
  }
  function saveOverrides(o) {
    localStorage.setItem(LS_OVERRIDES, JSON.stringify(o));
  }
  // 获取某类型合并后的数据（原始 + 覆盖）
  function mergedData(t) {
    var base = clone(getData(t));
    var ov = loadOverrides()[t.key] || {};
    Object.keys(ov).forEach(function (k) {
      if (ov[k] === null) delete base[k];
      else base[k] = ov[k];
    });
    return base;
  }
  // 是否被覆盖过
  function isDirty(typeKey, itemKey) {
    var ov = loadOverrides()[typeKey];
    return !!(ov && Object.prototype.hasOwnProperty.call(ov, itemKey));
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ============ Toast ============ */
  function toast(msg, kind) {
    kind = kind || "ok";
    var wrap = document.getElementById("toastWrap");
    if (!wrap) return;
    var el = document.createElement("div");
    el.className = "admin-toast " + kind;
    el.innerHTML = '<span>' + esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = "all .2s";
      setTimeout(function () { el.remove(); }, 250);
    }, 2600);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ============ 确认弹窗 ============ */
  function confirmDialog(title, msg, onYes, danger) {
    var modal = document.createElement("div");
    modal.className = "admin-modal";
    modal.innerHTML =
      '<div class="admin-modal-card">' +
        '<h3>' + esc(title) + '</h3>' +
        '<p>' + esc(msg) + '</p>' +
        '<div class="am-actions">' +
          '<button class="admin-btn admin-btn-light" data-act="no">取消</button>' +
          '<button class="admin-btn ' + (danger ? "admin-btn-danger" : "admin-btn-primary") + '" data-act="yes">确定</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.dataset.act === "no") modal.remove();
      if (e.target.dataset.act === "yes") { onYes(); modal.remove(); }
    });
  }

  /* ============ 密码门禁 ============ */
  function checkLock() {
    var lock = null;
    try { lock = JSON.parse(localStorage.getItem(LS_LOCK) || "null"); } catch (e) {}
    if (lock && lock.until && Date.now() < lock.until) {
      var mins = Math.ceil((lock.until - Date.now()) / 60000);
      return { locked: true, mins: mins };
    }
    return { locked: false };
  }

  function showLockScreen() {
    var lockInfo = checkLock();
    var lock = document.createElement("div");
    lock.className = "admin-lock";
    lock.id = "lockScreen";
    lock.innerHTML =
      '<div class="admin-lock-card">' +
        '<div class="lock-logo">' +
          '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' +
          '</svg>' +
        '</div>' +
        '<h1>Galileo OS 内容管理</h1>' +
        '<p>请输入管理员密码以继续</p>' +
        (lockInfo.locked
          ? '<div class="lock-error">已锁定，请 ' + lockInfo.mins + ' 分钟后再试</div>' +
            '<button disabled>已锁定</button>'
          : '<input type="password" id="pwdInput" placeholder="管理员密码" autocomplete="off">' +
            '<div class="lock-error" id="pwdError"></div>' +
            '<button id="pwdSubmit">进入后台</button>' +
            '<p style="margin-top:16px;font-size:11px;color:var(--text-inverse-3);">默认密码 galileo2026（可在 admin.js 修改）</p>'
        ) +
      '</div>';
    document.body.innerHTML = "";
    document.body.className = "admin-body";
    document.body.appendChild(lock);

    if (!lockInfo.locked) {
      var input = document.getElementById("pwdInput");
      var btn = document.getElementById("pwdSubmit");
      var err = document.getElementById("pwdError");
      input.focus();
      function tryLogin() {
        var val = input.value.trim();
        if (val === ADMIN_PASSWORD) {
          localStorage.setItem(LS_AUTH, JSON.stringify({ at: Date.now(), user: "admin" }));
          localStorage.removeItem(LS_LOCK);
          init(); // 重新初始化
        } else {
          var lock = JSON.parse(localStorage.getItem(LS_LOCK) || '{"fails":0}');
          lock.fails = (lock.fails || 0) + 1;
          if (lock.fails >= 5) {
            lock.until = Date.now() + 5 * 60000;
            lock.fails = 0;
            err.textContent = "错误次数过多，已锁定 5 分钟";
            toast("密码错误次数过多，已锁定 5 分钟", "err");
          } else {
            err.textContent = "密码错误，还剩 " + (5 - lock.fails) + " 次机会";
          }
          localStorage.setItem(LS_LOCK, JSON.stringify(lock));
          input.value = "";
          input.focus();
        }
      }
      btn.addEventListener("click", tryLogin);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });
    }
  }

  function logout() {
    localStorage.removeItem(LS_AUTH);
    showLockScreen();
  }

  /* ============ 宽松代码解析器 ============ */
  // 接受：整个对象源码，如：
  //   "mes": { name: "MES", modules: [...] }    ← 带 key
  //   { name: "MES", modules: [...] }            ← 不带 key
  //   mes: { ... }                               ← 不带引号的 key
  // 支持注释、单双引号、尾逗号、未加引号的 key
  function parseLoose(code) {
    code = String(code || "").trim();
    if (!code) throw new Error("内容为空");
    var key = null, body = code;
    // 检测是否是 "key": {...} 或 key: {...} 形式
    // 找到第一个冒号，且前面没有 { } [ ]
    var m = code.match(/^(['"]?)([a-zA-Z0-9_-]+)\1\s*:\s*(\{[\s\S]*\})\s*;?\s*$/);
    if (m) {
      key = m[2];
      body = m[3];
    } else {
      // 可能是不带 key 的 {...}
      if (body[0] !== "{") {
        // 尝试包一层 {}
        body = "{\n" + body + "\n}";
      }
    }
    // 用 Function 容错执行
    var obj;
    try {
      obj = (new Function("return (" + body + ")"))();
    } catch (e) {
      throw new Error("语法错误：" + e.message);
    }
    if (obj == null || typeof obj !== "object" || Array.isArray(obj)) {
      throw new Error("解析结果不是对象");
    }
    return { key: key, obj: obj };
  }

  /* ============ 渲染：左侧菜单 ============ */
  function renderSidenav() {
    var html = "";
    html += '<div class="admin-nav-section">';
    html += '<div class="admin-nav-label">内容类型</div>';
    TYPES.forEach(function (t) {
      var count = Object.keys(mergedData(t)).length;
      var dirtyCount = countDirty(t.key);
      html += '<div class="admin-nav-item' + (state.currentType === t.key ? " active" : "") + (dirtyCount > 0 ? " dirty" : "") + '" data-type="' + t.key + '">' +
        '<span><span class="nav-dot"></span>' + esc(t.label) + '</span>' +
        '<span class="nav-count">' + count + (dirtyCount > 0 ? "*" : "") + '</span>' +
      '</div>';
    });
    html += '</div>';
    html += '<div class="admin-nav-divider"></div>';
    html += '<div class="admin-nav-section">';
    html += '<div class="admin-nav-label">开发者</div>';
    var keyCount = loadKeys().length;
    html += '<div class="admin-nav-item' + (state.currentType === "apikeys" ? " active" : "") + '" data-type="apikeys">' +
      '<span><span class="nav-dot"></span>API 密钥</span>' +
      '<span class="nav-count">' + keyCount + '</span>' +
    '</div>';
    html += '</div>';
    html += '<div class="admin-nav-divider"></div>';
    html += '<div class="admin-nav-section">';
    html += '<div class="admin-nav-label">数据</div>';
    html += '<div class="admin-nav-action" id="navExportAll">' +
      '<span style="display:flex;align-items:center;gap:8px;">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      '导出全部 data.js</span></div>';
    html += '<div class="admin-nav-action danger" id="navReset">' +
      '<span style="display:flex;align-items:center;gap:8px;">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' +
      '重置所有修改</span></div>';
    html += '</div>';
    var nav = document.getElementById("sidenav");
    nav.innerHTML = html;
    nav.querySelectorAll(".admin-nav-item").forEach(function (el) {
      el.addEventListener("click", function () {
        state.currentType = el.dataset.type;
        state.currentKey = null;
        state.mode = "visual";
        renderAll();
      });
    });
    document.getElementById("navExportAll").addEventListener("click", exportAll);
    document.getElementById("navReset").addEventListener("click", resetAll);
  }

  function countDirty(typeKey) {
    var ov = loadOverrides()[typeKey];
    return ov ? Object.keys(ov).length : 0;
  }

  /* ============ 渲染：中间列表 ============ */
  function renderListpane() {
    var pane = document.getElementById("listpane");
    if (!state.currentType) {
      pane.innerHTML = '<div class="admin-empty">请从左侧选择内容类型</div>';
      return;
    }
    // API 密钥视图
    if (state.currentType === "apikeys") {
      renderKeysListpane(pane);
      return;
    }
    var t = typeOf(state.currentType);
    var data = mergedData(t);
    var keys = Object.keys(data).filter(function (k) {
      if (!state.search) return true;
      var s = state.search.toLowerCase();
      return k.toLowerCase().indexOf(s) >= 0 ||
        String(data[k].name || "").toLowerCase().indexOf(s) >= 0;
    });

    var html = '<div class="admin-list-header">' +
      '<div class="admin-list-header-top">' +
        '<h3>' + esc(t.label) + '（' + keys.length + '）</h3>' +
        '<button class="admin-btn admin-btn-primary admin-btn-sm" id="newItemBtn">+ 新建</button>' +
      '</div>' +
      '<div class="admin-search">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" id="searchInput" placeholder="搜索 key 或名称…" value="' + esc(state.search) + '">' +
      '</div>' +
    '</div>' +
    '<div class="admin-list-body">';

    if (keys.length === 0) {
      html += '<div class="admin-empty">无匹配条目</div>';
    } else {
      keys.forEach(function (k) {
        var item = data[k];
        var status = item.status || "live";
        var statusText = { live: "已上架", beta: "内测", soon: "即将", invite: "邀约" }[status] || status;
        var dirty = isDirty(t.key, k);
        html += '<div class="admin-item-row' + (state.currentKey === k ? " active" : "") + '" data-key="' + esc(k) + '">' +
          '<span class="ai-key">' + esc(k) + '</span>' +
          '<span class="ai-name">' + esc(item.name || "(未命名)") + '</span>' +
          (dirty ? '<span class="ai-dirty" title="已修改"></span>' : '') +
          '<span class="ai-status ' + status + '">' + statusText + '</span>' +
        '</div>';
      });
    }
    html += '</div>';
    pane.innerHTML = html;

    document.getElementById("newItemBtn").addEventListener("click", newItem);
    var si = document.getElementById("searchInput");
    si.addEventListener("input", function () {
      state.search = si.value;
      renderListpane();
    });
    pane.querySelectorAll(".admin-item-row").forEach(function (row) {
      row.addEventListener("click", function () {
        state.currentKey = row.dataset.key;
        state.mode = "visual";
        renderListpane();
        renderEditor();
      });
    });
  }

  /* ============================================
   * ============ API 密钥管理 ==================
   * 密钥格式：gal_sk_live_<32位随机>（带前缀，便于辨认）
   * 存储：galileo_admin_apikeys → [{ id, key, name, scope, createdAt, status }]
   * 全站通用密钥，调用 Agent / Skill 时作鉴权凭证
   * ============================================ */
  function loadKeys() {
    try { return JSON.parse(localStorage.getItem(LS_KEYS) || "[]"); }
    catch (e) { return []; }
  }
  function saveKeys(arr) {
    localStorage.setItem(LS_KEYS, JSON.stringify(arr));
  }
  // 生成随机字符串（crypto 优先，降级 Math.random）
  function randStr(len) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var out = "";
    if (window.crypto && window.crypto.getRandomValues) {
      var buf = new Uint32Array(len);
      window.crypto.getRandomValues(buf);
      for (var i = 0; i < len; i++) out += chars[buf[i] % chars.length];
    } else {
      for (var j = 0; j < len; j++) out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }
  function generateKey() {
    return "gal_sk_live_" + randStr(32);
  }
  // 简易 id
  function genId() {
    return "k_" + Date.now().toString(36) + randStr(4).toLowerCase();
  }

  function addKey(name) {
    var arr = loadKeys();
    var rec = {
      id: genId(),
      key: generateKey(),
      name: name || "未命名密钥",
      scope: "all",          // 全站通用
      createdAt: new Date().toISOString(),
      lastUsed: null,
      calls: 0,
      status: "active"
    };
    arr.unshift(rec);
    saveKeys(arr);
    return rec;
  }

  function revokeKey(id) {
    var arr = loadKeys().map(function (k) {
      if (k.id === id) k.status = "revoked";
      return k;
    });
    saveKeys(arr);
  }
  function deleteKey(id) {
    saveKeys(loadKeys().filter(function (k) { return k.id !== id; }));
  }

  // 复制到剪贴板（带降级）
  function copyText(text, cb) {
    function done() { if (cb) cb(true); }
    function fail() { if (cb) cb(false); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text) ? done() : fail();
      });
    } else {
      fallbackCopy(text) ? done() : fail();
    }
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ----- 渲染：密钥中间面板 ----- */
  function renderKeysListpane(pane) {
    var allKeys = loadKeys();
    var keys = allKeys.filter(function (k) {
      if (!state.search) return true;
      var s = state.search.toLowerCase();
      return (k.name || "").toLowerCase().indexOf(s) >= 0 ||
        k.key.toLowerCase().indexOf(s) >= 0;
    });

    var html = '<div class="admin-list-header">' +
      '<div class="admin-list-header-top">' +
        '<h3>API 密钥（' + allKeys.length + '）</h3>' +
        '<button class="admin-btn admin-btn-primary admin-btn-sm" id="newKeyBtn">+ 生成密钥</button>' +
      '</div>' +
      '<div class="admin-search">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" id="searchInput" placeholder="搜索密钥名或前缀…" value="' + esc(state.search) + '">' +
      '</div>' +
    '</div>';

    html += '<div class="admin-key-intro">' +
      '<b>密钥用途：</b>供其他智能体（如 Coze / Dify / n8n / 自研系统）调用本平台 Agent / Skill 时鉴权。' +
      '调用方式：在请求头加 <code>Authorization: Bearer gal_sk_live_xxxx</code>。' +
    '</div>';

    html += '<div class="admin-list-body admin-key-list">';
    if (keys.length === 0) {
      html += '<div class="admin-empty">暂无密钥，点击「生成密钥」创建</div>';
    } else {
      keys.forEach(function (k) {
        var masked = k.status === "revoked"
          ? '<span class="key-value revoked">' + esc(k.key) + '</span>'
          : '<span class="key-value" data-full="' + esc(k.key) + '">' + esc(maskKey(k.key)) + '</span>';
        var created = k.createdAt ? new Date(k.createdAt).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";
        var lastUsed = k.lastUsed ? new Date(k.lastUsed).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "从未调用";
        html += '<div class="admin-key-card' + (k.status === "revoked" ? " is-revoked" : "") + '" data-id="' + esc(k.id) + '">' +
          '<div class="akc-head">' +
            '<div class="akc-title">' +
              '<span class="akc-name">' + esc(k.name) + '</span>' +
              (k.status === "revoked"
                ? '<span class="akc-status revoked">已吊销</span>'
                : '<span class="akc-status active">生效中</span>') +
            '</div>' +
            '<span class="akc-created">创建于 ' + esc(created) + '</span>' +
          '</div>' +
          '<div class="akc-key-row">' + masked + '</div>' +
          '<div class="akc-meta">' +
            '<span>最近调用：' + esc(lastUsed) + '</span>' +
            '<span>调用次数：' + esc(String(k.calls || 0)) + '</span>' +
          '</div>' +
          '<div class="akc-actions">' +
            '<button class="admin-btn admin-btn-light admin-btn-sm" data-act="show" data-id="' + esc(k.id) + '">显示完整</button>' +
            '<button class="admin-btn admin-btn-light admin-btn-sm" data-act="copy" data-id="' + esc(k.id) + '">复制</button>' +
            (k.status === "revoked"
              ? '<button class="admin-btn admin-btn-danger admin-btn-sm" data-act="del" data-id="' + esc(k.id) + '">删除</button>'
              : '<button class="admin-btn admin-btn-danger admin-btn-sm" data-act="revoke" data-id="' + esc(k.id) + '">吊销</button>') +
          '</div>' +
        '</div>';
      });
    }
    html += '</div>';
    pane.innerHTML = html;

    // 搜索
    var si = document.getElementById("searchInput");
    si.addEventListener("input", function () { state.search = si.value; renderKeysListpane(pane); });
    // 新建
    document.getElementById("newKeyBtn").addEventListener("click", promptNewKey);
    // 卡片操作
    pane.querySelectorAll("[data-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.dataset.act, id = btn.dataset.id;
        var rec = loadKeys().filter(function (k) { return k.id === id; })[0];
        if (!rec) return;
        if (act === "copy") {
          copyText(rec.key, function (ok) {
            toast(ok ? "密钥已复制到剪贴板" : "复制失败，请手动选择复制", ok ? "ok" : "err");
          });
        } else if (act === "show") {
          // 切换显示
          var span = pane.querySelector('.admin-key-card[data-id="' + id + '"] .key-value');
          if (span) {
            if (span.dataset.shown === "1") {
              span.textContent = maskKey(rec.key);
              span.dataset.shown = "0";
              btn.textContent = "显示完整";
            } else {
              span.textContent = rec.key;
              span.dataset.shown = "1";
              btn.textContent = "隐藏";
            }
          }
        } else if (act === "revoke") {
          confirmDialog("确认吊销此密钥？", "吊销后使用此密钥的调用将立即失败。此操作不可恢复。\n\n密钥：「" + rec.name + "」", function () {
            revokeKey(id);
            toast("密钥已吊销", "ok");
            renderAll();
          }, true);
        } else if (act === "del") {
          confirmDialog("确认彻底删除？", "将彻底移除已吊销的密钥记录：「" + rec.name + "」", function () {
            deleteKey(id);
            toast("已删除", "ok");
            renderAll();
          }, true);
        }
      });
    });
  }

  function maskKey(key) {
    if (!key || key.length < 16) return "****";
    return key.slice(0, 14) + "****" + key.slice(-4);
  }

  function promptNewKey() {
    var name = window.prompt("请为密钥起个名字（便于识别用途，如「Coze 调用」「内部 ERP 对接」）：", "");
    if (name === null) return; // 取消
    name = name.trim() || "未命名密钥";
    var rec = addKey(name);
    // 立即复制 + 提示完整密钥（唯一一次完整展示的机会）
    copyText(rec.key, function (ok) {
      toast("密钥已生成" + (ok ? "并复制到剪贴板，请妥善保存" : "，请手动复制保存") + "（离开后将不再完整显示）", "ok");
    });
    renderAll();
    // 弹出完整密钥让用户确认保存
    setTimeout(function () {
      window.alert("新密钥已生成（已复制）：\n\n" + rec.key + "\n\n请妥善保存，出于安全考虑，列表中默认掩码显示。\n点击「显示完整」可再次查看。");
    }, 100);
  }

  /* ============ 渲染：右侧编辑器 ============ */
  function renderEditor() {
    var ed = document.getElementById("editor");
    if (!state.currentType) {
      ed.innerHTML = emptyEditor("请选择内容类型", "从左侧菜单选择要管理的内容类型");
      return;
    }
    // API 密钥视图（不使用右侧编辑器，密钥管理全部在中间列表完成）
    if (state.currentType === "apikeys") {
      ed.innerHTML = emptyEditor(
        "API 密钥管理",
        "在中间面板生成、复制、吊销密钥。密钥供其他智能体或第三方系统调用本平台 Agent / Skill 时鉴权使用。"
      );
      return;
    }
    if (!state.currentKey) {
      var t = typeOf(state.currentType);
      ed.innerHTML = emptyEditor("请选择或新建" + t.short, "在中间列表选择一个条目编辑，或点击「新建」创建");
      return;
    }
    var t = typeOf(state.currentType);
    var data = mergedData(t);
    var item = data[state.currentKey];
    if (!item) {
      ed.innerHTML = emptyEditor("条目不存在", "可能已被删除");
      return;
    }

    if (state.mode === "code") {
      renderCodeMode(t, item);
    } else {
      renderVisualMode(t, item);
    }
  }

  function emptyEditor(title, msg) {
    return '<div class="admin-editor-empty">' +
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' +
      '</svg>' +
      '<p>' + esc(title) + '</p>' +
      '<p style="font-size:12.5px;">' + esc(msg) + '</p>' +
    '</div>';
  }

  /* ----- 可视化模式 ----- */
  function renderVisualMode(t, item) {
    var ed = document.getElementById("editor");
    var dirty = isDirty(t.key, state.currentKey);

    var html = '<div class="admin-editor-header">' +
      '<div class="admin-editor-title">' +
        '<h3>' + esc(item.name || "(未命名)") + '</h3>' +
        '<span class="et-key">' + esc(state.currentKey) + '</span>' +
        (dirty ? '<span class="admin-btn admin-btn-sm" style="background:#FEF3C7;color:#92400E;cursor:default;">已修改</span>' : '') +
      '</div>' +
      '<div class="admin-mode-tabs">' +
        '<button class="admin-mode-tab active" data-mode="visual">可视化</button>' +
        '<button class="admin-mode-tab" data-mode="code">代码模式</button>' +
      '</div>' +
    '</div>';

    // 表单
    html += '<div class="admin-form">';
    // 基本字段
    html += fieldRow([
      textField("name", "名称", item.name, true),
      textField("icon", "图标/缩写", item.icon, false, "如 MES、EAM，或 emoji，用于卡片展示")
    ]);
    html += fieldRow([
      selectField("status", "状态", item.status, [
        ["live", "已上架"], ["beta", "内测中"], ["soon", "即将上架"], ["invite", "邀约开放"]
      ]),
      textField("category", "分类", item.category)
    ]);
    html += fieldRow([
      textField("version", "版本", item.version),
      textField("updatedAt", "更新日期", item.updatedAt, false, "如 2026-06-30")
    ]);
    html += fieldRow([
      textField("provider", "提供方", item.provider),
      tagsField("tags", "标签", item.tags)
    ]);
    html += textField("oneLine", "一句话介绍", item.oneLine, false, "", "full");
    html += textareaField("overview", "详细简介", item.overview, false, "tall");

    // 类型特有字段
    html += '<div style="margin:24px 0 8px;padding-top:16px;border-top:1px solid var(--border-subtle);font-size:12px;color:var(--text-quaternary);letter-spacing:0.04em;">' + esc(t.short) + '专属字段（在代码模式可编辑全部字段）</div>';

    // 通用：价格
    if (item.pricing) {
      html += '<details open style="margin-bottom:16px;border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:0;">' +
        '<summary style="padding:10px 14px;cursor:pointer;font-size:13px;font-weight:600;background:var(--gray-50);">价格信息</summary>' +
        '<div style="padding:14px;">' + renderSubObject(item.pricing, "pricing") + '</div>' +
      '</details>';
    }
    // 通用：规格 specs
    if (item.specs) {
      html += '<details style="margin-bottom:16px;border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:0;">' +
        '<summary style="padding:10px 14px;cursor:pointer;font-size:13px;font-weight:600;background:var(--gray-50);">技术规格（' + (Array.isArray(item.specs) ? item.specs.length : 0) + ' 项）</summary>' +
        '<div style="padding:14px;font-size:12px;color:var(--text-secondary);">在「代码模式」中编辑此数组结构更方便。</div>' +
      '</details>';
    }

    html += '</div>';

    // 底部操作
    html += '<div class="admin-editor-footer">' +
      '<div class="ef-left">最后保存后，前台页面刷新即生效（同一浏览器）</div>' +
      '<div class="ef-right">' +
        '<a class="admin-btn admin-btn-light admin-btn-sm" href="' + t.detailPage + '?id=' + encodeURIComponent(state.currentKey) + '" target="_blank">预览</a>' +
        '<button class="admin-btn admin-btn-danger admin-btn-sm" id="delBtn">删除</button>' +
        '<button class="admin-btn admin-btn-primary" id="saveBtn">保存修改</button>' +
      '</div>' +
    '</div>';

    ed.innerHTML = html;

    // 绑定事件
    ed.querySelectorAll(".admin-mode-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.mode = tab.dataset.mode;
        renderEditor();
      });
    });
    document.getElementById("saveBtn").addEventListener("click", function () { saveVisual(t, item); });
    document.getElementById("delBtn").addEventListener("click", function () { deleteItem(t); });
    bindTagsInput();
  }

  /* ----- 代码模式 ----- */
  function renderCodeMode(t, item) {
    var ed = document.getElementById("editor");
    var dirty = isDirty(t.key, state.currentKey);
    // 序列化当前对象为可读 JS 源码（带 key）
    var serialized = stringifyJS(state.currentKey, item);

    var html = '<div class="admin-editor-header">' +
      '<div class="admin-editor-title">' +
        '<h3>' + esc(item.name || "(未命名)") + '</h3>' +
        '<span class="et-key">' + esc(state.currentKey) + '</span>' +
        (dirty ? '<span class="admin-btn admin-btn-sm" style="background:#FEF3C7;color:#92400E;cursor:default;">已修改</span>' : '') +
      '</div>' +
      '<div class="admin-mode-tabs">' +
        '<button class="admin-mode-tab" data-mode="visual">可视化</button>' +
        '<button class="admin-mode-tab active" data-mode="code">代码模式</button>' +
      '</div>' +
    '</div>';

    html += '<div class="admin-code-mode">' +
      '<div class="admin-code-hint">' +
        '直接编辑下方对象源码，支持 <code>注释</code>、<code>尾逗号</code>、<code>单引号</code>、<code>不带引号的 key</code>。' +
        '点击「解析并保存」即生效。<br>' +
        '第一行 <code>"key": { ... }</code> 中的 key 决定条目 ID（留空则保留原 key）。' +
      '</div>' +
      '<textarea class="admin-code-area" id="codeArea" spellcheck="false">' + esc(serialized) + '</textarea>' +
      '<div class="admin-code-status" id="codeStatus"></div>' +
      '<div class="admin-code-actions">' +
        '<button class="admin-btn admin-btn-primary" id="parseBtn">解析并保存</button>' +
        '<button class="admin-btn admin-btn-light admin-btn-sm" id="formatBtn">重新格式化</button>' +
        '<a class="admin-btn admin-btn-light admin-btn-sm" href="' + t.detailPage + '?id=' + encodeURIComponent(state.currentKey) + '" target="_blank">预览</a>' +
        '<span style="flex:1;"></span>' +
        '<button class="admin-btn admin-btn-danger admin-btn-sm" id="delBtn2">删除条目</button>' +
      '</div>' +
    '</div>';

    ed.innerHTML = html;

    ed.querySelectorAll(".admin-mode-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.mode = tab.dataset.mode;
        renderEditor();
      });
    });
    document.getElementById("parseBtn").addEventListener("click", function () { saveCode(t); });
    document.getElementById("formatBtn").addEventListener("click", function () {
      try {
        var parsed = parseLoose(document.getElementById("codeArea").value);
        document.getElementById("codeArea").value = stringifyJS(parsed.key || state.currentKey, parsed.obj);
        showCodeStatus("已格式化", "ok");
      } catch (e) { showCodeStatus(e.message, "err"); }
    });
    document.getElementById("delBtn2").addEventListener("click", function () { deleteItem(t); });
  }

  function showCodeStatus(msg, kind) {
    var s = document.getElementById("codeStatus");
    if (!s) return;
    s.className = "admin-code-status show " + kind;
    s.textContent = (kind === "ok" ? "✓ " : "✗ ") + msg;
  }

  /* ============ 表单字段辅助 ============ */
  function fieldRow(fields) {
    return '<div class="admin-field-row">' + fields.join("") + '</div>';
  }
  function textField(name, label, val, required, hint, width) {
    return '<div class="admin-field" style="' + (width === "full" ? "grid-column:1/-1;" : "") + '">' +
      '<label>' + esc(label) + (required ? '<span class="req">*</span>' : '') + (hint ? '<span class="hint">' + esc(hint) + '</span>' : '') + '</label>' +
      '<input type="text" data-field="' + name + '" value="' + esc(val || "") + '">' +
    '</div>';
  }
  function textareaField(name, label, val, required, cls) {
    return '<div class="admin-field">' +
      '<label>' + esc(label) + (required ? '<span class="req">*</span>' : '') + '</label>' +
      '<textarea data-field="' + name + '" class="' + (cls || "") + '">' + esc(val || "") + '</textarea>' +
    '</div>';
  }
  function selectField(name, label, val, options) {
    var opts = options.map(function (o) {
      return '<option value="' + esc(o[0]) + '"' + (val === o[0] ? " selected" : "") + '>' + esc(o[1]) + '</option>';
    }).join("");
    return '<div class="admin-field">' +
      '<label>' + esc(label) + '</label>' +
      '<select data-field="' + name + '">' + opts + '</select>' +
    '</div>';
  }
  function tagsField(name, label, tags) {
    tags = Array.isArray(tags) ? tags : [];
    var chips = tags.map(function (tg, i) {
      return '<span class="tag-chip"><span>' + esc(tg) + '</span><span class="tag-x" data-i="' + i + '">×</span></span>';
    }).join("");
    return '<div class="admin-field">' +
      '<label>' + esc(label) + '<span class="hint">回车添加</span></label>' +
      '<div class="admin-tag-input" data-field="' + name + '">' + chips +
        '<input type="text" placeholder="添加后回车">' +
      '</div>' +
    '</div>';
  }
  function renderSubObject(obj, name) {
    var rows = Object.keys(obj).map(function (k) {
      var v = obj[k];
      if (Array.isArray(v)) v = "[" + v.length + " 项]";
      else if (typeof v === "object") v = "{对象}";
      return '<div class="admin-field">' +
        '<label>' + esc(k) + '</label>' +
        '<input type="text" value="' + esc(String(v)) + '" readonly style="background:var(--gray-50);color:var(--text-secondary);">' +
      '</div>';
    }).join("");
    return '<div>' + rows + '<p class="help">嵌套结构请在代码模式编辑</p></div>';
  }

  function bindTagsInput() {
    document.querySelectorAll(".admin-tag-input").forEach(function (box) {
      var inp = box.querySelector("input");
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && inp.value.trim()) {
          e.preventDefault();
          var chip = document.createElement("span");
          chip.className = "tag-chip";
          chip.innerHTML = '<span>' + esc(inp.value.trim()) + '</span><span class="tag-x">×</span>';
          box.insertBefore(chip, inp);
          inp.value = "";
          chip.querySelector(".tag-x").addEventListener("click", function () { chip.remove(); });
        }
      });
      box.querySelectorAll(".tag-x").forEach(function (x) {
        x.addEventListener("click", function () { x.closest(".tag-chip").remove(); });
      });
    });
  }

  function collectFormValues() {
    var obj = {};
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var field = el.dataset.field;
      if (el.tagName === "INPUT" && el.type === "text") {
        obj[field] = el.value;
      } else if (el.tagName === "TEXTAREA") {
        obj[field] = el.value;
      } else if (el.tagName === "SELECT") {
        obj[field] = el.value;
      } else if (el.classList.contains("admin-tag-input")) {
        var tags = [];
        el.querySelectorAll(".tag-chip span:first-child").forEach(function (s) { tags.push(s.textContent); });
        obj[field] = tags;
      }
    });
    return obj;
  }

  /* ============ 保存（可视化） ============ */
  function saveVisual(t, oldItem) {
    var form = collectFormValues();
    // 合并：保留旧的其他字段（如 modules、components 等复杂结构），覆盖表单字段
    var merged = clone(oldItem);
    Object.keys(form).forEach(function (k) { merged[k] = form[k]; });
    if (!merged.name) { toast("请填写名称", "err"); return; }
    writeOverride(t.key, state.currentKey, merged);
    toast("已保存「" + merged.name + "」，前台刷新即生效", "ok");
    renderSidenav();
    renderListpane();
    renderEditor();
  }

  /* ============ 保存（代码模式） ============ */
  function saveCode(t) {
    var code = document.getElementById("codeArea").value;
    try {
      var parsed = parseLoose(code);
      var newKey = parsed.key || state.currentKey;
      if (!parsed.obj.name) { showCodeStatus("对象缺少 name 字段", "err"); return; }
      // 如果 key 变了，需要删除旧的、写新的
      if (parsed.key && parsed.key !== state.currentKey) {
        if (!/^[a-z0-9][a-z0-9_-]*$/.i.test(newKey)) {
          showCodeStatus("key 只能包含字母、数字、下划线、短横线", "err");
          return;
        }
        confirmDialog(
          "确认更改 ID？",
          "ID 从「" + state.currentKey + "」变为「" + newKey + "」。\n注意：其他页面引用此 ID 的链接会失效（如 apps.components.agents[].id）。",
          function () {
            writeOverride(t.key, state.currentKey, null); // 删旧
            writeOverride(t.key, newKey, parsed.obj);     // 写新
            state.currentKey = newKey;
            showCodeStatus("解析成功，已保存（ID 已变更）", "ok");
            toast("ID 已变更为 " + newKey, "ok");
            renderSidenav();
            renderListpane();
            renderEditor();
          },
          true
        );
      } else {
        writeOverride(t.key, newKey, parsed.obj);
        showCodeStatus("解析成功，已保存", "ok");
        toast("已保存「" + parsed.obj.name + "」", "ok");
        renderSidenav();
        renderListpane();
        renderEditor();
      }
    } catch (e) {
      showCodeStatus(e.message, "err");
    }
  }

  /* ============ 写覆盖 ============ */
  function writeOverride(typeKey, itemKey, val) {
    var ov = loadOverrides();
    if (!ov[typeKey]) ov[typeKey] = {};
    if (val === null) ov[typeKey][itemKey] = null;  // 删除标记
    else ov[typeKey][itemKey] = val;
    saveOverrides(ov);
  }

  /* ============ 新建 ============ */
  function newItem() {
    var t = typeOf(state.currentType);
    var baseKey = "new-" + Date.now().toString(36).slice(-5);
    var key = window.prompt("请输入新条目的 ID（英文/数字/短横线，如 my-app）：", baseKey);
    if (!key) return;
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(key)) {
      toast("ID 格式不正确（仅字母数字下划线短横线，且不以短横线开头）", "err");
      return;
    }
    var existing = mergedData(t);
    if (existing[key]) { toast("ID「" + key + "」已存在", "err"); return; }
    var tpl = {
      name: "新" + t.short,
      icon: t.short,
      category: "",
      status: "soon",
      version: "v1.0",
      updatedAt: new Date().toISOString().slice(0, 10),
      provider: "思为交互",
      tags: [],
      oneLine: "请编辑一句话介绍",
      overview: "请编辑详细简介。"
    };
    writeOverride(t.key, key, tpl);
    state.currentKey = key;
    state.mode = "code"; // 新建直接进代码模式更高效
    toast("已新建「" + key + "」，请在代码模式完善内容", "ok");
    renderAll();
  }

  /* ============ 删除 ============ */
  function deleteItem(t) {
    confirmDialog(
      "确认删除？",
      "删除「" + state.currentKey + "」（" + (mergedData(t)[state.currentKey] || {}).name + "）\n此操作仅标记删除，原始 data.js 不变，可重置恢复。",
      function () {
        writeOverride(t.key, state.currentKey, null);
        state.currentKey = null;
        toast("已删除", "ok");
        renderAll();
      },
      true
    );
  }

  /* ============ 重置 ============ */
  function resetAll() {
    confirmDialog(
      "确认重置所有修改？",
      "将清除所有本地修改，恢复到 data.js 的原始状态。此操作不可恢复。",
      function () {
        localStorage.removeItem(LS_OVERRIDES);
        toast("已重置，所有修改已清除", "ok");
        renderAll();
      },
      true
    );
  }

  /* ============ 导出 ============ */
  function exportAll() {
    var count = 0;
    TYPES.forEach(function (t, i) {
      setTimeout(function () { exportOne(t); }, i * 400);
      count++;
    });
    toast("正在导出 " + count + " 个 data.js 文件，请注意浏览器下载", "ok");
  }

  function exportOne(t) {
    var data = mergedData(t);
    var header =
      "/* ============================================\n" +
      " * Galileo OS · " + t.label + "详情数据\n" +
      " * 由内容管理后台导出于 " + new Date().toISOString().slice(0, 16).replace("T", " ") + "\n" +
      " * 共 " + Object.keys(data).length + " 条\n" +
      " * ============================================ */\n\n";
    var body = "window." + t.gvar + " = {\n\n" +
      Object.keys(data).map(function (k) {
        return stringifyEntry(k, data[k], 0);
      }).join(",\n\n") +
      "\n\n};\n";
    download(t.dataFile, header + body);
  }

  function download(filename, text) {
    var blob = new Blob(["\uFEFF" + text], { type: "application/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  // 把 JS 对象序列化为可读源码（带缩进）
  function stringifyJS(key, obj, indent) {
    indent = indent || 0;
    var pad = repeat("  ", indent);
    var body = serialize(obj, indent);
    if (key) return pad + '"' + key + '": ' + body;
    return body;
  }
  function stringifyEntry(key, obj, indent) {
    return stringifyJS(key, obj, indent);
  }
  function serialize(val, indent) {
    var pad = repeat("  ", indent);
    var pad2 = repeat("  ", indent + 1);
    if (val === null || val === undefined) return "null";
    if (typeof val === "string") return quoteStr(val);
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) {
      if (val.length === 0) return "[]";
      var items = val.map(function (v) { return pad2 + serialize(v, indent + 1); });
      return "[\n" + items.join(",\n") + "\n" + pad + "]";
    }
    if (typeof val === "object") {
      var keys = Object.keys(val);
      if (keys.length === 0) return "{}";
      var pairs = keys.map(function (k) {
        var v = val[k];
        // key 是否合法标识符
        var kk = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : quoteStr(k);
        return pad2 + kk + ": " + serialize(v, indent + 1);
      });
      return "{\n" + pairs.join(",\n") + "\n" + pad + "}";
    }
    return quoteStr(String(val));
  }
  function quoteStr(s) {
    // 用双引号，转义内部双引号和换行
    return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + '"';
  }
  function repeat(s, n) { var r = ""; for (var i = 0; i < n; i++) r += s; return r; }

  /* ============ 渲染全部 ============ */
  function renderAll() {
    renderSidenav();
    renderListpane();
    renderEditor();
  }

  /* ============ 顶栏 ============ */
  function renderTopbar() {
    var tb = document.getElementById("topbar");
    tb.innerHTML =
      '<div class="admin-topbar-left">' +
        '<img src="assets/galileo-logo-nav-white.png" alt="Galileo OS">' +
        '<span class="at-title">Galileo OS · 内容管理</span>' +
        '<span class="at-sub">后台</span>' +
      '</div>' +
      '<div class="admin-topbar-right">' +
        '<a class="admin-btn admin-btn-ghost admin-btn-sm" href="index.html" target="_blank">打开前台</a>' +
        '<button class="admin-btn admin-btn-ghost admin-btn-sm" id="exportTopBtn">导出全部</button>' +
        '<button class="admin-btn admin-btn-ghost admin-btn-sm" id="logoutBtn">退出</button>' +
      '</div>';
    document.getElementById("exportTopBtn").addEventListener("click", exportAll);
    document.getElementById("logoutBtn").addEventListener("click", logout);
  }

  /* ============ 初始化 ============ */
  function init() {
    // 检查登录
    var auth = null;
    try { auth = JSON.parse(localStorage.getItem(LS_AUTH) || "null"); } catch (e) {}
    if (!auth) {
      showLockScreen();
      return;
    }
    // 已登录：构建界面
    document.body.className = "admin-body";
    document.body.innerHTML =
      '<div class="admin-topbar" id="topbar"></div>' +
      '<div class="admin-layout">' +
        '<aside class="admin-sidenav" id="sidenav"></aside>' +
        '<section class="admin-listpane" id="listpane"></section>' +
        '<main class="admin-editor" id="editor"></main>' +
      '</div>' +
      '<div class="admin-toast-wrap" id="toastWrap"></div>';
    renderTopbar();
    // 默认选中第一个类型
    if (!state.currentType) state.currentType = TYPES[0].key;
    renderAll();
  }

  // DOM 就绪后启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 暴露调试入口
  window.GalileoAdmin = {
    exportOne: exportOne,
    exportAll: exportAll,
    resetAll: resetAll,
    parseLoose: parseLoose,
    mergedData: mergedData,
    loadOverrides: loadOverrides
  };
})();
