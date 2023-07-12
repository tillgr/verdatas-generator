import { Connection, GraphEdge, GraphNode, Node } from '@vue-flow/core';
import { Ref } from 'vue';
import { NodeData } from 'assets/generated/model/NodeData';
import { GraphSchema } from 'assets/generated/schema';

import { NodeType } from 'assets/generated/model/NodeType';

const getTypeInformation = (type: NodeType) => {
  const result = GraphSchema.filter((nodeType) => nodeType.model.type === type)[0];

  if (!result) throw new Error('No type information found for provided node ' + type);
  return result;
};

export const getNodeById = (id: string, nodes: Ref<GraphNode<any, any>[]>): Node | undefined => {
  return nodes.value.filter((el) => {
    return el.id === id;
  })[0];
};

export const edgeContainsNode = (edge: GraphEdge, node: Node) => {
  return edge.id.includes(node.id);
};
export const edgeContainsNodeType = (edge: GraphEdge, type: string) => {
  return edge.sourceNode.type === type || edge.targetNode.type === type;
};

const matchNodeTypes = (id: string, nodes: Ref<GraphNode<any, any>[]>, types?: (NodeType | undefined)[]): boolean => {
  const node = getNodeById(id, nodes);
  return types?.some((type) => type === node?.type) || false;
};

const checkForMultipleParents = (
  connection: Connection,
  nodes: Ref<GraphNode<any, any>[]>,
  edges: Ref<GraphEdge<any, any>[]>
): boolean => {
  const source = getNodeById(connection.source, nodes);
  const target = getNodeById(connection.target, nodes);

  if (!(source && target)) {
    return false;
  }
  const sourceParentType = getTypeInformation(source.type as NodeType).parent; // TODO done
  const targetType = target.type;

  const child = targetType === sourceParentType ? source : target;
  return !edges.value.some(
    (edge) => edgeContainsNode(edge, child) && edgeContainsNodeType(edge, child.data.metaParentType)
  );
};

export const getValidationFunctions = (
  type: NodeType,
  nodesRef: Ref<GraphNode<any, any>[]>,
  edgesRef: Ref<GraphEdge<any, any>[]>
) => {
  const { parent, children } = getTypeInformation(type); //TODO done

  const isValidSourcePos = (connection: Connection) =>
    matchNodeTypes(connection.source, nodesRef, [parent, children].flat()) && // TODO done
    checkForMultipleParents(connection, nodesRef, edgesRef);

  const isValidTargetPos = (connection: Connection) =>
    matchNodeTypes(connection.target, nodesRef, [parent, children].flat()) && // TODO done
    checkForMultipleParents(connection, nodesRef, edgesRef);

  return {
    isValidSourcePos,
    isValidTargetPos,
  };
};

const createLabelFromId = (id: string) => {
  const paramsString = id.split('?')[1];
  const params = new URLSearchParams(paramsString);

  return `node_${params.get('target')}`;
};

export const createNode = (
  id: string,
  type: NodeType,
  position: { x: number; y: number },
  nodesRef: Ref<GraphNode<any, any>[]>,
  edgesRef: Ref<GraphEdge<any, any>[]>,
  label?: string
): Node => {
  const data = NodeData[type];
  const validationFunctions = getValidationFunctions(type, nodesRef, edgesRef);

  return {
    id,
    type,
    label: label ?? createLabelFromId(id),
    position,
    data,
    ...validationFunctions,
  };
};

// const createEdge = (source: string, target: string): Edge => {
//   const id = source + target;
//
//   return {
//     id,
//     source,
//     target,
//   };
// };

// TODO later
// export const calculateTreeLayout = (
//   hierarchyData: d3Hierarchy,
//   nodesRef: Ref<GraphNode<any, any>[]>,
//   edgesRef: Ref<GraphEdge<any, any>[]>
// ) => {
//   const root = hierarchy(hierarchyData);
//   const _tree = tree().nodeSize(ImportSpacing)(root);
//   const newNodes: Node[] = [];
//   let newEdges: Edge[] = [];
//
//   try {
//     _tree.each((node: any) => {
//       const newNode = createNode(
//         node.data.id,
//         node.data.type.toLowerCase(),
//         {
//           x: node.x,
//           y: node.y,
//         },
//         nodesRef,
//         edgesRef
//       );
//       newNodes.push(newNode);
//     });
//
//     newEdges = _tree.links().map((node: HierarchyPointLink<any>) => {
//       return createEdge(node.source.data.id, node.target.data.id);
//     });
//   } catch (e) {
//     console.error(e);
//   }
//   return { edges: newEdges, nodes: newNodes };
// };
