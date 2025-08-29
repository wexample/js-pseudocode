export class FunctionReturnConfig {
  constructor({ type, description }) {
    this.type = type || null;
    this.description = description || null;
  }

  static fromConfig(data) {
    if (!data) return null;
    if (typeof data !== 'object') {
      throw new Error('Invalid YAML for return: expected mapping with key "type"');
    }
    if (!('type' in data) || !data.type) {
      throw new Error('Invalid YAML for return: missing non-empty "type"');
    }
    return new FunctionReturnConfig({ type: data.type, description: data.description });
  }
}
