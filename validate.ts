import { Topic_Children_Schema } from './output/Topic_Schema';

console.log(
  Topic_Children_Schema.validate([
    'PreparationModule',
    // 'LearningModule',
    'PracticeModule',
  ])
);
