
import * as Joi from 'joi';


export const PreparationModule_Children_Schema: Joi.ArraySchema =
  // Children Schema 'PreparationChapter'
  Joi.array()
    .items(Joi.string().valid('PreparationChapter'))
    .custom(
      (array, helpers) => {
        const occurrences: { [key: string]: number } = { "PreparationChapter": 0 };

        array.forEach((element: string) => {
          occurrences[element] = occurrences[element] + 1;
        });

        const schema = Joi.object().assert('.PreparationChapter', Joi.number().min(0).max(1))

        const result = schema.validate(occurrences);

        if (result.error) return helpers.error('any.invalid');
        return array;
      }
    )

