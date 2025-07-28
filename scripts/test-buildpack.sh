#!/bin/bash

# Buildpack テストスクリプト
set -e

echo "🧪 Buildpack テストを開始します..."

# テスト用のイメージ名
TEST_IMAGE="survey-app-test:latest"

# 既存のテストイメージを削除
echo "🗑️ 既存のテストイメージを削除中..."
docker rmi ${TEST_IMAGE} 2>/dev/null || true

# Buildpack でビルド
echo "🏗️ Buildpack でビルド中..."
pack build ${TEST_IMAGE} \
  --builder gcr.io/buildpacks/builder:v1 \
  --env NODE_ENV=production \
  --env NPM_CONFIG_PRODUCTION=false \
  --verbose

echo "✅ ビルド完了!"

# イメージの情報を表示
echo "📋 イメージ情報:"
docker images ${TEST_IMAGE}

# コンテナを起動してテスト
echo "🚀 テストコンテナを起動中..."
docker run -d --name survey-app-test -p 8080:8080 ${TEST_IMAGE}

# 少し待機
sleep 5

# ヘルスチェック
echo "🏥 ヘルスチェック中..."
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ アプリケーションが正常に起動しました!"
    echo "🌐 URL: http://localhost:8080"
else
    echo "❌ アプリケーションの起動に失敗しました"
fi

# コンテナを停止・削除
echo "🛑 テストコンテナを停止中..."
docker stop survey-app-test
docker rm survey-app-test

echo "🧹 テスト完了!" 