export class ConstantConfig {
  type = 'constant' as const;
  name: string;
  value: unknown;
  description: string | null;

  constructor({
    name,
    value,
    description,
  }: { name: string; value: unknown; description?: string | null }) {
    this.name = name;
    this.value = value;
    this.description = description ?? null;
  }

  static fromConfig(data: any): ConstantConfig {
    return new ConstantConfig({
      name: data.name,
      value: data.value,
      description: data.description,
    });
  }

  toCode(): string {
    const lines: string[] = [];
    if (this.description) {
      lines.push(`// ${this.description}`);
    }
    const val = typeof this.value === 'string' ? JSON.stringify(this.value) : String(this.value);
    lines.push(`const ${this.name} = ${val};`);
    return lines.join('\n');
  }
}
