export const en = {
  startup: {
    studioAlt: "Studio logo",
    studioName: "Studio Name",

    disclaimer: {
      title: "Warning",

      paragraph1:
        "Coasting is a non-commercial amateur project currently under development.",

      paragraph2:
        "The software is provided as is. Although the application is not intended to make system-level changes or affect the operation of your device, software errors cannot be completely ruled out.",

      paragraph3:
        "It is recommended not to use experimental builds on devices containing critical data without proper backups.",

      paragraph4:
        "By continuing, you confirm that you understand the experimental nature of the current version.",

      continue: "Continue",
    },
  },

  common: {
    back: "Back",
    continue: "Continue",
    you: "You",
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

    lunaBrokenPendant: {
      name: "Luna's Broken Pendant",
      description:
        "A small damaged pendant. It seems to have belonged to Luna.",
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

  interaction: {
    interact: "Interact",
    talk: "Talk",
    open: "Open",
    enter: "Enter",
    inspect: "Inspect",
    pickup: "Pickup",
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

    lunaPendant: {
      playerQuestion: "Does this happen to be yours?",
      lunaSurprised: "Wait... Where did you find this?",
      lunaThanks: "I thought I'd lost it forever. Thank you.",
    },

    choices: {
      comfort: "Don't worry. I'm here.",
      leaveAlone: "You probably need some time alone.",
      close: "You can tell me everything, if you want.",
    },

    lunaAfterIntroduction: {
      start: "You're here again.",
      choices: {
        askHow: "How are you feeling?",
        talk: "If you want to talk, I can listen.",
        leave: "I won't bother you.",
      },
      askHowResult: "Better. I think.",
      talkResult:
        "Thank you. It's still hard for me to talk about it... but I'll try.",
      leaveResult: "Alright. See you later.",
    },

    openedUpStart: "Hi. I'm glad you came back.",

    closeResult: "Thank you... I actually feel a little better now.",
  },
} as const;
