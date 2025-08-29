import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.ts';

const resDir = join(process.cwd(), 'tests', 'resources', 'item', 'function');

function normalizeEol(s: string) { return s.replace(/\r\n/g, '\n'); }

const expectedJs = normalizeEol(`/**
 * Calculate the sum of two ints.
 *
 * @param a - The first operand.
 * @param b - The second operand.
 * @returns: The sum of the two numbers.
 */
function add(a, b) {
  // TODO: Implement function body
}`);

function assertEqual(a: string, b: string, msg?: string) {
  if (a !== b) {
    console.error('Assertion failed:', msg || 'values differ');
    console.error('Expected:\n' + b);
    console.error('Actual:\n' + a);
    process.exit(1);
  }
}

const yml = readFileSync(join(resDir, 'basic_function.yml'), 'utf-8');
const code = new CodeGenerator().generate(yml);
assertEqual(normalizeEol(code.trim()), expectedJs, 'YAML -> JS function generation matches expected JS');
console.log('OK');
