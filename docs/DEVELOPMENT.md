# DM3 MCP Server 开发指南

## 开发环境设置

### 前置要求

- Node.js 18+
- TypeScript 5+
- DM3 引擎 v0.9.3

### 安装开发依赖

```bash
cd DM3-mcp
npm install
```

### 开发模式

```bash
npm run dev
```

这会启动 TypeScript 监视模式，自动重新编译代码。

## 项目结构

```
DM3-mcp/
├── src/
│   ├── index.ts              # 服务器入口
│   ├── tools/                # 工具实现
│   │   ├── project.ts        # 项目管理工具
│   │   ├── generator.ts      # 代码生成工具
│   │   ├── docs.ts           # 文档查询工具
│   │   └── validator.ts      # 代码验证工具
│   ├── templates/            # 代码模板
│   └── utils/                # 工具函数
│       └── encoding.ts       # 编码处理
├── docs/                     # 文档
├── scripts/                  # 脚本
├── tests/                    # 测试
└── package.json
```

## 添加新工具

### 1. 定义工具接口

在 `src/tools/` 创建新文件，例如 `my-tool.ts`：

```typescript
import { z } from "zod";

interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  handler: (args: any) => Promise<any>;
}

const myTool: Tool = {
  name: "dm3_my_tool",
  description: "我的工具描述",
  inputSchema: z.object({
    param1: z.string().describe("参数1"),
    param2: z.number().default(100).describe("参数2"),
  }),
  handler: async (args) => {
    const { param1, param2 } = args;
    
    // 实现工具逻辑
    
    return {
      success: true,
      result: "结果",
    };
  },
};

export const myTools: Tool[] = [myTool];
```

### 2. 注册工具

在 `src/index.ts` 中导入并注册：

```typescript
import { myTools } from "./tools/my-tool.js";

const allTools = [
  ...projectTools,
  ...generatorTools,
  ...docsTools,
  ...validatorTools,
  ...myTools,  // 添加新工具
];
```

### 3. 测试工具

```bash
npm run build
npm run test
```

## 添加模板

### 1. 创建模板文件

在 `src/templates/` 创建 `.tmpl` 文件：

```handlebars
-- {{name}}
local 配置 = {
    类型 = "{{type}}",
    名称 = "{{name}}",
    
    {{#if description}}
    说明 = "{{description}}",
    {{/if}}
}

return 配置
```

### 2. 使用模板

```typescript
import Handlebars from "handlebars";
import { readFileSync } from "fs";

const templatePath = join(__dirname, "../templates/my-template.tmpl");
const templateContent = readFileSync(templatePath, "utf-8");
const template = Handlebars.compile(templateContent);

const result = template({
  name: "测试",
  type: "角色",
  description: "这是一个测试",
});
```

## 编码处理

DM3 要求所有 Lua 文件使用 GBK 编码。使用 `encoding.ts` 工具：

```typescript
import { convertToGBK, convertFromGBK, detectEncoding } from "../utils/encoding.js";

// 转换为 GBK
const gbkBuffer = convertToGBK("中文文本");

// 从 GBK 转换
const text = convertFromGBK(buffer);

// 检测编码
const encoding = detectEncoding(buffer);
```

## 测试

### 单元测试

```bash
npm run test
```

### 集成测试

```bash
# 测试工具列表
./scripts/test-mcp.sh

# 手动测试
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### 测试工具调用

```bash
echo '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"tools/call",
  "params":{
    "name":"dm3_list_projects",
    "arguments":{}
  }
}' | node dist/index.js
```

## 调试

### 启用调试日志

```bash
export DM3_LOG_LEVEL=debug
npm run dev
```

### 使用 VS Code 调试

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug MCP Server",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "DM3_ENGINE_PATH": "/path/to/v0.9.3"
      }
    }
  ]
}
```

## 代码规范

### TypeScript

- 使用严格模式
- 所有函数添加类型注解
- 使用 async/await 处理异步操作
- 使用 Zod 验证输入

### 命名规范

- 工具名称：`dm3_` 前缀 + 下划线命名
- 文件名：kebab-case
- 变量名：camelCase
- 类型名：PascalCase

### 错误处理

```typescript
try {
  // 操作
} catch (error) {
  throw new Error(`操作失败: ${error}`);
}
```

## 发布流程

### 1. 更新版本

```bash
npm version patch  # 或 minor, major
```

### 2. 构建

```bash
npm run build
```

### 3. 测试

```bash
npm run test
./scripts/test-mcp.sh
```

### 4. 提交

```bash
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main --tags
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### Commit 规范

- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `style:` 格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建

## 常见问题

### Q: 如何添加新的代码生成器？

A: 在 `src/tools/generator.ts` 添加新工具，创建对应模板。

### Q: 如何支持新的文档类型？

A: 在 `src/tools/docs.ts` 添加新的查询工具。

### Q: 如何处理 GBK 编码？

A: 使用 `src/utils/encoding.ts` 中的工具函数。

### Q: 如何测试 MCP 协议？

A: 使用 `scripts/test-mcp.sh` 或手动发送 JSON-RPC 请求。

## 资源

- [MCP 协议文档](https://modelcontextprotocol.io/)
- [DM3 官方文档](http://dm3.2ddm.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Zod 文档](https://zod.dev/)
