import Mustache from 'mustache';

export const renderChildren = (children: string[]): string => {
  return Mustache.render(
    `
    // Children: {{children}}
    Joi.object({
      model: {
        type: Joi.string().allow(
          {{children}}
        ),
        attributes: Joi.array().items(Joi.any()),
        children: Joi.array().items(Joi.any()),
      },
      walkStrategy: Joi.any(),
    })
    `,
    {
      children: "'" + children.join("', '") + "'",
    }
  );
};
