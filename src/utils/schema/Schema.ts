import { renderAttributesSchema } from 'utils/schema/Attribute';
import Mustache from 'mustache';
import { Attribute } from 'model/Attribute';
import { Child } from 'model/Child';
import { renderChildrenSchema } from 'utils/schema/Children';
import { MetaNode } from 'model/MetaNode';
import { Node } from 'ts-tree-structure';

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

enum ObjectKey {
  Attributes = 'attributes',
  Children = 'children',
}

class ExportObject {
  attributes: string[];
  children: string[];
  [key: string]: any;
  constructor() {
    this.attributes = [];
    this.children = [];
  }
}

const renderExportObject = (nodeTypes: Node<MetaNode>[]) => {
  const exportObj = new ExportObject();

  nodeTypes.forEach((node) => {
    const { attributes, children, type } = node.model;
    const template = `
    [NodeType.{{type.original}}]: {{type.lower}}_{{objectKey}}_schema,
    `;
    const viewPart = { type: { original: type, lower: type.toLowerCase() } };

    if (!!attributes || !!children) {
      let objectKey;

      if (!!attributes) {
        objectKey = ObjectKey.Attributes;
        exportObj[objectKey].push(
          Mustache.render(template, { ...viewPart, objectKey })
        );
      }
      if (!!children) {
        objectKey = ObjectKey.Children;
        exportObj[objectKey].push(
          Mustache.render(template, { ...viewPart, objectKey })
        );
      }
    }
  });

  const objectContent = Object.keys(exportObj)
    .map((key) => {
      const schemas = exportObj[key].join('');

      return Mustache.render(
        `
      {{objectKey}}: {
        {{schemas}}
      },
    `,
        { objectKey: key, schemas }
      );
    })
    .join('');

  return Mustache.render(
    `
      export const schemas = {
        {{objectContent}}
      }
    `,
    { objectContent }
  );
};

const renderDynamicImports = (nodeTypes: Node<MetaNode>[]) => {
  const exportObj = new ExportObject();

  nodeTypes.forEach((node) => {
    const { attributes, children, type } = node.model;
    const template = `
    import { {{type.lower}}_{{objectKey}}_schema } from 'assets/schema/{{type.lower}}_schema';
    `;
    const viewPart = { type: { original: type, lower: type.toLowerCase() } };

    if (!!attributes || !!children) {
      let objectKey;

      if (!!attributes) {
        objectKey = ObjectKey.Attributes;
        exportObj[objectKey].push(
          Mustache.render(template, { ...viewPart, objectKey })
        );
      }
      if (!!children) {
        objectKey = ObjectKey.Children;
        exportObj[objectKey].push(
          Mustache.render(template, { ...viewPart, objectKey })
        );
      }
    }
  });

  return Object.keys(exportObj)
    .map((key) => exportObj[key].join(''))
    .join('');
};

export const renderExport = (nodeTypes: Node<MetaNode>[]) => {
  const staticImports = `
  import GraphSchemaJSON from 'assets/schema/GraphSchema.json';
  import { MetaNode } from 'assets/model/MetaNode';
  import { NodeType } from 'assets/model';
  `;
  const dynamicImports = renderDynamicImports(nodeTypes);
  const staticExport =
    'export const GraphSchema = GraphSchemaJSON as unknown as MetaNode[];';

  const dynamicObjectExport = renderExportObject(nodeTypes);

  return Mustache.render(
    `
  {{staticImports}}
  {{dynamicImports}}
  
  {{staticExport}}
  
  {{dynamicObjectExport}}
  `,
    {
      staticImports,
      dynamicImports,
      staticExport,
      dynamicObjectExport,
    }
  );
};
