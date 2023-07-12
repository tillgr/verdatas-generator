
import Joi from 'joi';


export const PreparationModule_Children_Schema: Joi.ArraySchema =
  // Children Schema 'PreparationChapter'
  Joi.array()
    .items(Joi.string().valid('PreparationChapter'))
    .custom(
      (array, helpers) => {
        const occurrences = {};
        array.forEach((element) => {
          occurrences[element] = (occurrences[element] || 0) + 1;
        });

        const schema = Joi.object().assert('PreparationChapter', Joi.number().min(0).max(1))

        const result = schema.validate(occurrences);

        if (result.error) return helpers.error('any.invalid').message('Invalid child count');
        return array;
      }
    )

