import { renderAttributes } from 'utils/schema/attribute';
import Mustache from 'mustache';
import { renderChildren } from 'utils/schema/children';
import { Attribute } from 'model/attribute';

export const renderSchema = (
  type: string,
  attributes?: Attribute[],
  childNames?: string[]
) => {
  const view = {
    type,
    attributes: !!attributes?.length && renderAttributes(attributes),
    children: !!childNames?.length && renderChildren(childNames),
  };

  return Mustache.render(
    `
      const {{type}}_schema: Joi.ObjectSchema<CustomNode> = Joi.object({
        model: {
          type: Joi.string().required(),
          {{#attributes}}
          attributes: Joi.array().items(
            {{attributes}}
          ),
          {{/attributes}}
          {{#children}}
          children: Joi.array().items(
            {{children}}
          ),
          {{/children}}
        },
        {{#children}}children: Joi.array().items({{children}}),{{/children}}
        walkStrategy: Joi.any(),
      });
    `,
    view
  );
};
