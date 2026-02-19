#!/bin/bash

# DM3 MCP Server 本地安装脚本
# 此脚本会将 dm3-mcp 安装为全局命令，无需发布到 npm

set -e

echo "🚀 开始安装 DM3 MCP Server..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "📁 项目目录: $PROJECT_DIR"

# 进入项目目录
cd "$PROJECT_DIR"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ ! -f "dist/index.js" ]; then
    echo "❌ 构建失败：未找到 dist/index.js"
    exit 1
fi

if [ ! -d "dm_fw" ]; then
    echo "❌ 错误：未找到 dm_fw 目录"
    exit 1
fi

echo "✅ 构建成功"

# 全局链接
echo "🔗 创建全局链接..."
npm link

echo ""
echo "✅ 安装完成！"
echo ""
echo "现在你可以使用以下方式运行："
echo "  1. 直接运行: dm3-mcp-server"
echo "  2. 使用 npx: npx dm3-mcp-server"
echo "  3. 使用 node: node $PROJECT_DIR/dist/index.js"
echo ""
echo "配置 MCP 客户端时，使用以下命令："
echo "  - 推荐: \"command\": \"dm3-mcp-server\""
echo "  - 或者: \"command\": \"node\", \"args\": [\"$PROJECT_DIR/dist/index.js\"]"
echo ""
echo "查看配置指南: cat docs/MCP-CLIENTS.md"
echo ""
