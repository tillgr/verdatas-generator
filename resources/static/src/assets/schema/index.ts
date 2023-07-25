import GraphSchemaJSON from 'assets/schema/GraphSchema.json';
import { MetaNode } from 'assets/model/MetaNode';
import { NodeType } from 'assets/model';
import { learningchapter_attributes_schema } from 'assets/schema/learningchapter_schema';
import { learningmodule_children_schema } from 'assets/schema/learningmodule_schema';
import { practicemodule_attributes_schema } from 'assets/schema/practicemodule_schema';
import { preparationchapter_attributes_schema } from 'assets/schema/preparationchapter_schema';
import { preparationmodule_children_schema } from 'assets/schema/preparationmodule_schema';
import { topic_attributes_schema, topic_children_schema } from 'assets/schema/topic_schema';

export const GraphSchema = GraphSchemaJSON as unknown as MetaNode[];

export const schemas = {
  attributes: {
    [NodeType.LearningChapter]: learningchapter_attributes_schema,
    [NodeType.PracticeModule]: practicemodule_attributes_schema,
    [NodeType.PreparationChapter]: preparationchapter_attributes_schema,
    [NodeType.Topic]: topic_attributes_schema,
  },
  children: {
    [NodeType.LearningModule]: learningmodule_children_schema,
    [NodeType.PreparationModule]: preparationmodule_children_schema,
    [NodeType.Topic]: topic_children_schema,
  },
};
