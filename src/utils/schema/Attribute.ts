import Mustache from 'mustache';
import { Attribute, AttributeString, AttributeType } from 'model/Attribute';
import { getDefaultValue } from 'utils/helpers';

const renderAttribute = (
  name: string,
  type: AttributeString,
  value?: AttributeType
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
          getDefaultValue(type);
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
