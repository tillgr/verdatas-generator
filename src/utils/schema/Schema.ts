import { renderAttributesSchema } from 'utils/schema/Attribute';
import Mustache from 'mustache';
import { Attribute } from 'model/Attribute';
import { Child } from 'model/Child';
import { renderChildrenSchema } from 'utils/schema/Children';

export const renderSchemas = (
  type: string,
  attributes?: Attribute[],
  children?: Child[]
) => {
  const view = {
    type: type.toLowerCase(),
    attributesSchema:
      !!attributes?.length && renderAttributesSchema(attributes),
    childrenSchema: !!children?.length && renderChildrenSchema(children),
  };

  return Mustache.render(
    `
    import * as Joi from 'joi';
    
    {{#attributesSchema}}
    export const {{type}}_attributes_schema: Joi.ObjectSchema = {{attributesSchema}}
    {{/attributesSchema}}
      
    {{#childrenSchema}}
    export const {{type}}_children_schema: Joi.ArraySchema = {{childrenSchema}}
    {{/childrenSchema}}
    `,
    view
  );
};
