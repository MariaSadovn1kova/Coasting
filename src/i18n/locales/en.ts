export const en = {
  common: {
    back: "Back",
    continue: "Continue",
  },

  mainMenu: {
    title: "Coasting",

    newGame: "New Game",
    continueGame: "Continue",
    loadGame: "Load Game",
    settings: "Settings",
    exit: "Exit",
  },

  game: {
    placeholderTitle: "Game Scene",
    placeholderDescription: "The isometric world will appear here soon.",
    backToMenu: "Back to Menu",
  },

  locations: {
    testRoom: {
      name: "Test Room",
    },
  },

  items: {
    oldKey: {
      name: "Old Key",
      description: "A worn key from an unknown lock.",
    },
  },

  inventory: {
    title: "Inventory",
    empty: "Inventory is empty.",
  },

  container: {
    title: "Contents",
    empty: "The container is empty.",
    take: "Take",
    takeAll: "Take All",
  },

  saveMenu: {
    saveTitle: "Save Game",
    loadTitle: "Load Game",
    loading: "Loading saves...",
    slot: "Slot {{slot}}",
    empty: "Empty slot",
    corrupted: "Corrupted save",
  },

  characters: {
    luna: {
      name: "Luna",
    },
  },

  dialogues: {
    lunaIntroduction: {
      start: "You actually came over... I thought you'd just walk past.",

      sad: "Don't mind me. Today just isn't the best day.",

      choices: {
        comfort: "Do you want to tell me what happened?",

        leaveAlone: "Alright. I'll leave you alone.",
      },

      comfortResult: "Thank you. Maybe... someday I'll actually tell you.",

      leaveResult: "Yeah. Maybe that's for the best.",
    },

    lunaAfterComfort: {
      start:
        "You came back... Thank you for not turning away from me last time.",
    },

    lunaAfterLeave: {
      start: "You're here again. I thought you'd rather keep your distance.",
    },

    lunaRepeat: {
      start:
        "We've already talked about the important things... But I don't mind if you just stay for a while.",
    },
  },
} as const;
