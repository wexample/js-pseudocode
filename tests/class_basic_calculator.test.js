import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.js';

const pyFixtureDir = '/home/weeger/Desktop/WIP/WEB/WEXAMPLE/PIP/pip/pseudocode/tests/resources/item/class';

function normalizeEol(s) { return s.replace(/\r\n/g, '\n'); }

const expectedJs = normalizeEol(`/**
 * A class that performs basic arithmetic operations.
 */
class Calculator {
  constructor() {
    // Stores the result of the last operation performed.
    this.lastResult = 0;
  }
  /**
   * Calculate the sum of two ints.
   *
   * @param a - The first operand.
   * @param b - The second operand.
   * @returns: The sum of the two numbers.
   */
  add(a, b) {
    // TODO: Implement method body
  }
}`);

function assertEqual(a, b, msg) {
  if (a !== b) {
    console.error('Assertion failed:', msg || 'values differ');
    console.error('Expected:\n' + b);
    console.error('Actual:\n' + a);
    process.exit(1);
  }
}

const yml = readFileSync(join(pyFixtureDir, 'basic_calculator.yml'), 'utf-8');
const code = new CodeGenerator().generate(yml);
assertEqual(normalizeEol(code.trim()), expectedJs, 'YAML -> JS class generation matches expected JS');
console.log('OK');
