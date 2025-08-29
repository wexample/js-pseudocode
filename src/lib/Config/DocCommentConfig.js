export class DocCommentConfig {
  constructor({ description = null, parameters = [], returnConfig = null }) {
    this.description = description;
    this.parameters = parameters; // array of FunctionParameterConfig
    this.return = returnConfig;   // FunctionReturnConfig
  }

  static buildJSDoc({ description, parameters, returnConfig }) {
    const lines = ['/**'];
    if (description) {
      for (const line of description.split('\n')) {
        lines.push(` * ${line}`);
      }
    }
    const paramLines = [];
    for (const p of parameters) {
      const desc = p.description ? ` - ${p.description}` : '';
      paramLines.push(` * @param ${p.name}${desc}`);
    }
    const retDesc = returnConfig && returnConfig.description ? ` ${returnConfig.description}` : '';
    if (paramLines.length || returnConfig) {
      if (description) {
        lines.push(' *');
      }
      for (const l of paramLines) lines.push(l);
      if (returnConfig) lines.push(` * @returns${retDesc ? ':' + retDesc : ''}`);
    }
    lines.push(' */');
    return lines.join('\n');
  }
}
