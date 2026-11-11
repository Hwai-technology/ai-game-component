import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { DialogueChoice, DialogueNode, DialogueState, DialogueTreeConfig } from '../types/index.js';

export class DialogueTreeEngine implements Disposable {
  private readonly nodes = new Map<string, DialogueNode>();
  private readonly startNodeId: string;
  private currentNodeId?: string;
  private isEnded = false;
  private _isDisposed = false;

  constructor(config: DialogueTreeConfig) {
    this.startNodeId = config.startNodeId;
    for (const [id, node] of Object.entries(config.nodes)) {
      this.nodes.set(id, { ...node });
    }
    this.currentNodeId = this.startNodeId;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getCurrentNode(): DialogueNode | undefined {
    if (!this.currentNodeId) return undefined;
    return this.nodes.get(this.currentNodeId);
  }

  public getAvailableChoices(context?: unknown): DialogueChoice[] {
    const node = this.getCurrentNode();
    if (!node || !node.choices) return [];

    return node.choices.filter((c) => (c.condition ? c.condition(context) : true));
  }

  public selectChoice(choiceIndex: number, context?: unknown): DialogueNode | null {
    if (this._isDisposed || this.isEnded) return null;

    const available = this.getAvailableChoices(context);
    const selected = available[choiceIndex];
    if (!selected) {
      throw new ValidationError(`Invalid choice index '${choiceIndex}'`);
    }

    return this.advanceToNode(selected.targetNodeId);
  }

  public advance(): DialogueNode | null {
    if (this._isDisposed || this.isEnded) return null;

    const current = this.getCurrentNode();
    if (!current) return null;

    if (current.nextNodeId) {
      return this.advanceToNode(current.nextNodeId);
    }

    // No next node and no choices -> conversation ends
    this.isEnded = true;
    this.currentNodeId = undefined;
    return null;
  }

  public getState(context?: unknown): DialogueState {
    return {
      currentNode: this.getCurrentNode(),
      availableChoices: this.getAvailableChoices(context),
      isEnded: this.isEnded,
    };
  }

  public reset(): void {
    this.currentNodeId = this.startNodeId;
    this.isEnded = false;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.nodes.clear();
  }

  private advanceToNode(nodeId: string): DialogueNode | null {
    const nextNode = this.nodes.get(nodeId);
    if (!nextNode) {
      this.isEnded = true;
      this.currentNodeId = undefined;
      return null;
    }

    this.currentNodeId = nodeId;
    return nextNode;
  }
}

