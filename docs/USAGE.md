# DM3 MCP Server 使用指南

## 配置

### 在 Kiro 中配置

编辑 `.kiro/settings/mcp.json`：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/absolute/path/to/DM3-mcp/dist/index.js"],
      "env": {
        "DM3_ENGINE_PATH": "/absolute/path/to/v0.9.3",
        "DM3_PROJECTS_DIR": "/absolute/path/to/projects"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 在 Claude Desktop 中配置

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "dm3": {
      "command": "node",
      "args": ["/absolute/path/to/DM3-mcp/dist/index.js"],
      "env": {
        "DM3_ENGINE_PATH": "/absolute/path/to/v0.9.3"
      }
    }
  }
}
```

## 使用示例

### 1. 创建项目

```
请使用 dm3_create_project 创建一个名为 "my_rpg" 的项目，标题为 "我的RPG游戏"
```

### 2. 生成角色

```
使用 dm3_generate_actor 在 my_rpg 项目中创建一个主角，生命值 1000，魔法值 500
```

### 3. 生成道具

```
使用 dm3_generate_item 创建一个生命药水，可堆叠，最大堆叠 99
```

### 4. 生成技能

```
使用 dm3_generate_skill 创建一个火球术技能，魔法消耗 20，冷却时间 2000ms
```

### 5. 生成窗口

```
使用 dm3_generate_window 创建一个背包窗口，宽度 600，高度 400
```

### 6. 搜索文档

```
使用 dm3_search_docs 搜索关于 "技能系统" 的文档
```

### 7. 获取 API 参考

```
使用 dm3_get_api_reference 获取 "角色" 的 API 文档
```

### 8. 验证代码

```
使用 dm3_validate_lua 验证以下代码：
local 配置 = {
    类型 = "角色",
    名称 = "主角"
}
return 配置
```

### 9. 检查编码

```
使用 dm3_check_encoding 检查文件 "projects/my_rpg/角色/主角.lua" 的编码
```

### 10. 构建项目

```
使用 dm3_build_project 编译 my_rpg 项目
```

## 完整工作流示例

### 创建一个简单的 RPG 游戏

1. **创建项目**
```
创建一个 DM3 项目，名称 "simple_rpg"，标题 "简单RPG"
```

2. **生成主角**
```
在 simple_rpg 中创建主角，生命值 1000，魔法值 500，速度 5
```

3. **生成怪物**
```
在 simple_rpg 中创建史莱姆怪物，生命值 100，魔法值 0，速度 3
```

4. **生成道具**
```
创建生命药水，恢复 100 生命值
创建魔法药水，恢复 50 魔法值
```

5. **生成技能**
```
创建普通攻击技能，无魔法消耗
创建火球术技能，魔法消耗 20
```

6. **生成窗口**
```
创建主界面窗口，800x600
创建背包窗口，400x300
创建技能栏窗口，600x100
```

7. **验证代码**
```
验证所有生成的 Lua 文件语法
检查文件编码是否为 GBK
```

8. **构建运行**
```
编译项目
运行项目进行测试
```

## 常见问题

### Q: 工具调用失败

A: 检查以下几点：
- DM3_ENGINE_PATH 是否正确设置
- 项目目录是否存在
- 文件权限是否正确

### Q: 编码问题

A: DM3 要求所有 Lua 文件使用 GBK 编码，MCP 服务器会自动处理转换。

### Q: 如何调试

A: 查看服务器日志：
```bash
# 开发模式运行
npm run dev
```

### Q: 如何添加自定义模板

A: 编辑 `src/templates/` 目录下的模板文件，使用 Handlebars 语法。

## 高级用法

### 批量生成

```
批量创建 10 个不同的怪物角色，生命值从 100 到 1000
```

### 自定义模板

```
使用自定义模板生成一个复杂的窗口，包含多个控件
```

### 文档集成

```
搜索所有关于 "缓动动画" 的文档和示例
```

## 性能优化

- 使用 `autoApprove` 自动批准常用工具
- 批量操作时使用脚本
- 定期清理项目目录

## 安全建议

- 不要在生产环境中使用开发模式
- 定期备份项目文件
- 使用版本控制管理代码
