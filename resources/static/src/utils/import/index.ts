import { IliasNodeType, NodeType } from 'assets/model/NodeType';
import { GraphSchema } from 'assets/schema';
import { MetaNode } from 'assets/model';

export const ImportSpacing: [number, number] = [160, 100];

export const parseJsonFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e: any) => resolve(JSON.parse(e?.target?.result));
    fr.onerror = (error) => reject(error);
    file && fr.readAsText(file);
  });
};

export type d3Hierarchy = {
  [data: string]: any;
  children?: any[];
};

// TODO needs to very generic
// lookup aus types
// root (kein parent)
// child types von root

// zugriff auf props im import nach child types
// mapping zu d3 hierarchy
// id: file.object_id,
// type: 'topic',
// children: modules,

//rekursion nutzen

type fileNode = {
  [data: string | Partial<IliasNodeType>]: any;
};

const convertNode = (node: fileNode, type: NodeType, isRoot?: boolean): d3Hierarchy => {
  let childTypes: IliasNodeType[] | undefined;
  const makePlural = (type: IliasNodeType) => type + 's';

  if (!!isRoot) {
    const { model } = getRoot();
    childTypes = getChildTypes(model.type)?.map(makePlural) as IliasNodeType[];
  } else {
    childTypes = Object.values(IliasNodeType)
      .map(makePlural)
      .filter((value) => Object.keys(node).includes(value)) as IliasNodeType[];
  }

  const children = childTypes?.map((key) => node[key]);

  node = {
    id: node.object_id,
    type,
    children,
  };

  node.children?.forEach((child) => (!!child ? convertNode(child, type) : undefined));

  return node;

  // attribute weglassen
  // alle children in einem array zusammenfassen
  // über child types in array gehen gehen
  // für jedes child convertNode
};

const getRoot = () => GraphSchema.filter((node: MetaNode) => !node.parent)[0]!;
const getChildTypes = (nodeType: NodeType): IliasNodeType[] | undefined =>
  GraphSchema.filter((node: MetaNode) => node.model.type.toLowerCase() === nodeType.toLowerCase())[0]?.children?.map(
    (child) => child.type.replace(/./, (c) => c.toLowerCase()) as IliasNodeType
  );

export const filterJsonFile = (file: any): d3Hierarchy => {
  const { model } = getRoot();
  return convertNode(file, model.type, true);
};

// export const filterJsonFile = (file: IliasGraph): d3Hierarchy => {
//   const modules = file[IliasNodeType.Modules]?.map((module: Module) => {
//     const chapters = module[IliasNodeType.Chapters]?.map((chapter: Chapter) => {
//       const interactiveTasks = chapter[IliasNodeType.InteractiveTasks]?.map((task: InteractiveTask) => {
//         return { id: task.object_id, type: NodeType.InteractiveTask };
//       });
//       return { id: chapter.object_id, type: NodeType.Chapter, children: interactiveTasks };
//     });
//     return { id: module.object_id, type: NodeType.Module, children: chapters };
//   });
//
//   return {
//     id: file.object_id,
//     type: 'topic',
//     children: modules,
//   };
// };
