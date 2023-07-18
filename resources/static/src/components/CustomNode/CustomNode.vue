<script setup lang="ts">
import { Connection, Handle, Position } from '@vue-flow/core';
import { NodeData, NodeType } from 'assets/model';
import { GraphSchema } from 'assets/schema';

export interface CustomNodeProps {
  isValidTargetPos: (connection: Connection) => boolean;
  isValidSourcePos: (connection: Connection) => boolean;
  id: string;
  type: NodeType;
  label: string;
  data: NodeData;
}

const props = defineProps<CustomNodeProps>();

const getMetaNodeByType = (type: NodeType) => {
  return GraphSchema.filter((nodeType) => nodeType.model.type.toLowerCase() === type.toLowerCase())[0];
};

const isRoot = getMetaNodeByType(props.type)?.parent === undefined;
const isLeaf = getMetaNodeByType(props.type)?.children === undefined;
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Handle v-if="!isRoot" type="target" :position="Position.Top" :is-valid-connection="props.isValidSourcePos" />
  <Handle v-if="!isLeaf" type="source" :position="Position.Bottom" :is-valid-connection="props.isValidTargetPos" />
  <div>ID: {{ props.label }}</div>
  <div>Type: {{ props.type }}</div>
</template>

<style scoped>
@import 'CustomNode.css';
</style>
