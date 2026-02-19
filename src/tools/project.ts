import { z } from "zod";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readdirSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { convertToGBK } from "../utils/encoding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DM3_FW_PATH = join(__dirname, "../../dm_fw");
const PROJECTS_DIR = process.env.DM3_PROJECTS_DIR || "./projects";

interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  handler: (args: any) => Promise<any>;
}

// 创建项目
const createProjectTool: Tool = {
  name: "dm3_create_project",
  description: "创建新的 DM3 游戏项目",
  inputSchema: z.object({
    name: z.string().describe("项目名称（英文）"),
    title: z.string().describe("游戏标题（中文）"),
    width: z.number().default(1024).describe("屏幕宽度"),
    height: z.number().default(768).describe("屏幕高度"),
  }),
  handler: async (args) => {
    const { name, title, width, height } = args;

    // 检查内置框架是否存在
    if (!existsSync(DM3_FW_PATH)) {
      throw new Error("DM3 框架模板不存在，请确保 dm_fw 目录完整");
    }

    // 确保项目目录存在
    if (!existsSync(PROJECTS_DIR)) {
      mkdirSync(PROJECTS_DIR, { recursive: true });
    }

    const projectPath = join(PROJECTS_DIR, name);
    
    if (existsSync(projectPath)) {
      throw new Error(`项目 ${name} 已存在`);
    }

    // 复制 dm_fw 模板到项目目录
    try {
      cpSync(DM3_FW_PATH, projectPath, { recursive: true });
    } catch (error) {
      throw new Error(`复制框架模板失败: ${error}`);
    }

    // 生成 App.lua 配置
    const appLuaContent = `-- ${title}
-- 游戏主配置文件
-- 编码：GBK

local 配置 = {
    游戏标题 = "${title}",
    屏幕宽度 = ${width},
    屏幕高度 = ${height},
    
    -- 资源配置
    资源表 = {
        -- 在这里注册游戏资源
        -- 示例：
        -- ["主角图片"] = "资源/图片/hero.png",
    },
    
    -- 默认字体
    默认字体 = {
        字体 = "宋体12",
        间距 = 0
    },
    
    -- 扩展组件
    扩展组件 = {},
    
    -- 系统事件
    系统事件 = {
        游戏开始 = function()
            调试输出("${title} - 游戏开始")
            -- 在这里初始化游戏
        end,
        
        游戏结束 = function()
            调试输出("游戏结束")
        end,
        
        游戏更新 = function(间隔时间)
            -- 每帧更新逻辑
        end
    }
}

return 配置
`;

    const appLuaPath = join(projectPath, "App.lua");
    writeFileSync(appLuaPath, convertToGBK(appLuaContent));

    // 创建项目子目录
    const subDirs = ["角色", "道具", "技能", "状态", "窗口", "地图", "脚本"];
    for (const dir of subDirs) {
      const dirPath = join(projectPath, dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
    }

    return {
      success: true,
      message: `项目 ${name} 创建成功`,
      path: projectPath,
    };
  },
};

// 构建项目
const buildProjectTool: Tool = {
  name: "dm3_build_project",
  description: "编译 DM3 项目",
  inputSchema: z.object({
    name: z.string().describe("项目名称"),
  }),
  handler: async (args) => {
    const { name } = args;
    const projectPath = join(PROJECTS_DIR, name);

    if (!existsSync(projectPath)) {
      throw new Error(`项目 ${name} 不存在`);
    }

    try {
      const appExe = join(projectPath, "App.exe");
      if (!existsSync(appExe)) {
        throw new Error("App.exe 不存在，请确保项目完整");
      }

      const output = execSync(`"${appExe}" -b ${name}`, {
        cwd: projectPath,
        encoding: "utf-8",
      });

      return {
        success: true,
        message: `项目 ${name} 编译成功`,
        output,
      };
    } catch (error) {
      throw new Error(`编译失败: ${error}`);
    }
  },
};

// 运行项目
const runProjectTool: Tool = {
  name: "dm3_run_project",
  description: "运行 DM3 项目",
  inputSchema: z.object({
    name: z.string().describe("项目名称"),
  }),
  handler: async (args) => {
    const { name } = args;
    const projectPath = join(PROJECTS_DIR, name);

    if (!existsSync(projectPath)) {
      throw new Error(`项目 ${name} 不存在`);
    }

    const appExe = join(projectPath, "App.exe");
    if (!existsSync(appExe)) {
      throw new Error("App.exe 不存在，请确保项目完整");
    }

    return {
      success: true,
      message: `请手动运行: cd ${projectPath} && ./App.exe -g ${name}`,
      command: `./App.exe -g ${name}`,
      cwd: projectPath,
      note: "或者双击项目目录中的 run.bat 文件",
    };
  },
};

// 列出项目
const listProjectsTool: Tool = {
  name: "dm3_list_projects",
  description: "列出所有 DM3 项目",
  inputSchema: z.object({}),
  handler: async () => {
    if (!existsSync(PROJECTS_DIR)) {
      return {
        projects: [],
        message: "项目目录不存在",
      };
    }

    const projects = readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return {
      projects,
      count: projects.length,
    };
  },
};

export const projectTools: Tool[] = [
  createProjectTool,
  buildProjectTool,
  runProjectTool,
  listProjectsTool,
];
