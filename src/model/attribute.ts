export type AttributeType = string | number | boolean;
export type AttributeString = 'string' | 'number' | 'boolean';
export type Attribute = {
  name: string;
  value: AttributeType;
  type: AttributeString;
};
