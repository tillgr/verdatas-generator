import { Attribute } from 'model/attribute';

export type MetaNode = {
  // id: string; // only for instances
  type: string;
  parent: MetaNode;
  attributes?: Attribute[];
  children?: MetaNode[];
};
