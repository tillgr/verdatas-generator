import { Node } from 'ts-tree-structure';
import { MetaNode } from 'model/MetaNode';
import Mustache from 'mustache';

export const renderStyleData = (nodeTypes: Node<MetaNode>[]) => {
  return nodeTypes
    .map((nodeType) => {
      const { type, color } = nodeType.model;

      return Mustache.render(
        `
    .vue-flow__node-{{type}} {
      border: {{color}} 1px solid;
    }
    
    .vue-flow__node-{{type}} .vue-flow__handle {
      background: {{color}};
    }
    `,
        {
          type: type.toLowerCase(),
          color,
        }
      );
    })
    .join('\n');
};
