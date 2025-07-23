# CSS依存関係分析システム - コンポーネントアーキテクチャ

## 概要

CSS依存関係分析システムをコンポーネント化することで、保守性、拡張性、再利用性を大幅に向上させました。このドキュメントでは、新しいアーキテクチャの設計思想と利点について説明します。

## アーキテクチャ概要

```
lib/analyzers/
├── css-analyzer.ts      # CSS依存関係分析クラス
├── report-generator.ts  # レポート生成クラス
└── index.ts            # エクスポート

scripts/
├── css-dependency-analyzer.js  # メインスクリプト
└── quality-check.js            # 品質チェック統合

config/
├── css-analysis.config.js      # 設定ファイル
└── report-config.js           # レポート設定
```

## コンポーネント化の利点

### 1. 関心の分離 (Separation of Concerns)

**Before (ハードコード版):**
```javascript
// すべての機能が1つのファイルに混在
function analyzeTailwindDependencies() { /* ... */ }
function analyzeGlobalCSS() { /* ... */ }
function generateReport() { /* ... */ }
function detectIssues() { /* ... */ }
```

**After (コンポーネント化版):**
```typescript
// 分析ロジック
class CSSDependencyAnalyzer {
  async analyze(): Promise<CSSAnalysisResult> { /* ... */ }
}

// レポート生成
class CSSReportGenerator {
  generateReport(analysis: CSSAnalysisResult): string { /* ... */ }
}
```

### 2. 型安全性

```typescript
// 明確な型定義
export interface CSSAnalysisResult {
  tailwindClasses: Map<string, string[]>;
  customCSS: Map<string, string[]>;
  componentDependencies: Map<string, string[]>;
  globalStyles: Map<string, any>;
  issues: AnalysisIssue[];
  recommendations: AnalysisRecommendation[];
  statistics: AnalysisStatistics;
}
```

### 3. 設定の柔軟性

```typescript
// 設定可能な分析オプション
export interface CSSAnalyzerConfig {
  directories: {
    components: string[];
    css: string[];
  };
  analysis: {
    detectDuplicatePatterns: boolean;
    maxClassesPerComponent: number;
    analyzeComponentDependencies: boolean;
  };
  thresholds: {
    duplicatePatterns: number;
    longClassList: number;
  };
}
```

### 4. 複数の出力形式

```typescript
// 同じデータから異なる形式のレポートを生成
const reportGenerator = new CSSReportGenerator({
  outputFormat: 'html'  // 'console' | 'json' | 'html' | 'markdown'
});

const report = reportGenerator.generateReport(analysis);
```

## 主要コンポーネント

### CSSDependencyAnalyzer

**責任:** CSS依存関係の分析と問題検出

**主要メソッド:**
- `analyze()`: メイン分析メソッド
- `updateConfig()`: 設定の動的更新
- `getResult()`: 分析結果の取得
- `reset()`: 結果のリセット

**使用例:**
```typescript
const analyzer = new CSSDependencyAnalyzer({
  directories: {
    components: ['components/ui', 'app/_components']
  },
  analysis: {
    detectDuplicatePatterns: true,
    maxClassesPerComponent: 15
  }
});

const result = await analyzer.analyze();
```

### CSSReportGenerator

**責任:** 分析結果のレポート生成

**主要メソッド:**
- `generateReport()`: レポート生成
- `saveReport()`: ファイル保存
- `updateConfig()`: レポート設定の更新

**使用例:**
```typescript
const reportGenerator = new CSSReportGenerator({
  outputFormat: 'html',
  detailed: true,
  showStatistics: true
});

const report = reportGenerator.generateReport(analysis);
await reportGenerator.saveReport(analysis, 'report.html');
```

## 拡張性

### 新しい分析機能の追加

```typescript
class CSSDependencyAnalyzer {
  // 新しい分析メソッドを簡単に追加
  private async analyzeCSSVariables(): Promise<void> {
    // CSS変数の分析ロジック
  }
  
  private async analyzeMediaQueries(): Promise<void> {
    // メディアクエリの分析ロジック
  }
}
```

### 新しいレポート形式の追加

```typescript
class CSSReportGenerator {
  private generateCSVReport(analysis: CSSAnalysisResult): string {
    // CSV形式のレポート生成
  }
  
  private generateXMLReport(analysis: CSSAnalysisResult): string {
    // XML形式のレポート生成
  }
}
```

### 新しい問題検出ルールの追加

```typescript
class CSSDependencyAnalyzer {
  private detectUnusedCSSVariables(): void {
    // 未使用CSS変数の検出
  }
  
  private detectCircularDependencies(): void {
    // 循環依存の検出
  }
}
```

## テスト可能性

### 単体テスト

```typescript
describe('CSSDependencyAnalyzer', () => {
  let analyzer: CSSDependencyAnalyzer;
  
  beforeEach(() => {
    analyzer = new CSSDependencyAnalyzer({
      directories: { components: ['test-components'] }
    });
  });
  
  it('should detect duplicate class patterns', async () => {
    const result = await analyzer.analyze();
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].type).toBe('duplicate-pattern');
  });
});
```

### 統合テスト

```typescript
describe('CSS Analysis Integration', () => {
  it('should generate HTML report from analysis', async () => {
    const analyzer = new CSSDependencyAnalyzer();
    const reportGenerator = new CSSReportGenerator({ outputFormat: 'html' });
    
    const analysis = await analyzer.analyze();
    const report = reportGenerator.generateReport(analysis);
    
    expect(report).toContain('<html>');
    expect(report).toContain('CSS依存関係分析レポート');
  });
});
```

## パフォーマンス最適化

### 非同期処理

```typescript
// ファイル読み込みを並列実行
private async analyzeDirectory(dirPath: string): Promise<void> {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const promises = files.map(file => this.analyzeFile(file));
  await Promise.all(promises);
}
```

### メモリ効率

```typescript
// 大きなファイルをストリーム処理
private async analyzeLargeFile(filePath: string): Promise<void> {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  // ストリームベースの分析
}
```

## 設定管理

### 環境別設定

```typescript
// development.config.js
export default {
  analysis: {
    detailed: true,
    maxClassesPerComponent: 20
  }
};

// production.config.js
export default {
  analysis: {
    detailed: false,
    maxClassesPerComponent: 10
  }
};
```

### 動的設定更新

```typescript
const analyzer = new CSSDependencyAnalyzer();
analyzer.updateConfig({
  thresholds: { longClassList: 15 }
});
```

## エラーハンドリング

### 構造化されたエラー

```typescript
export interface AnalysisIssue {
  type: 'error' | 'warning';
  message: string;
  component?: string;
  file?: string;
  severity: 'low' | 'medium' | 'high';
}
```

### エラー回復

```typescript
try {
  await analyzer.analyze();
} catch (error) {
  if (error.code === 'ENOENT') {
    // ファイルが見つからない場合の処理
  } else if (error.code === 'EACCES') {
    // 権限エラーの処理
  }
}
```

## 今後の拡張計画

### 1. プラグインシステム

```typescript
interface CSSAnalysisPlugin {
  name: string;
  analyze(analysis: CSSAnalysisResult): Promise<void>;
  priority: number;
}

class PluginManager {
  register(plugin: CSSAnalysisPlugin): void;
  execute(analysis: CSSAnalysisResult): Promise<void>;
}
```

### 2. リアルタイム分析

```typescript
class RealtimeAnalyzer extends CSSDependencyAnalyzer {
  watch(directories: string[]): void;
  onFileChange(callback: (file: string) => void): void;
}
```

### 3. CI/CD統合

```typescript
class CICDAnalyzer extends CSSDependencyAnalyzer {
  generateJUnitReport(): string;
  generateGitHubAnnotations(): string;
  checkThresholds(): boolean;
}
```

## 結論

コンポーネント化により、CSS依存関係分析システムは以下の利点を獲得しました：

1. **保守性**: 各コンポーネントが単一責任を持つ
2. **拡張性**: 新しい機能を簡単に追加可能
3. **再利用性**: 他のプロジェクトでも利用可能
4. **テスト可能性**: 単体テストと統合テストが容易
5. **型安全性**: TypeScriptによる型チェック
6. **設定の柔軟性**: 環境や要件に応じた設定変更

このアーキテクチャにより、開発チームはより効率的にCSS依存関係を管理し、コードの品質を向上させることができます。 