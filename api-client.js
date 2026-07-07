/* ============================================
 * Galileo OS · 前端 API 客户端
 * 封装所有 /api/* 调用，带错误降级
 *
 * 降级策略：API 失败不影响前台展示（用原始 data.js）
 * ============================================ */
(function () {
  "use strict";

  // API 基础路径（同域，通过 Nginx 反代）
  var BASE = '/api';
  // 本地开发时（无后端），改为 localhost:3100
  // var BASE = 'http://localhost:3100/api';

  // 后台密码（与 admin.js 一致，仅后台写接口用）
  var ADMIN_PWD = 'galileo2026';

  /* ---------- 通用请求 ---------- */
  function request(method, path, body, isAdmin) {
    var headers = { 'Content-Type': 'application/json' };
    if (isAdmin) headers['X-Admin-Password'] = ADMIN_PWD;
    return fetch(BASE + path, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* ---------- 内容覆盖 ---------- */
  var API = {
    // 获取全量覆盖数据（前台用）
    getOverrides: function () {
      return request('GET', '/overrides').catch(function () { return {}; });
    },
    // 保存一条覆盖（后台用）
    saveOverride: function (type, key, data) {
      return request('PUT', '/overrides/' + encodeURIComponent(type) + '/' + encodeURIComponent(key), data, true);
    },
    // 删除一条（标记 null）
    deleteOverride: function (type, key) {
      return request('DELETE', '/overrides/' + encodeURIComponent(type) + '/' + encodeURIComponent(key), null, true);
    },
    // 重置全部
    resetOverrides: function () {
      return request('DELETE', '/overrides', null, true);
    },

    /* ---------- 用户申请 ---------- */
    getApplications: function () {
      return request('GET', '/applications', null, true).catch(function () { return []; });
    },
    submitApplication: function (rec) {
      return request('POST', '/applications', rec);
    },
    updateAppStatus: function (id, status) {
      return request('PATCH', '/applications/' + encodeURIComponent(id), { status: status }, true);
    },
    deleteApplication: function (id) {
      return request('DELETE', '/applications/' + encodeURIComponent(id), null, true);
    },

    /* ---------- API 密钥 ---------- */
    getKeys: function () {
      return request('GET', '/keys', null, true).catch(function () { return []; });
    },
    createKey: function (name) {
      return request('POST', '/keys', { name: name }, true);
    },
    updateKeyStatus: function (id, status) {
      return request('PATCH', '/keys/' + encodeURIComponent(id), { status: status }, true);
    },
    deleteKey: function (id) {
      return request('DELETE', '/keys/' + encodeURIComponent(id), null, true);
    },

    /* ---------- 健康检查 ---------- */
    health: function () {
      return request('GET', '/health').catch(function () { return { ok: false }; });
    }
  };

  window.GalileoAPI = API;
})();
