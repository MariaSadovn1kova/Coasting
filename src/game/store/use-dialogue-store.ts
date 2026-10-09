import { create } from "zustand";

import { gamePauseController } from "../core/game-pause-controller";

import type { DialogueController } from "../dialogue/dialogue-controller";
import type { TDialogueNode } from "../dialogue/dialogue";

interface IDialogueState {
  isOpen: boolean;

  npcId: string | null;
  dialogueId: string | null;

  currentNode: TDialogueNode | null;

  controller: DialogueController | null;

  openDialogue: (
    npcId: string,
    dialogueId: string,
    controller: DialogueController,
  ) => void;

  refreshNode: () => void;

  closeDialogue: () => void;
}

export const useDialogueStore = create<IDialogueState>((set, get) => ({
  isOpen: false,

  npcId: null,
  dialogueId: null,

  currentNode: null,

  controller: null,

  openDialogue: (npcId, dialogueId, controller) => {
    gamePauseController.pause("dialogue");

    set({
      isOpen: true,

      npcId,
      dialogueId,

      controller,

      currentNode: controller.getCurrentNode(),
    });
  },

  refreshNode: () => {
    const controller = get().controller;

    if (!controller) {
      return;
    }

    set({
      currentNode: controller.getCurrentNode(),
    });
  },

  closeDialogue: () => {
    gamePauseController.resume("dialogue");

    set({
      isOpen: false,

      npcId: null,
      dialogueId: null,

      currentNode: null,

      controller: null,
    });
  },
}));
