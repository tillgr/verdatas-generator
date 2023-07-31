import { Connection, Edge, GraphEdge, GraphNode, Node } from '@vue-flow/core';
import { Ref } from 'vue';
import { GraphSchema, schemas } from 'assets/schema';
import { NodeData, NodeType } from 'assets/model';
import { D3Hierarchy, ImportSpacing } from 'utils/import';
import { hierarchy, HierarchyPointLink, tree } from 'd3';

const getTypeInformation = (type: NodeType) => {
  const result = GraphSchema.filter((nodeType: NodeType) => nodeType.model.type.toLowerCase() === type)[0];

  if (!result) throw new Error('No type information found for provided node ' + type);
  return result;
};

export const getNodeById = (id: string, nodes: Ref<GraphNode<any, any>[]>): Node | undefined => {
  return nodes.value.filter((el: GraphNode) => {
    return el.id === id;
  })[0];
};

export const edgeContainsNode = (edge: GraphEdge, node: Node) => {
  return edge.id.includes(node.id);
};
export const edgeContainsNodeType = (edge: GraphEdge, type?: string) => {
  if (!type) return false;
  return edge.sourceNode.type === type || edge.targetNode.type === type;
};

const validateChildrenBySchema = (nodeType: NodeType, children: NodeType[]) => {
  const schema = schemas.children[nodeType];

  if (!schema) return false;
  return !schema.validate(children).error;
};

const matchNodeTypes = (
  connectionId: string,
  currentId: string,
  nodes: Ref<GraphNode<any, any>[]>,
  edges: Ref<GraphEdge<any, any>[]>
): boolean => {
  const connectionNode = getNodeById(connectionId, nodes);
  const currentNode = getNodeById(currentId, nodes);
  if (!connectionNode || !currentNode) {
    throw new Error(`Invalid source or target as connection for validating match of node types.`);
  }

  // CASE: parent -> child
  const { parent: connectionParent } = getTypeInformation(connectionNode?.type as NodeType);
  const isParent = currentNode.type === connectionParent?.toLowerCase();

  // CASE: child -> parent
  // get all connections of connectionNode
  const connectionEdges = edges.value.filter(
    (edge: GraphEdge) => edge.targetNode.id === connectionId || edge.sourceNode.id === connectionId
  );
  // map to types
  const connectionChildren: NodeType[] = connectionEdges
    .map((edge: GraphEdge) => {
      if (edge.targetNode.id === connectionId) return edge.sourceNode.type.toLowerCase() as NodeType;
      return edge.targetNode.type.toLowerCase() as NodeType;
    })
    // remove parent (only children left)
    .filter((type: NodeType) => type.toLowerCase() !== connectionParent?.toLowerCase());
  // add potential child candidate
  connectionChildren.push(currentNode.type);
  // validate with type specific children schema
  const isChild = validateChildrenBySchema(connectionNode.type, connectionChildren);

  return isParent || isChild;
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
  const sourceParentType = getTypeInformation(source.type as NodeType).parent;
  const targetType = target.type;

  const child = targetType === sourceParentType ? source : target;
  return !edges.value.some(
    (edge: GraphEdge) =>
      edgeContainsNode(edge, child) && edgeContainsNodeType(edge, getTypeInformation(child.type as NodeType).parent)
  );
};

export const getValidationFunctions = (nodesRef: Ref<GraphNode<any, any>[]>, edgesRef: Ref<GraphEdge<any, any>[]>) => {
  const isValidSourcePos = (connection: Connection) =>
    matchNodeTypes(connection.source, connection.target, nodesRef, edgesRef) &&
    checkForMultipleParents(connection, nodesRef, edgesRef);

  const isValidTargetPos = (connection: Connection) =>
    matchNodeTypes(connection.target, connection.source, nodesRef, edgesRef) &&
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
  const validationFunctions = getValidationFunctions(nodesRef, edgesRef);

  return {
    id,
    type,
    label: label ?? createLabelFromId(id),
    position,
    data,
    ...validationFunctions,
  };
};

const createEdge = (source: string, target: string): Edge => {
  const id = source + target;

  return {
    id,
    source,
    target,
  };
};

export const calculateTreeLayout = (
  hierarchyData: D3Hierarchy,
  nodesRef: Ref<GraphNode<any, any>[]>,
  edgesRef: Ref<GraphEdge<any, any>[]>
) => {
  const root = hierarchy(hierarchyData);
  const _tree = tree().nodeSize(ImportSpacing)(root);
  const newNodes: Node[] = [];
  let newEdges: Edge[] = [];

  try {
    _tree.each((node: any) => {
      const newNode = createNode(
        node.data.id,
        node.data.type.toLowerCase(),
        {
          x: node.x,
          y: node.y,
        },
        nodesRef,
        edgesRef
      );
      newNodes.push(newNode);
    });

    newEdges = _tree.links().map((node: HierarchyPointLink<any>) => {
      return createEdge(node.source.data.id, node.target.data.id);
    });
  } catch (e) {
    console.error(e);
  }
  return { edges: newEdges, nodes: newNodes };
};
