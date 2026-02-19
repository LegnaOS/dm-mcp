# DM3 MCP Server API 文档

## 工具列表

### 项目管理

#### dm3_create_project

创建新的 DM3 游戏项目。

**参数：**
- `name` (string, 必需): 项目名称（英文）
- `title` (string, 必需): 游戏标题（中文）
- `width` (number, 默认 1024): 屏幕宽度
- `height` (number, 默认 768): 屏幕高度

**返回：**
```json
{
  "success": true,
  "message": "项目 my_game 创建成功",
  "path": "/path/to/projects/my_game"
}
```

#### dm3_build_project

编译 DM3 项目。

**参数：**
- `name` (string, 必需): 项目名称

**返回：**
```json
{
  "success": true,
  "message": "项目 my_game 编译成功",
  "output": "..."
}
```

#### dm3_run_project

运行 DM3 项目。

**参数：**
- `name` (string, 必需): 项目名称

**返回：**
```json
{
  "success": true,
  "message": "请手动运行: ...",
  "command": "App.exe -g my_game",
  "cwd": "/path/to/projects"
}
```

#### dm3_list_projects

列出所有 DM3 项目。

**参数：** 无

**返回：**
```json
{
  "projects": ["my_game", "another_game"],
  "count": 2
}
```

### 代码生成

#### dm3_generate_actor

生成角色配置文件。

**参数：**
- `project` (string, 必需): 项目名称
- `name` (string, 必需): 角色名称
- `type` (enum, 默认 "npc"): 角色类型 (player/npc/monster)
- `hp` (number, 默认 100): 生命值
- `mp` (number, 默认 100): 魔法值
- `speed` (number, 默认 5): 移动速度
- `image` (string, 可选): 角色图片资源标识

**返回：**
```json
{
  "success": true,
  "message": "角色 主角 生成成功",
  "path": "/path/to/角色/主角.lua"
}
```

#### dm3_generate_item

生成道具配置文件。

**参数：**
- `project` (string, 必需): 项目名称
- `name` (string, 必需): 道具名称
- `type` (enum, 默认 "consumable"): 道具类型 (consumable/equipment/material)
- `description` (string, 默认 ""): 道具描述
- `stackable` (boolean, 默认 true): 是否可堆叠
- `maxStack` (number, 默认 99): 最大堆叠数量

**返回：**
```json
{
  "success": true,
  "message": "道具 生命药水 生成成功",
  "path": "/path/to/道具/生命药水.lua"
}
```

#### dm3_generate_skill

生成技能配置文件。

**参数：**
- `project` (string, 必需): 项目名称
- `name` (string, 必需): 技能名称
- `mpCost` (number, 默认 10): 魔法消耗
- `cooldown` (number, 默认 1000): 冷却时间（毫秒）
- `range` (number, 默认 5): 施法范围

**返回：**
```json
{
  "success": true,
  "message": "技能 火球术 生成成功",
  "path": "/path/to/技能/火球术.lua"
}
```

#### dm3_generate_window

生成窗口配置文件。

**参数：**
- `project` (string, 必需): 项目名称
- `name` (string, 必需): 窗口名称
- `width` (number, 默认 400): 窗口宽度
- `height` (number, 默认 300): 窗口高度
- `modal` (boolean, 默认 false): 是否模态窗口

**返回：**
```json
{
  "success": true,
  "message": "窗口 背包 生成成功",
  "path": "/path/to/窗口/背包.lua"
}
```

### 文档查询

#### dm3_search_docs

搜索 DM3 文档。

**参数：**
- `query` (string, 必需): 搜索关键词
- `category` (enum, 默认 "all"): 文档分类 (指南/Api/控件/组件/其他/all)

**返回：**
```json
{
  "query": "技能系统",
  "count": 3,
  "results": [
    {
      "category": "指南",
      "file": "技能",
      "path": "/path/to/技能.md",
      "matches": [
        {
          "line": 10,
          "content": "技能系统是游戏的核心..."
        }
      ]
    }
  ]
}
```

#### dm3_get_api_reference

获取 API 参考文档。

**参数：**
- `api` (enum, 必需): API 名称 (引擎/地图/角色/道具/技能/状态/窗口/音乐/缓动/全局/自定义组件)

**返回：**
```json
{
  "api": "角色",
  "content": "# 角色 API\n\n...",
  "path": "/path/to/Api/角色.md"
}
```

#### dm3_get_example

获取代码示例。

**参数：**
- `topic` (string, 必需): 主题（如：角色、道具、技能等）

**返回：**
```json
{
  "topic": "角色",
  "count": 2,
  "examples": [
    {
      "source": "角色",
      "codes": ["local 配置 = {...}"]
    }
  ]
}
```

#### dm3_get_control_doc

获取控件文档。

**参数：**
- `control` (string, 必需): 控件名称

**返回：**
```json
{
  "control": "按钮",
  "content": "# 按钮控件\n\n...",
  "path": "/path/to/控件/按钮.md"
}
```

### 代码验证

#### dm3_validate_lua

验证 Lua 代码语法。

**参数：**
- `code` (string, 必需): Lua 代码

**返回：**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["建议使用中文命名"]
}
```

#### dm3_check_encoding

检查文件编码。

**参数：**
- `filePath` (string, 必需): 文件路径

**返回：**
```json
{
  "filePath": "/path/to/file.lua",
  "encoding": "GBK",
  "isGBK": true,
  "message": "文件编码正确"
}
```

#### dm3_lint_config

检查配置文件规范。

**参数：**
- `code` (string, 必需): 配置文件内容
- `type` (enum, 必需): 配置类型 (角色/道具/技能/状态/窗口/地图)

**返回：**
```json
{
  "valid": true,
  "type": "角色",
  "errors": [],
  "warnings": []
}
```

#### dm3_check_resources

检查资源引用。

**参数：**
- `code` (string, 必需): 代码内容

**返回：**
```json
{
  "hasIssues": false,
  "warnings": [],
  "message": "资源引用检查通过"
}
```

## 错误处理

所有工具在出错时返回：

```json
{
  "error": "错误信息"
}
```

常见错误：
- `DM3_ENGINE_PATH 环境变量未设置`
- `项目不存在`
- `文件编码错误`
- `语法错误`

## 最佳实践

1. **项目创建**：先创建项目，再生成组件
2. **编码检查**：生成文件后检查编码
3. **语法验证**：修改代码后验证语法
4. **文档查询**：不确定时先查询文档
5. **批量操作**：使用脚本处理批量任务
