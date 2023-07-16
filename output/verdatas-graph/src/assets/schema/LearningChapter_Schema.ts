
import * as Joi from 'joi';

export const LearningChapter_Attributes_Schema: Joi.ObjectSchema = Joi.object({
  a1: Joi.string().allow('').required(),

  a2: Joi.boolean().allow(true).required(),
})

