import { Node } from 'ts-tree-structure';
import Mustache from 'mustache';
import { createTree } from 'utils/tree';
import { renderSchema } from 'utils/schema';
import { readJson } from 'utils/file';
import { Project } from 'ts-morph';

type CustomNodeBase = {
  // id: string; // only for instances
  type: string;
  attributes?: {
    name: string;
    value: string | number | boolean;
  }[];
};
export type CustomNode = CustomNodeBase & {
  children?: CustomNodeBase[];
};
const nodeTypes: Node<CustomNode>[] = [];

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
  })
  .then(async () => {
    const fileContent = renderSchema();
    const outputFile = project.createSourceFile(
      'output/output.ts',
      fileContent,
      { overwrite: true }
    );
    outputFile.formatText({
      baseIndentSize: 2,
      indentSize: 2,
      tabSize: 2,
    });
    await project.save();
  });

// general:
// - single parent -> wird im editor implementiert (ts-tree structure)
