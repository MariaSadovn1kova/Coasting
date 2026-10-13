import type { ILocation } from "../../game/world/location";

import { createRoomWalls } from "../../game/world/create-room-walls";

import { hallwayDoor } from "../objects/hallway-door";
import { lunaBrokenPendant } from "../objects/luna-broken-pendant";

const ROOM_WIDTH = 12;
const ROOM_HEIGHT = 12;

export const hallway: ILocation = {
  id: "hallway",

  nameKey: "locations.hallway.name",

  width: ROOM_WIDTH,

  height: ROOM_HEIGHT,

  spawn: {
    x: 2,
    y: 8,
  },

  blockedTiles: [],

  walls: createRoomWalls({
    width: ROOM_WIDTH,

    height: ROOM_HEIGHT,

    wallHeight: 64,

    openings: [
      {
        side: "left",
        index: 2,
      },
    ],
  }),

  objects: [hallwayDoor, lunaBrokenPendant],

  objectVisibility: {
    [lunaBrokenPendant.id]: {
      all: [
        {
          type: "fact",

          key: "luna.left-alone",

          equals: true,
        },
      ],
    },
  },

  floor: {
    base: {
      src: "/assets/textures/floors/marble.jpg",

      mode: "continuous",

      repeatX: 4,

      repeatY: 4,
    },

    layers: [],
  },
};
