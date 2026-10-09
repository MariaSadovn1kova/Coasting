import type { IDialogue } from "../../game/dialogue/dialogue";

export const lunaRepeatDialogue: IDialogue = {
  id: "luna-repeat",

  npcId: "luna",

  startNodeId: "start",

  nodes: {
    start: {
      id: "start",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaRepeat.start",

      emotion: "neutral",

      nextNodeId: null,
    },
  },
};
