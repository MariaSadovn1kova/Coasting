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

      conditions: {
        none: [
          {
            type: "fact",

            key: "luna.opened-up",

            equals: true,
          },
        ],
      },

      nextNodeId: "opened-up-start",
    },

    "opened-up-start": {
      id: "opened-up-start",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaRepeat.openedUpStart",

      emotion: "happy",

      conditions: {
        all: [
          {
            type: "fact",

            key: "luna.opened-up",

            equals: true,
          },
        ],
      },

      nextNodeId: "reply",
    },

    reply: {
      id: "reply",

      type: "choice",

      choiceId: "luna-repeat.reply",

      options: [
        {
          id: "ask-how",

          textKey: "dialogues.lunaRepeat.choices.askHow",

          nextNodeId: "ask-how-result",
        },

        {
          id: "talk",

          textKey: "dialogues.lunaRepeat.choices.talk",

          conditions: {
            all: [
              {
                type: "relationship",

                npcId: "luna",

                min: 2,
              },
            ],

            none: [
              {
                type: "fact",

                key: "luna.opened-up",

                equals: true,
              },
            ],
          },

          nextNodeId: "talk-result",

          effects: [
            {
              type: "change-relationship",

              npcId: "luna",

              amount: 1,
            },

            {
              type: "set-fact",

              key: "luna.opened-up",

              value: true,
            },
          ],
        },

        {
          id: "leave",

          textKey: "dialogues.lunaRepeat.choices.leave",

          nextNodeId: "leave-result",
        },
      ],
    },

    "ask-how-result": {
      id: "ask-how-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaRepeat.askHowResult",

      emotion: "neutral",
    },

    "talk-result": {
      id: "talk-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaRepeat.talkResult",

      emotion: "happy",
    },

    "leave-result": {
      id: "leave-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaRepeat.leaveResult",

      emotion: "neutral",
    },
  },
};
