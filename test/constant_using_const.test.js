import { test, strict as assert } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CodeGenerator } from '../src/index.js';

const phpFixtureDir = '/home/weeger/Desktop/WIP/WEB/WEXAMPLE/COMPOSER/packages/wexample/php-pseudocode/tests/resources/item/constant';

function normalizeEol(s) { return s.replace(/\r\n/g, '\n'); }

const expectedJs = normalizeEol(`// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Base URL for the API
const API_BASE_URL = "https://api.example.com";`);

test('YAML -> JS constants generation matches expected JS', () => {
  const yml = readFileSync(join(phpFixtureDir, 'constant_using_const.yml'), 'utf-8');
  const code = new CodeGenerator().generate(yml);
  assert.equal(normalizeEol(code.trim()), expectedJs);
});
