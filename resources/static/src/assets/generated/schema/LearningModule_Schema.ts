
import Joi from 'joi';


export const LearningModule_Children_Schema: Joi.ArraySchema =
  // Children Schema 'LearningChapter'
  Joi.array()
    .items(Joi.string().valid('LearningChapter'))
    .custom(
      (array, helpers) => {
        const occurrences = {};
        array.forEach((element) => {
          occurrences[element] = (occurrences[element] || 0) + 1;
        });

        const schema = Joi.object().assert('LearningChapter', Joi.number().min(0).max(1))

        const result = schema.validate(occurrences);

        if (result.error) return helpers.error('any.invalid').message('Invalid child count');
        return array;
      }
    )

