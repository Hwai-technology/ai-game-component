export interface DialogueChoice {
  text: string;
  targetNodeId: string;
  condition?: (context?: unknown) => boolean;
}

export interface DialogueNode {
  id: string;
  speakerName: string;
  text: string;
  choices?: DialogueChoice[];
  nextNodeId?: string; // Automatic continuation if choices are not provided
}

export interface DialogueTreeConfig {
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
}

export interface DialogueState {
  currentNode?: DialogueNode;
  availableChoices: DialogueChoice[];
  isEnded: boolean;
}

