import Mustache from 'mustache';

const renderAttribute = (
  name: string,
  _default: string | number | boolean,
  type: 'string' | 'number' | 'boolean'
) => {
  return Mustache.render(
    `
      Joi.object({
        name: Joi.string().allow('{{name}}').required(),
        default: Joi.{{type}}().allow('{{_default}}'),
        type: Joi.{{type}}().required(),
      }),
    `,
    {
      name,
      type,
      _default,
    }
  );
};

export const renderAttributes = (
  attributes: {
    name: string;
    _default: string | number | boolean;
    type: 'string' | 'number' | 'boolean';
  }[]
): string => {
  return attributes
    .map((attr) => renderAttribute(attr.name, attr._default, attr.type))
    .join('\n,');
};
