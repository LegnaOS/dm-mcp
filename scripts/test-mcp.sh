#!/bin/bash

echo "🧪 测试 DM3 MCP Server"
echo ""

# 检查构建
if [ ! -d "dist" ]; then
    echo "❌ 未找到 dist 目录，请先运行 npm run build"
    exit 1
fi

# 测试工具列表
echo "📋 测试工具列表..."
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js

echo ""
echo "✅ 测试完成"
