export const ru = {
  common: {
    back: "Назад",
    continue: "Продолжить",
  },

  mainMenu: {
    title: "Coasting",

    newGame: "Новая игра",
    continueGame: "Продолжить",
    loadGame: "Загрузить игру",
    settings: "Настройки",
    exit: "Выйти",
  },

  game: {
    placeholderTitle: "Игровая сцена",
    placeholderDescription: "Здесь скоро появится изометрический мир.",
    backToMenu: "Вернуться в меню",
  },

  locations: {
    testRoom: {
      name: "Тестовая комната",
    },
  },

  items: {
    oldKey: {
      name: "Старый ключ",
      description: "Потёртый ключ неизвестно от какого замка.",
    },
  },

  inventory: {
    title: "Инвентарь",
    empty: "Инвентарь пуст.",
  },

  container: {
    title: "Содержимое",
    empty: "Контейнер пуст.",
    take: "Взять",
    takeAll: "Взять всё",
  },

  saveMenu: {
    saveTitle: "Сохранить игру",
    loadTitle: "Загрузить игру",
    loading: "Загрузка сохранений...",
    slot: "Слот {{slot}}",
    empty: "Пустой слот",
    corrupted: "Повреждённое сохранение",
  },

  characters: {
    luna: {
      name: "Луна",
    },
  },

  dialogues: {
    lunaIntroduction: {
      start: "Ты всё-таки подошёл... Я думала, просто пройдёшь мимо.",

      sad: "Не обращай внимания. Сегодня просто не самый лучший день.",

      choices: {
        comfort: "Хочешь рассказать, что случилось?",

        leaveAlone: "Хорошо. Я оставлю тебя одну.",
      },

      comfortResult:
        "Спасибо. Может быть... когда-нибудь я действительно расскажу.",

      leaveResult: "Да. Наверное, так будет лучше.",
    },

    lunaAfterComfort: {
      start: "Ты снова пришёл... Спасибо, что тогда не отвернулся.",
    },

    lunaAfterLeave: {
      start: "Ты снова здесь. Я думала, ты предпочтёшь держаться подальше.",
    },

    lunaRepeat: {
      start:
        "Мы уже поговорили обо всём важном... Но я не против, если ты просто побудешь рядом.",
    },
  },
} as const;
