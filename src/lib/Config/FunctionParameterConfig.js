export class FunctionParameterConfig {
  constructor({ name, type, description, optional = false, defaultValue = undefined }) {
    this.name = name;
    this.type = type || null; // ISO type; mapping deferred
    this.description = description || null;
    this.optional = !!optional;
    this.defaultValue = defaultValue;
  }

  static fromConfig(data) {
    return new FunctionParameterConfig({
      name: data.name,
      type: data.type,
      description: data.description,
      optional: data.optional,
      defaultValue: data.default,
    });
  }

  toCode() {
    // JS signature param only (no default/optional for now to keep simple parity)
    return this.name;
  }
}
