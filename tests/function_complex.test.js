import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.js';

const pyFixtureDir = '/home/weeger/Desktop/WIP/WEB/WEXAMPLE/PIP/pip/pseudocode/tests/resources/item/function';

function normalizeEol(s) { return s.replace(/\r\n/g, '\n'); }

const expectedJs = normalizeEol(`/**
 * Process an array of data with optional configuration.
 *
 * @param data - The data to process
 * @param config - Optional configuration parameters
 * @param callback - Optional callback for custom processing
 * @returns
 */
function processData(data, config, callback) {
  // TODO: Implement function body
}`);

function assertEqual(a, b, msg) {
  if (a !== b) {
    console.error('Assertion failed:', msg || 'values differ');
    console.error('Expected:\n' + b);
    console.error('Actual:\n' + a);
    process.exit(1);
  }
}

const yml = readFileSync(join(pyFixtureDir, 'complex_function.yml'), 'utf-8');
const code = new CodeGenerator().generate(yml);
assertEqual(normalizeEol(code.trim()), expectedJs, 'YAML -> JS complex function generation matches expected JS');
console.log('OK');
