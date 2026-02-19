import { z } from "zod";
import { readFileSync } from "fs";
import { detectEncoding } from "../utils/encoding.js";

interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  handler: (args: any) => Promise<any>;
}

// 验证 Lua 语法
const validateLuaTool: Tool = {
  name: "dm3_validate_lua",
  description: "验证 Lua 代码语法",
  inputSchema: z.object({
    code: z.string().describe("Lua 代码"),
  }),
  handler: async (args) => {
    const { code } = args;
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基础语法检查
    const lines = code.split("\n");
    let inComment = false;
    let bracketStack: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      // 跳过空行
      if (!line) continue;

      // 多行注释
      if (line.includes("--[[")) inComment = true;
      if (line.includes("]]")) inComment = false;
      if (inComment) continue;

      // 单行注释
      if (line.startsWith("--")) continue;

      // 检查括号匹配
      for (const char of line) {
        if (char === "{" || char === "[" || char === "(") {
          bracketStack.push(char);
        } else if (char === "}" || char === "]" || char === ")") {
          const last = bracketStack.pop();
          const pairs: Record<string, string> = { "{": "}", "[": "]", "(": ")" };
          if (last && pairs[last] !== char) {
            errors.push(`第 ${lineNum} 行: 括号不匹配`);
          }
        }
      }

      // 检查常见错误
      if (line.includes("print(") && !line.includes("调试输出")) {
        warnings.push(`第 ${lineNum} 行: 建议使用 调试输出() 而不是 print()`);
      }

      if (line.match(/local\s+\w+\s*=\s*function/)) {
        const match = line.match(/local\s+(\w+)/);
        if (match && /^[a-zA-Z]/.test(match[1])) {
          warnings.push(`第 ${lineNum} 行: 建议使用中文命名: ${match[1]}`);
        }
      }
    }

    // 检查未闭合的括号
    if (bracketStack.length > 0) {
      errors.push(`存在未闭合的括号: ${bracketStack.join(", ")}`);
    }

    // 检查必需的 return 语句
    if (!code.includes("return")) {
      warnings.push("配置文件应该包含 return 语句");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  },
};

// 检查文件编码
const checkEncodingTool: Tool = {
  name: "dm3_check_encoding",
  description: "检查文件编码是否为 GBK",
  inputSchema: z.object({
    filePath: z.string().describe("文件路径"),
  }),
  handler: async (args) => {
    const { filePath } = args;
    
    try {
      const buffer = readFileSync(filePath);
      const encoding = detectEncoding(buffer);
      
      return {
        filePath,
        encoding,
        isGBK: encoding === "GBK",
        message: encoding === "GBK" 
          ? "文件编码正确" 
          : `文件编码为 ${encoding}，应该使用 GBK`,
      };
    } catch (error) {
      throw new Error(`读取文件失败: ${error}`);
    }
  },
};

// 检查配置文件
const lintConfigTool: Tool = {
  name: "dm3_lint_config",
  description: "检查 DM3 配置文件规范",
  inputSchema: z.object({
    code: z.string().describe("配置文件内容"),
    type: z.enum(["角色", "道具", "技能", "状态", "窗口", "地图"]).describe("配置类型"),
  }),
  handler: async (args) => {
    const { code, type } = args;
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查必需字段
    const requiredFields: Record<string, string[]> = {
      "角色": ["类型", "名称"],
      "道具": ["类型", "名称"],
      "技能": ["类型", "名称"],
      "状态": ["类型", "名称"],
      "窗口": ["类型", "名称"],
      "地图": ["类型", "名称"],
    };

    const required = requiredFields[type] || [];
    for (const field of required) {
      if (!code.includes(`${field} =`)) {
        errors.push(`缺少必需字段: ${field}`);
      }
    }

    // 检查类型字段
    if (!code.includes(`类型 = "${type}"`)) {
      errors.push(`类型字段应该为: "${type}"`);
    }

    // 检查 return 语句
    if (!code.includes("return 配置")) {
      errors.push("配置文件应该以 'return 配置' 结尾");
    }

    // 检查事件定义
    if (code.includes("事件 =") && !code.includes("事件 = {")) {
      warnings.push("事件应该定义为表");
    }

    return {
      valid: errors.length === 0,
      type,
      errors,
      warnings,
    };
  },
};

// 检查资源引用
const checkResourcesTool: Tool = {
  name: "dm3_check_resources",
  description: "检查资源引用是否正确",
  inputSchema: z.object({
    code: z.string().describe("代码内容"),
  }),
  handler: async (args) => {
    const { code } = args;
    const warnings: string[] = [];

    // 检查是否使用了文件路径而不是资源标识
    const pathPatterns = [
      /["']\.\.?\//,  // 相对路径
      /["'][A-Z]:\\/,  // Windows 绝对路径
      /["']\/[^"']+\.(png|jpg|wav|mp3)/i,  // 文件扩展名
    ];

    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      for (const pattern of pathPatterns) {
        if (pattern.test(line)) {
          warnings.push(
            `第 ${lineNum} 行: 疑似使用文件路径，应该使用资源标识`
          );
          break;
        }
      }
    }

    return {
      hasIssues: warnings.length > 0,
      warnings,
      message: warnings.length === 0 
        ? "资源引用检查通过" 
        : "发现可能的问题",
    };
  },
};

export const validatorTools: Tool[] = [
  validateLuaTool,
  checkEncodingTool,
  lintConfigTool,
  checkResourcesTool,
];
