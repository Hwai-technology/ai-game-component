export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
}

export interface QuestReward {
  xp?: number;
  coins?: number;
  itemIds?: string[];
}

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  prerequisiteQuestIds?: string[];
  objectives: QuestObjective[];
  rewards?: QuestReward;
}

export interface QuestInstance {
  definition: QuestDefinition;
  status: QuestStatus;
  progressPercentage: number;
}
