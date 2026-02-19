import { z } from "zod";
import { writeFileSync } from "fs";
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
    name: z.string().describe("角色名称（中文）"),
    displayName: z.string().optional().describe("显示名（可选，默认同名称）"),
    type: z.enum(["player", "npc", "monster"]).default("npc").describe("角色类型"),
    hp: z.number().default(100).describe("生命值"),
    maxhp: z.number().optional().describe("最大生命值（可选，默认同hp）"),
    mp: z.number().default(100).describe("魔法值"),
    maxmp: z.number().optional().describe("最大魔法值（可选，默认同mp）"),
    speed: z.number().default(0).describe("移动速度（百分比增幅）"),
    attackSpeed: z.number().default(0).describe("攻击速度（百分比增幅）"),
    image: z.string().optional().describe("角色图片资源标识"),
  }),
  handler: async (args) => {
    const { project, name, displayName, type, hp, maxhp, mp, maxmp, speed, attackSpeed, image } = args;
    
    const template = `-- 角色配置: {{name}}
-- 编码：GBK

local 配置 = {
    类型 = "角色",
    名称 = "{{name}}",
    {{#if displayName}}
    显示名 = "{{displayName}}",
    {{/if}}
    {{#if isPlayer}}
    默认主角 = true,
    {{/if}}
    
    -- 基础属性
    hp = {{hp}},
    maxhp = {{maxhp}},
    mp = {{mp}},
    maxmp = {{maxmp}},
    
    -- 速度属性
    移动速度 = {{speed}},
    攻击速度 = {{attackSpeed}},
    
    {{#if image}}
    -- 外观
    外观 = {{{{位置="衣服",图片="{{image}}"}}}},
    {{/if}}
    
    -- 系统事件
    系统事件 = {
        创建 = function(角色对象)
            调试输出("角色创建: " .. 角色对象.名称)
        end,
        
        死亡 = function(角色对象, 伤害来源)
            调试输出("角色死亡: " .. 角色对象.名称)
        end,
        
        受伤 = function(角色对象, 掉血值, 剩余血量, 总血量, 伤害来源, 伤害类型, 伤害组件)
            -- 在这里处理受伤逻辑
        end
    }
}

return 配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled({
      name,
      displayName: displayName || name,
      isPlayer: type === "player",
      hp,
      maxhp: maxhp || hp,
      mp,
      maxmp: maxmp || mp,
      speed,
      attackSpeed,
      image,
    });
    
    const filePath = join(PROJECTS_DIR, project, "角色", `${name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `角色 ${name} 生成成功`,
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
    name: z.string().describe("道具名称（唯一标识）"),
    displayName: z.string().optional().describe("显示名（可选，默认同名称）"),
    category: z.enum(["道具", "装备", "特殊"]).default("道具").describe("分类"),
    subCategory: z.string().default("消耗").describe("子类（消耗/衣服/武器/项链/手镯/戒指/其他）"),
    icon: z.string().optional().describe("图标资源标识"),
    maxStack: z.number().default(99).describe("最大叠加数量"),
    canDrop: z.boolean().default(true).describe("是否可丢弃"),
  }),
  handler: async (args) => {
    const { project, name, displayName, category, subCategory, icon, maxStack, canDrop } = args;
    
    const template = `-- 道具配置: {{name}}
-- 编码：GBK

local 道具配置 = {
    类型 = "道具",
    名称 = "{{name}}",
    显示名 = "{{displayName}}",
    颜色 = RGBA(255, 255, 255, 255),
    {{#if icon}}
    图标 = "{{icon}}",
    {{/if}}
    气泡提示 = "{{displayName}}",
    分类 = "{{category}}",
    子类 = "{{subCategory}}",
    最大叠加 = {{maxStack}},
    禁止丢弃 = {{#unless canDrop}}true{{else}}false{{/unless}},
    
    -- 扩展属性（根据需要添加）
    扩展属性 = {
        -- 攻击 = 10,
        -- 防御 = 5,
    },
    
    -- 系统事件
    系统事件 = {
        创建 = function(道具对象, 附加)
            -- 道具创建时触发
            调试输出("道具创建: " .. 道具对象.名称)
        end,
        
        使用 = function(道具对象)
            -- 道具使用时触发，返回 false 可拦截
            调试输出("使用道具: " .. 道具对象.名称)
            -- return false
        end,
        
        拾取 = function(道具对象)
            -- 道具拾取时触发，返回 false 可拦截
            调试输出("拾取道具: " .. 道具对象.名称)
            -- return false
        end,
        
        掉落 = function(地图坐标x, 地图坐标y, 道具对象, 来源角色)
            -- 道具掉落到地图时触发，返回 false 可拦截并销毁道具
            -- return false
        end,
        
        丢弃 = function(道具对象)
            -- 从包裹往地图丢弃时触发
            -- 返回 false: 不允许丢弃
            -- 返回 -1: 直接销毁道具
            -- 返回 格子x, 格子y: 丢弃到指定格子
            -- 无返回值: 按默认逻辑掉落
        end
    }
}

return 道具配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled({
      name,
      displayName: displayName || name,
      category,
      subCategory,
      icon,
      maxStack,
      canDrop,
    });
    
    const filePath = join(PROJECTS_DIR, project, "道具", `${name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `道具 ${name} 生成成功`,
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
    name: z.string().describe("技能名称（唯一标识）"),
    displayName: z.string().optional().describe("显示名（可选，默认同名称）"),
    targetCamp: z.enum(["敌方", "友方", "不限"]).default("敌方").describe("目标阵营"),
    attackRange: z.number().default(1).describe("攻击距离（格子）"),
    action: z.string().default("攻击").describe("动作名称"),
    interval: z.number().default(2000).describe("技能CD间隔（毫秒）"),
    targetPosition: z.number().default(0).describe("目标位置（0:角色目标 1:鼠标格子 2:优先角色 3:自身）"),
    priority: z.number().default(1).describe("优先级（值越大越优先）"),
    damageDelay: z.number().default(500).describe("伤害延迟（毫秒）"),
  }),
  handler: async (args) => {
    const { project, name, displayName, targetCamp, attackRange, action, interval, targetPosition, priority, damageDelay } = args;
    
    const template = `-- 技能配置: {{name}}
-- 编码：GBK

local 技能配置 = {
    类型 = "技能",
    名称 = "{{name}}",
    显示名 = "{{displayName}}",
    攻击距离 = {{attackRange}},
    动作 = "{{action}}",
    间隔 = {{interval}},
    目标阵营 = "{{targetCamp}}",
    目标位置 = {{targetPosition}},
    优先级 = {{priority}},
    伤害延迟 = {{damageDelay}},
    
    -- 伤害范围（点模式，对目标造成伤害）
    伤害范围 = {
        类型 = 1,
        范围 = {
            {0, 0, 100}  -- 面向, 距离, 伤害比例
        }
    },
    
    -- 受伤效果
    受伤效果 = {
        几率 = 100,
        动作 = true,
        音效 = true,
        闪烁 = RGBA(255, 255, 255, 255)
    },
    
    -- 伤害公式（a:我方 b:敌方 c:技能对象）
    伤害公式 = "a.攻击 ^ 2 / (a.攻击 + b.防御) * (0.8 + math.random() * 0.2)",
    
    -- 系统事件
    系统事件 = {
        创建 = function(来源角色, 技能对象)
            -- 角色增加技能时触发
            调试输出(来源角色.名称 .. " 增加技能 " .. 技能对象.名称)
        end,
        
        启动 = function(来源角色, 技能对象, 目标角色, 格子x, 格子y, 坐标x, 坐标y)
            -- 技能启动前触发
            -- 返回 false: 拦截技能释放
            -- 返回 动作名: 改变起手动作
            -- 返回 数值: 施法时间（毫秒）
            调试输出("技能启动: " .. 技能对象.名称)
        end,
        
        准备 = function(来源角色, 技能对象, 目标角色)
            -- 自动战斗时释放技能前触发
            -- 返回 false: 拦截释放
            -- 返回 数值: 延迟触发时间
            -- 返回 文本: 替换技能名称
            -- 返回 角色对象: 改变目标
        end,
        
        结束 = function(来源角色, 技能对象)
            -- 技能所有命中效果结束后触发
            调试输出("技能结束: " .. 技能对象.名称)
        end,
        
        技能格子 = function(技能对象, 格子对象)
            -- 技能格子被按下时触发
            -- 返回 true: 拦截使用
        end
    }
}

return 技能配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled({
      name,
      displayName: displayName || name,
      targetCamp,
      attackRange,
      action,
      interval,
      targetPosition,
      priority,
      damageDelay,
    });
    
    const filePath = join(PROJECTS_DIR, project, "技能", `${name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `技能 ${name} 生成成功`,
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
    name: z.string().describe("窗口名称（唯一标识）"),
    title: z.string().optional().describe("窗口标题（可选）"),
    width: z.number().default(400).describe("窗口宽度"),
    height: z.number().default(300).describe("窗口高度"),
    movable: z.boolean().default(true).describe("是否可移动"),
    defaultVisible: z.boolean().default(true).describe("默认是否可视"),
  }),
  handler: async (args) => {
    const { project, name, title, width, height, movable, defaultVisible } = args;
    
    const template = `-- 窗口配置: {{name}}
-- 编码：GBK

local 窗口配置 = {
    类型 = "窗口",
    名称 = "{{name}}",
    {{#if title}}
    标题 = "{{title}}",
    {{/if}}
    宽度 = {{width}},
    高度 = {{height}},
    可移动 = {{movable}},
    默认可视 = {{defaultVisible}},
    
    -- 控件数组
    控件 = {
        -- 在这里添加控件
        -- 示例：
        -- {
        --     类型 = "标签",
        --     名称 = "标题标签",
        --     x = 10,
        --     y = 10,
        --     文本 = "欢迎",
        -- },
    },
    
    -- 系统事件
    系统事件 = {
        创建 = function(窗口对象)
            -- 所有控件完成初始化，窗口创建后触发
            调试输出(窗口对象.名称 .. " 创建")
        end,
        
        打开 = function(窗口对象)
            -- 窗口打开时触发
            调试输出(窗口对象.名称 .. " 打开")
        end,
        
        关闭 = function(窗口对象)
            -- 窗口关闭时触发
            调试输出(窗口对象.名称 .. " 关闭")
        end,
        
        点击 = function(窗口对象, 键值, 功能键)
            -- 窗口被点击时触发
            -- 键值: 0=左键 1=右键 2=中键
            -- 功能键: 1=Ctrl 2=Shift 3=Alt
            -- 返回 false 可阻止事件继续传播
            调试输出(窗口对象.名称 .. " 点击")
        end
    }
}

return 窗口配置
`;

    const compiled = Handlebars.compile(template);
    const content = compiled({
      name,
      title,
      width,
      height,
      movable,
      defaultVisible,
    });
    
    const filePath = join(PROJECTS_DIR, project, "窗口", `${name}.lua`);
    writeFileSync(filePath, convertToGBK(content));

    return {
      success: true,
      message: `窗口 ${name} 生成成功`,
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
