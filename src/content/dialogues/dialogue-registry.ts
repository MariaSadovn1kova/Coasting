import type { IDialogue } from "../../game/dialogue/dialogue";

import {
  lunaAfterComfortDialogue,
  lunaAfterLeaveDialogue,
} from "./luna-follow-ups";
import { lunaIntroductionDialogue } from "./luna-introduction";

import { lunaRepeatDialogue } from "./luna-repeat";
import { lunaAfterIntroductionDialogue } from "./luna-after-introduction";
import { lunaPendantDialogue } from "./luna-pendant";

const dialogues: IDialogue[] = [
  lunaIntroductionDialogue,
  lunaAfterComfortDialogue,
  lunaAfterLeaveDialogue,
  lunaRepeatDialogue,
  lunaPendantDialogue,
  lunaAfterIntroductionDialogue,
];

const dialogueMap = new Map(
  dialogues.map((dialogue) => [dialogue.id, dialogue]),
);

export function getDialogueById(dialogueId: string): IDialogue | undefined {
  return dialogueMap.get(dialogueId);
}
