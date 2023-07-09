import Mustache from 'mustache';
import { Attribute } from 'model/Attribute';

const renderAttribute = (
  name: string,
  value: string | number | boolean,
  type: 'string' | 'number' | 'boolean'
) => {
  return Mustache.render(
    `
    {{name}}: Joi.{{type}}().allow({{value}}).required(),
    `,
    {
      name,
      type,
      value: () => {
        if (typeof value === 'string') return `'${value}'`;
        return value;
      },
    }
  );
};

export const renderAttributesSchema = (attributes: Attribute[]): string => {
  return `Joi.object({${attributes
    .map((attr) => renderAttribute(attr.name, attr.value, attr.type))
    .join('')}})`;
};
