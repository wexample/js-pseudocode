import { ClassMethodConfig } from './ClassMethodConfig.js';
import { ClassPropertyConfig } from './ClassPropertyConfig.js';

export class ClassConfig {
  type = 'class' as const;
  name: string;
  description: string | null;
  properties: ClassPropertyConfig[];
  methods: ClassMethodConfig[];

  constructor({
    name,
    description,
    properties,
    methods,
  }: {
    name: string;
    description?: string | null;
    properties?: ClassPropertyConfig[];
    methods?: ClassMethodConfig[];
  }) {
    this.name = name;
    this.description = description || null;
    this.properties = properties || [];
    this.methods = methods || [];
  }

  static fromConfig(data: any): ClassConfig {
    const properties = Array.isArray(data.properties)
      ? data.properties.map((p: any) => ClassPropertyConfig.fromConfig(p))
      : [];
    const methods = Array.isArray(data.methods)
      ? data.methods.map((m: any) => ClassMethodConfig.fromConfig(m))
      : [];
    return new ClassConfig({
      name: data.name,
      description: data.description,
      properties,
      methods,
    });
  }

  toCode(): string {
    const lines: string[] = [];
    if (this.description) {
      lines.push('/**');
      for (const l of this.description.split('\n')) lines.push(` * ${l}`);
      lines.push(' */');
    }
    lines.push(`class ${this.name} {`);
    // constructor for default properties
    if (this.properties.length) {
      lines.push('  constructor() {');
      for (const p of this.properties) {
        const val =
          p.defaultValue !== undefined
            ? typeof p.defaultValue === 'string'
              ? JSON.stringify(p.defaultValue)
              : String(p.defaultValue)
            : 'undefined';
        if (p.description) lines.push(`    // ${p.description}`);
        lines.push(`    this.${p.name} = ${val};`);
      }
      lines.push('  }');
    }
    // methods
    for (const m of this.methods) {
      const methodSrc = m
        .toCode()
        .split('\n')
        .map((l) => `  ${l}`);
      for (const l of methodSrc) lines.push(l);
    }
    lines.push('}');
    return lines.join('\n');
  }
}
