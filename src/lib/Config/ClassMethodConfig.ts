import { DocCommentConfig } from './DocCommentConfig.ts';
import { FunctionParameterConfig } from './FunctionParameterConfig.ts';
import { FunctionReturnConfig } from './FunctionReturnConfig.ts';

export class ClassMethodConfig {
  type = 'method' as const;
  name: string;
  description: string | null;
  parameters: FunctionParameterConfig[];
  return: FunctionReturnConfig | null;

  constructor({
    name,
    description,
    parameters,
    returnConfig,
  }: {
    name: string;
    description?: string | null;
    parameters?: FunctionParameterConfig[];
    returnConfig?: FunctionReturnConfig | null;
  }) {
    this.name = name;
    this.description = description || null;
    this.parameters = parameters || [];
    this.return = returnConfig || null;
  }

  static fromConfig(data: any): ClassMethodConfig {
    const params = Array.isArray(data.parameters)
      ? data.parameters.map((p: any) => FunctionParameterConfig.fromConfig(p))
      : [];
    const ret = FunctionReturnConfig.fromConfig(data.return);
    return new ClassMethodConfig({
      name: data.name,
      description: data.description,
      parameters: params,
      returnConfig: ret,
    });
  }

  toCode(): string {
    const paramsSrc = this.parameters.map((p) => p.toCode()).join(', ');
    const jsdoc = DocCommentConfig.buildJSDoc({
      description: this.description,
      parameters: this.parameters,
      returnConfig: this.return,
    });
    const lines: string[] = [];
    if (jsdoc) lines.push(jsdoc);
    lines.push(`${this.name}(${paramsSrc}) {`);
    lines.push('  // TODO: Implement method body');
    lines.push('}');
    return lines.join('\n');
  }
}
