import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.ts';
import { normalizeEol, readExpected } from './utils/testHelpers.ts';

const resDir = join(process.cwd(), 'tests', 'resources', 'item', 'constant');

const expectedJs = readExpected(join(resDir, 'constant_using_const.js.txt'));

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
assertEqual(
  normalizeEol(code.trim()),
  expectedJs,
  'YAML -> JS constants generation matches expected JS'
);
console.log('OK');
