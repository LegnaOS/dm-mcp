import { z } from "zod";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  handler: (args: any) => Promise<any>;
}

// 获取当前模块的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 文档目录在项目根目录的 dm3_docs
const DOCS_DIR = join(__dirname, "../../dm3_docs");

// 搜索文档
const searchDocsTool: Tool = {
  name: "dm3_search_docs",
  description: "搜索 DM3 文档",
  inputSchema: z.object({
    query: z.string().describe("搜索关键词"),
    category: z.enum(["指南", "Api", "控件", "组件", "其他", "all"]).default("all").describe("文档分类"),
  }),
  handler: async (args) => {
    const { query, category } = args;
    
    if (!existsSync(DOCS_DIR)) {
      throw new Error("文档目录不存在");
    }

    const results: any[] = [];
    const categories = category === "all" ? ["指南", "Api", "控件", "组件", "其他"] : [category];

    for (const cat of categories) {
      const catDir = join(DOCS_DIR, cat);
      if (!existsSync(catDir)) continue;

      const files = readdirSync(catDir).filter(f => f.endsWith(".md"));
      
      for (const file of files) {
        const filePath = join(catDir, file);
        const content = readFileSync(filePath, "utf-8");
        
        if (content.toLowerCase().includes(query.toLowerCase())) {
          const lines = content.split("\n");
          const matchingLines = lines
            .map((line, idx) => ({ line, idx }))
            .filter(({ line }) => line.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 3);

          results.push({
            category: cat,
            file: file.replace(".md", ""),
            path: filePath,
            matches: matchingLines.map(m => ({
              line: m.idx + 1,
              content: m.line.trim(),
            })),
          });
        }
      }
    }

    return {
      query,
      count: results.length,
      results: results.slice(0, 10),
    };
  },
};

// 获取 API 参考
const getApiReferenceTool: Tool = {
  name: "dm3_get_api_reference",
  description: "获取 DM3 API 参考文档",
  inputSchema: z.object({
    api: z.enum(["引擎", "地图", "角色", "道具", "技能", "状态", "窗口", "音乐", "缓动", "全局", "自定义组件"]).describe("API 名称"),
  }),
  handler: async (args) => {
    const { api } = args;
    const filePath = join(DOCS_DIR, "Api", `${api}.md`);

    if (!existsSync(filePath)) {
      throw new Error(`API 文档不存在: ${api}`);
    }

    const content = readFileSync(filePath, "utf-8");
    
    return {
      api,
      content,
      path: filePath,
    };
  },
};

// 获取代码示例
const getExampleTool: Tool = {
  name: "dm3_get_example",
  description: "获取 DM3 代码示例",
  inputSchema: z.object({
    topic: z.string().describe("主题（如：角色、道具、技能、窗口等）"),
  }),
  handler: async (args) => {
    const { topic } = args;
    
    // 从指南文档中提取示例
    const guideDir = join(DOCS_DIR, "指南");
    if (!existsSync(guideDir)) {
      throw new Error("指南目录不存在");
    }

    const files = readdirSync(guideDir).filter(f => f.endsWith(".md"));
    const examples: any[] = [];

    for (const file of files) {
      const filePath = join(guideDir, file);
      const content = readFileSync(filePath, "utf-8");
      
      if (content.toLowerCase().includes(topic.toLowerCase())) {
        // 提取代码块
        const codeBlocks = content.match(/```lua\n([\s\S]*?)```/g);
        
        if (codeBlocks) {
          examples.push({
            source: file.replace(".md", ""),
            codes: codeBlocks.map(block => 
              block.replace(/```lua\n/, "").replace(/```$/, "").trim()
            ),
          });
        }
      }
    }

    return {
      topic,
      count: examples.length,
      examples: examples.slice(0, 5),
    };
  },
};

// 获取控件文档
const getControlDocTool: Tool = {
  name: "dm3_get_control_doc",
  description: "获取 DM3 控件文档",
  inputSchema: z.object({
    control: z.string().describe("控件名称（如：按钮、标签、输入框等）"),
  }),
  handler: async (args) => {
    const { control } = args;
    const filePath = join(DOCS_DIR, "控件", `${control}.md`);

    if (!existsSync(filePath)) {
      throw new Error(`控件文档不存在: ${control}`);
    }

    const content = readFileSync(filePath, "utf-8");
    
    return {
      control,
      content,
      path: filePath,
    };
  },
};

export const docsTools: Tool[] = [
  searchDocsTool,
  getApiReferenceTool,
  getExampleTool,
  getControlDocTool,
];
