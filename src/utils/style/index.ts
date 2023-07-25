import { Node } from 'ts-tree-structure';
import { MetaNode } from 'model/MetaNode';
import Mustache from 'mustache';

export const renderStyleData = (nodeTypes: Node<MetaNode>[]) => {
  const dynamicString = nodeTypes
    .map((nodeType) => {
      const { type, color } = nodeType.model;

      return Mustache.render(
        `
        .vue-flow__node-{{type}} {
          border: {{color}} 1px solid;
        }
        
        .vue-flow__node-{{type}} .vue-flow__handle {
          border: {{color}} 1px solid;
        }
        `,
        {
          type: type.toLowerCase(),
          color,
        }
      );
    })
    .join('\n');

  const staticString = `
  .validationflow .vue-flow__handle-connecting {
    background: #ff6060
  }
  
  .validationflow .vue-flow__handle-valid {
    background: #55dd99
  }
  `;

  return [dynamicString, staticString].join('\n');
};
