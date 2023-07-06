import { Node } from 'ts-tree-structure';
import Mustache from 'mustache';
import { createTree } from 'utils/tree';
import { readJson, saveNodeTypes, saveProject, saveSchemas } from 'utils/file';
import { MetaNode } from 'model/node';

Mustache.escape = function (text) {
  return text;
};

const nodeTypes: Node<MetaNode>[] = [];
const fileContent = readJson();
const root = createTree(fileContent);
root.walk((node) => {
  if (!nodeTypes.some((type) => type.model.type === node.model.type))
    nodeTypes.push(node);
  return true;
});

// console.log(nodeTypes);

saveSchemas(nodeTypes);
saveNodeTypes(nodeTypes);
saveProject();

// general:
// - single parent -> wird im editor implementiert (ts-tree structure)
