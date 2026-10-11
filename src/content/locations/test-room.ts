import type { ILocation } from "../../game/world/location";

import { lunaWorldObject } from "../objects/luna-world-object";
import { testChest } from "../objects/test-chest";
import { testRoomDoor } from "../objects/test-room-door";

import { createRoomWalls } from "../../game/world/create-room-walls";

const ROOM_WIDTH = 15;
const ROOM_HEIGHT = 15;

export const testRoom: ILocation = {
  id: "test-room",

  nameKey: "locations.testRoom.name",

  width: ROOM_WIDTH,
  height: ROOM_HEIGHT,

  spawn: {
    x: 4,
    y: 4,
  },

  blockedTiles: [
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
  ],

  walls: createRoomWalls({
    width: ROOM_WIDTH,
    height: ROOM_HEIGHT,

    wallHeight: 64,

    openings: [
      {
        side: "right",
        index: 5,
      },
    ],
  }),

  objects: [testChest, lunaWorldObject, testRoomDoor],

  floor: {
    /*
     * БАЗОВЫЙ ПОЛ
     *
     * Один JPG непрерывно покрывает
     * всю комнату.
     */
    base: {
      src: "/assets/textures/floors/marble.jpg",

      mode: "continuous",

      /*
       * JPG повторится несколько раз
       * по всей комнате.
       */
      repeatX: 5,
      repeatY: 5,

      /*
       * Можно менять визуальный
       * размер рисунка.
       */
      scale: 1,

      /*
       * Поворот в градусах.
       */
      rotation: 0,

      /*
       * UV-сдвиг.
       */
      offsetX: 0,
      offsetY: 0,

      alpha: 1,
    },

    layers: [
      /*
       * БОЛЬШОЙ УЗОР
       *
       * Один JPG натягивается
       * непрерывно только на
       * выбранную область.
       */
      {
        id: "carpet",

        regions: [
          {
            from: {
              x: 2,
              y: 2,
            },

            to: {
              x: 7,
              y: 6,
            },

            texture: {
              src: "/assets/textures/floors/marble.jpg",

              mode: "continuous",

              scale: 1,

              rotation: 0,

              offsetX: 0,
              offsetY: 0,

              repeatX: 1,
              repeatY: 1,

              alpha: 1,

              blendMode: "normal",
            },
          },
        ],
      },

      /*
       * ГРЯЗЬ
       *
       * Ещё один continuous JPG
       * поверх части пола.
       *
       * Multiply хорошо подходит
       * для тёмных загрязнений.
       */
      {
        id: "dirt",

        regions: [
          {
            from: {
              x: 4,
              y: 4,
            },

            to: {
              x: 8,
              y: 8,
            },

            texture: {
              src: "/assets/textures/floors/marble.jpg",

              mode: "continuous",

              repeatX: 2,
              repeatY: 2,

              scale: 1.2,

              rotation: 15,

              offsetX: 0.1,
              offsetY: -0.05,

              alpha: 0.55,

              blendMode: "multiply",
            },
          },
        ],
      },

      /*
       * ОСВЕЩЕНИЕ
       *
       * Этот слой занимает
       * всю комнату.
       */
      {
        id: "light",

        texture: {
          src: "/assets/textures/floors/marble.jpg",

          mode: "continuous",

          scale: 1,

          repeatX: 1,
          repeatY: 1,

          rotation: 0,

          offsetX: 0,
          offsetY: 0,

          alpha: 0.25,

          blendMode: "screen",
        },
      },

      {
        id: "damaged-tiles",

        tiles: [
          {
            position: {
              x: 1,
              y: 1,
            },

            texture: {
              src: "/assets/textures/floors/marble.jpg",

              mode: "tile",

              scale: 1,

              rotation: 0,

              alpha: 0.8,

              blendMode: "multiply",
            },
          },

          {
            position: {
              x: 1,
              y: 2,
            },

            texture: {
              src: "/assets/textures/floors/marble.jpg",

              mode: "tile",

              scale: 1.3,

              rotation: 90,

              offsetX: 0.05,

              alpha: 0.65,

              blendMode: "multiply",
            },
          },

          {
            position: {
              x: 2,
              y: 1,
            },

            texture: {
              src: "/assets/textures/floors/marble.jpg",

              mode: "tile",

              scale: 0.8,

              rotation: 180,

              alpha: 0.5,

              blendMode: "multiply",
            },
          },
        ],
      },
    ],
  },
};
