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
    type,
    attributesSchema:
      !!attributes?.length && renderAttributesSchema(attributes),
    childrenSchema: !!children?.length && renderChildrenSchema(children),
  };

  return Mustache.render(
    `
    import * as Joi from 'joi';
    
    {{#attributesSchema}}
    export const {{type}}_Attributes_Schema: Joi.ObjectSchema = {{attributesSchema}}
    {{/attributesSchema}}
      
    {{#childrenSchema}}
    export const {{type}}_Children_Schema: Joi.ArraySchema = {{childrenSchema}}
    {{/childrenSchema}}
    `,
    view
  );
};
