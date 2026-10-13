import type { IDialogue } from "../../game/dialogue/dialogue";

export const lunaAfterIntroductionDialogue: IDialogue = {
  id: "luna-after-introduction",

  npcId: "luna",

  startNodeId: "start",

  nodes: {
    start: {
      id: "start",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaAfterIntroduction.start",

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

      textKey: "dialogues.lunaAfterIntroduction.openedUpStart",

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

      choiceId: "luna-after-introduction.reply",

      options: [
        {
          id: "ask-how",

          textKey: "dialogues.lunaAfterIntroduction.choices.askHow",

          nextNodeId: "ask-how-result",
        },

        {
          id: "talk",

          textKey: "dialogues.lunaAfterIntroduction.choices.talk",

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

          textKey: "dialogues.lunaAfterIntroduction.choices.leave",

          nextNodeId: "leave-result",
        },
      ],
    },

    "ask-how-result": {
      id: "ask-how-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaAfterIntroduction.askHowResult",

      emotion: "neutral",
    },

    "talk-result": {
      id: "talk-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaAfterIntroduction.talkResult",

      emotion: "happy",
    },

    "leave-result": {
      id: "leave-result",

      type: "line",

      speakerId: "luna",

      textKey: "dialogues.lunaAfterIntroduction.leaveResult",

      emotion: "neutral",
    },
  },
};
