import { FunctionParameterConfig } from './FunctionParameterConfig.js';
import { FunctionReturnConfig } from './FunctionReturnConfig.js';
import { DocCommentConfig } from './DocCommentConfig.js';

export class ClassMethodConfig {
  constructor({ name, description, parameters, returnConfig }) {
    this.type = 'method';
    this.name = name;
    this.description = description || null;
    this.parameters = parameters || [];
    this.return = returnConfig || null;
  }

  static fromConfig(data) {
    const params = Array.isArray(data.parameters)
      ? data.parameters.map(FunctionParameterConfig.fromConfig)
      : [];
    const ret = FunctionReturnConfig.fromConfig(data.return);
    return new ClassMethodConfig({
      name: data.name,
      description: data.description,
      parameters: params,
      returnConfig: ret,
    });
  }

  toCode() {
    const paramsSrc = this.parameters.map(p => p.toCode()).join(', ');
    const jsdoc = DocCommentConfig.buildJSDoc({
      description: this.description,
      parameters: this.parameters,
      returnConfig: this.return,
    });
    const lines = [];
    if (jsdoc) lines.push(jsdoc);
    lines.push(`${this.name}(${paramsSrc}) {`);
    lines.push('  // TODO: Implement method body');
    lines.push('}');
    return lines.join('\n');
  }
}
