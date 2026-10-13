import type { TGameEffect } from "../effects/game-effect";

export type TDialogueEmotion = "neutral" | "happy" | "sad" | "angry";

export interface IDialogueLineNode {
  id: string;

  type: "line";

  speakerId: string;

  textKey: string;

  emotion: TDialogueEmotion;

  nextNodeId?: string;
}

export interface IDialogueChoiceOption {
  id: string;

  textKey: string;

  nextNodeId?: string;

  effects?: TGameEffect[];
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

  completionEffects?: TGameEffect[];
}
