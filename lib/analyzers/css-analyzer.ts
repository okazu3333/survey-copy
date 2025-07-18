import fs from 'fs';
import path from 'path';

// 分析結果の型定義
export interface CSSAnalysisResult {
  tailwindClasses: Map<string, string[]>;
  customCSS: Map<string, string[]>;
  componentDependencies: Map<string, string[]>;
  globalStyles: Map<string, any>;
  issues: AnalysisIssue[];
  recommendations: AnalysisRecommendation[];
  statistics: AnalysisStatistics;
}

export interface AnalysisIssue {
  type: 'error' | 'warning';
  message: string;
  component?: string;
  file?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisRecommendation {
  type: 'duplicate-pattern' | 'long-class-list' | 'unused-class' | 'dependency-cycle';
  message: string;
  component?: string;
  pattern?: string;
  classes?: string[];
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export interface AnalysisStatistics {
  totalComponents: number;
  totalTailwindClasses: number;
  totalCustomClasses: number;
  totalRecommendations: number;
  successRate: number;
}

// 分析設定の型定義
export interface CSSAnalyzerConfig {
  directories: {
    components: string[];
    css: string[];
  };
  tailwind: {
    configFile: string;
    analyzeTheme: boolean;
    analyzePlugins: boolean;
    detectCustomClasses: boolean;
  };
  analysis: {
    detectDuplicatePatterns: boolean;
    maxClassesPerComponent: number;
    detectUnusedClasses: boolean;
    analyzeComponentDependencies: boolean;
    analyzeCSSVariables: boolean;
    analyzeLayers: boolean;
  };
  thresholds: {
    duplicatePatterns: number;
    longClassList: number;
    unusedClasses: number;
  };
  exclude: {
    files: string[];
    classes: string[];
  };
}

// CSS依存関係分析クラス
export class CSSDependencyAnalyzer {
  private config: CSSAnalyzerConfig;
  private result: CSSAnalysisResult;

  constructor(config?: Partial<CSSAnalyzerConfig>) {
    this.config = this.getDefaultConfig();
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.result = this.initializeResult();
  }

  private getDefaultConfig(): CSSAnalyzerConfig {
    return {
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
  }

  private initializeResult(): CSSAnalysisResult {
    return {
      tailwindClasses: new Map(),
      customCSS: new Map(),
      componentDependencies: new Map(),
      globalStyles: new Map(),
      issues: [],
      recommendations: [],
      statistics: {
        totalComponents: 0,
        totalTailwindClasses: 0,
        totalCustomClasses: 0,
        totalRecommendations: 0,
        successRate: 0
      }
    };
  }

  // メイン分析メソッド
  public async analyze(): Promise<CSSAnalysisResult> {
    try {
      await this.analyzeTailwindDependencies();
      await this.analyzeGlobalCSS();
      await this.detectDependencyIssues();
      this.calculateStatistics();
      return this.result;
    } catch (error) {
      this.addIssue('error', `分析エラー: ${error}`, 'high');
      throw error;
    }
  }

  // Tailwind CSSクラスの依存関係を分析
  private async analyzeTailwindDependencies(): Promise<void> {
    for (const dir of this.config.directories.components) {
      if (fs.existsSync(dir)) {
        await this.analyzeDirectory(dir);
      }
    }

    if (fs.existsSync(this.config.tailwind.configFile)) {
      await this.analyzeTailwindConfig();
    }
  }

  // ディレクトリ内のファイルを分析
  private async analyzeDirectory(dirPath: string): Promise<void> {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        await this.analyzeDirectory(fullPath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        await this.analyzeComponentFile(fullPath);
      }
    }
  }

  // コンポーネントファイルの分析
  private async analyzeComponentFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = path.basename(filePath, path.extname(filePath));

      const classes = this.extractClasses(content);
      if (classes.length > 0) {
        this.result.tailwindClasses.set(componentName, classes);
      }

      if (this.config.analysis.analyzeComponentDependencies) {
        const dependencies = this.extractDependencies(content);
        if (dependencies.length > 0) {
          this.result.componentDependencies.set(componentName, dependencies);
        }
      }
    } catch (error) {
      this.addIssue('error', `ファイル分析エラー (${filePath}): ${error}`, 'medium');
    }
  }

  // クラスを抽出
  private extractClasses(content: string): string[] {
    const classes = new Set<string>();

    // className属性を抽出
    const classNameMatches = content.match(/className\s*=\s*["'`]([^"'`]+)["'`]/g);
    if (classNameMatches) {
      classNameMatches.forEach(match => {
        const classValue = match.match(/className\s*=\s*["'`]([^"'`]+)["'`]/)?.[1];
        if (classValue) {
          classValue.split(' ').forEach(cls => {
            const trimmed = cls.trim();
            if (trimmed && !this.config.exclude.classes.includes(trimmed)) {
              classes.add(trimmed);
            }
          });
        }
      });
    }

    // cn()関数内のクラス
    const cnMatches = content.match(/cn\s*\(\s*([^)]+)\s*\)/g);
    if (cnMatches) {
      cnMatches.forEach(match => {
        const cnContent = match.match(/cn\s*\(\s*([^)]+)\s*\)/)?.[1];
        if (cnContent) {
          const stringMatches = cnContent.match(/["'`]([^"'`]+)["'`]/g);
          if (stringMatches) {
            stringMatches.forEach(strMatch => {
              const classValue = strMatch.replace(/["'`]/g, '');
              classValue.split(' ').forEach(cls => {
                const trimmed = cls.trim();
                if (trimmed && !this.config.exclude.classes.includes(trimmed)) {
                  classes.add(trimmed);
                }
              });
            });
          }
        }
      });
    }

    return Array.from(classes);
  }

  // 依存関係を抽出
  private extractDependencies(content: string): string[] {
    const dependencies = new Set<string>();

    const importMatches = content.match(/import\s+.*?from\s+["'`]([^"'`]+)["'`]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const importPath = match.match(/from\s+["'`]([^"'`]+)["'`]/)?.[1];
        if (importPath && (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../'))) {
          dependencies.add(importPath);
        }
      });
    }

    return Array.from(dependencies);
  }

  // Tailwind設定ファイルの分析
  private async analyzeTailwindConfig(): Promise<void> {
    try {
      const content = fs.readFileSync(this.config.tailwind.configFile, 'utf8');

      if (this.config.tailwind.analyzeTheme) {
        const themeMatches = content.match(/theme:\s*{([^}]+)}/g);
        if (themeMatches) {
          this.result.globalStyles.set('tailwind-theme', 'カスタムテーマ設定あり');
        }
      }

      if (this.config.tailwind.analyzePlugins) {
        const pluginMatches = content.match(/plugins:\s*\[([^\]]+)\]/g);
        if (pluginMatches) {
          this.result.globalStyles.set('tailwind-plugins', 'プラグイン設定あり');
        }
      }
    } catch (error) {
      this.addIssue('error', `Tailwind設定分析エラー: ${error}`, 'medium');
    }
  }

  // グローバルCSSファイルの分析
  private async analyzeGlobalCSS(): Promise<void> {
    for (const cssFile of this.config.directories.css) {
      if (fs.existsSync(cssFile)) {
        await this.analyzeCSSFile(cssFile);
      }
    }
  }

  // CSSファイルの分析
  private async analyzeCSSFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);

      if (this.config.analysis.analyzeCSSVariables) {
        const cssVars = content.match(/--[^:]+:\s*[^;]+;/g);
        if (cssVars) {
          this.result.globalStyles.set(`${fileName}-variables`, cssVars.length);
        }
      }

      const customClasses = content.match(/\.[a-zA-Z][a-zA-Z0-9_-]*\s*{/g);
      if (customClasses) {
        const classes = customClasses.map(cls => cls.replace(/[.{]/g, '').trim());
        this.result.customCSS.set(fileName, classes);
      }

      if (this.config.analysis.analyzeLayers) {
        const layerMatches = content.match(/@layer\s+([^{]+){/g);
        if (layerMatches) {
          this.result.globalStyles.set(`${fileName}-layers`, layerMatches.length);
        }
      }
    } catch (error) {
      this.addIssue('error', `CSSファイル分析エラー (${filePath}): ${error}`, 'medium');
    }
  }

  // 依存関係の問題を検出
  private async detectDependencyIssues(): Promise<void> {
    if (this.config.analysis.detectDuplicatePatterns) {
      this.detectDuplicatePatterns();
    }

    if (this.config.analysis.detectUnusedClasses) {
      this.detectLongClassLists();
    }
  }

  // 重複パターンを検出
  private detectDuplicatePatterns(): void {
    const classPatterns = new Map<string, string[]>();

    this.result.tailwindClasses.forEach((classes, component) => {
      const pattern = classes.sort().join(' ');
      if (classPatterns.has(pattern)) {
        classPatterns.get(pattern)!.push(component);
      } else {
        classPatterns.set(pattern, [component]);
      }
    });

    classPatterns.forEach((components, pattern) => {
      if (components.length > this.config.thresholds.duplicatePatterns) {
        this.addRecommendation('duplicate-pattern', {
          message: `重複するクラスパターン: ${components.join(', ')}`,
          pattern,
          impact: 'medium',
          effort: 'medium'
        });
      }
    });
  }

  // 長いクラスリストを検出
  private detectLongClassLists(): void {
    this.result.tailwindClasses.forEach((classes, component) => {
      if (classes.length > this.config.thresholds.longClassList) {
        this.addRecommendation('long-class-list', {
          message: `${component}: クラス数が多すぎます (${classes.length}個)`,
          classes,
          impact: 'low',
          effort: 'low'
        });
      }
    });
  }

  // 統計情報を計算
  private calculateStatistics(): void {
    this.result.statistics.totalComponents = this.result.tailwindClasses.size;
    this.result.statistics.totalTailwindClasses = Array.from(this.result.tailwindClasses.values())
      .reduce((sum, classes) => sum + classes.length, 0);
    this.result.statistics.totalCustomClasses = Array.from(this.result.customCSS.values())
      .reduce((sum, classes) => sum + classes.length, 0);
    this.result.statistics.totalRecommendations = this.result.recommendations.length;

    const totalChecks = this.result.statistics.totalComponents + this.result.statistics.totalCustomClasses;
    this.result.statistics.successRate = totalChecks > 0 
      ? ((this.result.statistics.totalComponents / totalChecks) * 100)
      : 100;
  }

  // 問題を追加
  private addIssue(type: 'error' | 'warning', message: string, severity: 'low' | 'medium' | 'high'): void {
    this.result.issues.push({
      type,
      message,
      severity
    });
  }

  // 推奨事項を追加
  private addRecommendation(
    type: AnalysisRecommendation['type'],
    data: {
      message: string;
      component?: string;
      pattern?: string;
      classes?: string[];
      impact: 'low' | 'medium' | 'high';
      effort: 'low' | 'medium' | 'high';
    }
  ): void {
    this.result.recommendations.push({
      type,
      message: data.message,
      component: data.component,
      pattern: data.pattern,
      classes: data.classes,
      impact: data.impact,
      effort: data.effort
    });
  }

  // 設定を更新
  public updateConfig(newConfig: Partial<CSSAnalyzerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // 結果を取得
  public getResult(): CSSAnalysisResult {
    return this.result;
  }

  // 結果をリセット
  public reset(): void {
    this.result = this.initializeResult();
  }
} 