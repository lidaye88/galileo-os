/* ============================================
 * Galileo OS · 后端 API 服务
 * Express + MySQL
 * 端口: 3100（通过 Nginx 反代 /api）
 * ============================================ */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { getPool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3100;

// 后台写接口的密码（与前端 admin.js 一致）
const ADMIN_PASSWORD = 'galileo2026';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

/* ---------- 中间件：后台鉴权 ---------- */
// 写接口需要 header 带 X-Admin-Password
function adminAuth(req, res, next) {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权：需要管理员密码' });
  }
  next();
}

/* ============================================
 * 1. 内容覆盖 API（前台读 + 后台写）
 * ============================================ */

// 获取全量覆盖数据（前台 admin-runtime.js 调用）
// 返回格式：{ apps: { mes: {...} }, agents: {...}, ... }
app.get('/api/overrides', async (req, res) => {
  try {
    const [rows] = await getPool().execute('SELECT type, item_key, data FROM overrides');
    const result = {};
    rows.forEach(r => {
      if (!result[r.type]) result[r.type] = {};
      // data 是 null 表示删除标记
      result[r.type][r.item_key] = r.data;
    });
    res.json(result);
  } catch (e) {
    console.error('[API] getOverrides error:', e.message);
    res.status(500).json({ error: '数据库错误' });
  }
});

// 写/改一条覆盖（后台保存）
app.put('/api/overrides/:type/:key', adminAuth, async (req, res) => {
  const { type, key } = req.params;
  const data = req.body; // 完整记录对象
  try {
    await getPool().execute(
      'INSERT INTO overrides (type, item_key, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
      [type, key, JSON.stringify(data)]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[API] saveOverride error:', e.message);
    res.status(500).json({ error: '保存失败' });
  }
});

// 删除一条覆盖（标记 null = 逻辑删除，前台会隐藏该条目）
app.delete('/api/overrides/:type/:key', adminAuth, async (req, res) => {
  const { type, key } = req.params;
  try {
    await getPool().execute(
      'INSERT INTO overrides (type, item_key, data) VALUES (?, ?, NULL) ON DUPLICATE KEY UPDATE data = NULL',
      [type, key]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[API] deleteOverride error:', e.message);
    res.status(500).json({ error: '删除失败' });
  }
});

// 重置全部覆盖（清空表）
app.delete('/api/overrides', adminAuth, async (req, res) => {
  try {
    await getPool().execute('TRUNCATE TABLE overrides');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '重置失败' });
  }
});

/* ============================================
 * 2. 用户申请 API（前台提交 + 后台管理）
 * ============================================ */

// 获取所有申请（后台用）
app.get('/api/applications', adminAuth, async (req, res) => {
  try {
    const [rows] = await getPool().execute(
      'SELECT * FROM applications ORDER BY created_at DESC'
    );
    res.json(rows.map(r => ({
      id: r.id, name: r.name, phone: r.phone, company: r.company,
      role: r.role, interest: r.interest, desc: r.desc_text,
      status: r.status, createdAt: r.created_at ? new Date(r.created_at).toISOString() : null
    })));
  } catch (e) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 提交申请（前台用户用，无需鉴权）
app.post('/api/applications', async (req, res) => {
  const { name, phone, company, role, interest, desc } = req.body;
  if (!name || !/^1\d{10}$/.test(phone || '') || !company || !role) {
    return res.status(400).json({ error: '信息不完整' });
  }
  const id = 'a_' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex');
  try {
    await getPool().execute(
      'INSERT INTO applications (id, name, phone, company, role, interest, desc_text, status) VALUES (?, ?, ?, ?, ?, ?, ?, "pending")',
      [id, name, phone, company, role, interest || '', desc || '']
    );
    res.json({ ok: true, id });
  } catch (e) {
    console.error('[API] submitApplication error:', e.message);
    res.status(500).json({ error: '提交失败' });
  }
});

// 改申请状态（后台用）
app.patch('/api/applications/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'contacted', 'opened', 'ignored'].includes(status)) {
    return res.status(400).json({ error: '无效状态' });
  }
  try {
    await getPool().execute('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '更新失败' });
  }
});

// 删除申请（后台用）
app.delete('/api/applications/:id', adminAuth, async (req, res) => {
  try {
    await getPool().execute('DELETE FROM applications WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '删除失败' });
  }
});

/* ============================================
 * 3. API 密钥管理（后台用）
 * ============================================ */

// 获取密钥列表
app.get('/api/keys', adminAuth, async (req, res) => {
  try {
    const [rows] = await getPool().execute('SELECT * FROM api_keys ORDER BY created_at DESC');
    res.json(rows.map(r => ({
      id: r.id, key: r.key, name: r.name, scope: r.scope,
      status: r.status,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : null,
      lastUsed: r.last_used ? new Date(r.last_used).toISOString() : null,
      calls: r.calls || 0
    })));
  } catch (e) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 生成新密钥
app.post('/api/keys', adminAuth, async (req, res) => {
  const { name } = req.body;
  const id = 'k_' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex');
  const keyStr = 'gal_sk_live_' + crypto.randomBytes(16).toString('hex');
  try {
    await getPool().execute(
      'INSERT INTO api_keys (id, `key`, name, scope, status) VALUES (?, ?, ?, "all", "active")',
      [id, keyStr, name || '未命名密钥']
    );
    res.json({ ok: true, rec: { id, key: keyStr, name: name || '未命名密钥', scope: 'all', status: 'active', createdAt: new Date().toISOString(), lastUsed: null, calls: 0 } });
  } catch (e) {
    res.status(500).json({ error: '生成失败' });
  }
});

// 改密钥状态（吊销/恢复）
app.patch('/api/keys/:id', adminAuth, async (req, res) => {
  const { status } = req.body;
  if (!['active', 'revoked'].includes(status)) {
    return res.status(400).json({ error: '无效状态' });
  }
  try {
    await getPool().execute('UPDATE api_keys SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '更新失败' });
  }
});

// 删除密钥
app.delete('/api/keys/:id', adminAuth, async (req, res) => {
  try {
    await getPool().execute('DELETE FROM api_keys WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '删除失败' });
  }
});

/* ---------- 健康检查 ---------- */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'galileo-os-api', time: new Date().toISOString() });
});

/* ---------- 启动 ---------- */
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`[Galileo OS API] 服务已启动: http://localhost:${PORT}`);
      console.log(`[Galileo OS API] 健康检查: http://localhost:${PORT}/api/health`);
    });
  } catch (e) {
    console.error('[启动失败]', e.message);
    process.exit(1);
  }
}

start();
