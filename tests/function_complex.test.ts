import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.js';
import { normalizeEol, readExpected } from './utils/testHelpers.js';

const resDir = join(process.cwd(), 'tests', 'resources', 'item', 'function');

const expectedJs = readExpected(join(resDir, 'complex_function.js.txt'));

function assertEqual(a: string, b: string, msg?: string) {
  if (a !== b) {
    console.error('Assertion failed:', msg || 'values differ');
    console.error('Expected:\n' + b);
    console.error('Actual:\n' + a);
    process.exit(1);
  }
}

const yml = readFileSync(join(resDir, 'complex_function.yml'), 'utf-8');
const code = new CodeGenerator().generate(yml);
assertEqual(
  normalizeEol(code.trim()),
  expectedJs,
  'YAML -> JS complex function generation matches expected JS'
);
console.log('OK');
