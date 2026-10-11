export const GAME_CONFIG = {
  viewport: {
    width: 1280,
    height: 720,
  },

  camera: {
    zoom: 1.5,

    deadZone: {
      width: 0.45,
      height: 0.4,
    },
  },

  tile: {
    width: 64,
    height: 32,
  },

  player: {
    moveSpeed: 3,
  },
} as const;
