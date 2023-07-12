
import Joi from 'joi';

export const Topic_Attributes_Schema: Joi.ArraySchema = Joi.array().items(

  // Attribute: a1, Type: string
  Joi.object({
    name: Joi.string().allow('a1').required(),
    value: Joi.string().allow(''),
    type: Joi.string().required(),
  })
  ,
  // Attribute: a2, Type: number
  Joi.object({
    name: Joi.string().allow('a2').required(),
    value: Joi.number().allow('0'),
    type: Joi.number().required(),
  })

);

export const Topic_Children_Schema: Joi.ArraySchema =
  // Children Schema 'PreparationModule', 'LearningModule', 'PracticeModule'
  Joi.array()
    .items(Joi.string().valid('PreparationModule', 'LearningModule', 'PracticeModule'))
    .custom(
      (array, helpers) => {
        const occurrences = {};
        array.forEach((element) => {
          occurrences[element] = (occurrences[element] || 0) + 1;
        });

        const schema = Joi.object().assert('PreparationModule', Joi.number().min(0).max(2)).assert('LearningModule', Joi.number().min(0).max(1)).assert('PracticeModule', Joi.number().min(1).max(1))

        const result = schema.validate(occurrences);

        if (result.error) return helpers.error('any.invalid').message('Invalid child count');
        return array;
      }
    )

