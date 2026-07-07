/* ============================================
 * Galileo OS · 前台数据覆盖层
 * admin-runtime.js
 *
 * 作用：从后端 API 获取后台编辑的覆盖数据，
 *       合并到 window.XXX_DATA，让前台反映修改。
 *       全站所有访客可见。
 *
 * 加载时机：必须在各 *-data.js 和 api-client.js 之后执行。
 * 降级：API 失败则不覆盖（前台仍可用原始 data.js）。
 * ============================================ */
(function () {
  "use strict";

  // 全局变量名 → 类型 key 映射
  var MAP = {
    APPS_DATA: "apps",
    AGENTS_DATA: "agents",
    SKILLS_DATA: "skills",
    KNOWLEDGE_DATA: "knowledge",
    SOLUTIONS_DATA: "solutions",
    INDUSTRIES_DATA: "industries",
    ENGINES_DATA: "engines"
  };

  // 优先用 API，降级到 localStorage（本地开发无后端时）
  function applyOverrides(overrides) {
    Object.keys(MAP).forEach(function (gvar) {
      var typeKey = MAP[gvar];
      var base = window[gvar];
      if (!base || typeof base !== "object") return;
      var ov = overrides[typeKey];
      if (!ov || typeof ov !== "object") return;
      Object.keys(ov).forEach(function (itemKey) {
        var v = ov[itemKey];
        try {
          if (v === null) {
            delete base[itemKey];
          } else {
            base[itemKey] = JSON.parse(JSON.stringify(v));
          }
        } catch (e) {
          if (window.console) console.warn("[admin-runtime] 覆盖失败 " + typeKey + "." + itemKey, e);
        }
      });
    });
  }

  function applyLocalFallback() {
    // 降级：读 localStorage（本地开发或 API 不可用时）
    try {
      var ov = JSON.parse(localStorage.getItem("galileo_admin_overrides") || "{}");
      if (Object.keys(ov).length) applyOverrides(ov);
    } catch (e) {}
  }

  // 优先走 API
  if (window.GalileoAPI && window.GalileoAPI.getOverrides) {
    window.GalileoAPI.getOverrides().then(function (overrides) {
      if (overrides && Object.keys(overrides).length) {
        applyOverrides(overrides);
        // 重新触发详情页渲染（如果详情页已渲染，需重新执行）
        if (window.GalileoRuntimeRefresh && typeof window.GalileoRuntimeRefresh === 'function') {
          window.GalileoRuntimeRefresh();
        }
      }
    }).catch(function () {
      applyLocalFallback();
    });
  } else {
    // api-client.js 未加载，直接降级
    applyLocalFallback();
  }
})();
