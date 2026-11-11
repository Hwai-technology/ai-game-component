import { Disposable } from '../../../../core/shared-types/src/index.js';
import { QuestDefinition, QuestInstance, QuestReward, QuestStatus } from '../types/index.js';

export class QuestMissionSystem implements Disposable {
  private readonly quests = new Map<string, QuestInstance>();
  private readonly completionListeners = new Set<(questId: string, reward?: QuestReward) => void>();
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public registerQuest(definition: QuestDefinition): void {
    const hasPrereqs = definition.prerequisiteQuestIds && definition.prerequisiteQuestIds.length > 0;
    const initialStatus: QuestStatus = hasPrereqs ? 'locked' : 'available';

    const objectives = definition.objectives.map((o) => ({
      ...o,
      currentCount: 0,
      isCompleted: false,
    }));

    this.quests.set(definition.id, {
      definition: { ...definition, objectives },
      status: initialStatus,
      progressPercentage: 0,
    });
  }

  public startQuest(questId: string): boolean {
    if (this._isDisposed) return false;
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'available') return false;

    quest.status = 'in_progress';
    return true;
  }

  public advanceObjective(questId: string, objectiveId: string, delta = 1): boolean {
    if (this._isDisposed) return false;
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'in_progress') return false;

    const objective = quest.definition.objectives.find((o) => o.id === objectiveId);
    if (!objective || objective.isCompleted) return false;

    objective.currentCount = Math.min(objective.targetCount, objective.currentCount + delta);
    if (objective.currentCount >= objective.targetCount) {
      objective.isCompleted = true;
    }

    // Recalculate quest progress
    const totalObjs = quest.definition.objectives.length;
    const finishedObjs = quest.definition.objectives.filter((o) => o.isCompleted).length;
    quest.progressPercentage = Math.round((finishedObjs / totalObjs) * 100);

    // If all objectives finished -> quest completed!
    if (finishedObjs === totalObjs) {
      quest.status = 'completed';
      this.unlockDependentQuests();

      for (const listener of this.completionListeners) {
        listener(questId, quest.definition.rewards);
      }
    }

    return true;
  }

  public getQuest(questId: string): QuestInstance | undefined {
    return this.quests.get(questId);
  }

  public getQuestsByStatus(status: QuestStatus): QuestInstance[] {
    return Array.from(this.quests.values()).filter((q) => q.status === status);
  }

  public onQuestComplete(listener: (questId: string, reward?: QuestReward) => void): () => void {
    this.completionListeners.add(listener);
    return () => this.completionListeners.delete(listener);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.quests.clear();
    this.completionListeners.clear();
  }

  private unlockDependentQuests(): void {
    const completedIds = new Set(
      Array.from(this.quests.values())
        .filter((q) => q.status === 'completed')
        .map((q) => q.definition.id)
    );

    for (const quest of this.quests.values()) {
      if (quest.status === 'locked' && quest.definition.prerequisiteQuestIds) {
        const allMet = quest.definition.prerequisiteQuestIds.every((id) => completedIds.has(id));
        if (allMet) {
          quest.status = 'available';
        }
      }
    }
  }
}

