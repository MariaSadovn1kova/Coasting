import type { ILocation } from "../../game/world/location";

import { lunaWorldObject } from "../objects/luna-world-object";
import { testChest } from "../objects/test-chest";

import { createRoomWalls } from "../../game/world/create-room-walls";

const ROOM_WIDTH = 20;
const ROOM_HEIGHT = 20;

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

  objects: [testChest, lunaWorldObject],
};
