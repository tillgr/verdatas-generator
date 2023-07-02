import { renderAttributes } from 'utils/schema/attribute';
import Mustache from 'mustache';
import { renderChildren } from 'utils/schema/children';

export const renderSchema = () => {
  const view = {
    type: 'Topic',
    attributes: renderAttributes([
      { name: 'a1', _default: '', type: 'string' },
      { name: 'a2', _default: 0, type: 'number' },
    ]),
    children: renderChildren([
      'PreparationModule',
      'LearningModule',
      'PracticeModule',
    ]),
  };

  return Mustache.render(
    `
      const {{type}}_schema: Joi.ObjectSchema<CustomNode> = Joi.object({
        model: {
          type: Joi.string().required(),
          attributes: Joi.array().items(
            {{attributes}}
          ),
          children: Joi.array().items(
            {{children}}
          ),
        },
        children: Joi.array().items({{children}}),
        walkStrategy: Joi.any(),
      });
    `,
    view
  );
};
