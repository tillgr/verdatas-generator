import { Attribute } from 'assets/generated/model/Attribute';
import { NodeType } from 'assets/generated/model/NodeType';

export type MetaNode = {
  model: {
    type: NodeType;
    attributes?: Attribute[];
  };
  parent?: NodeType;
  children?: NodeType[];
};
