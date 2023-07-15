import { Attribute } from 'assets/model/Attribute';
import { NodeType } from 'assets/model/NodeType';

export type MetaNode = {
  model: {
    type: NodeType;
    attributes?: Attribute[];
  };
  parent?: NodeType;
  children?: NodeType[];
};
