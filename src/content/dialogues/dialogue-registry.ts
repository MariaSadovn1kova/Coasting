import type { IDialogue } from "../../game/dialogue/dialogue";

import {
  lunaAfterComfortDialogue,
  lunaAfterLeaveDialogue,
} from "./luna-follow-ups";
import { lunaIntroductionDialogue } from "./luna-introduction";

import { lunaRepeatDialogue } from "./luna-repeat";

const dialogues: IDialogue[] = [
  lunaIntroductionDialogue,
  lunaAfterComfortDialogue,
  lunaAfterLeaveDialogue,
  lunaRepeatDialogue,
];

const dialogueRegistry = new Map(
  dialogues.map((dialogue) => [dialogue.id, dialogue]),
);

export function getDialogueById(dialogueId: string): IDialogue | null {
  return dialogueRegistry.get(dialogueId) ?? null;
}
