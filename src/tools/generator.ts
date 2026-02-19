import { z } from "zod";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Handlebars from "handlebars";
import { convertToGBK } from "../utils/encoding.js";

const PROJECTS_DIR = process.env.DM3_PROJECTS_DIR || "./projects";

interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  handler: (args: any) => Promise<any>;
}

// 生成角色
const generateActorTool: Tool = {
  name: "dm3_generate_actor",
  description: "生成 DM3 角色配置文件",
  inputSchema: z.object({
    project: z.string().describe("项目名称"),
    name: z.string().describe("角色名称"),
    type: z.enum(["player", "npc", "monster"]).default("npc").describe("角色类型"),
    hp: z.number().default(100).describe("生命值"),
    mp: z.number().default(100).describe("魔法值"),
    speed: z.number().default(5).describe("移动速度"),
    image: z.string().optional().describe("角色图片资源标识"),
  }),
  handler: async (args) => {
    const template = `-- 角色: {{name}}
local 配置 = {
    类型 = "角色",
    名称 = "{{name}}",
    
    -- 基础属性
    生命值 = {{hp}},
    魔法值 = {{mp}},
    移动速度 = {{speed}},
    
    {{#if image}}
    -- 外观
    图片 = "{{image}}",
    {{/if}}
    
    -- 事件
    事件 = {
        创建时 = function(角色)
            调试输出("角色创建: " .. 角色.名称)
        end,
        
        死亡时 = function(角色)
            调试输出("角色死亡: " .. 角色.名称)
        end
    }
}

return 配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled(args);
    
    const filePath = join(PROJECTS_DIR, args.project, "角色", `${args.name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `角色 ${args.name} 生成成功`,
      path: filePath,
    };
  },
};

// 生成道具
const generateItemTool: Tool = {
  name: "dm3_generate_item",
  description: "生成 DM3 道具配置文件",
  inputSchema: z.object({
    project: z.string().describe("项目名称"),
    name: z.string().describe("道具名称"),
    type: z.enum(["consumable", "equipment", "material"]).default("consumable").describe("道具类型"),
    description: z.string().default("").describe("道具描述"),
    stackable: z.boolean().default(true).describe("是否可堆叠"),
    maxStack: z.number().default(99).describe("最大堆叠数量"),
  }),
  handler: async (args) => {
    const template = `-- 道具: {{name}}
local 配置 = {
    类型 = "道具",
    名称 = "{{name}}",
    说明 = "{{description}}",
    
    -- 堆叠设置
    可堆叠 = {{stackable}},
    {{#if stackable}}
    最大堆叠 = {{maxStack}},
    {{/if}}
    
    -- 事件
    事件 = {
        使用时 = function(道具, 使用者)
            调试输出(使用者.名称 .. " 使用了 " .. 道具.名称)
            return true
        end
    }
}

return 配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled(args);
    
    const filePath = join(PROJECTS_DIR, args.project, "道具", `${args.name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `道具 ${args.name} 生成成功`,
      path: filePath,
    };
  },
};

// 生成技能
const generateSkillTool: Tool = {
  name: "dm3_generate_skill",
  description: "生成 DM3 技能配置文件",
  inputSchema: z.object({
    project: z.string().describe("项目名称"),
    name: z.string().describe("技能名称"),
    mpCost: z.number().default(10).describe("魔法消耗"),
    cooldown: z.number().default(1000).describe("冷却时间（毫秒）"),
    range: z.number().default(5).describe("施法范围"),
  }),
  handler: async (args) => {
    const template = `-- 技能: {{name}}
local 配置 = {
    类型 = "技能",
    名称 = "{{name}}",
    
    -- 消耗
    魔法消耗 = {{mpCost}},
    冷却时间 = {{cooldown}},
    施法范围 = {{range}},
    
    -- 事件
    事件 = {
        释放时 = function(技能, 释放者, 目标)
            调试输出(释放者.名称 .. " 释放了 " .. 技能.名称)
            
            -- 在这里实现技能效果
            
            return true
        end
    }
}

return 配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled(args);
    
    const filePath = join(PROJECTS_DIR, args.project, "技能", `${args.name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `技能 ${args.name} 生成成功`,
      path: filePath,
    };
  },
};

// 生成窗口
const generateWindowTool: Tool = {
  name: "dm3_generate_window",
  description: "生成 DM3 窗口配置文件",
  inputSchema: z.object({
    project: z.string().describe("项目名称"),
    name: z.string().describe("窗口名称"),
    width: z.number().default(400).describe("窗口宽度"),
    height: z.number().default(300).describe("窗口高度"),
    modal: z.boolean().default(false).describe("是否模态窗口"),
  }),
  handler: async (args) => {
    const template = `-- 窗口: {{name}}
local 配置 = {
    类型 = "窗口",
    名称 = "{{name}}",
    
    -- 尺寸
    宽度 = {{width}},
    高度 = {{height}},
    
    -- 属性
    模态 = {{modal}},
    可拖动 = true,
    
    -- 控件
    控件 = {
        -- 在这里添加控件
    },
    
    -- 事件
    事件 = {
        创建时 = function(窗口)
            调试输出("窗口创建: " .. 窗口.名称)
        end,
        
        关闭时 = function(窗口)
            调试输出("窗口关闭: " .. 窗口.名称)
        end
    }
}

return 配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled(args);
    
    const filePath = join(PROJECTS_DIR, args.project, "窗口", `${args.name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `窗口 ${args.name} 生成成功`,
      path: filePath,
    };
  },
};

export const generatorTools: Tool[] = [
  generateActorTool,
  generateItemTool,
  generateSkillTool,
  generateWindowTool,
];
