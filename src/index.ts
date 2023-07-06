import { Node } from 'ts-tree-structure';
import Mustache from 'mustache';
import { createTree } from 'utils/tree';
import { renderSchema } from 'utils/schema';
import { readJson } from 'utils/file';
import { Project } from 'ts-morph';
import { MetaNode } from 'model/node';
import { jsonc } from 'jsonc';

const nodeTypes: Node<MetaNode>[] = [];

Mustache.escape = function (text) {
  return text;
};
const project = new Project({
  // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
  // If you initialize with a tsconfig.json, then it will automatically populate the project
  // with the associated source files.
  // Read more: https://ts-morph.com/setup/
});

readJson()
  .then((fileContent) => {
    return createTree(fileContent);
  })
  .then((root) => {
    // collect all node types
    root.walk((node) => {
      if (!nodeTypes.some((type) => type.model.type === node.model.type))
        nodeTypes.push(node);
      return true;
    });

    console.log(nodeTypes);
  })
  .then(() => {
    nodeTypes.forEach((node) => {
      const parent = node.parent?.model.type;
      const { type, attributes, children } = node.model;
      const childNames = children?.map((child) => child.type);

      const fileContent = renderSchema(type, parent, attributes, childNames);
      const outputFile = project.createSourceFile(
        `output/${node.model.type}_schema.ts`,
        fileContent,
        { overwrite: true }
      );
      outputFile.formatText({
        indentSize: 2,
        tabSize: 2,
      });
    });
  })
  .then(() => {
    const fileContent = jsonc.stringify(nodeTypes);
    const outputFile = project.createSourceFile(
      `output/nodeTypes.json`,
      fileContent,
      { overwrite: true }
    );
    outputFile.formatText({
      indentSize: 2,
      tabSize: 2,
    });
  })
  .then(async () => {
    await project.save();
  });

// general:
// - single parent -> wird im editor implementiert (ts-tree structure)
