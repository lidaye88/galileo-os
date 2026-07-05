/* ============================================
 * Galileo OS · 前台数据覆盖层
 * admin-runtime.js
 *
 * 作用：读取浏览器 localStorage 中的后台编辑结果，
 *       覆盖 window.XXX_DATA 的对应条目，让前台立即反映修改。
 *
 * 加载时机：必须在各 *-data.js 之后、详情页渲染脚本之前执行。
 *          推荐放在 <script src="xxx-data.js"></script> 紧随其后。
 *
 * 安全性：无 localStorage 时完全空操作，前台表现与无此文件一致。
 * ============================================ */
(function () {
  "use strict";

  var LS_KEY = "galileo_admin_overrides";

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

  // 读取覆盖数据
  var overrides = {};
  try {
    overrides = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch (e) {
    if (window.console) console.warn("[admin-runtime] overrides 解析失败，忽略：", e);
    return;
  }

  // 逐类型合并覆盖
  Object.keys(MAP).forEach(function (gvar) {
    var typeKey = MAP[gvar];
    var base = window[gvar];
    if (!base || typeof base !== "object") return;       // 该页面没加载此数据文件，跳过
    var ov = overrides[typeKey];
    if (!ov || typeof ov !== "object") return;            // 无覆盖，跳过

    Object.keys(ov).forEach(function (itemKey) {
      var v = ov[itemKey];
      try {
        if (v === null) {
          // 删除标记
          delete base[itemKey];
        } else {
          // 新增 / 覆盖（深拷贝避免污染）
          base[itemKey] = JSON.parse(JSON.stringify(v));
        }
      } catch (e) {
        if (window.console) console.warn("[admin-runtime] 应用覆盖失败 " + typeKey + "." + itemKey + "：", e);
      }
    });
  });
})();
