
import * as Joi from 'joi';

export const Topic_Attributes_Schema: Joi.ObjectSchema = Joi.object({
  a1: Joi.string().allow('').required(),

  a2: Joi.number().allow(0).required(),
})

export const Topic_Children_Schema: Joi.ArraySchema =
  // Children Schema 'PreparationModule', 'LearningModule', 'PracticeModule'
  Joi.array()
    .items(Joi.string().valid('PreparationModule', 'LearningModule', 'PracticeModule'))
    .custom(
      (array, helpers) => {
        const occurrences: { [key: string]: number } = { "PreparationModule": 0, "LearningModule": 0, "PracticeModule": 0 };

        array.forEach((element: string) => {
          occurrences[element] = occurrences[element] + 1;
        });

        const schema = Joi.object().assert('.PreparationModule', Joi.number().min(0).max(2)).assert('.LearningModule', Joi.number().min(0).max(1)).assert('.PracticeModule', Joi.number().min(1).max(1))

        const result = schema.validate(occurrences);

        if (result.error) return helpers.error('any.invalid');
        return array;
      }
    )

