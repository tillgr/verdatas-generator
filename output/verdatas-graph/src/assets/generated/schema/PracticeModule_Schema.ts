
import * as Joi from 'joi';

export const PracticeModule_Attributes_Schema: Joi.ObjectSchema = Joi.object({
  a1: Joi.string().allow('none').required(),

  a2: Joi.boolean().allow(false).required(),
})

