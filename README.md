# @wexample/js-pseudocode

Version: 0.1.37

`@wexample/js-pseudocode` turns a YAML description of code into JavaScript source: a root `items:` list whose entries are typed `constant`, `function` or `class` comes back as declarations, class bodies and JSDoc blocks built from the declared descriptions, parameters and return types, with method bodies left as `// TODO: Implement function body`. The whole public surface is one class exported from src/index.ts — `new CodeGenerator().generate(yamlText)` takes the YAML as a string and returns the code as a string, with no file access and no CLI. It is for tool authors who keep a language-neutral description of an API and need the JavaScript rendering of it, alongside the sibling generators of the Wexample suite that render the same descriptions in other languages.

## Table of Contents

- [Architecture](#architecture)
- [Integration in the Suite](#integration-in-the-suite)
- [Dependencies](#dependencies)
- [Versioning & Compatibility Policy](#versioning--compatibility-policy)
- [License](#license)
- [About us](#about-us)
- [Migration Notes](#migration-notes)

## Architecture

The package is a pure string-to-string transformer: YAML text in, JavaScript source out. There is no file access, no CLI, no state kept between calls. Everything lives under `src/lib/`, split in two directories — `Generator/` holds the single orchestrator, `Config/` holds one class per node of the YAML document.

### The public surface is one line

src/index.ts re-exports exactly one symbol:

```ts
export { CodeGenerator } from './lib/Generator/CodeGenerator.js';
```

Everything else is internal. A consumer writes `new CodeGenerator().generate(yamlText)` and gets a string back. Note the `.js` extension on a TypeScript import: the package is `"type": "module"` and its sources are consumed as-is (`exports` maps `./*` to `./src/*.ts`), so relative imports carry the runtime extension throughout the codebase.

### The path of a call

src/lib/Generator/CodeGenerator.ts is thirty lines and holds the whole control flow:

1. `yaml.load(yamlText)` — the only use of the sole runtime dependency, `js-yaml`.
2. A guard on the shape: `if (!data || !Array.isArray(data.items))` throws `Invalid YAML: expected root with items[]`.
3. A `switch (item.type)` over each entry of `items`, dispatching `constant`, `function` and `class` to `ConstantConfig`, `FunctionConfig` and `ClassConfig`. Any other value throws `Unsupported item type: ${item.type}`.
4. Each branch does the same two steps — `const cfg = XConfig.fromConfig(item); parts.push(cfg.toCode());`
5. `parts.join('\n')` — items are concatenated with a single newline, no blank line between them.

Adding a new top-level item type means adding a config class *and* a case in that switch; the dispatch is not data-driven.

### The config contract

Every class in `src/lib/Config/` is a plain data holder built from raw YAML by a static `fromConfig(data: any)`, and the ones that render themselves expose `toCode(): string`. The two halves are deliberately separate: `fromConfig` is where the YAML vocabulary is decoded (note `defaultValue: data.default` in src/lib/Config/FunctionParameterConfig.ts — the YAML key is `default`, the field is not), `toCode` is where JavaScript syntax is decided.

The contract is not uniform, and the exceptions are where the code surprises:

- src/lib/Config/ClassPropertyConfig.ts has **no** `toCode()`. Properties are rendered by their parent, inside the constructor `ClassConfig` synthesises when `this.properties.length` is non-zero.
- src/lib/Config/FunctionReturnConfig.ts has no `toCode()` either, and its `fromConfig` returns `FunctionReturnConfig | null` — `null` for an absent `return:`, and a throw for a mapping without a non-empty `type`. It is the only config that validates its input.
- src/lib/Config/FunctionParameterConfig.ts renders to nothing but its own name: `toCode() { return this.name; }`.

### Composition of a class body

src/lib/Config/ClassConfig.ts assembles the output by pushing lines into an array. Method sources come from `ClassMethodConfig.toCode()` and are indented by the parent, not by the child:

```ts
const methodSrc = m.toCode().split('\n').map((l) => `  ${l}`);
```

So src/lib/Config/ClassMethodConfig.ts always emits at column zero and stays reusable; a nesting level added anywhere is the caller's job to re-indent. `ClassMethodConfig` and src/lib/Config/FunctionConfig.ts are near-identical — same fields, same `fromConfig`, and `toCode` bodies differing only by the `function ` keyword in the signature.

### Doc comments are built in one place, almost

src/lib/Config/DocCommentConfig.ts centralises JSDoc through the static `DocCommentConfig.buildJSDoc({ description, parameters, returnConfig })`, called by both `FunctionConfig` and `ClassMethodConfig`. It handles multi-line descriptions, the blank ` *` separator inserted only when a description is followed by tags, `@param name - description` lines and a `@returns` line.

The class also has a constructor and instance fields mirroring those arguments, which nothing in the codebase instantiates. And `ClassConfig` does *not* go through it: it opens its own `/**`, maps the description lines and closes it inline. Class-level and function-level comments therefore drift independently.

### Types are parsed and then dropped

The YAML carries type information — `type: int` on parameters, properties and returns — and every config keeps it in a field. No `toCode()` emits it. Parameters render as bare names, `@param` lines have no `{type}` brace, and `@returns` carries the description alone (`@returns: The sum of the two numbers.`). Same for `optional` and parameter defaults: `FunctionParameterConfig` stores both, and the generated signature shows neither. The information is available to anyone who wants to emit TypeScript or default values; today it is deliberately unused.

Bodies are never generated: functions get `// TODO: Implement function body`, methods get `// TODO: Implement method body`. The package produces skeletons, not implementations.

### Values

Only constants and property defaults reach real JavaScript literals, and both use the same two-line rule — `typeof value === 'string' ? JSON.stringify(value) : String(value)`. Strings get quoted and escaped, numbers and `null` are printed raw, and a property with no `default` becomes `this.name = undefined;`.

### Tests are fixture comparisons, not a framework

There is no test runner. `npm test` chains four Node invocations under `node --loader ts-node/esm`, one per file: tests/constant_using_const.test.ts, tests/function_basic.test.ts, tests/function_complex.test.ts and tests/class_basic_calculator.test.ts. Each has the same body — read a `.yml` under `tests/resources/item/<kind>/`, run it through `CodeGenerator`, compare with the sibling `.js.txt`, and `process.exit(1)` with an expected/actual dump on mismatch. Shared helpers live in tests/utils/testHelpers.ts: `normalizeEol` and `readExpected`, both trivial.

Adding a case means adding the fixture pair, a script that mirrors an existing one, and an entry in the `test` chain in `package.json` — nothing globs the directory.

Two things about the fixtures are worth knowing before trusting them. They are shared with the PHP generator of the suite and still carry keys this package ignores, such as the `generator: php: constantDeclaration:` blocks in `tests/resources/item/constant/constant_using_define.yml` — that file has no test of its own. And stale `.test.js` copies sit next to the `.ts` ones; they are not in the `test` script, and `tests/constant_using_const.test.js` reads its fixtures from an absolute path pointing outside the repository.

### Build and packaging

`npm run build` is `tsc --noEmit`: a type check, not a compilation. tsconfig.json declares `rootDir: "src"` and `outDir: "dist"`, but nothing is ever emitted there — `files: ["src"]` publishes the TypeScript sources and consumers compile them. `strict` is on for `src`; `tests` is in the tsconfig `exclude` list and is only type-checked by ts-node at run time.

The practical consequence: `fromConfig(data: any)` is the boundary where `strict` stops helping. Everything above it is untyped YAML, everything below it is checked.

## Integration in the Suite

This package is part of the Wexample Suite — a collection of high-quality, modular tools designed to work seamlessly together across multiple languages and environments.

### Related Packages

The suite includes packages for configuration management, file handling, prompts, and more. Each package can be used independently or as part of the integrated suite.

Visit the [Wexample Suite documentation](https://docs.wexample.com) for the complete package ecosystem.

## Dependencies

- js-yaml: 4.1.0

## Versioning & Compatibility Policy

Wexample packages follow **Semantic Versioning** (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

We maintain backward compatibility within major versions and provide clear migration guides for breaking changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Free to use in both personal and commercial projects.

## About us

[Wexample](https://wexample.com) stands as a cornerstone of the digital ecosystem — a collective of seasoned engineers, researchers, and creators driven by a relentless pursuit of technological excellence. More than a media platform, it has grown into a vibrant community where innovation meets craftsmanship, and where every line of code reflects a commitment to clarity, durability, and shared intelligence.

This packages suite embodies this spirit. Trusted by professionals and enthusiasts alike, it delivers a consistent, high-quality foundation for modern development — open, elegant, and battle-tested. Its reputation is built on years of collaboration, refinement, and rigorous attention to detail, making it a natural choice for those who demand both robustness and beauty in their tools.

Wexample cultivates a culture of mastery. Each package, each contribution carries the mark of a community that values precision, ethics, and innovation — a community proud to shape the future of digital craftsmanship.

## Migration Notes

When upgrading between major versions, refer to the migration guides in the documentation.

Breaking changes are clearly documented with upgrade paths and examples.
