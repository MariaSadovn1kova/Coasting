import type { IGridPosition } from "../world/grid-position";

import type { INpcDialogueRule } from "./npc-dialogue";

export type TNpcEmotion = "neutral" | "happy" | "sad" | "angry" | "surprised";

export interface INpcPortraits {
  neutral: string;

  happy?: string;
  sad?: string;
  angry?: string;
  surprised?: string;
}

export interface INpc {
  id: string;

  nameKey: string;

  position: IGridPosition;

  portraits: INpcPortraits;

  speechSound: string;

  initialDialogueId: string;

  dialogueRules?: INpcDialogueRule[];

  initialRelationship: number;
}
