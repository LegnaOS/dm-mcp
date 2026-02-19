# MCP 客户端配置指南

本文档详细说明如何在各种 AI 编辑器和 IDE 中配置 DM3 MCP Server。

> 💡 **重要提示**：所有配置都需要使用**绝对路径**，Windows 用户推荐使用斜杠 `/` 或双反斜杠 `\\`

## 📋 目录

- [1. Kiro IDE](#1-kiro-ide)
- [2. Claude Desktop](#2-claude-desktop)
- [3. Cursor](#3-cursor)
- [4. VS Code (Cline/Continue)](#4-vs-code-clinecontinue)
- [5. Windsurf (Codeium)](#5-windsurf-codeium)
- [6. Zed Editor](#6-zed-editor)
- [7. Cody (Sourcegraph)](#7-cody-sourcegraph)
- [8. 通用配置](#8-通用配置)

---

## 1. Kiro IDE

Kiro 是原生支持 MCP 的 AI 编辑器。

### Windows 配置

1. 在项目根目录创建 `.kiro/settings/mcp.json`

2. 添加配置（假设安装在 `C:\dm-mcp`）：

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

### macOS/Linux 配置

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/Users/你的用户名/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "/Users/你的用户名/dm-mcp/projects"
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

### 使用方法

1. 重启 Kiro 或在命令面板中选择 "Reload MCP Servers"
2. 在 Kiro 中输入 "列出所有 DM3 工具"
3. 使用工具：`使用 dm3_create_project 创建项目`

---

## 2. Claude Desktop

Claude Desktop 原生支持 MCP 协议。

### Windows 配置

1. 打开配置文件：
   - 按 `Win + R`
   - 输入 `%APPDATA%\Claude`
   - 编辑 `claude_desktop_config.json`

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

### macOS 配置

1. 打开配置文件：
   ```bash
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. 添加配置：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/Users/你的用户名/dm-mcp/dist/index.js"]
    }
  }
}
```

### 使用方法

1. 重启 Claude Desktop
2. 在对话中输入 "使用 dm3 工具"
3. Claude 会自动调用可用的工具

---

## 3. Cursor

Cursor 通过 MCP 扩展支持。

### 安装 MCP 扩展

1. 打开 Cursor
2. 按 `Ctrl+Shift+X`（Windows）或 `Cmd+Shift+X`（macOS）
3. 搜索 "MCP" 或 "Model Context Protocol"
4. 安装官方 MCP 扩展

### Windows 配置

1. 打开设置：`File` → `Preferences` → `Settings`
2. 搜索 "MCP"
3. 点击 "Edit in settings.json"
4. 添加配置：

```json
{
  "mcp.servers": {
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

### macOS/Linux 配置

```json
{
  "mcp.servers": {
    "dm3": {
      "command": "node",
      "args": ["/Users/你的用户名/dm-mcp/dist/index.js"]
    }
  }
}
```

### 使用方法

1. 重启 Cursor
2. 在 AI 对话中使用 "@dm3" 调用工具
3. 或直接说 "使用 DM3 创建游戏项目"

---

## 4. VS Code (Cline/Continue)

VS Code 通过 Cline 或 Continue 扩展支持 MCP。

### 方法 A：使用 Cline 扩展

1. **安装 Cline**：
   - 打开 VS Code
   - 按 `Ctrl+Shift+X`（Windows）或 `Cmd+Shift+X`（macOS）
   - 搜索 "Cline"
   - 安装

2. **配置 MCP**：
   - 打开命令面板：`Ctrl+Shift+P`（Windows）或 `Cmd+Shift+P`（macOS）
   - 输入 "Cline: Open MCP Settings"
   - 添加配置

**Windows 配置：**
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

**macOS/Linux 配置：**
```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/Users/你的用户名/dm-mcp/dist/index.js"]
    }
  }
}
```

### 方法 B：使用 Continue 扩展

1. **安装 Continue 扩展**

2. **打开配置文件**：
   - macOS/Linux: `~/.continue/config.json`
   - Windows: `%USERPROFILE%\.continue\config.json`

**Windows 配置：**
```json
{
  "experimental": {
    "modelContextProtocol": true
  },
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["C:/dm-mcp/dist/index.js"]
    }
  }
}
```

**macOS/Linux 配置：**
```json
{
  "experimental": {
    "modelContextProtocol": true
  },
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/Users/你的用户名/dm-mcp/dist/index.js"]
    }
  }
}
```

3. 重启 VS Code

---

## 5. Windsurf (Codeium)

Windsurf 是 Codeium 的 AI 编辑器。

### 配置方法

1. 打开 Windsurf
2. 进入设置：`File` → `Preferences` → `Settings`
3. 搜索 "MCP" 或 "Model Context Protocol"
4. 编辑 MCP 配置文件

**Windows 配置：**
```json
{
  "mcp": {
    "servers": {
      "dm3": {
        "command": "node",
        "args": ["C:/dm-mcp/dist/index.js"],
        "env": {
          "DM3_PROJECTS_DIR": "C:/dm-mcp/projects"
        }
      }
    }
  }
}
```

**macOS/Linux 配置：**
```json
{
  "mcp": {
    "servers": {
      "dm3": {
        "command": "node",
        "args": ["/Users/你的用户名/dm-mcp/dist/index.js"]
      }
    }
  }
}
```

5. 重启 Windsurf

---

## 6. Zed Editor

Zed 是新一代高性能编辑器，支持 MCP。

### 配置方法

1. 打开 Zed
2. 打开配置：`Cmd+,`（macOS）或 `Ctrl+,`（Windows）
3. 选择 "Open Config Folder"
4. 编辑 `settings.json`

**Windows 配置：**
```json
{
  "assistant": {
    "mcp_servers": {
      "dm3": {
        "command": "node",
        "args": ["C:/dm-mcp/dist/index.js"]
      }
    }
  }
}
```

**macOS/Linux 配置：**
```json
{
  "assistant": {
    "mcp_servers": {
      "dm3": {
        "command": "node",
        "args": ["/Users/你的用户名/dm-mcp/dist/index.js"]
      }
    }
  }
}
```

5. 重启 Zed

---

## 7. Cody (Sourcegraph)

Cody 支持通过扩展使用 MCP。

### 配置方法

1. 安装 Cody 扩展（VS Code 或 JetBrains）
2. 打开 Cody 设置
3. 找到 "Experimental Features"
4. 启用 "Model Context Protocol"
5. 添加 MCP 服务器配置

**配置文件位置：**
- Windows: `%APPDATA%\Sourcegraph\Cody\mcp.json`
- macOS: `~/Library/Application Support/Sourcegraph/Cody/mcp.json`

**配置内容：**
```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["C:/dm-mcp/dist/index.js"]
    }
  }
}
```

---

## 8. 通用配置

如果你使用的编辑器不在上述列表中，可以尝试以下通用方法：

### 标准 MCP 配置格式

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["绝对路径/dm-mcp/dist/index.js"],
      "env": {
        "DM3_PROJECTS_DIR": "绝对路径/projects"
      }
    }
  }
}
```

### 查找配置文件

大多数支持 MCP 的编辑器会在以下位置存储配置：

- **Windows**: `%APPDATA%\编辑器名称\mcp.json` 或 `config.json`
- **macOS**: `~/Library/Application Support/编辑器名称/mcp.json`
- **Linux**: `~/.config/编辑器名称/mcp.json`

---

## 🔍 配置验证

配置完成后，验证是否成功：

### 1. 重启编辑器

所有配置更改都需要重启编辑器才能生效。

### 2. 测试连接

在 AI 对话中输入：
- "列出所有 DM3 工具"
- "使用 dm3_list_projects 列出项目"
- "帮我创建一个 DM3 游戏项目"

### 3. 查看日志

大多数编辑器都有 MCP 日志输出：
- **Kiro**: 查看输出面板 → MCP
- **VS Code**: 查看输出面板 → Cline/Continue
- **Claude Desktop**: 查看开发者工具（Help → Toggle Developer Tools）

---

## ⚠️ 常见问题

### 问题 1：路径错误

❌ **错误示例：**
```json
"args": ["dm-mcp/dist/index.js"]  // 相对路径
"args": ["C:\dm-mcp\dist\index.js"]  // 单反斜杠
"args": ["C:\\用户\\文档\\dm-mcp\\dist\\index.js"]  // 包含中文
```

✅ **正确示例：**
```json
"args": ["C:/dm-mcp/dist/index.js"]  // 推荐：斜杠
"args": ["C:\\dm-mcp\\dist\\index.js"]  // 可以：双反斜杠
"args": ["D:/dm-mcp/dist/index.js"]  // 可以：其他盘符
```

### 问题 2：Node.js 未找到

确保 Node.js 已安装并在 PATH 中：

```bash
node --version  # 应该显示版本号，如 v22.19.0
npm --version   # 应该显示版本号，如 11.6.0
```

如果未安装，从 [nodejs.org](https://nodejs.org/) 下载安装。

### 问题 3：权限问题

**Windows 用户**：
- 以管理员身份运行编辑器
- 或将项目放在非系统目录（如 `C:\dm-mcp` 而不是 `C:\Program Files\`）

**macOS/Linux 用户**：
- 确保文件有执行权限：`chmod +x dist/index.js`

### 问题 4：端口冲突

如果多个 MCP 服务器冲突：
1. 重启编辑器
2. 检查是否有其他 MCP 服务器在运行
3. 重启系统

### 问题 5：编码问题

DM3 需要 GBK 编码，但 MCP 服务器会自动处理，无需手动转换。

---

## 📝 配置模板

为了方便，我们提供了配置模板文件：

- [Kiro 配置模板](../examples/kiro-config.json)
- [Claude Desktop 配置模板](../examples/claude-config.json)
- [VS Code 配置模板](../examples/vscode-config.json)

直接复制并修改路径即可使用！

---

## 🆘 获取帮助

如果配置遇到问题：

1. 查看 [README.md](../README.md)
2. 查看 [Issues](https://github.com/LegnaOS/dm-mcp/issues)
3. 提交新的 Issue 描述你的问题

---

**祝你配置顺利！** 🎉
