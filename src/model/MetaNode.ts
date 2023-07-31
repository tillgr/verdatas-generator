import { Attribute } from 'model/Attribute';

export type MetaNode = {
  type: string;
  color: string;
  count?: {
    min?: number;
    max?: number;
  };
  attributes?: Attribute[];
  children?: MetaNode[];
};
