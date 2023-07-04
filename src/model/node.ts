import { Attribute } from 'model/attribute';

export type MetaNode = {
  // id: string; // only for instances
  type: string;
  attributes?: Attribute[];
  children?: MetaNode[];
};
