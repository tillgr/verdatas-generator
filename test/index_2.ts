import fs from 'fs/promises';
import path from 'path';
import Tree, { Node } from 'ts-tree-structure';
import { OclEngine } from '@stekoe/ocl.js';
import { render } from 'mustache';

const dir = './input';

type CustomNodeBase = {
  // id: string; // only for instances
  typeName: string;
  attributes?: {
    name: string;
    type: string | string[] | number | boolean;
  }[];
};
type CustomNode = CustomNodeBase & {
  children?: CustomNodeBase[];
};
const nodeTypes: Node<CustomNode>[] = [];
const oclEngine = OclEngine.create();

const readJson = async () => {
  try {
    const files = await fs.readdir(dir);
    const file = files[0];

    let ext = path.extname(file).slice(1);

    let filePath = path.join(dir, file);
    try {
      if (ext !== 'json') throw new Error('File is not of type json');

      const fileContent = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (e) {
      return console.error('Error while reading file: ', e);
    }
  } catch (e) {
    console.error('Error while reading directory: ', e);
  }
};

const createTree = (content: CustomNode): Node<CustomNode> => {
  const tree = new Tree();
  return tree.parse(content);
};

readJson()
  .then((fileContent) => {
    return createTree(fileContent);
  })
  .then((root) => {
    // collect all node types
    root.walk((node) => {
      if (!nodeTypes.includes(node)) nodeTypes.push(node);

      return true;
    });

    //create OCL config
    const topic = nodeTypes.filter(
      (type) => type.model.typeName === 'Topic'
    )[0];
    const view = {
      Topic: {
        children: topic.children
          .map((child) => child.model.typeName)
          .join(' or '),
      },
      attributes: topic.model.attributes,
    };

    //
    const myOclExpression = render(
      `
      context Topic
        inv: self.children->notEmpty()
        inv: self.children->forAll(ch | ch.model.name = ${view.Topic.children})
        inv: self.parent->

      -- context PreparationModule
      --     inv: self.children->notEmpty()

      -- context LearningModule
      --   inv: self.children->notEmpty()

      -- context PracticeModule
      --   inv: self.children->notEmpty()

      -- context Chapter
      --   inv: self.children->notEmpty()

      -- context ContentPage
      --   inv: self.children->notEmpty()

      -- context InteractiveTask
      --   inv: self.children->notEmpty()
      `,
      view
    );

    oclEngine.addOclExpression(myOclExpression);

    // validate model
    root.walk((node) => {
      let oclResult = oclEngine.evaluate(node);
      console.log(oclResult.getResult());
      console.log(oclResult.getEvaluatedContexts());
      // console.log(oclResult.getNamesOfFailedInvs());
      return true;
    });
  });

// general:
// - single parent -> wird im editor implementiert
