import { readFileSync } from 'node:fs';

export function normalizeEol(s: string): string {
  return s.replace(/\r\n/g, '\n');
}

export function readExpected(filePath: string): string {
  return normalizeEol(readFileSync(filePath, 'utf-8')).trim();
}
