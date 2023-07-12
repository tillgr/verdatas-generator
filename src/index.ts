import { Node } from 'ts-tree-structure';
import Mustache from 'mustache';
import { createTree } from 'utils/tree';
import {
  readJson,
  saveEnum,
  saveGraphSchema,
  saveNodeData,
  saveProject,
  saveValidationSchemas,
} from 'utils/file';
import { MetaNode } from 'model/MetaNode';
import fs from 'fs/promises';

const generateEditorData = async () => {
  Mustache.escape = function (text) {
    return text;
  };

  const nodeTypes: Node<MetaNode>[] = [];
  const fileContent = readJson();
  const root = createTree(fileContent);
  root.walk((node) => {
    if (!nodeTypes.some((type) => type.model.type === node.model.type))
      nodeTypes.push(node);
    return true;
  });

  saveValidationSchemas(nodeTypes);
  saveGraphSchema(nodeTypes);
  saveEnum(nodeTypes);
  saveNodeData(nodeTypes);
  await saveProject();
};

const paths = {
  static: {
    source: 'resources/static',
    destination: 'output',
  },
  dynamic: {
    source: 'resources/dynamic',
    destination: '',
  },
};

const insertStaticData = async () => {
  const { source, destination } = paths.static;
  try {
    await fs.cp(source, destination, { recursive: true });
  } catch (e) {
    console.log(e);
  }
};

const insertDynamicData = async () => {};

generateEditorData()
  .then(() => insertStaticData())
  .then(() => insertDynamicData());

// general:
// - single parent -> wird im editor implementiert (ts-tree structure)
