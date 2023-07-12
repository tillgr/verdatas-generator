import GraphSchemaJSON from 'assets/generated/schema/GraphSchema.json';
import { MetaNode } from 'assets/generated/model/MetaNode';

export const GraphSchema = GraphSchemaJSON as unknown as MetaNode[];
