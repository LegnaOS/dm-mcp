#!/bin/bash

echo "🎮 DM3 MCP Server 安装脚本"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install

# 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

# 创建项目目录
echo ""
echo "📁 创建项目目录..."
mkdir -p projects

# 复制环境变量模板
if [ ! -f .env ]; then
    echo ""
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，设置 DM3_ENGINE_PATH"
fi

echo ""
echo "✅ 安装完成！"
echo ""
echo "下一步："
echo "1. 编辑 .env 文件，设置 DM3_ENGINE_PATH"
echo "2. 在 Kiro 或其他 MCP 客户端中配置此服务器"
echo "3. 运行 npm start 启动服务器"
