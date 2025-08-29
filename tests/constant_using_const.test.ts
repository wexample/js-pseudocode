import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.ts';

const resDir = join(process.cwd(), 'tests', 'resources', 'item', 'constant');

function normalizeEol(s: string) { return s.replace(/\r\n/g, '\n'); }

const expectedJs = normalizeEol(`// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Base URL for the API
const API_BASE_URL = "https://api.example.com";`);

function assertEqual(a: string, b: string, msg?: string) {
  if (a !== b) {
    console.error('Assertion failed:', msg || 'values differ');
    console.error('Expected:\n' + b);
    console.error('Actual:\n' + a);
    process.exit(1);
  }
}

const yml = readFileSync(join(resDir, 'constant_using_const.yml'), 'utf-8');
const code = new CodeGenerator().generate(yml);
assertEqual(normalizeEol(code.trim()), expectedJs, 'YAML -> JS constants generation matches expected JS');
console.log('OK');
