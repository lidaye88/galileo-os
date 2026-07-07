# Galileo OS 宝塔部署文档

## 架构

```
用户浏览器 → Nginx（宝塔）
              ├─ 静态文件（HTML/CSS/JS）→ 直接返回
              └─ /api/* → 反代 → Node.js(端口3100) → MySQL
```

---

## 第 1 步：创建 MySQL 数据库

宝塔面板 → **数据库** → **添加数据库**：
- 数据库名：`galileo_os`
- 用户名：`galileo`
- 密码：自己设一个强密码（记下来，等下要用）
- 访问权限：本地服务器
- 字符集：utf8mb4

---

## 第 2 步：上传代码

宝塔 → **网站** → **添加站点**：
- 域名：`galileo.idmakers.cn`
- 根目录：`/www/wwwroot/galileo.idmakers.cn`
- PHP 版本：**纯静态**

宝塔 → **终端**：
```bash
cd /www/wwwroot/galileo.idmakers.cn

# 清空默认文件
rm -f index.html 404.html

# 克隆代码
git clone https://github.com/lidaye88/galileo-os.git .

# 确认文件就位
ls -la
```

---

## 第 3 步：配置后端数据库连接

宝塔 → **终端**：
```bash
cd /www/wwwroot/galileo.idmakers.cn/server

# 编辑 db.js，修改数据库密码
```

打开 `/www/wwwroot/galileo.idmakers.cn/server/db.js`，修改这三行：
```js
user: 'galileo',           // ← 你的数据库用户名
password: 'YOUR_PASSWORD', // ← 改成你刚才设的密码
database: 'galileo_os',    // ← 你的数据库名
```

可以用宝塔的**文件管理器**找到 `server/db.js`，右键编辑。

---

## 第 4 步：安装依赖并启动

宝塔 → **终端**：
```bash
cd /www/wwwroot/galileo.idmakers.cn/server

# 安装依赖
npm install

# 测试启动（Ctrl+C 退出）
node index.js
# 看到 "[Galileo OS API] 服务已启动" 说明成功

# 用 PM2 守护进程（保持后台运行）
pm2 start ecosystem.config.cjs
pm2 save
```

验证：浏览器访问 `http://galileo.idmakers.cn/api/health`，应返回：
```json
{"ok":true,"service":"galileo-os-api","time":"..."}
```

---

## 第 5 步：配置 Nginx 反向代理

宝塔 → **网站** → 点击 `galileo.idmakers.cn` → **配置文件**

在 `server { }` 块内（`location / { }` 之前）加入：
```nginx
    # API 反代到 Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

保存 → **重启 Nginx**（宝塔会自动提示）

---

## 第 6 步：配置 SSL（HTTPS）

宝塔 → 网站 → `galileo.idmakers.cn` → **SSL** → **Let's Encrypt** → 申请 → 开启**强制 HTTPS**

---

## 第 7 步：验证

1. 访问 `https://galileo.idmakers.cn/` → 看到网站首页
2. 访问 `https://galileo.idmakers.cn/admin.html` → 输入密码 `galileo2026` → 进后台
3. 后台编辑一个 Agent → 保存
4. **换一个浏览器/手机**访问该 Agent 详情页 → 能看到修改 ← 这就是数据库生效了

---

## 后续更新代码

```bash
cd /www/wwwroot/galileo.idmakers.cn
git pull origin main

# 如果 server/ 有更新
cd server && npm install && pm2 restart galileo-os-api
```

---

## 替换图片

宝塔 → 文件管理器 → `/www/wwwroot/galileo.idmakers.cn/assets/` → 上传覆盖

---

## 常见问题

### Q: 后台显示"服务器连接失败"？
A: Node 服务没启动或数据库密码不对。终端执行 `pm2 logs galileo-os-api` 看报错。

### Q: API 返回 502？
A: Node 服务没运行。执行 `pm2 start ecosystem.config.cjs`（在 server/ 目录下）。

### Q: 前台正常但后台编辑不生效？
A: 检查 Nginx 反代配置是否加了 `/api/` location。`curl http://localhost:3100/api/health` 测试。

### Q: 数据库连不上？
A: 检查 db.js 的密码、宝塔数据库的访问权限（需"本地服务器"或"所有人"）。
