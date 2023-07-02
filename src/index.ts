import { Node } from 'ts-tree-structure';
import Mustache from 'mustache';
import { createTree } from 'utils/tree';
import { renderSchema } from 'utils/schema';
import { readJson } from 'utils/file';

type CustomNodeBase = {
  // id: string; // only for instances
  type: string;
  attributes?: {
    name: string;
    value: string | number | boolean;
  }[];
};
export type CustomNode = CustomNodeBase & {
  children?: CustomNodeBase[];
};
const nodeTypes: Node<CustomNode>[] = [];

Mustache.escape = function (text) {
  return text;
};

readJson()
  .then((fileContent) => {
    return createTree(fileContent);
  })
  .then((root) => {
    // collect all node types
    root.walk((node) => {
      if (!nodeTypes.some((type) => type.model.type === node.model.type))
        nodeTypes.push(node);
      return true;
    });
  })
  .then(() => {
    console.log(renderSchema());
  });

// general:
// - single parent -> wird im editor implementiert (ts-tree structure)
