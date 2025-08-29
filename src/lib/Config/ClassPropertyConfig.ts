export class ClassPropertyConfig {
  name: string;
  type: string | null;
  description: string | null;
  defaultValue: unknown;

  constructor({ name, type, description, defaultValue = undefined }:
    { name: string; type?: string | null; description?: string | null; defaultValue?: unknown }) {
    this.name = name;
    this.type = type || null;
    this.description = description || null;
    this.defaultValue = defaultValue;
  }

  static fromConfig(data: any): ClassPropertyConfig {
    return new ClassPropertyConfig({
      name: data.name,
      type: data.type,
      description: data.description,
      defaultValue: data.default,
    });
  }
}
