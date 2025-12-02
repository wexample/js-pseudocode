import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.js';

const phpFixtureDir =
  '/home/weeger/Desktop/WIP/WEB/WEXAMPLE/COMPOSER/packages/wexample/php-pseudocode/tests/resources/item/constant';

function normalizeEol(s) {
  return s.replace(/\r\n/g, '\n');
}

const expectedJs = normalizeEol(`// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Base URL for the API
const API_BASE_URL = "https://api.example.com";`);

function assertEqual(a, b, msg) {
  if (a !== b) {
    console.error('Assertion failed:', msg || 'values differ');
    console.error('Expected:\n' + b);
    console.error('Actual:\n' + a);
    process.exit(1);
  }
}

const yml = readFileSync(join(phpFixtureDir, 'constant_using_const.yml'), 'utf-8');
const code = new CodeGenerator().generate(yml);
assertEqual(
  normalizeEol(code.trim()),
  expectedJs,
  'YAML -> JS constants generation matches expected JS'
);
console.log('OK');
