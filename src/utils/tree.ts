import Tree, { Node } from 'ts-tree-structure';
import { MetaNode } from 'model/MetaNode';

export const createTree = (content: MetaNode): Node<MetaNode> => {
  const tree = new Tree();
  return tree.parse(content);
};
