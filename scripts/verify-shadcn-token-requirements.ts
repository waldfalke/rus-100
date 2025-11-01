#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();
const globalsPath = path.join(root, 'app', 'globals.css');

function read(p: string): string {
  try { return fs.readFileSync(p, 'utf-8'); } catch { return ''; }
}

function extractCssDefinedVars(css: string): Set<string> {
  const names = new Set<string>();
  const re = /--([\w-]+)\s*:/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) names.add(m[1]);
  return names;
}

// Minimal set of variables expected by shadcn-ui theme mapping
const requiredVars = [
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'destructive', 'destructive-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'border', 'input', 'ring',
  'radius',
  // Project-specific tokens used in tailwind.config.ts
  'wildberries-primary', 'wildberries-secondary', 'wildberries-dark', 'wildberries-darkest',
];

function main() {
  const css = read(globalsPath);
  if (!css) {
    console.error(chalk.red('✖ Не найден app/globals.css — невозможно проверить требуемые токены.'));
    process.exit(1);
  }

  const defined = extractCssDefinedVars(css);
  const missing = requiredVars.filter(v => !defined.has(v));

  if (missing.length === 0) {
    console.log(chalk.green('✔ Все обязательные CSS-переменные для shadcn-ui присутствуют в app/globals.css.'));
    process.exit(0);
  }

  console.log(chalk.yellow('⚠ Отсутствуют обязательные CSS-переменные для shadcn-ui:'));
  for (const v of missing) console.log(`  - ${v}`);

  process.exit(1);
}

try { main(); } catch (err) {
  console.error(chalk.red('Ошибка проверки требований shadcn токенов:'), err);
  process.exit(2);
}