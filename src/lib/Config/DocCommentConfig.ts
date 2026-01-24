import type { FunctionParameterConfig } from './FunctionParameterConfig';
import type { FunctionReturnConfig } from './FunctionReturnConfig';

export class DocCommentConfig {
  description: string | null;
  parameters: FunctionParameterConfig[];
  return: FunctionReturnConfig | null;

  constructor({
    description = null,
    parameters = [],
    returnConfig = null,
  }: {
    description?: string | null;
    parameters?: FunctionParameterConfig[];
    returnConfig?: FunctionReturnConfig | null;
  }) {
    this.description = description ?? null;
    this.parameters = parameters;
    this.return = returnConfig ?? null;
  }

  static buildJSDoc({
    description,
    parameters,
    returnConfig,
  }: {
    description?: string | null;
    parameters: FunctionParameterConfig[];
    returnConfig: FunctionReturnConfig | null;
  }): string {
    const lines: string[] = ['/**'];
    if (description) {
      for (const line of description.split('\n')) {
        lines.push(` * ${line}`);
      }
    }
    const paramLines: string[] = [];
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
