import type { IDialogue } from "../../game/dialogue/dialogue";

export const lunaIntroductionDialogue: IDialogue = {
  id: "luna-introduction",

  npcId: "luna",

  startNodeId: "start",

  nodes: {
    start: {
      id: "start",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaIntroduction.start",

      emotion: "neutral",

      nextNodeId: "sad",
    },

    sad: {
      id: "sad",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaIntroduction.sad",

      emotion: "sad",

      nextNodeId: "reply",
    },

    reply: {
      id: "reply",

      type: "choice",

      choiceId: "luna-introduction.reply",

      options: [
        {
          id: "comfort",

          textKey: "dialogues.lunaIntroduction.choices.comfort",

          nextNodeId: "comfort-result",

          effects: {
            relationshipChange: 2,

            setFlags: {
              "comforted-luna": true,
            },
          },
        },

        {
          id: "leave-alone",

          textKey: "dialogues.lunaIntroduction.choices.leaveAlone",

          nextNodeId: "leave-result",

          effects: {
            relationshipChange: -1,
          },
        },
      ],
    },

    "comfort-result": {
      id: "comfort-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaIntroduction.comfortResult",

      emotion: "neutral",

      nextNodeId: null,
    },

    "leave-result": {
      id: "leave-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaIntroduction.leaveResult",

      emotion: "sad",

      nextNodeId: null,
    },
  },
};
