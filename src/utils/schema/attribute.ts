import Mustache from 'mustache';
import { Attribute } from 'model/attribute';

const renderAttribute = (
  name: string,
  _default: string | number | boolean,
  type: 'string' | 'number' | 'boolean'
) => {
  return Mustache.render(
    `
    // Attribute: {{name}}, Type: {{type}}
    Joi.object({
      name: Joi.string().allow('{{name}}').required(),
      default: Joi.{{type}}().allow({{_default}}),
      type: Joi.{{type}}().required(),
    })
    `,
    {
      name,
      type,
      _default,
    }
  );
};

export const renderAttributes = (attributes: Attribute[]): string => {
  return attributes
    .map((attr) => renderAttribute(attr.name, attr._default, attr.type))
    .join(',');
};
