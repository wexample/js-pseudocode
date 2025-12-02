export class FunctionParameterConfig {
  name: string;
  type: string | null;
  description: string | null;
  optional: boolean;
  defaultValue: unknown;

  constructor({
    name,
    type,
    description,
    optional = false,
    defaultValue = undefined,
  }: {
    name: string;
    type?: string | null;
    description?: string | null;
    optional?: boolean;
    defaultValue?: unknown;
  }) {
    this.name = name;
    this.type = type || null;
    this.description = description || null;
    this.optional = !!optional;
    this.defaultValue = defaultValue;
  }

  static fromConfig(data: any): FunctionParameterConfig {
    return new FunctionParameterConfig({
      name: data.name,
      type: data.type,
      description: data.description,
      optional: data.optional,
      defaultValue: data.default,
    });
  }

  toCode(): string {
    return this.name;
  }
}
