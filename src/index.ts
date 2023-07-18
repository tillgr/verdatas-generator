import { Node } from 'ts-tree-structure';
import Mustache from 'mustache';
import { createTree } from 'utils/tree';
import {
  readJson,
  saveEnum,
  saveGraphSchema,
  saveNodeData,
  saveProject,
  saveStyles,
  saveValidationSchemas,
} from 'utils/file';
import { MetaNode } from 'model/MetaNode';
import fs from 'fs/promises';

const PROJECT_NAME = 'verdatas-graph';

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

  // assets
  saveValidationSchemas(nodeTypes);
  saveGraphSchema(nodeTypes);
  saveEnum(nodeTypes);
  saveNodeData(nodeTypes);
  // style
  saveStyles(nodeTypes);

  await saveProject();
};

const paths = {
  static: {
    source: 'static',
    destination: `${PROJECT_NAME}`,
  },
  dynamic: {
    assets: {
      source: 'dynamic/assets',
      destination: `${PROJECT_NAME}/src/assets`,
    },
    style: {
      source: 'dynamic/style',
      destination: `${PROJECT_NAME}/src`,
    },
  },
};

type Paths = {
  source: string;
  destination: string;
};

const copyDataByPath = async (paths: Paths) => {
  const { source, destination } = paths;
  try {
    await fs.cp(`resources/${source}`, `output/${destination}`, {
      recursive: true,
    });
  } catch (e) {
    console.log(e);
  }
};

generateEditorData()
  .then(() => copyDataByPath(paths.static))
  .then(() => copyDataByPath(paths.dynamic.assets))
  .then(() => copyDataByPath(paths.dynamic.style));
