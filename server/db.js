/* ============================================
 * Galileo OS · 数据库连接与建表
 * ============================================ */

const mysql = require('mysql2/promise');

// 数据库配置（部署时修改为你自己的）
const dbConfig = {
  host: 'localhost',
  user: 'galileo',           // ← 改成你的 MySQL 用户名
  password: 'YOUR_PASSWORD', // ← 改成你的 MySQL 密码
  database: 'galileo_os',    // ← 改成你的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
};

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// 建表
async function initDB() {
  const conn = await getPool().getConnection();
  try {
    // 内容覆盖表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS overrides (
        type VARCHAR(20) NOT NULL,
        item_key VARCHAR(100) NOT NULL,
        data JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (type, item_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 用户申请表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(30) PRIMARY KEY,
        name VARCHAR(50),
        phone VARCHAR(20),
        company VARCHAR(100),
        role VARCHAR(50),
        interest VARCHAR(200),
        desc_text TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // API 密钥表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id VARCHAR(30) PRIMARY KEY,
        \`key\` VARCHAR(60) UNIQUE NOT NULL,
        name VARCHAR(100),
        scope VARCHAR(20) DEFAULT 'all',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP NULL,
        calls INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('[DB] 表创建/确认成功');
  } finally {
    conn.release();
  }
}

module.exports = { getPool, initDB, dbConfig };
