import { Attribute } from 'model/Attribute';

export type MetaNode = {
  type: string;
  count: {
    min: number;
    max: number;
  };
  parent: MetaNode;
  attributes?: Attribute[];
  children?: MetaNode[];
};
