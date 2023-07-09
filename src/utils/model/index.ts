import { Node } from 'ts-tree-structure';
import { MetaNode } from 'model/MetaNode';
import Mustache from 'mustache';
import { Attribute } from 'model/Attribute';

export const renderNodeData = (nodeTypes: Node<MetaNode>[]) => {
  const view = {
    types: renderTypes(nodeTypes),
    record: renderRecord(nodeTypes),
  };

  return Mustache.render(
    `
    import { NodeType } from './NodeType';
    
    {{types}}
    
    {{record}}
    `,
    view
  );
};

const renderType = (name: string, attributes: Attribute[]) => {
  return Mustache.render(
    `
    export type {{name}}Data = {
    {{attributes}}
    }
    `,
    {
      name,
      attributes: () => {
        return attributes
          .map((attribute) => {
            const { name, type } = attribute;
            return `${name}: ${type};`;
          })
          .join('\n');
      },
    }
  );
};

const renderTypes = (nodeTypes: Node<MetaNode>[]) => {
  return nodeTypes
    .map((nodeType) => {
      const { type, attributes } = nodeType.model;

      if (!attributes?.length) return;
      return renderType(type, attributes);
    })
    .filter((el) => el !== undefined)
    .join('');
};

const renderRecordEntry = (name: string, attributes: Attribute[]) => {
  return Mustache.render(
    `
    [NodeType.{{name}}]: {
      {{attributes}}
    },
    `,
    {
      name,
      attributes: () => {
        return attributes
          .map((attribute) => {
            const { name, value } = attribute;

            let finalValue = value;
            if (typeof value === 'string') finalValue = `'${value}'`;

            return `${name}: ${finalValue},`;
          })
          .join('\n');
      },
    }
  );
};

const renderRecordEntries = (nodeTypes: Node<MetaNode>[]) => {
  return nodeTypes
    .map((nodeType) => {
      const { type, attributes } = nodeType.model;

      if (!attributes?.length) return;
      return renderRecordEntry(type, attributes);
    })
    .filter((el) => el !== undefined)
    .join('');
};

const renderRecord = (nodeTypes: Node<MetaNode>[]) => {
  const recordTypes = nodeTypes
    .map((nodeType) => {
      if (!nodeType.model.attributes?.length) return;
      return `${nodeType.model.type}Data`;
    })
    .filter((el) => el !== undefined)
    .join(' | ');

  return Mustache.render(
    `
    export const NodeData: Record<string, {{recordTypes}}> = {
      {{recordEntries}}
    };
    `,
    {
      recordTypes,
      recordEntries: renderRecordEntries(nodeTypes),
    }
  );
};
