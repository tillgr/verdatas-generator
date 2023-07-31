export const MetamodelAjvSchema = {
  $id: 'verdatas-generator/tree',
  type: 'object',
  required: ['type', 'color'],
  properties: {
    type: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    count: {
      type: 'object',
      properties: {
        min: {
          type: 'number',
          minimum: 0,
        },
        max: {
          type: 'number',
          minimum: 1,
        },
      },
    },
    attributes: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['name', 'value', 'type'],
        properties: {
          name: {
            type: 'string',
          },
          value: {
            type: ['string', 'number', 'boolean'],
          },
          type: {
            type: 'string',
          },
        },
      },
    },
    children: {
      type: 'array',
      uniqueItems: true,
      items: { $ref: '#' },
    },
  },
};
