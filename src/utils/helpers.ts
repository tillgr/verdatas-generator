import { AttributeString } from 'model/Attribute';

export const getDefaultValue = (type: AttributeString) => {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
  }
};
