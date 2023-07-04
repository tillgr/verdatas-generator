export type AttributeType = string | number | boolean;
export type AttributeString = 'string' | 'number' | 'boolean';
export type Attribute = {
  name: string;
  _default: AttributeType;
  type: AttributeString;
};
