#!/bin/bash

echo "🔍 验证 DM3 MCP Server 设置"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm"
    exit 1
fi
echo "✅ npm: $(npm --version)"

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ dist 目录不存在，请运行 npm run build"
    exit 1
fi
echo "✅ dist 目录存在"

# 检查 dm_fw 目录
if [ ! -d "dm_fw" ]; then
    echo "❌ dm_fw 目录不存在"
    exit 1
fi
echo "✅ dm_fw 目录存在"

# 检查 App.exe
if [ ! -f "dm_fw/App.exe" ]; then
    echo "❌ dm_fw/App.exe 不存在"
    exit 1
fi
echo "✅ dm_fw/App.exe 存在"

# 检查编译后的文件
if [ ! -f "dist/index.js" ]; then
    echo "❌ dist/index.js 不存在"
    exit 1
fi
echo "✅ dist/index.js 存在"

# 检查工具文件
for tool in project generator docs validator; do
    if [ ! -f "dist/tools/${tool}.js" ]; then
        echo "❌ dist/tools/${tool}.js 不存在"
        exit 1
    fi
done
echo "✅ 所有工具文件存在"

# 检查文档目录
if [ ! -d "../dm3_docs_cleaned" ]; then
    echo "⚠️  警告: dm3_docs_cleaned 目录不存在，文档查询功能可能无法使用"
else
    echo "✅ dm3_docs_cleaned 目录存在"
fi

echo ""
echo "✅ 所有检查通过！"
echo ""
echo "下一步："
echo "1. 配置 MCP 客户端（Kiro/Claude）"
echo "2. 运行 npm start 启动服务器"
echo "3. 或者在 MCP 客户端中测试工具"
