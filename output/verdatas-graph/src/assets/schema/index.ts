import GraphSchemaJSON from 'assets/schema/GraphSchema.json';
import { MetaNode } from 'assets/model/MetaNode';

export const GraphSchema = GraphSchemaJSON as unknown as MetaNode[];
