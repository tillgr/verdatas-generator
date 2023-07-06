import { renderAttributes } from 'utils/schema/attribute';
import Mustache from 'mustache';
import { Attribute } from 'model/attribute';
import { renderNodes } from 'utils/schema/node';

export const renderSchema = (
  type: string,
  parentName?: string,
  attributes?: Attribute[],
  childNames?: string[]
) => {
  const view = {
    type,
    parent: !!parentName && renderNodes([parentName]),
    attributes: !!attributes?.length && renderAttributes(attributes),
    children: !!childNames?.length && renderNodes(childNames),
  };

  return Mustache.render(
    `
      export const {{type}}_schema: Joi.ObjectSchema<MetaNode> = Joi.object({
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
        {{#parent}}parent: {{parent}},{{/parent}}
        walkStrategy: Joi.any(),
      });
    `,
    view
  );
};
