
import { NodeType } from './NodeType';


export type TopicData = {
  a1: string;
  a2: number;
}

export type PreparationChapterData = {
  a1: string;
  a2: boolean;
}

export type LearningChapterData = {
  a1: string;
  a2: boolean;
}

export type PracticeModuleData = {
  a1: string;
  a2: boolean;
}



export const NodeData: Record<string, TopicData | PreparationChapterData | LearningChapterData | PracticeModuleData> = {

  [NodeType.Topic]: {
    a1: '',
    a2: 0,
  },

  [NodeType.PreparationChapter]: {
    a1: '',
    a2: false,
  },

  [NodeType.LearningChapter]: {
    a1: '',
    a2: true,
  },

  [NodeType.PracticeModule]: {
    a1: 'none',
    a2: false,
  },

};

