// CSS依存関係分析システムのエクスポート

import type {
  CSSAnalysisResult,
  CSSAnalyzerConfig,
  AnalysisIssue,
  AnalysisRecommendation,
  AnalysisStatistics
} from './css-analyzer';

import type { ReportConfig } from './report-generator';

import { CSSDependencyAnalyzer } from './css-analyzer';
import { CSSReportGenerator } from './report-generator';

export {
  CSSDependencyAnalyzer
} from './css-analyzer';

export {
  CSSReportGenerator
} from './report-generator';

export type {
  CSSAnalysisResult,
  CSSAnalyzerConfig,
  AnalysisIssue,
  AnalysisRecommendation,
  AnalysisStatistics,
  ReportConfig
};

// 便利なファクトリ関数
export function createAnalyzer(config?: Partial<CSSAnalyzerConfig>) {
  return new CSSDependencyAnalyzer(config);
}

export function createReportGenerator(config?: Partial<ReportConfig>) {
  return new CSSReportGenerator(config);
}

// プリセット設定
export const defaultAnalyzerConfig: CSSAnalyzerConfig = {
  directories: {
    components: ['components/ui', 'app/_components', 'app/(auth)', 'components'],
    css: ['app/globals.css', 'styles/globals.css', 'styles/main.css']
  },
  tailwind: {
    configFile: 'tailwind.config.ts',
    analyzeTheme: true,
    analyzePlugins: true,
    detectCustomClasses: true
  },
  analysis: {
    detectDuplicatePatterns: true,
    maxClassesPerComponent: 10,
    detectUnusedClasses: true,
    analyzeComponentDependencies: true,
    analyzeCSSVariables: true,
    analyzeLayers: true
  },
  thresholds: {
    duplicatePatterns: 1,
    longClassList: 10,
    unusedClasses: 5
  },
  exclude: {
    files: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/.next/**'],
    classes: ['sr-only', 'hidden', 'invisible']
  }
};

export const defaultReportConfig: ReportConfig = {
  detailed: true,
  colored: true,
  showStatistics: true,
  showRecommendations: true,
  generateDependencyGraph: false,
  outputFormat: 'console'
};

// 使用例
export async function analyzeCSSDependencies(config?: Partial<CSSAnalyzerConfig>) {
  const analyzer = createAnalyzer(config);
  return await analyzer.analyze();
}

export function generateCSSReport(
  analysis: CSSAnalysisResult, 
  config?: Partial<ReportConfig>
) {
  const reportGenerator = createReportGenerator(config);
  return reportGenerator.generateReport(analysis);
}

export async function analyzeAndReport(
  analyzerConfig?: Partial<CSSAnalyzerConfig>,
  reportConfig?: Partial<ReportConfig>
) {
  const analysis = await analyzeCSSDependencies(analyzerConfig);
  const report = generateCSSReport(analysis, reportConfig);
  return { analysis, report };
} 