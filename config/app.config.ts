/**
 * アプリケーション設定
 *
 * このファイルには、アプリケーション全体で使用される設定を定義します。
 */

export const appConfig = {
  // アプリケーション基本情報
  name: "Survey PoC",
  version: "0.1.0",
  description: "アンケート作成・管理システムのプロトタイプ",

  // 開発環境設定
  development: {
    port: 3000,
    host: "localhost",
    apiBaseUrl: "http://localhost:3000/api",
  },

  // 本番環境設定
  production: {
    apiBaseUrl: process.env.API_BASE_URL || "https://api.survey-app.com",
  },

  // 認証設定
  auth: {
    basicAuth: {
      enabled: true,
      user: process.env.BASIC_AUTH_USER || "",
      password: process.env.BASIC_AUTH_PASSWORD || "",
    },
  },

  // アンケート設定
  survey: {
    maxQuestions: 100,
    maxOptions: 20,
    maxSections: 10,
    supportedTypes: ["SA", "MA", "NU", "TE", "RA", "CA", "GR"] as const,
  },

  // AI設定
  ai: {
    enabled: true,
    maxTokens: 4000,
    temperature: 0.7,
    model: "gpt-4",
  },

  // レビュー設定
  review: {
    maxReviewers: 5,
    autoApprove: false,
    requireAllApprovals: true,
  },

  // ファイルアップロード設定
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
    maxFiles: 10,
  },

  // パフォーマンス設定
  performance: {
    maxBundleSize: 500 * 1024, // 500KB
    imageOptimization: true,
    codeSplitting: true,
  },
} as const;

// 環境変数の型安全なアクセス
export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  basicAuthUser: process.env.BASIC_AUTH_USER || "",
  basicAuthPassword: process.env.BASIC_AUTH_PASSWORD || "",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
} as const;

// 型定義
export type SurveyType = (typeof appConfig.survey.supportedTypes)[number];
export type Environment = typeof env.nodeEnv;
