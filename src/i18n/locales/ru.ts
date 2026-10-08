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
} as const;
