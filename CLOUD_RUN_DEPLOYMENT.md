# Cloud Run デプロイガイド

このプロジェクトは Google Cloud Run に Cloud Native Buildpacks を使用してデプロイできます。

## 前提条件

1. **Google Cloud SDK** がインストールされていること
2. **Docker** がインストールされていること
3. **Pack CLI** がインストールされていること
4. **Google Cloud プロジェクト** が作成されていること

## セットアップ

### 1. Google Cloud SDK のインストール

```bash
# macOS
brew install google-cloud-sdk

# 初期化
gcloud init
```

### 2. Pack CLI のインストール

```bash
# macOS
brew install buildpacks/tap/pack

# または
curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.32.1/pack-v0.32.1-macos.tgz" | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack
```

### 3. 必要なAPIの有効化

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## デプロイ手順

### 方法1: 自動デプロイスクリプトを使用

1. 環境変数を設定:

```bash
export PROJECT_ID="your-project-id"
export SERVICE_NAME="survey-app"
export REGION="asia-northeast1"
```

2. デプロイを実行:

```bash
npm run deploy:cloudrun
```

### 方法2: 手動デプロイ

1. プロジェクトを設定:

```bash
gcloud config set project YOUR_PROJECT_ID
```

2. Buildpack でビルド:

```bash
pack build gcr.io/YOUR_PROJECT_ID/survey-app \
  --builder gcr.io/buildpacks/builder:v1 \
  --env NODE_ENV=production \
  --env NPM_CONFIG_PRODUCTION=false
```

3. イメージをプッシュ:

```bash
docker push gcr.io/YOUR_PROJECT_ID/survey-app
```

4. Cloud Run にデプロイ:

```bash
gcloud run deploy survey-app \
  --image gcr.io/YOUR_PROJECT_ID/survey-app \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

## 設定ファイル

### project.toml
Cloud Native Buildpacks の設定ファイルです。ビルド時とランタイム時の環境変数を定義しています。

### next.config.ts
Next.js の設定で、`output: 'standalone'` を指定して Cloud Run 用に最適化しています。

### .dockerignore
Docker ビルド時に除外するファイルを指定しています。

## 環境変数

デプロイ時に以下の環境変数を設定できます:

```bash
gcloud run deploy survey-app \
  --set-env-vars NODE_ENV=production,DATABASE_URL=your-db-url
```

## トラブルシューティング

### ビルドエラー
- Node.js のバージョンが適切か確認
- 依存関係が正しくインストールされているか確認

### デプロイエラー
- Google Cloud プロジェクトの権限を確認
- 必要なAPIが有効化されているか確認

### ランタイムエラー
- ログを確認: `gcloud run logs read survey-app --region asia-northeast1`
- 環境変数が正しく設定されているか確認

## 参考リンク

- [Cloud Run ドキュメント](https://cloud.google.com/run/docs)
- [Cloud Native Buildpacks](https://buildpacks.io/)
- [Next.js デプロイメント](https://nextjs.org/docs/deployment) 