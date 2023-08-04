import Mustache from 'mustache';
import { Attribute } from 'model/Attribute';

const renderAttribute = (
  name: string,
  type: 'string' | 'number' | 'boolean',
  value?: string | number | boolean
) => {
  return Mustache.render(
    `
    {{name}}: Joi.{{type}}().allow({{value}}).required(),
    `,
    {
      name,
      type,
      value: () => {
        if (!value) {
          switch (type) {
            case 'string':
              return '';
            case 'number':
              return 0;
            case 'boolean':
              return false;
          }
        }
        if (typeof value === 'string') return `'${value}'`;
        return value;
      },
    }
  );
};

export const renderAttributesSchema = (attributes: Attribute[]): string => {
  return `Joi.object({${attributes
    .map((attr) => renderAttribute(attr.name, attr.type, attr.value))
    .join('')}})`;
};
