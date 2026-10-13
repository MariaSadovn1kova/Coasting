import type { INpc } from "../../game/npc/npc";

export const luna: INpc = {
  id: "luna",

  nameKey: "characters.luna.name",

  position: {
    x: 6,
    y: 6,
  },

  portraits: {
    neutral: "/assets/characters/luna/luna-neutral.jpg",

    sad: "/assets/characters/luna/luna-sad.jpg",
  },

  speechSound: "/assets/audio/voices/luna-speech.mp3",

  initialDialogueId: "luna-introduction",

  dialogueRules: [
    {
      dialogueId: "luna-pendant",

      gameConditions: {
        all: [
          {
            type: "fact",
            key: "luna.pendant-found",
            equals: true,
          },
        ],

        none: [
          {
            type: "fact",
            key: "luna.pendant-discussed",
            equals: true,
          },
        ],
      },
    },

    {
      dialogueId: "luna-after-introduction",

      conditions: [
        {
          completedDialogueId: "luna-introduction",
        },
      ],
    },

    {
      dialogueId: "luna-after-comfort",

      conditions: [
        {
          completedDialogueId: "luna-introduction",
        },

        {
          notCompletedDialogueId: "luna-after-comfort",
        },

        {
          choice: {
            choiceId: "luna-introduction.reply",

            optionId: "comfort",
          },
        },
      ],
    },

    {
      dialogueId: "luna-after-leave",

      conditions: [
        {
          completedDialogueId: "luna-introduction",
        },

        {
          notCompletedDialogueId: "luna-after-leave",
        },

        {
          choice: {
            choiceId: "luna-introduction.reply",

            optionId: "leave-alone",
          },
        },
      ],
    },

    {
      dialogueId: "luna-repeat",

      conditions: [
        {
          completedDialogueId: "luna-introduction",
        },
      ],
    },
  ],

  initialRelationship: 0,
};
