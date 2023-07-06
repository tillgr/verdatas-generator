import Mustache from 'mustache';
import { Attribute } from 'model/attribute';

const renderAttribute = (
  name: string,
  value: string | number | boolean,
  type: 'string' | 'number' | 'boolean'
) => {
  return Mustache.render(
    `
    // Attribute: {{name}}, Type: {{type}}
    Joi.object({
      name: Joi.string().allow('{{name}}').required(),
      value: Joi.{{type}}().allow({{value}}),
      type: Joi.{{type}}().required(),
    })
    `,
    {
      name,
      type,
      value: () => {
        if (value === '') return "''";
        return value;
      },
    }
  );
};

export const renderAttributes = (attributes: Attribute[]): string => {
  return attributes
    .map((attr) => renderAttribute(attr.name, attr.value, attr.type))
    .join(',');
};
