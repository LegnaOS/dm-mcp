# 示例：创建一个完整的 RPG 游戏

这个示例展示如何使用 DM3 MCP Server 创建一个完整的 RPG 游戏。

## 步骤 1：创建项目

```
使用 dm3_create_project 创建项目：
- name: "fantasy_rpg"
- title: "幻想RPG"
- width: 1024
- height: 768
```

## 步骤 2：创建角色

### 主角
```
使用 dm3_generate_actor 创建主角：
- project: "fantasy_rpg"
- name: "勇者"
- type: "player"
- hp: 1000
- mp: 500
- speed: 5
```

### NPC
```
使用 dm3_generate_actor 创建村长：
- project: "fantasy_rpg"
- name: "村长"
- type: "npc"
- hp: 500
- mp: 0
- speed: 3
```

### 怪物
```
使用 dm3_generate_actor 创建史莱姆：
- project: "fantasy_rpg"
- name: "史莱姆"
- type: "monster"
- hp: 100
- mp: 0
- speed: 2

使用 dm3_generate_actor 创建哥布林：
- project: "fantasy_rpg"
- name: "哥布林"
- type: "monster"
- hp: 300
- mp: 50
- speed: 4
```

## 步骤 3：创建道具

### 消耗品
```
使用 dm3_generate_item 创建生命药水：
- project: "fantasy_rpg"
- name: "生命药水"
- type: "consumable"
- description: "恢复100点生命值"
- stackable: true
- maxStack: 99

使用 dm3_generate_item 创建魔法药水：
- project: "fantasy_rpg"
- name: "魔法药水"
- type: "consumable"
- description: "恢复50点魔法值"
- stackable: true
- maxStack: 99
```

### 装备
```
使用 dm3_generate_item 创建铁剑：
- project: "fantasy_rpg"
- name: "铁剑"
- type: "equipment"
- description: "攻击力+10"
- stackable: false

使用 dm3_generate_item 创建皮甲：
- project: "fantasy_rpg"
- name: "皮甲"
- type: "equipment"
- description: "防御力+5"
- stackable: false
```

## 步骤 4：创建技能

```
使用 dm3_generate_skill 创建普通攻击：
- project: "fantasy_rpg"
- name: "普通攻击"
- mpCost: 0
- cooldown: 500
- range: 1

使用 dm3_generate_skill 创建火球术：
- project: "fantasy_rpg"
- name: "火球术"
- mpCost: 20
- cooldown: 2000
- range: 5

使用 dm3_generate_skill 创建治疗术：
- project: "fantasy_rpg"
- name: "治疗术"
- mpCost: 30
- cooldown: 3000
- range: 3
```

## 步骤 5：创建窗口

```
使用 dm3_generate_window 创建主界面：
- project: "fantasy_rpg"
- name: "主界面"
- width: 1024
- height: 768
- modal: false

使用 dm3_generate_window 创建背包：
- project: "fantasy_rpg"
- name: "背包"
- width: 600
- height: 400
- modal: true

使用 dm3_generate_window 创建技能栏：
- project: "fantasy_rpg"
- name: "技能栏"
- width: 800
- height: 100
- modal: false

使用 dm3_generate_window 创建对话框：
- project: "fantasy_rpg"
- name: "对话框"
- width: 500
- height: 200
- modal: true
```

## 步骤 6：验证代码

```
使用 dm3_validate_lua 验证所有生成的 Lua 文件

使用 dm3_check_encoding 检查所有文件编码是否为 GBK

使用 dm3_lint_config 检查配置文件规范
```

## 步骤 7：查询文档

```
使用 dm3_search_docs 搜索 "战斗系统" 了解如何实现战斗

使用 dm3_get_api_reference 获取 "技能" API 文档

使用 dm3_get_example 获取 "角色" 相关的代码示例
```

## 步骤 8：构建和运行

```
使用 dm3_build_project 编译项目：
- name: "fantasy_rpg"

使用 dm3_run_project 运行项目：
- name: "fantasy_rpg"
```

## 预期结果

完成以上步骤后，你将得到：

- ✅ 1 个完整的 RPG 游戏项目
- ✅ 4 个角色（1个主角，1个NPC，2个怪物）
- ✅ 4 个道具（2个消耗品，2个装备）
- ✅ 3 个技能（攻击、魔法、治疗）
- ✅ 4 个窗口（主界面、背包、技能栏、对话框）
- ✅ 所有代码经过验证
- ✅ 可运行的游戏

## 下一步

1. 自定义角色属性和行为
2. 实现战斗逻辑
3. 添加地图和场景
4. 设计任务系统
5. 优化 UI 界面
6. 添加音效和音乐
