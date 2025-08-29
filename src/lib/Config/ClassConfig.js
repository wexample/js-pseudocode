import { ClassPropertyConfig } from './ClassPropertyConfig.js';
import { ClassMethodConfig } from './ClassMethodConfig.js';

export class ClassConfig {
  constructor({ name, description, properties, methods }) {
    this.type = 'class';
    this.name = name;
    this.description = description || null;
    this.properties = properties || [];
    this.methods = methods || [];
  }

  static fromConfig(data) {
    const properties = Array.isArray(data.properties) ? data.properties.map(ClassPropertyConfig.fromConfig) : [];
    const methods = Array.isArray(data.methods) ? data.methods.map(ClassMethodConfig.fromConfig) : [];
    return new ClassConfig({
      name: data.name,
      description: data.description,
      properties,
      methods,
    });
  }

  toCode() {
    const lines = [];
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
        const val = p.defaultValue !== undefined ? (typeof p.defaultValue === 'string' ? JSON.stringify(p.defaultValue) : String(p.defaultValue)) : 'undefined';
        if (p.description) lines.push(`    // ${p.description}`);
        lines.push(`    this.${p.name} = ${val};`);
      }
      lines.push('  }');
    }
    // methods
    for (const m of this.methods) {
      const methodSrc = m.toCode().split('\n').map((l, i) => (i === 0 ? `  ${l}` : `  ${l}`));
      for (const l of methodSrc) lines.push(l);
    }
    lines.push('}');
    return lines.join('\n');
  }
}
