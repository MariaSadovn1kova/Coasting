import type { TGameEffect } from "../effects/game-effect";

import type { IGameConditionGroup } from "../conditions/game-condition";

export type TDialogueEmotion = "neutral" | "happy" | "sad" | "angry";

export interface IDialogueLineNode {
  id: string;

  type: "line";

  speakerId: string;

  textKey: string;

  emotion: TDialogueEmotion;

  nextNodeId?: string;

  conditions?: IGameConditionGroup;

  effects?: TGameEffect[];
}

export interface IDialogueChoiceOption {
  id: string;

  textKey: string;

  nextNodeId?: string;

  effects?: TGameEffect[];

  conditions?: IGameConditionGroup;
}

export interface IDialogueChoiceNode {
  id: string;

  type: "choice";

  choiceId: string;

  options: IDialogueChoiceOption[];

  nextNodeId?: string;

  conditions?: IGameConditionGroup;

  effects?: TGameEffect[];
}

export type TDialogueNode = IDialogueLineNode | IDialogueChoiceNode;

export interface IDialogue {
  id: string;

  npcId: string;

  startNodeId: string;

  nodes: Record<string, TDialogueNode>;

  completionEffects?: TGameEffect[];
}
