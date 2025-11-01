#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

const CSS_DEF_REGEX = /^\s*--([\w-]+)\s*:/m;
const CSS_DEF_GLOBAL_REGEX = /--([\w-]+)\s*:/g;
const CSS_VAR_USAGE_REGEX = /var\(\s*--([\w-]+)\s*(?:,\s*[^)]+)?\)/g;

const root = process.cwd();

function readIfExists(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function collectDefinedVars(): Set<string> {
  const files = [
    path.join(root, 'app', 'globals.css'),
    path.join(root, 'styles', 'tokens.light.css'),
    path.join(root, 'styles', 'tokens.dark.css'),
    path.join(root, 'styles', 'component-overrides.css'),
    path.join(root, 'styles', 'globals.css'),
  ];
  const defined = new Set<string>();
  for (const f of files) {
    const content = readIfExists(f);
    if (!content) continue;
    const m = content.match(CSS_DEF_GLOBAL_REGEX);
    if (m) {
      for (const def of m) {
        const name = def.split(':')[0].trim().replace(/^--/, '');
        if (name) defined.add(name);
      }
    }
  }
  return defined;
}

async function collectVarUsages(): Promise<Map<string, Set<string>>> {
  const include = ['**/*.{ts,tsx,css}'];
  const ignore = [
    '**/node_modules/**', '**/.next/**', '**/dist/**', '**/out/**', '**/coverage/**',
    '**/design-system/**',
    '**/docs/**',
    '**/__tests__/**',
    '**/pages/demo/**',
    '**/archive/**', '**/storybook-static/**', '**/tmp/**', '**/temp/**',
    'styles/tokens.*.css',
  ];
  const files = await glob(include, { cwd: root, ignore });
  const usage = new Map<string, Set<string>>();

  for (const rel of files) {
    const abs = path.join(root, rel);
    const content = readIfExists(abs);
    const vars = new Set<string>();
    let match: RegExpExecArray | null;
    const regex = new RegExp(CSS_VAR_USAGE_REGEX);
    while ((match = regex.exec(content)) !== null) {
      const name = match[1];
      const full = match[0];
      const hasFallback = full.includes(',');
      if (!hasFallback) {
        vars.add(name);
      }
    }
    if (vars.size > 0) usage.set(rel, vars);
  }
  return usage;
}

async function main() {
  const defined = collectDefinedVars();
  const usage = await collectVarUsages();

  const undefinedUsages: { file: string; names: string[] }[] = [];

  for (const [file, names] of usage.entries()) {
    const missing = Array.from(names)
      // ignore Tailwind runtime and Radix/Next Fonts variables
      .filter(n => !defined.has(n)
        && !n.startsWith('tw-')
        && !n.startsWith('radix-')
        && !n.startsWith('font-')
        && !n.startsWith('skeleton-'));
    if (missing.length > 0) {
      undefinedUsages.push({ file, names: missing.sort() });
    }
  }

  if (undefinedUsages.length === 0) {
    console.log(chalk.green('✔ Все var(--...) в коде соответствуют определённым CSS-переменным.'));
    process.exit(0);
  }

  console.log(chalk.yellow('⚠ Обнаружены var(--...) без определений:'));
  for (const entry of undefinedUsages) {
    console.log(chalk.cyan(`\n${entry.file}`));
    for (const n of entry.names) {
      console.log(`  - ${n}`);
    }
  }

  process.exit(1);
}

main().catch(err => {
  console.error(chalk.red('Ошибка проверки использования токенов в коде:'), err);
  process.exit(2);
});