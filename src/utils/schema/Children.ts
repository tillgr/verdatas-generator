import Mustache from 'mustache';
import { Child } from 'model/Child';

export const renderChildrenSchema = (children: Child[]) => {
  const view = {
    childNames:
      "'" +
      children.map((child) => child.type.toLowerCase()).join("', '") +
      "'",
    customLogic: renderCustomLogic(children),
  };

  return Mustache.render(
    `
    // Children Schema {{childNames}}
    Joi.array()
    .items(Joi.string().valid({{childNames}}))
    .custom({{customLogic}})
    `,
    view
  );
};

const renderCustomLogic = (children: Child[]) => {
  const assertions = children
    .map((child) => {
      return Mustache.render(
        `.assert('.{{type}}', Joi.number(){{#count.min}}.min({{count.min}}){{/count.min}}{{#count.max}}.max({{count.max}}){{/count.max}})`,
        {
          type: child.type.toLowerCase(),
          count: child.count,
        }
      );
    })
    .join('');

  const occurrences = JSON.stringify(
    Object.fromEntries(children.map((child) => [child.type.toLowerCase(), 0]))
  );

  return Mustache.render(
    `
    (array, helpers) => {
    const occurrences: { [key: string]: number } = {{occurrences}};
    
    array.forEach((element: string) => {
      occurrences[element] = occurrences[element] + 1;
    });
    
    const schema = Joi.object(){{assertions}}
    
    const result = schema.validate(occurrences);
  
    if (result.error) return helpers.error('any.invalid');
    return array;
    }
    `,
    {
      assertions,
      occurrences,
    }
  );
};
