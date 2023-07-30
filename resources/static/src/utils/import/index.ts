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

export type D3Hierarchy = {
  [data: string]: any;
  children?: any[];
};

const convertNode = (node: any, type: NodeType, isRoot?: boolean): D3Hierarchy => {
  let childTypes: string[] | undefined;
  const makePlural = (type: IliasNodeType) => type + 's';
  const makeSingular = (type: string) => (type = type.slice(0, -1));

  if (!!isRoot) {
    const { model } = getRoot();
    childTypes = getChildTypes(model.type)?.map(makePlural);
  } else {
    childTypes = Object.values(IliasNodeType)
      .map(makePlural)
      .filter((value) => Object.keys(node).includes(value));
  }

  let children = childTypes
    ?.map((type) => {
      const childrenByType = node[type];
      childrenByType.forEach((child) => (child.type = type.toLowerCase() as NodeType));
      return childrenByType;
    })
    .flat();
  const hasChildren = !!children?.length;

  node = {
    id: node.object_id,
    type: !isRoot ? makeSingular(type.toLowerCase()) : type.toLowerCase(),
    ...(hasChildren && { children }),
  };

  if (!hasChildren) return node;

  node.children = node.children?.map((child) => (!!child ? convertNode(child, child.type) : undefined));
  return node;
};

const getRoot = () => GraphSchema.filter((node: MetaNode) => !node.parent)[0]!;
const getChildTypes = (nodeType: NodeType): IliasNodeType[] | undefined =>
  GraphSchema.filter((node: MetaNode) => node.model.type.toLowerCase() === nodeType.toLowerCase())[0]?.children?.map(
    (child) => child.type.replace(/./, (c) => c.toLowerCase()) as IliasNodeType
  );

export const filterJsonFile = (file: any): D3Hierarchy => {
  const { model } = getRoot();
  return convertNode(file, model.type, true);
};
