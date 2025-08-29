import yaml from 'js-yaml';
import { ConstantConfig } from '../Config/ConstantConfig.js';
import { FunctionConfig } from '../Config/FunctionConfig.js';
import { ClassConfig } from '../Config/ClassConfig.js';

export class CodeGenerator {
  generate(yamlText) {
    const data = yaml.load(yamlText);
    const items = (data && Array.isArray(data.items)) ? data.items : [];
    const codeParts = [];

    for (const item of items) {
      if (item.type === 'constant') {
        const cfg = ConstantConfig.fromConfig(item);
        codeParts.push(cfg.toCode());
      } else if (item.type === 'function') {
        const cfg = FunctionConfig.fromConfig(item);
        codeParts.push(cfg.toCode());
      } else if (item.type === 'class') {
        const cfg = ClassConfig.fromConfig(item);
        codeParts.push(cfg.toCode());
      }
    }

    return codeParts.join('\n');
  }
}
