import { Attribute } from 'assets/model/Attribute';

export type MetaNode = {
  model: {
    type: string;
    attributes?: Attribute[];
  };
  parent?: string;
  children?: Child[];
};

export type Child = {
  type: string;
  count?: {
    min?: number;
    max?: number;
  };
};
