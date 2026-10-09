import type { IDialogue } from "../../game/dialogue/dialogue";

export const lunaAfterComfortDialogue: IDialogue = {
  id: "luna-after-comfort",

  npcId: "luna",

  startNodeId: "start",

  nodes: {
    start: {
      id: "start",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaAfterComfort.start",

      emotion: "neutral",

      nextNodeId: null,
    },
  },
};

export const lunaAfterLeaveDialogue: IDialogue = {
  id: "luna-after-leave",

  npcId: "luna",

  startNodeId: "start",

  nodes: {
    start: {
      id: "start",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaAfterLeave.start",

      emotion: "sad",

      nextNodeId: null,
    },
  },
};
