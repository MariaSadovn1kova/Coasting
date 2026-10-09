import type { TNpcEmotion } from "../npc/npc";

export interface IDialogueEffect {
  relationshipChange?: number;

  setFlags?: Record<string, boolean>;
}

export interface IDialogueLineNode {
  id: string;

  type: "line";

  speakerId: string;

  textKey: string;

  emotion: TNpcEmotion;

  nextNodeId: string | null;
}

export interface IDialogueChoiceOption {
  id: string;

  textKey: string;

  nextNodeId: string | null;

  effects?: IDialogueEffect;
}

export interface IDialogueChoiceNode {
  id: string;

  type: "choice";

  choiceId: string;

  options: IDialogueChoiceOption[];
}

export type TDialogueNode = IDialogueLineNode | IDialogueChoiceNode;

export interface IDialogue {
  id: string;

  npcId: string;

  startNodeId: string;

  nodes: Record<string, TDialogueNode>;
}
