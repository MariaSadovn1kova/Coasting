import type { IDialogue } from "../../game/dialogue/dialogue";

export const lunaPendantDialogue: IDialogue = {
  id: "luna-pendant",

  npcId: "luna",

  startNodeId: "player-question",

  nodes: {
    "player-question": {
      id: "player-question",

      type: "line",

      speakerId: "player",

      textKey: "dialogues.lunaPendant.playerQuestion",

      emotion: "neutral",

      nextNodeId: "luna-surprised",
    },

    "luna-surprised": {
      id: "luna-surprised",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaPendant.lunaSurprised",

      emotion: "happy",

      nextNodeId: "luna-thanks",
    },

    "luna-thanks": {
      id: "luna-thanks",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaPendant.lunaThanks",

      emotion: "happy",
    },
  },

  completionEffects: [
    {
      type: "remove-item",

      itemId: "luna-broken-pendant",

      quantity: 1,
    },

    {
      type: "set-fact",

      key: "luna.pendant-discussed",

      value: true,
    },
  ],
};
