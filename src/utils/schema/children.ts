import Mustache from 'mustache';

export const renderChildren = (children: string[]): string => {
  return Mustache.render(
    `
     Joi.object({
       type: Joi.string().allow(
         {{children}}
       ),
       attributes: Joi.array().items(Joi.any()),
       children: Joi.array().items(Joi.any()),
     })
    `,
    {
      children: "'" + children.join("', '") + "'",
    }
  );
};
