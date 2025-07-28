#!/bin/bash

# カラーコード
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 キャッシュクリアを開始します...${NC}\n"

# プロジェクトルートに移動
cd "$(dirname "$0")/.."

# クリア対象のディレクトリ
CACHE_DIRS=(
    ".next"
    "node_modules/.cache"
    ".turbo"
    "dist"
    "build"
    "coverage"
    ".nyc_output"
)

cleared_count=0

# ディレクトリの削除
for dir in "${CACHE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}🗑️  $dir を削除中...${NC}"
        rm -rf "$dir"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $dir を削除しました${NC}"
            ((cleared_count++))
        else
            echo -e "${RED}❌ $dir の削除に失敗しました${NC}"
        fi
    else
        echo -e "${BLUE}ℹ️  $dir は存在しません${NC}"
    fi
done

# 一時ファイルの削除
echo -e "\n${YELLOW}🗑️  一時ファイルを削除中...${NC}"
find . -name "_buildManifest.js.tmp.*" -delete 2>/dev/null || true
find . -name "_ssgManifest.js.tmp.*" -delete 2>/dev/null || true
find . -name "_app.js.tmp.*" -delete 2>/dev/null || true
find . -name "_error.js.tmp.*" -delete 2>/dev/null || true
echo -e "${GREEN}✅ 一時ファイルを削除しました${NC}"
((cleared_count++))

# npm cacheのクリア
echo -e "\n${YELLOW}📦 npm cacheをクリア中...${NC}"
if npm cache clean --force; then
    echo -e "${GREEN}✅ npm cacheをクリアしました${NC}"
    ((cleared_count++))
else
    echo -e "${RED}❌ npm cacheのクリアに失敗しました${NC}"
fi

# メモリ使用量の表示
echo -e "\n${BLUE}📊 システム情報:${NC}"
if command -v free &> /dev/null; then
    echo -e "${BLUE}メモリ使用量:${NC}"
    free -h | grep -E "Mem|Swap"
fi

if command -v df &> /dev/null; then
    echo -e "${BLUE}ディスク使用量:${NC}"
    df -h . | tail -1
fi

echo -e "\n${GREEN}🎉 キャッシュクリアが完了しました！ (${cleared_count}個の項目をクリア)${NC}"

echo -e "\n${BLUE}💡 次のコマンドで開発サーバーを再起動してください:${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo -e "\n${BLUE}💡 完全にクリーンな状態で開発サーバーを起動する場合:${NC}"
echo -e "   ${YELLOW}npm run dev:clean${NC}"
echo -e "\n${BLUE}💡 または、このスクリプトを直接実行:${NC}"
echo -e "   ${YELLOW}./scripts/clear-cache.sh${NC}" 