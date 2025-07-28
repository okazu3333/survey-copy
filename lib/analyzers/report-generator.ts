import type { CSSAnalysisResult } from "./css-analyzer";

// レポート設定の型定義
export interface ReportConfig {
  detailed: boolean;
  colored: boolean;
  showStatistics: boolean;
  showRecommendations: boolean;
  generateDependencyGraph: boolean;
  outputFormat: "console" | "json" | "html" | "markdown";
  outputFile?: string;
}

// レポート生成クラス
export class CSSReportGenerator {
  private config: ReportConfig;

  constructor(config?: Partial<ReportConfig>) {
    this.config = this.getDefaultConfig();
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private getDefaultConfig(): ReportConfig {
    return {
      detailed: true,
      colored: true,
      showStatistics: true,
      showRecommendations: true,
      generateDependencyGraph: false,
      outputFormat: "console",
    };
  }

  // メインのレポート生成メソッド
  public generateReport(analysis: CSSAnalysisResult): string {
    switch (this.config.outputFormat) {
      case "json":
        return this.generateJSONReport(analysis);
      case "html":
        return this.generateHTMLReport(analysis);
      case "markdown":
        return this.generateMarkdownReport(analysis);
      default:
        return this.generateConsoleReport(analysis);
    }
  }

  // コンソールレポート生成
  private generateConsoleReport(analysis: CSSAnalysisResult): string {
    const lines: string[] = [];

    // ヘッダー
    lines.push(this.createHeader("CSS依存関係分析レポート"));

    // Tailwindクラス使用状況
    if (this.config.detailed) {
      lines.push(this.createTailwindClassesSection(analysis));
    }

    // カスタムCSS
    if (analysis.customCSS.size > 0) {
      lines.push(this.createCustomCSSSection(analysis));
    }

    // グローバルスタイル
    if (analysis.globalStyles.size > 0) {
      lines.push(this.createGlobalStylesSection(analysis));
    }

    // コンポーネント依存関係
    if (this.config.detailed && analysis.componentDependencies.size > 0) {
      lines.push(this.createDependenciesSection(analysis));
    }

    // 推奨事項
    if (
      this.config.showRecommendations &&
      analysis.recommendations.length > 0
    ) {
      lines.push(this.createRecommendationsSection(analysis));
    }

    // 統計情報
    if (this.config.showStatistics) {
      lines.push(this.createStatisticsSection(analysis));
    }

    // フッター
    lines.push(this.createFooter());

    return lines.join("\n");
  }

  // JSONレポート生成
  private generateJSONReport(analysis: CSSAnalysisResult): string {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalComponents: analysis.statistics.totalComponents,
        totalTailwindClasses: analysis.statistics.totalTailwindClasses,
        totalCustomClasses: analysis.statistics.totalCustomClasses,
        totalRecommendations: analysis.statistics.totalRecommendations,
        successRate: analysis.statistics.successRate,
      },
      tailwindClasses: Object.fromEntries(analysis.tailwindClasses),
      customCSS: Object.fromEntries(analysis.customCSS),
      globalStyles: Object.fromEntries(analysis.globalStyles),
      componentDependencies: Object.fromEntries(analysis.componentDependencies),
      recommendations: analysis.recommendations,
      issues: analysis.issues,
    };

    return JSON.stringify(report, null, 2);
  }

  // HTMLレポート生成
  private generateHTMLReport(analysis: CSSAnalysisResult): string {
    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS依存関係分析レポート</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #374151; margin-top: 30px; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb; }
        .stat-number { font-size: 2em; font-weight: bold; color: #2563eb; }
        .stat-label { color: #6b7280; margin-top: 5px; }
        .recommendation { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .issue { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .component-list { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .class-list { font-family: monospace; background: #f3f4f6; padding: 10px; border-radius: 4px; margin: 5px 0; }
        .impact-high { border-left-color: #ef4444; }
        .impact-medium { border-left-color: #f59e0b; }
        .impact-low { border-left-color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS依存関係分析レポート</h1>
        
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-number">${analysis.statistics.totalComponents}</div>
                <div class="stat-label">コンポーネント数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analysis.statistics.totalTailwindClasses}</div>
                <div class="stat-label">Tailwindクラス数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analysis.statistics.totalCustomClasses}</div>
                <div class="stat-label">カスタムクラス数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analysis.statistics.totalRecommendations}</div>
                <div class="stat-label">推奨事項数</div>
            </div>
        </div>

        ${this.generateHTMLRecommendations(analysis)}
        ${this.generateHTMLIssues(analysis)}
        ${this.generateHTMLTailwindClasses(analysis)}
        ${this.generateHTMLCustomCSS(analysis)}
    </div>
</body>
</html>`;
  }

  // Markdownレポート生成
  private generateMarkdownReport(analysis: CSSAnalysisResult): string {
    const lines: string[] = [];

    lines.push("# CSS依存関係分析レポート");
    lines.push("");
    lines.push(`**生成日時**: ${new Date().toLocaleString("ja-JP")}`);
    lines.push("");

    // 統計情報
    lines.push("## 📊 統計情報");
    lines.push("");
    lines.push(
      `- **コンポーネント数**: ${analysis.statistics.totalComponents}`,
    );
    lines.push(
      `- **Tailwindクラス数**: ${analysis.statistics.totalTailwindClasses}`,
    );
    lines.push(
      `- **カスタムクラス数**: ${analysis.statistics.totalCustomClasses}`,
    );
    lines.push(`- **推奨事項数**: ${analysis.statistics.totalRecommendations}`);
    lines.push(`- **成功率**: ${analysis.statistics.successRate.toFixed(1)}%`);
    lines.push("");

    // 推奨事項
    if (analysis.recommendations.length > 0) {
      lines.push("## 💡 推奨事項");
      lines.push("");
      analysis.recommendations.forEach((rec, index) => {
        lines.push(`### ${index + 1}. ${rec.message}`);
        if (rec.pattern) {
          lines.push(`**パターン**: \`${rec.pattern}\``);
        }
        if (rec.classes) {
          lines.push(`**クラス**: \`${rec.classes.join(" ")}\``);
        }
        lines.push(`**影響度**: ${rec.impact} | **作業量**: ${rec.effort}`);
        lines.push("");
      });
    }

    // Tailwindクラス
    if (this.config.detailed) {
      lines.push("## 🎨 Tailwind CSSクラス使用状況");
      lines.push("");
      analysis.tailwindClasses.forEach((classes, component) => {
        lines.push(`### ${component}`);
        lines.push(`**クラス数**: ${classes.length}`);
        lines.push(`**クラス**: \`${classes.join(" ")}\``);
        lines.push("");
      });
    }

    return lines.join("\n");
  }

  // セクション生成メソッド
  private createHeader(title: string): string {
    const separator = "=".repeat(80);
    return `${separator}\n${title}\n${separator}`;
  }

  private createTailwindClassesSection(analysis: CSSAnalysisResult): string {
    const lines = ["\n📊 Tailwind CSSクラス使用状況:"];

    analysis.tailwindClasses.forEach((classes, component) => {
      lines.push(`  ${component}: ${classes.length}個のクラス`);
      if (classes.length > 0) {
        lines.push(`    ${classes.join(" ")}`);
      }
    });

    return lines.join("\n");
  }

  private createCustomCSSSection(analysis: CSSAnalysisResult): string {
    const lines = ["\n🎨 カスタムCSS:"];

    analysis.customCSS.forEach((classes, file) => {
      lines.push(`  ${file}: ${classes.length}個のクラス`);
      if (classes.length > 0) {
        lines.push(`    ${classes.join(", ")}`);
      }
    });

    return lines.join("\n");
  }

  private createGlobalStylesSection(analysis: CSSAnalysisResult): string {
    const lines = ["\n🌍 グローバルスタイル:"];

    analysis.globalStyles.forEach((value, key) => {
      lines.push(`  ${key}: ${value}`);
    });

    return lines.join("\n");
  }

  private createDependenciesSection(analysis: CSSAnalysisResult): string {
    const lines = ["\n🔗 コンポーネント依存関係:"];

    analysis.componentDependencies.forEach((deps, component) => {
      lines.push(`  ${component}:`);
      deps.forEach((dep) => lines.push(`    → ${dep}`));
    });

    return lines.join("\n");
  }

  private createRecommendationsSection(analysis: CSSAnalysisResult): string {
    const lines = ["\n💡 推奨事項:"];

    analysis.recommendations.forEach((rec, index) => {
      lines.push(`  ${index + 1}. ${rec.message}`);
      if (rec.pattern) {
        lines.push(`     パターン: ${rec.pattern}`);
      }
    });

    return lines.join("\n");
  }

  private createStatisticsSection(analysis: CSSAnalysisResult): string {
    const lines = ["\n📈 統計情報:"];

    lines.push(`  コンポーネント数: ${analysis.statistics.totalComponents}`);
    lines.push(
      `  Tailwindクラス数: ${analysis.statistics.totalTailwindClasses}`,
    );
    lines.push(`  カスタムクラス数: ${analysis.statistics.totalCustomClasses}`);
    lines.push(`  推奨事項数: ${analysis.statistics.totalRecommendations}`);

    return lines.join("\n");
  }

  private createFooter(): string {
    return `\n${"=".repeat(80)}`;
  }

  // HTMLセクション生成メソッド
  private generateHTMLRecommendations(analysis: CSSAnalysisResult): string {
    if (analysis.recommendations.length === 0) return "";

    const recommendations = analysis.recommendations
      .map(
        (rec) => `
      <div class="recommendation impact-${rec.impact}">
        <strong>${rec.message}</strong>
        ${rec.pattern ? `<br><code>パターン: ${rec.pattern}</code>` : ""}
        ${rec.classes ? `<br><code>クラス: ${rec.classes.join(" ")}</code>` : ""}
        <br><small>影響度: ${rec.impact} | 作業量: ${rec.effort}</small>
      </div>
    `,
      )
      .join("");

    return `
      <h2>💡 推奨事項</h2>
      ${recommendations}
    `;
  }

  private generateHTMLIssues(analysis: CSSAnalysisResult): string {
    if (analysis.issues.length === 0) return "";

    const issues = analysis.issues
      .map(
        (issue) => `
      <div class="issue">
        <strong>${issue.type.toUpperCase()}:</strong> ${issue.message}
        <br><small>重要度: ${issue.severity}</small>
      </div>
    `,
      )
      .join("");

    return `
      <h2>⚠️ 問題</h2>
      ${issues}
    `;
  }

  private generateHTMLTailwindClasses(analysis: CSSAnalysisResult): string {
    if (analysis.tailwindClasses.size === 0) return "";

    const components = Array.from(analysis.tailwindClasses.entries())
      .map(
        ([component, classes]) => `
      <div class="component-list">
        <h3>${component}</h3>
        <div class="class-list">${classes.join(" ")}</div>
        <small>${classes.length}個のクラス</small>
      </div>
    `,
      )
      .join("");

    return `
      <h2>🎨 Tailwind CSSクラス</h2>
      ${components}
    `;
  }

  private generateHTMLCustomCSS(analysis: CSSAnalysisResult): string {
    if (analysis.customCSS.size === 0) return "";

    const files = Array.from(analysis.customCSS.entries())
      .map(
        ([file, classes]) => `
      <div class="component-list">
        <h3>${file}</h3>
        <div class="class-list">${classes.join(", ")}</div>
        <small>${classes.length}個のクラス</small>
      </div>
    `,
      )
      .join("");

    return `
      <h2>🎨 カスタムCSS</h2>
      ${files}
    `;
  }

  // 設定を更新
  public updateConfig(newConfig: Partial<ReportConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // レポートをファイルに保存
  public async saveReport(
    analysis: CSSAnalysisResult,
    filePath: string,
  ): Promise<void> {
    const fs = await import("node:fs");
    const report = this.generateReport(analysis);
    await fs.promises.writeFile(filePath, report, "utf8");
  }
}
