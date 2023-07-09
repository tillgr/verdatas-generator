import Mustache from 'mustache';

export const renderNodes = (nodeNames: string[]): string => {
  return Mustache.render(
    `
    // Nodes: {{nodes}}
    Joi.object({
      model: {
        type: Joi.string().allow(
          {{nodes}}
        ),
        attributes: Joi.array().items(Joi.any()),
        children: Joi.array().items(Joi.any()),
      },
      parent: Joi.any().optional(),
      children: Joi.array().items(Joi.any()),
      walkStrategy: Joi.any(),
    })
    `,
    {
      nodes: "'" + nodeNames.join("', '") + "'",
    }
  );
};
