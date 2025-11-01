#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

// Files to include and exclude
const includePatterns = [
  '**/*.{ts,tsx,css}'
];
const excludePatterns = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/out/**',
  '**/coverage/**',
  '**/design-system/**',
  'app/globals.css',
  'styles/tokens.*.css',
  'styles/globals.css'
];

// Allowed literals that shouldn't be flagged
const allowedLiterals = new Set([
  'transparent', 'currentColor', 'inherit', 'none',
  '0', '0px', '0%', '100%'
]);

// Regex patterns to detect hardcoded values
const HEX_COLOR = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const RGB_COLOR = /rgb\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/g;
const RGBA_COLOR = /rgba\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0(?:\.\d+)?|1(?:\.0)?)\s*\)/g;
// Only match HSL when numeric (avoid hsl(var(--...)))
const HSL_COLOR = /hsl\s*\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)/g;
const HSLA_COLOR = /hsla\s*\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(?:0(?:\.\d+)?|1(?:\.0)?)\s*\)/g;
const PX_VALUE = /(?<![a-zA-Z-])\b\d+(?:\.\d+)?px\b/g; // basic px detector
const PERCENT_VALUE = /(?<!var\()\b\d+(?:\.\d+)?%\b/g; // skip var(...%) definitions
const OPACITY_VALUE = /opacity\s*:\s*(?:0(?:\.\d+)?|1(?:\.0)?)\b/g;

function isAllowed(value: string): boolean {
  return allowedLiterals.has(value.trim());
}

function collectMatches(content: string): string[] {
  const matches: string[] = [];
  const pushAll = (regex: RegExp) => {
    const m = content.match(regex);
    if (m) matches.push(...m);
  };
  pushAll(HEX_COLOR);
  pushAll(RGB_COLOR);
  pushAll(RGBA_COLOR);
  pushAll(HSL_COLOR);
  pushAll(HSLA_COLOR);
  pushAll(PX_VALUE);
  pushAll(PERCENT_VALUE);
  pushAll(OPACITY_VALUE);
  return matches.filter(v => !isAllowed(v));
}

async function main() {
  const root = process.cwd();
  const files = await glob(includePatterns, { cwd: root, ignore: excludePatterns });

  const results: { file: string; lines: { line: number; snippet: string }[] }[] = [];

  for (const rel of files) {
    const abs = path.join(root, rel);
    const content = fs.readFileSync(abs, 'utf-8');
    const lines = content.split(/\r?\n/);

    const flagged: { line: number; snippet: string }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = collectMatches(line);
      if (matches.length > 0) {
        // Skip comments
        if (/^\s*\/(\/|\*)/.test(line)) continue;
        // Skip Tailwind config-like lines importing theme vars (hsl(var(--...)))
        if (/hsl\s*\(\s*var\s*\(\s*--/.test(line)) continue;

        flagged.push({ line: i + 1, snippet: line.trim() });
      }
    }
    if (flagged.length > 0) {
      results.push({ file: rel, lines: flagged });
    }
  }

  if (results.length === 0) {
    console.log(chalk.green('✔ Не найдено хардкодов цветов/значений.'));
    process.exit(0);
  }

  console.log(chalk.yellow(`⚠ Найдены потенциальные хардкоды (${results.length} файлов):`));
  for (const r of results) {
    console.log(chalk.cyan(`\n${r.file}`));
    for (const l of r.lines) {
      console.log(`  ${chalk.gray(`#${l.line}`)} ${l.snippet}`);
    }
  }

  // Non-zero exit to fail CI if hardcodes found
  process.exit(1);
}

main().catch(err => {
  console.error(chalk.red('Ошибка в проверке хардкодов:'), err);
  process.exit(2);
});