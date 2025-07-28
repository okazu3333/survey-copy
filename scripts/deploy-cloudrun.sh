#!/bin/bash

# Cloud Run デプロイスクリプト
set -e

# 設定
PROJECT_ID=${PROJECT_ID:-"your-project-id"}
SERVICE_NAME=${SERVICE_NAME:-"survey-app"}
REGION=${REGION:-"asia-northeast1"}
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Cloud Run デプロイを開始します..."
echo "Project ID: ${PROJECT_ID}"
echo "Service Name: ${SERVICE_NAME}"
echo "Region: ${REGION}"
echo "Image: ${IMAGE_NAME}"

# 1. プロジェクトの設定
echo "📋 プロジェクトを設定中..."
gcloud config set project ${PROJECT_ID}

# 2. Cloud Build API を有効化
echo "🔧 Cloud Build API を有効化中..."
gcloud services enable cloudbuild.googleapis.com

# 3. Buildpack でビルド
echo "🏗️ Buildpack でビルド中..."
pack build ${IMAGE_NAME} \
  --builder gcr.io/buildpacks/builder:v1 \
  --env NODE_ENV=production \
  --env NPM_CONFIG_PRODUCTION=false

# 4. イメージを Container Registry にプッシュ
echo "📤 イメージをプッシュ中..."
docker push ${IMAGE_NAME}

# 5. Cloud Run にデプロイ
echo "🚀 Cloud Run にデプロイ中..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

echo "✅ デプロイ完了!"
echo "🌐 サービスURL: $(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')" 