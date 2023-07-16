
import * as Joi from 'joi';


export const LearningModule_Children_Schema: Joi.ArraySchema =
  // Children Schema 'LearningChapter'
  Joi.array()
    .items(Joi.string().valid('LearningChapter'))
    .custom(
      (array, helpers) => {
        const occurrences: { [key: string]: number } = { "LearningChapter": 0 };

        array.forEach((element: string) => {
          occurrences[element] = occurrences[element] + 1;
        });

        const schema = Joi.object().assert('.LearningChapter', Joi.number().min(0).max(1))

        const result = schema.validate(occurrences);

        if (result.error) return helpers.error('any.invalid');
        return array;
      }
    )

