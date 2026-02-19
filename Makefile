.PHONY: install build dev test clean help

help:
	@echo "DM3 MCP Server - 可用命令："
	@echo "  make install    - 安装依赖"
	@echo "  make build      - 构建项目"
	@echo "  make dev        - 开发模式"
	@echo "  make test       - 运行测试"
	@echo "  make clean      - 清理构建文件"
	@echo "  make lint       - 代码检查"

install:
	@echo "📦 安装依赖..."
	npm install
	@echo "✅ 安装完成"

build:
	@echo "🔨 构建项目..."
	npm run build
	@echo "✅ 构建完成"

dev:
	@echo "🚀 启动开发模式..."
	npm run dev

test:
	@echo "🧪 运行测试..."
	npm run test
	chmod +x scripts/test-mcp.sh
	./scripts/test-mcp.sh

lint:
	@echo "🔍 代码检查..."
	npm run lint

clean:
	@echo "🧹 清理构建文件..."
	rm -rf dist/
	rm -rf node_modules/
	rm -rf *.log
	@echo "✅ 清理完成"

setup: install build
	@echo "📁 创建项目目录..."
	mkdir -p projects
	@if [ ! -f .env ]; then \
		echo "📝 创建环境变量文件..."; \
		cp .env.example .env; \
		echo "⚠️  请编辑 .env 文件，设置 DM3_ENGINE_PATH"; \
	fi
	@echo "✅ 设置完成"
	@echo ""
	@echo "下一步："
	@echo "1. 编辑 .env 文件"
	@echo "2. 配置 MCP 客户端"
	@echo "3. 运行 make test 测试"
