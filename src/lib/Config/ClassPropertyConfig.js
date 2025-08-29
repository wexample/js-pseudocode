export class ClassPropertyConfig {
  constructor({ name, type, description, defaultValue = undefined }) {
    this.name = name;
    this.type = type || null;
    this.description = description || null;
    this.defaultValue = defaultValue;
  }

  static fromConfig(data) {
    return new ClassPropertyConfig({
      name: data.name,
      type: data.type,
      description: data.description,
      defaultValue: data.default,
    });
  }
}
