export class ConstantConfig {
  constructor({ name, value, description }) {
    this.type = 'constant';
    this.name = name;
    this.value = value;
    this.description = description || null;
  }

  static fromConfig(data) {
    return new ConstantConfig({
      name: data.name,
      value: data.value,
      description: data.description,
    });
  }

  toCode() {
    const lines = [];
    if (this.description) {
      lines.push(`// ${this.description}`);
    }
    const val = typeof this.value === 'string' ? JSON.stringify(this.value) : String(this.value);
    lines.push(`const ${this.name} = ${val};`);
    return lines.join('\n');
  }
}
