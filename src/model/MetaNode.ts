import { Attribute } from 'model/Attribute';

export type MetaNode = {
  type: string; // PascalCase
  color: string;
  count?: {
    min?: number;
    max?: number;
  };
  attributes?: Attribute[];
  children?: MetaNode[];
};
