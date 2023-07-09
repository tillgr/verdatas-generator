import { CustomNode } from 'src/index';
import * as Joi from 'joi';

const topicSchema: Joi.ObjectSchema<CustomNode> = Joi.object({
  model: {
    type: Joi.string().required(),
    attributesSchema: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        default: Joi.string().allow(''),
        type: Joi.string().required(),
      }),
      Joi.object({
        name: Joi.string().required(),
        default: Joi.number(),
        type: Joi.string().required(),
      })
    ),
    children: Joi.array().items(
      Joi.object({
        type: Joi.string().allow(
          'PreparationModule',
          'LearningModule',
          'PracticeModule'
        ),
        attributesSchema: Joi.array().items(Joi.any()),
        children: Joi.array().items(Joi.any()),
      })
    ),
  },
  children: Joi.array().items(Joi.any()),
  walkStrategy: Joi.any(),
});
