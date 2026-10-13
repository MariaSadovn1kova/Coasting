import type { ILocation } from "../../game/world/location";

import { lunaWorldObject } from "../objects/luna-world-object";
import { testChest } from "../objects/test-chest";
import { testRoomDoor } from "../objects/test-room-door";

import { createRoomWalls } from "../../game/world/create-room-walls";

const ROOM_WIDTH = 15;
const ROOM_HEIGHT = 15;

const FLOOR_TEXTURE = "/assets/textures/floors/marble.jpg";
const ORNAMENT_TEXTURE = "/assets/textures/floors/ornament.jpg";

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
    base: {
      src: FLOOR_TEXTURE,

      mode: "continuous",

      repeatX: 4,
      repeatY: 4,

      scale: 1,

      rotation: 0,

      offsetX: 0,
      offsetY: 0,

      alpha: 1,
    },

    layers: [
      {
        id: "normal-overlay",

        regions: [
          {
            from: {
              x: 1,
              y: 1,
            },

            to: {
              x: 4,
              y: 4,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 1.4,

              rotation: 0,

              offsetX: 0,
              offsetY: 0,

              alpha: 0.65,

              blendMode: "normal",
            },
          },
        ],
      },

      {
        id: "multiply-overlay",

        regions: [
          {
            from: {
              x: 5,
              y: 1,
            },

            to: {
              x: 8,
              y: 4,
            },

            texture: {
              src: ORNAMENT_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 1.4,

              rotation: 0,

              offsetX: 0,
              offsetY: 0,

              alpha: 0.65,

              blendMode: "multiply",
            },
          },
        ],
      },

      {
        id: "screen-light",

        regions: [
          {
            from: {
              x: 9,
              y: 1,
            },

            to: {
              x: 12,
              y: 4,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 1.4,

              rotation: 0,

              offsetX: 0,
              offsetY: 0,

              alpha: 0.45,

              blendMode: "screen",
            },
          },
        ],
      },

      {
        id: "add-light",

        regions: [
          {
            from: {
              x: 1,
              y: 5,
            },

            to: {
              x: 4,
              y: 8,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 1.4,

              rotation: 0,

              offsetX: 0,
              offsetY: 0,

              alpha: 0.18,

              blendMode: "add",
            },
          },
        ],
      },

      {
        id: "rotated-pattern",

        regions: [
          {
            from: {
              x: 5,
              y: 5,
            },

            to: {
              x: 8,
              y: 8,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 2,
              repeatY: 2,

              scale: 0.8,

              rotation: 45,

              offsetX: 0,
              offsetY: 0,

              alpha: 0.8,

              blendMode: "normal",
            },
          },
        ],
      },

      {
        id: "offset-pattern",

        regions: [
          {
            from: {
              x: 9,
              y: 5,
            },

            to: {
              x: 12,
              y: 8,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 2,
              repeatY: 2,

              scale: 1,

              rotation: -20,

              offsetX: 0.2,
              offsetY: -0.15,

              alpha: 0.8,

              blendMode: "normal",
            },
          },
        ],
      },

      {
        id: "multiply-dark-light",

        regions: [
          {
            from: {
              x: 1,
              y: 9,
            },

            to: {
              x: 4,
              y: 12,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 2,

              rotation: 25,

              offsetX: 0.1,
              offsetY: 0,

              alpha: 0.8,

              blendMode: "multiply",
            },
          },
        ],
      },

      {
        id: "screen-strong-light",

        regions: [
          {
            from: {
              x: 5,
              y: 9,
            },

            to: {
              x: 8,
              y: 12,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 2,

              rotation: -25,

              offsetX: -0.1,
              offsetY: 0.1,

              alpha: 0.7,

              blendMode: "screen",
            },
          },
        ],
      },

      {
        id: "add-strong-light",

        regions: [
          {
            from: {
              x: 9,
              y: 9,
            },

            to: {
              x: 12,
              y: 12,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "continuous",

              repeatX: 1,
              repeatY: 1,

              scale: 2,

              rotation: 0,

              offsetX: 0,
              offsetY: 0,

              alpha: 0.3,

              blendMode: "add",
            },
          },
        ],
      },

      {
        id: "tile-tests",

        tiles: [
          {
            position: {
              x: 13,
              y: 1,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 0,

              alpha: 1,

              blendMode: "normal",
            },
          },

          {
            position: {
              x: 13,
              y: 2,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 90,

              alpha: 1,

              blendMode: "normal",
            },
          },

          {
            position: {
              x: 13,
              y: 3,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 180,

              alpha: 1,

              blendMode: "normal",
            },
          },

          {
            position: {
              x: 13,
              y: 4,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 270,

              alpha: 1,

              blendMode: "normal",
            },
          },

          {
            position: {
              x: 13,
              y: 6,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 0.5,

              rotation: 0,

              alpha: 1,

              blendMode: "normal",
            },
          },

          {
            position: {
              x: 13,
              y: 7,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1.5,

              rotation: 0,

              alpha: 1,

              blendMode: "normal",
            },
          },

          {
            position: {
              x: 13,
              y: 9,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 0,

              alpha: 0.6,

              blendMode: "multiply",
            },
          },

          {
            position: {
              x: 13,
              y: 10,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 0,

              alpha: 0.5,

              blendMode: "screen",
            },
          },

          {
            position: {
              x: 13,
              y: 11,
            },

            texture: {
              src: FLOOR_TEXTURE,

              mode: "tile",

              scale: 1,

              rotation: 0,

              alpha: 0.2,

              blendMode: "add",
            },
          },
        ],
      },
    ],
  },
};
