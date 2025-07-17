#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 色付きログ出力
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// CSS依存関係の分析結果
const cssAnalysis = {
  tailwindClasses: new Map(),
  customCSS: new Map(),
  componentDependencies: new Map(),
  globalStyles: new Map(),
  issues: [],
  recommendations: []
};

// Tailwind CSSクラスの依存関係を分析
function analyzeTailwindDependencies() {
  logInfo('Tailwind CSSクラスの依存関係を分析中...');
  
  const componentDirs = [
    'components/ui',
    'app/_components',
    'app/(auth)',
    'components'
  ];
  
  componentDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      analyzeDirectory(dir);
    }
  });
  
  // Tailwind設定ファイルの分析
  if (fs.existsSync('tailwind.config.ts')) {
    analyzeTailwindConfig();
  }
  
  logSuccess('Tailwind CSS依存関係の分析完了');
}

// ディレクトリ内のファイルを分析
function analyzeDirectory(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      analyzeDirectory(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      analyzeComponentFile(fullPath);
    }
  });
}

// コンポーネントファイルの分析
function analyzeComponentFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const componentName = path.basename(filePath, path.extname(filePath));
    
    // className属性を抽出
    const classNameMatches = content.match(/className\s*=\s*["'`]([^"'`]+)["'`]/g);
    const cnMatches = content.match(/cn\s*\(\s*([^)]+)\s*\)/g);
    
    const classes = new Set();
    
    // 通常のclassName属性
    if (classNameMatches) {
      classNameMatches.forEach(match => {
        const classValue = match.match(/className\s*=\s*["'`]([^"'`]+)["'`]/)[1];
        classValue.split(' ').forEach(cls => {
          if (cls.trim()) classes.add(cls.trim());
        });
      });
    }
    
    // cn()関数内のクラス
    if (cnMatches) {
      cnMatches.forEach(match => {
        const cnContent = match.match(/cn\s*\(\s*([^)]+)\s*\)/)[1];
        // 文字列リテラルを抽出
        const stringMatches = cnContent.match(/["'`]([^"'`]+)["'`]/g);
        if (stringMatches) {
          stringMatches.forEach(strMatch => {
            const classValue = strMatch.replace(/["'`]/g, '');
            classValue.split(' ').forEach(cls => {
              if (cls.trim()) classes.add(cls.trim());
            });
          });
        }
      });
    }
    
    if (classes.size > 0) {
      cssAnalysis.tailwindClasses.set(componentName, Array.from(classes));
    }
    
    // コンポーネントの依存関係を分析
    analyzeComponentDependencies(content, componentName);
    
  } catch (error) {
    logError(`ファイル分析エラー (${filePath}): ${error.message}`);
  }
}

// コンポーネントの依存関係を分析
function analyzeComponentDependencies(content, componentName) {
  const dependencies = new Set();
  
  // import文を抽出
  const importMatches = content.match(/import\s+.*?from\s+["'`]([^"'`]+)["'`]/g);
  if (importMatches) {
    importMatches.forEach(match => {
      const importPath = match.match(/from\s+["'`]([^"'`]+)["'`]/)[1];
      if (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../')) {
        dependencies.add(importPath);
      }
    });
  }
  
  if (dependencies.size > 0) {
    cssAnalysis.componentDependencies.set(componentName, Array.from(dependencies));
  }
}

// Tailwind設定ファイルの分析
function analyzeTailwindConfig() {
  try {
    const content = fs.readFileSync('tailwind.config.ts', 'utf8');
    
    // カスタムテーマの抽出
    const themeMatches = content.match(/theme:\s*{([^}]+)}/g);
    if (themeMatches) {
      logInfo('カスタムTailwindテーマを検出');
      cssAnalysis.globalStyles.set('tailwind-theme', 'カスタムテーマ設定あり');
    }
    
    // プラグインの抽出
    const pluginMatches = content.match(/plugins:\s*\[([^\]]+)\]/g);
    if (pluginMatches) {
      logInfo('Tailwindプラグインを検出');
      cssAnalysis.globalStyles.set('tailwind-plugins', 'プラグイン設定あり');
    }
    
  } catch (error) {
    logError(`Tailwind設定分析エラー: ${error.message}`);
  }
}

// グローバルCSSファイルの分析
function analyzeGlobalCSS() {
  logInfo('グローバルCSSファイルを分析中...');
  
  const cssFiles = [
    'app/globals.css',
    'styles/globals.css',
    'styles/main.css'
  ];
  
  cssFiles.forEach(cssFile => {
    if (fs.existsSync(cssFile)) {
      analyzeCSSFile(cssFile);
    }
  });
  
  logSuccess('グローバルCSS分析完了');
}

// CSSファイルの分析
function analyzeCSSFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // CSS変数の抽出
    const cssVars = content.match(/--[^:]+:\s*[^;]+;/g);
    if (cssVars) {
      cssAnalysis.globalStyles.set(`${fileName}-variables`, cssVars.length);
    }
    
    // カスタムクラスの抽出
    const customClasses = content.match(/\.[a-zA-Z][a-zA-Z0-9_-]*\s*{/g);
    if (customClasses) {
      const classes = customClasses.map(cls => cls.replace(/[.{]/g, '').trim());
      cssAnalysis.customCSS.set(fileName, classes);
    }
    
    // @layerディレクティブの分析
    const layerMatches = content.match(/@layer\s+([^{]+){/g);
    if (layerMatches) {
      logInfo(`${fileName}: Tailwindレイヤーを検出`);
      cssAnalysis.globalStyles.set(`${fileName}-layers`, layerMatches.length);
    }
    
  } catch (error) {
    logError(`CSSファイル分析エラー (${filePath}): ${error.message}`);
  }
}

// 依存関係の問題を検出
function detectDependencyIssues() {
  logInfo('依存関係の問題を検出中...');
  
  // 未使用のクラスを検出
  const allClasses = new Set();
  cssAnalysis.tailwindClasses.forEach(classes => {
    classes.forEach(cls => allClasses.add(cls));
  });
  
  // 重複するクラスパターンを検出
  const classPatterns = new Map();
  cssAnalysis.tailwindClasses.forEach((classes, component) => {
    const pattern = classes.sort().join(' ');
    if (classPatterns.has(pattern)) {
      classPatterns.get(pattern).push(component);
    } else {
      classPatterns.set(pattern, [component]);
    }
  });
  
  // 重複パターンの報告
  classPatterns.forEach((components, pattern) => {
    if (components.length > 1) {
      cssAnalysis.recommendations.push({
        type: 'duplicate-pattern',
        message: `重複するクラスパターン: ${components.join(', ')}`,
        pattern: pattern
      });
    }
  });
  
  // 長すぎるクラスリストを検出
  cssAnalysis.tailwindClasses.forEach((classes, component) => {
    if (classes.length > 10) {
      cssAnalysis.recommendations.push({
        type: 'long-class-list',
        message: `${component}: クラス数が多すぎます (${classes.length}個)`,
        classes: classes
      });
    }
  });
  
  logSuccess('依存関係問題の検出完了');
}

// レポートの生成
function generateReport() {
  console.log('\n' + '='.repeat(80));
  log('CSS依存関係分析レポート', 'cyan');
  console.log('='.repeat(80));
  
  // Tailwindクラス使用状況
  console.log('\n📊 Tailwind CSSクラス使用状況:');
  cssAnalysis.tailwindClasses.forEach((classes, component) => {
    log(`  ${component}: ${classes.length}個のクラス`, 'blue');
    if (classes.length > 0) {
      console.log(`    ${classes.join(' ')}`);
    }
  });
  
  // カスタムCSS
  console.log('\n🎨 カスタムCSS:');
  cssAnalysis.customCSS.forEach((classes, file) => {
    log(`  ${file}: ${classes.length}個のクラス`, 'blue');
    if (classes.length > 0) {
      console.log(`    ${classes.join(', ')}`);
    }
  });
  
  // グローバルスタイル
  console.log('\n🌍 グローバルスタイル:');
  cssAnalysis.globalStyles.forEach((value, key) => {
    log(`  ${key}: ${value}`, 'blue');
  });
  
  // コンポーネント依存関係
  console.log('\n🔗 コンポーネント依存関係:');
  cssAnalysis.componentDependencies.forEach((deps, component) => {
    log(`  ${component}:`, 'blue');
    deps.forEach(dep => console.log(`    → ${dep}`));
  });
  
  // 推奨事項
  if (cssAnalysis.recommendations.length > 0) {
    console.log('\n💡 推奨事項:');
    cssAnalysis.recommendations.forEach((rec, index) => {
      log(`  ${index + 1}. ${rec.message}`, 'yellow');
      if (rec.pattern) {
        console.log(`     パターン: ${rec.pattern}`);
      }
    });
  }
  
  // 統計情報
  const totalComponents = cssAnalysis.tailwindClasses.size;
  const totalClasses = Array.from(cssAnalysis.tailwindClasses.values())
    .reduce((sum, classes) => sum + classes.length, 0);
  const totalCustomClasses = Array.from(cssAnalysis.customCSS.values())
    .reduce((sum, classes) => sum + classes.length, 0);
  
  console.log('\n📈 統計情報:');
  log(`  コンポーネント数: ${totalComponents}`, 'green');
  log(`  Tailwindクラス数: ${totalClasses}`, 'green');
  log(`  カスタムクラス数: ${totalCustomClasses}`, 'green');
  log(`  推奨事項数: ${cssAnalysis.recommendations.length}`, 'yellow');
  
  console.log('\n' + '='.repeat(80));
}

// メイン実行関数
function main() {
  log('🚀 CSS依存関係分析を開始します...', 'cyan');
  
  try {
    analyzeTailwindDependencies();
    analyzeGlobalCSS();
    detectDependencyIssues();
    generateReport();
    
    logSuccess('CSS依存関係分析が完了しました！');
  } catch (error) {
    logError(`分析エラー: ${error.message}`);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  main();
}

module.exports = {
  analyzeTailwindDependencies,
  analyzeGlobalCSS,
  detectDependencyIssues,
  generateReport,
  cssAnalysis
}; 