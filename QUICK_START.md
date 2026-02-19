# DM3 MCP Server 快速开始

## 🚀 三种使用方式

### 方式一：本地安装（推荐，无需npm发布）

```bash
# 1. 克隆项目
git clone https://github.com/LegnaOS/dm-mcp.git
cd dm-mcp

# 2. 运行安装脚本
bash scripts/install-local.sh

# 3. 完成！现在可以全局使用
dm3-mcp-server
```

安装后，在 MCP 客户端配置中使用：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "dm3-mcp-server",
      "env": {
        "DM3_PROJECTS_DIR": "/path/to/your/projects"
      }
    }
  }
}
```

### 方式二：直接运行（开发/测试）

```bash
# 1. 克隆并构建
git clone https://github.com/LegnaOS/dm-mcp.git
cd dm-mcp
npm install
npm run build

# 2. 在 MCP 客户端配置中使用完整路径
```

配置示例（macOS/Linux）：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/Users/你的用户名/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "/Users/你的用户名/dm-projects"
      }
    }
  }
}
```

配置示例（Windows）：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["C:/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "C:/dm-projects"
      }
    }
  }
}
```

### 方式三：npm 发布后使用（未来）

发布到 npm 后，用户可以：

```bash
# 全局安装
npm install -g dm3-mcp-server

# 或直接使用 npx
npx dm3-mcp-server
```

配置：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "npx",
      "args": ["dm3-mcp-server"]
    }
  }
}
```

## 📝 配置 MCP 客户端

### Kiro IDE

创建或编辑 `.kiro/settings/mcp.json`：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "dm3-mcp-server",
      "env": {
        "DM3_PROJECTS_DIR": "/path/to/projects"
      },
      "disabled": false,
      "autoApprove": [
        "dm3_list_projects",
        "dm3_search_docs",
        "dm3_get_api_reference"
      ]
    }
  }
}
```

### Claude Desktop

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "dm3-mcp-server"
    }
  }
}
```

### 其他编辑器

查看完整配置指南：[docs/MCP-CLIENTS.md](docs/MCP-CLIENTS.md)

## 🎮 开始使用

在 AI 助手中尝试：

```
创建一个新的 DM3 游戏项目，名称为 "my_rpg"，标题为 "我的RPG游戏"
```

```
在 my_rpg 项目中生成一个角色：
- 名称：勇者
- 生命值：1000
- 魔法值：500
```

```
搜索 DM3 文档中关于 "技能系统" 的内容
```

## 🔍 验证安装

### 检查命令是否可用

```bash
# 如果使用方式一安装
which dm3-mcp-server
dm3-mcp-server --version

# 如果使用方式二
node /path/to/dm-mcp/dist/index.js
```

### 检查文件完整性

```bash
cd dm-mcp

# 检查必要目录
ls -la dist/        # 编译后的代码
ls -la dm_fw/       # DM3 引擎（31MB）
ls -la dm3_docs/    # DM3 文档（660KB）
```

### 测试 MCP 连接

在 Kiro 或其他 MCP 客户端中：

1. 重启编辑器
2. 检查 MCP 服务器状态
3. 尝试使用 DM3 工具

## ❓ 常见问题

### 1. 找不到 node 命令

**问题**：`/bin/sh: node: command not found`

**解决方案**：
- 使用方式一（本地安装），会自动处理路径
- 或者在配置中使用 Node.js 的完整路径：

```bash
# 查找 Node.js 路径
which node
# 输出：/Users/xxx/.nvm/versions/node/v22.19.0/bin/node

# 在配置中使用完整路径
{
  "command": "/Users/xxx/.nvm/versions/node/v22.19.0/bin/node",
  "args": ["/path/to/dm-mcp/dist/index.js"]
}
```

### 2. 缺少 dm_fw 或 dm3_docs

**问题**：项目运行时找不到框架或文档

**解决方案**：
```bash
# 重新克隆项目
git clone https://github.com/LegnaOS/dm-mcp.git

# 检查文件
ls -la dm_fw/
ls -la dm3_docs/
```

### 3. Windows 路径问题

**问题**：路径中的反斜杠导致错误

**解决方案**：
- 使用正斜杠：`C:/dm-mcp/dist/index.js`
- 或使用双反斜杠：`C:\\dm-mcp\\dist\\index.js`

## 📚 更多资源

- [完整文档](README.md)
- [MCP 客户端配置](docs/MCP-CLIENTS.md)
- [API 参考](docs/API.md)
- [使用指南](docs/USAGE.md)
- [开发指南](docs/DEVELOPMENT.md)
- [npm 发布指南](NPM_PUBLISH.md)

## 🎉 开始创作

现在你已经准备好使用 AI 助手开发 DM3 游戏了！

试试这些命令：
- `dm3_create_project` - 创建新项目
- `dm3_generate_actor` - 生成角色
- `dm3_generate_item` - 生成道具
- `dm3_generate_skill` - 生成技能
- `dm3_search_docs` - 搜索文档
- `dm3_get_api_reference` - 查询 API

祝你游戏开发愉快！🎮✨
