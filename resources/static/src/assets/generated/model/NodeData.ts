import { NodeType } from 'assets/generated/model/NodeType';

// TODO generate
export type ModuleData = {
  structure: string;
  processingTime: number;
  level: string;
};

export type InteractiveTaskData = {
  concludeModule: boolean;
};

// TODO generate
export const NodeData: Record<string, InteractiveTaskData | ModuleData> = {
  [NodeType.Module]: {
    structure: '',
    processingTime: 0,
    level: '',
  },
  [NodeType.InteractiveTask]: {
    concludeModule: false,
  },
};
