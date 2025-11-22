import yaml from 'js-yaml';
import { ConstantConfig } from '../Config/ConstantConfig.ts';
import { FunctionConfig } from '../Config/FunctionConfig.ts';
import { ClassConfig } from '../Config/ClassConfig.ts';

export class CodeGenerator {
  generate(yamlText: string): string {
    const data = yaml.load(yamlText) as any;
    if (!data || !Array.isArray(data.items)) {
      throw new Error('Invalid YAML: expected root with items[]');
    }
    const parts: string[] = [];
    for (const item of data.items) {
      switch (item.type) {
        case 'constant': {
          const cfg = ConstantConfig.fromConfig(item);
          parts.push(cfg.toCode());
          break;
        }
        case 'function': {
          const cfg = FunctionConfig.fromConfig(item);
          parts.push(cfg.toCode());
          break;
        }
        case 'class': {
          const cfg = ClassConfig.fromConfig(item);
          parts.push(cfg.toCode());
          break;
        }
        default:
          throw new Error(`Unsupported item type: ${item.type}`);
      }
    }
    return parts.join('\n');
  }
}
