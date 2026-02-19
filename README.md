# DM3 MCP Server

> 为 DM3 游戏引擎打造的 Model Context Protocol (MCP) 服务器，让 AI 助手帮你开发游戏！

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/dm3-mcp-server.svg)](https://www.npmjs.com/package/dm3-mcp-server)

## ✨ 特性

- 🎮 **完整的项目管理** - 创建、构建、运行 DM3 游戏项目
- 📝 **智能代码生成** - 自动生成角色、道具、技能、窗口等组件
- 🔍 **文档查询** - 快速查询 DM3 API 和使用指南
- ✅ **代码验证** - 检查 Lua 语法、GBK 编码、配置规范
- 🎯 **内置框架** - 无需外部 DM3 引擎，开箱即用
- 🤖 **AI 友好** - 完美集成 Kiro、Claude Desktop 等 MCP 客户端

## 📦 安装

### 方式一：通过 npm 安装（推荐）

```bash
npm install -g dm3-mcp-server
```

安装后，可以直接使用 `npx` 运行：

```bash
npx dm3-mcp-server
```

### 方式二：从源码安装

#### Windows 用户推荐安装路径

为了避免路径问题，强烈建议将项目放在简单的路径下：

- ✅ 推荐：`C:\dm-mcp`
- ✅ 推荐：`D:\dm-mcp`
- ❌ 不推荐：`C:\Users\你的用户名\Documents\项目\dm-mcp`（路径太长，可能有中文）

#### 1. 克隆项目

**Windows 用户（推荐）：**
```bash
# 打开命令提示符（CMD）或 PowerShell
cd C:\
git clone https://github.com/LegnaOS/dm-mcp.git
cd dm-mcp
```

**macOS/Linux 用户：**
```bash
git clone https://github.com/LegnaOS/dm-mcp.git
cd dm-mcp
```

#### 2. 安装依赖

```bash
npm install
```

> 💡 如果没有安装 Node.js，请先从 [nodejs.org](https://nodejs.org/) 下载安装（推荐 LTS 版本）

### 3. 构建项目

```bash
npm run build
```

### 4. 验证安装

**Windows 用户：**
```bash
# 在 Git Bash 中运行
bash scripts/verify-setup.sh

# 或者手动检查
dir dist
dir dm_fw
```

**macOS/Linux 用户：**
```bash
./scripts/verify-setup.sh
```

看到 "✅ 所有检查通过！" 就说明安装成功了！

## 🔧 配置 MCP 客户端

> 📚 **完整配置指南**：查看 [MCP 客户端配置指南](docs/MCP-CLIENTS.md) 了解所有支持的编辑器（Kiro、Claude Desktop、Cursor、VS Code、Windsurf、Zed、Cody 等）的详细配置方法。

### 快速配置示例

以下是 Kiro IDE 和 Claude Desktop 的快速配置示例。其他编辑器请查看[完整配置指南](docs/MCP-CLIENTS.md)。

### Kiro IDE

#### 使用 npx（推荐，无需关心路径）

```json
{
  "mcpServers": {
    "dm3": {
      "command": "npx",
      "args": ["dm3-mcp-server"],
      "env": {
        "DM3_PROJECTS_DIR": "C:/dm-projects"
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

#### 使用本地安装（从源码）

##### Windows 用户配置示例

假设你将项目安装在 `C:\dm-mcp`：

1. 打开或创建 `.kiro/settings/mcp.json`

2. 添加以下配置（**注意：Windows 路径使用双反斜杠 `\\` 或单斜杠 `/`**）：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["C:/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "C:/dm-mcp/projects"
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

或者使用双反斜杠：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["C:\\dm-mcp\\dist\\index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "C:\\dm-mcp\\projects"
      },
      "disabled": false
    }
  }
}
```

##### macOS/Linux 用户配置示例

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/绝对路径/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "/绝对路径/projects"
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

3. 重启 Kiro 或重新连接 MCP 服务器

4. 测试：在 Kiro 中输入 "列出所有 DM3 工具"

### Claude Desktop

#### Windows 用户配置

1. 编辑配置文件：`%APPDATA%\Claude\claude_desktop_config.json`
   
   快速打开方式：
   - 按 `Win + R`
   - 输入 `%APPDATA%\Claude`
   - 找到 `claude_desktop_config.json`

2. 添加配置：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["C:/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "C:/dm-mcp/projects"
      }
    }
  }
}
```

#### macOS 用户配置

1. 编辑配置文件：`~/Library/Application Support/Claude/claude_desktop_config.json`

2. 添加配置：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/绝对路径/dm-mcp/dist/index.js"]
    }
  }
}
```

3. 重启 Claude Desktop

### 常见路径问题

#### ❌ 错误示例
```json
"args": ["dm-mcp/dist/index.js"]  // 相对路径，不推荐
"args": ["C:\dm-mcp\dist\index.js"]  // 单反斜杠，JSON 中会出错
"args": ["C:\\用户\\文档\\dm-mcp\\dist\\index.js"]  // 包含中文，可能出错
```

#### ✅ 正确示例
```json
"args": ["C:/dm-mcp/dist/index.js"]  // 推荐：使用斜杠
"args": ["C:\\dm-mcp\\dist\\index.js"]  // 可以：双反斜杠
"args": ["D:/Projects/dm-mcp/dist/index.js"]  // 可以：D盘也行
```

## 🎮 使用示例

### 创建第一个游戏项目

在 AI 助手中输入：

```
使用 dm3_create_project 创建一个名为 "my_rpg" 的项目，标题为 "我的RPG游戏"
```

项目会自动包含完整的 DM3 引擎和框架！

### 生成游戏角色

```
使用 dm3_generate_actor 在 my_rpg 项目中创建主角：
- 名称：勇者
- 生命值：1000
- 魔法值：500
- 速度：5
```

### 生成道具

```
使用 dm3_generate_item 创建生命药水：
- 项目：my_rpg
- 名称：生命药水
- 类型：consumable
- 可堆叠：true
```

### 查询文档

```
使用 dm3_search_docs 搜索 "技能系统"
```

### 完整示例

查看 [examples/create-rpg-game.md](examples/create-rpg-game.md) 了解如何创建一个完整的 RPG 游戏。

## 🛠️ 可用工具

### 项目管理（4个）

| 工具 | 说明 |
|------|------|
| `dm3_create_project` | 创建新的 DM3 游戏项目 |
| `dm3_build_project` | 编译项目 |
| `dm3_run_project` | 运行项目 |
| `dm3_list_projects` | 列出所有项目 |

### 代码生成（4个）

| 工具 | 说明 |
|------|------|
| `dm3_generate_actor` | 生成角色配置 |
| `dm3_generate_item` | 生成道具配置 |
| `dm3_generate_skill` | 生成技能配置 |
| `dm3_generate_window` | 生成窗口配置 |

### 文档查询（4个）

| 工具 | 说明 |
|------|------|
| `dm3_search_docs` | 搜索文档 |
| `dm3_get_api_reference` | 获取 API 参考 |
| `dm3_get_example` | 获取代码示例 |
| `dm3_get_control_doc` | 获取控件文档 |

### 代码验证（4个）

| 工具 | 说明 |
|------|------|
| `dm3_validate_lua` | 验证 Lua 语法 |
| `dm3_check_encoding` | 检查文件编码 |
| `dm3_lint_config` | 检查配置规范 |
| `dm3_check_resources` | 检查资源引用 |

详细 API 文档请查看 [docs/API.md](docs/API.md)

## 📁 项目结构

```
dm-mcp/
├── dm_fw/                    # 内置 DM3 框架（完整引擎）
│   ├── App.exe              # DM3 引擎可执行文件
│   ├── Dat/                 # 引擎数据文件
│   └── MapRes/              # 地图资源
├── src/                      # 源代码
│   ├── index.ts             # MCP 服务器入口
│   ├── tools/               # 工具实现
│   │   ├── project.ts       # 项目管理
│   │   ├── generator.ts     # 代码生成
│   │   ├── docs.ts          # 文档查询
│   │   └── validator.ts     # 代码验证
│   └── utils/               # 工具函数
│       └── encoding.ts      # GBK 编码处理
├── docs/                     # 文档
├── examples/                 # 示例
└── scripts/                  # 脚本
```

## 🔍 核心特性详解

### 内置 DM3 框架

项目内置完整的 DM3 v0.9.3 引擎（`dm_fw` 目录），创建项目时会自动复制到项目目录。这意味着：

- ✅ 无需单独下载 DM3 引擎
- ✅ 每个项目都是独立完整的
- ✅ 可以直接运行和调试
- ✅ 便于分发和部署

### 自动 GBK 编码

DM3 引擎要求所有 Lua 文件使用 GBK 编码，MCP 服务器会自动处理：

- 生成的代码自动转换为 GBK
- 验证工具检查编码正确性
- 无需手动处理编码问题

### 智能代码生成

使用 Handlebars 模板引擎，生成符合 DM3 规范的代码：

- 统一的代码风格
- 完整的事件处理
- 中文命名规范
- 最佳实践

## 📚 文档

- [使用指南](docs/USAGE.md) - 详细的使用说明和示例
- [API 文档](docs/API.md) - 完整的工具 API 参考
- [开发指南](docs/DEVELOPMENT.md) - 如何扩展和开发
- [完整示例](examples/create-rpg-game.md) - 创建一个完整的 RPG 游戏

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与。

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。

## ⚠️ 注意事项

1. **编码要求**：所有 Lua 文件必须使用 GBK 编码（自动处理）
2. **中文命名**：遵循 DM3 规范，使用中文命名变量和函数
3. **资源引用**：使用资源标识而不是文件路径
4. **Windows 平台**：DM3 引擎仅支持 Windows（可在 macOS/Linux 上开发，在 Windows 上运行）

## 🔗 相关链接

- [DM3 官网](http://dm3.2ddm.com/)
- [DM3 官方文档](http://dm3.2ddm.com/doc/)
- [MCP 协议](https://modelcontextprotocol.io/)
- [问题反馈](https://github.com/LegnaOS/dm-mcp/issues)

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- DM3 游戏引擎团队
- Model Context Protocol 项目
- 所有贡献者

---

**开始你的游戏开发之旅吧！** 🎮✨
