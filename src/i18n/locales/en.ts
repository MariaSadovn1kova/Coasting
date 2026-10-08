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
} as const;
