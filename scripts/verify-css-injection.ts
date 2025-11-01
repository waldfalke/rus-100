#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();

function safeRead(p: string): string {
  try { return fs.readFileSync(p, 'utf-8'); } catch { return ''; }
}

function fileExists(p: string): boolean {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
}

function extractTailwindVarNames(twConfig: string): Set<string> {
  const names = new Set<string>();
  const re = /var\(\s*--([\w-]+)\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(twConfig)) !== null) names.add(m[1]);
  return names;
}

function extractCssDefinedVars(css: string): Set<string> {
  const names = new Set<string>();
  const re = /--([\w-]+)\s*:/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) names.add(m[1]);
  return names;
}

function main() {
  const layoutPath = path.join(root, 'app', 'layout.tsx');
  const globalsPath = path.join(root, 'app', 'globals.css');
  const twConfigPath = path.join(root, 'tailwind.config.ts');

  if (!fileExists(layoutPath)) {
    console.error(chalk.red('✖ Не найден app/layout.tsx — проект должен использовать App Router.'));
    process.exit(1);
  }

  const layout = safeRead(layoutPath);
  const hasGlobalsImport = /import\s+"\.\/globals\.css"/.test(layout) || /import\s+['"]\.\/globals\.css['"]/.test(layout);
  if (!hasGlobalsImport) {
    console.error(chalk.red('✖ app/layout.tsx не импортирует ./globals.css — стили могут не применяться глобально.'));
    process.exit(1);
  }

  if (!fileExists(globalsPath)) {
    console.error(chalk.red('✖ Не найден app/globals.css — глобальные стили отсутствуют.'));
    process.exit(1);
  }

  const twConfig = safeRead(twConfigPath);
  const varsInTailwind = extractTailwindVarNames(twConfig);
  const cssGlobals = safeRead(globalsPath);
  const varsInGlobals = extractCssDefinedVars(cssGlobals);

  // Ignore variables provided by Next Fonts/Radix runtime
  const ignoreVarsInGlobalsCheck = new Set([
    'font-inter',
    'font-source-serif-pro',
    'radix-accordion-content-height',
  ]);

  const missingInGlobals = Array.from(varsInTailwind)
    .filter(n => !varsInGlobals.has(n) && !ignoreVarsInGlobalsCheck.has(n));
  if (missingInGlobals.length > 0) {
    console.log(chalk.yellow('⚠ В tailwind.config.ts используются переменные, которых нет в app/globals.css:'));
    for (const n of missingInGlobals) console.log(`  - ${n}`);
  }

  const tokensDarkPath = path.join(root, 'styles', 'tokens.dark.css');
  const tokensLightPath = path.join(root, 'styles', 'tokens.light.css');
  const hasTokensDark = fileExists(tokensDarkPath);
  const hasTokensLight = fileExists(tokensLightPath);

  if (hasTokensDark || hasTokensLight) {
    const stylesGlobalsPath = path.join(root, 'styles', 'globals.css');
    const stylesGlobals = safeRead(stylesGlobalsPath);
    const importsTokens = /@import\s+"\.\/tokens\.(dark|light)\.css"/.test(stylesGlobals);
    if (!importsTokens) {
      console.log(chalk.yellow('⚠ Найдены tokens.*.css, но styles/globals.css их не импортирует. Если они должны участвовать — добавьте импорт.'));
    }
  }

  console.log(chalk.green('✔ Инъекция глобальных стилей через App Router выглядит корректно.'));
}

try { main(); } catch (err) {
  console.error(chalk.red('Ошибка проверки CSS-инъекции:'), err);
  process.exit(2);
}