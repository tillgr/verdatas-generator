import fs from 'fs';
import path from 'path';
import { Node } from 'ts-tree-structure';
import { MetaNode } from 'model/MetaNode';
import { renderSchemas } from 'utils/schema';
import { Project } from 'ts-morph';
import { Child } from 'model/Child';
import { renderNodeData } from 'utils/model';
import { renderStyleData } from 'utils/style';

const INPUT_DIR = 'input';
const OUTPUT_DIR = 'resources/dynamic';
export const readJson = () => {
  try {
    const files = fs.readdirSync(INPUT_DIR);
    const file = files[0];

    let ext = path.extname(file).slice(1);

    let filePath = path.join(INPUT_DIR, file);
    try {
      if (ext !== 'json') throw new Error('File is not of type json');

      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (e) {
      return console.error('Error while reading file: ', e);
    }
  } catch (e) {
    console.error('Error while reading directory: ', e);
  }
};

const project = new Project({
  // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
  // If you initialize with a tsconfig.json, then it will automatically populate the project
  // with the associated source files.
  // Read more: https://ts-morph.com/setup/
});

const formatOptions = {
  indentSize: 2,
  tabSize: 2,
};

export const saveValidationSchemas = (nodeTypes: Node<MetaNode>[]) => {
  nodeTypes.forEach((node) => {
    const { type, attributes, children: modelChildren } = node.model;
    const children = modelChildren?.map((child) => {
      const { type, count } = child;
      return { type, count } as Child;
    });

    const fileContent = renderSchemas(type, attributes, children);
    const outputFile = project.createSourceFile(
      `${OUTPUT_DIR}/assets/schema/${node.model.type.toLowerCase()}_schema.ts`,
      fileContent,
      { overwrite: true }
    );
    outputFile.formatText(formatOptions);
  });
};

const stringify = (obj: Node<MetaNode>[]) => {
  return JSON.stringify(obj, (key, value) => {
    switch (key) {
      case 'parent':
        return value.model.type;
      case 'children':
        if (!value.length) return;
        return value.map((node: Node<MetaNode>) => {
          const { type, count } = node?.model;
          return { type, count };
        });
      case 'model':
        const { children, ...rest } = value;
        return rest;
      case 'walkStrategy':
        return;
      default:
        return value;
    }
  });
};

export const saveGraphSchema = (nodeTypes: Node<MetaNode>[]) => {
  const fileContent = stringify(nodeTypes);
  const outputFile = project.createSourceFile(
    `${OUTPUT_DIR}/assets/schema/GraphSchema.json`,
    fileContent,
    { overwrite: true }
  );
  outputFile.formatText(formatOptions);
};

export const saveEnum = (nodeTypes: Node<MetaNode>[]) => {
  const members = nodeTypes
    .map((node) => node.model.type)
    .map((type) => {
      return {
        name: type,
        value: type.toLowerCase(),
      };
    });
  const outputFile = project.createSourceFile(
    `${OUTPUT_DIR}/assets/model/NodeType.ts`,
    undefined,
    {
      overwrite: true,
    }
  );
  outputFile.addEnum({
    name: 'NodeType',
    members,
    isExported: true,
  });
  outputFile.formatText(formatOptions);
};

export const saveNodeData = (nodeTypes: Node<MetaNode>[]) => {
  const fileContent = renderNodeData(nodeTypes);
  const outputFile = project.createSourceFile(
    `${OUTPUT_DIR}/assets/model/NodeData.ts`,
    fileContent,
    {
      overwrite: true,
    }
  );
  outputFile.formatText(formatOptions);
};

export const saveStyles = (nodeTypes: Node<MetaNode>[]) => {
  const fileContent = renderStyleData(nodeTypes);
  project.createSourceFile(`${OUTPUT_DIR}/style/Nodes.css`, fileContent, {
    overwrite: true,
  });
};

export const saveProject = async () => {
  await project.save();
};
