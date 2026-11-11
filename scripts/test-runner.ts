import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function findTestFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        findTestFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const testFiles = [
  ...findTestFiles('core'),
  ...findTestFiles('components'),
  ...findTestFiles('cli'),
  ...findTestFiles('examples'),
].sort();

console.log(`Running GameKit test runner across ${testFiles.length} test suites...\n`);

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', '--test', ...testFiles],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
