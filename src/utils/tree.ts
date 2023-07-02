import Tree, { Node } from 'ts-tree-structure';
import { CustomNode } from 'index';

export const createTree = (content: CustomNode): Node<CustomNode> => {
  const tree = new Tree();
  return tree.parse(content);
};
