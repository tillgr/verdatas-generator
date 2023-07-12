
import Joi from 'joi';

export const PreparationChapter_Attributes_Schema: Joi.ArraySchema = Joi.array().items(

  // Attribute: a1, Type: string
  Joi.object({
    name: Joi.string().allow('a1').required(),
    value: Joi.string().allow(''),
    type: Joi.string().required(),
  })
  ,
  // Attribute: a2, Type: boolean
  Joi.object({
    name: Joi.string().allow('a2').required(),
    value: Joi.boolean().allow('false'),
    type: Joi.boolean().required(),
  })

);

