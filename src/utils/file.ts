import fs from 'fs';
import path from 'path';
import { Node } from 'ts-tree-structure';
import { MetaNode } from 'model/node';
import { renderSchema } from 'utils/schema';
import { Project } from 'ts-morph';

const dir = './input';
export const readJson = () => {
  try {
    const files = fs.readdirSync(dir);
    const file = files[0];

    let ext = path.extname(file).slice(1);

    let filePath = path.join(dir, file);
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

export const saveSchemas = (nodeTypes: Node<MetaNode>[]) => {
  nodeTypes.forEach((node) => {
    const parent = node.parent?.model.type;
    const { type, attributes, children } = node.model;
    const childNames = children?.map((child) => child.type);

    const fileContent = renderSchema(type, parent, attributes, childNames);
    const outputFile = project.createSourceFile(
      `output/${node.model.type}_Schema.ts`,
      fileContent,
      { overwrite: true }
    );
    outputFile.formatText({
      indentSize: 2,
      tabSize: 2,
    });
  });
};

const stringify = (obj: Node<MetaNode>[]) => {
  return JSON.stringify(obj, (key, value) => {
    switch (key) {
      case 'parent':
        return value.model.type;
      case 'children':
        if (!value.length) return;
        return value.map((node: Node<MetaNode>) => node?.model?.type);
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

export const saveNodeTypes = (nodeTypes: Node<MetaNode>[]) => {
  const fileContent = stringify(nodeTypes);
  const outputFile = project.createSourceFile(
    `output/GraphSchema.json`,
    fileContent,
    { overwrite: true }
  );
  outputFile.formatText({
    indentSize: 2,
    tabSize: 2,
  });
};

export const saveProject = async () => {
  await project.save();
};
