import type { ILocation } from "../../game/world/location";

import { lunaWorldObject } from "../objects/luna-world-object";
import { testChest } from "../objects/test-chest";

export const testRoom: ILocation = {
  id: "test-room",

  nameKey: "locations.testRoom.name",

  width: 10,
  height: 10,

  spawn: {
    x: 4,
    y: 4,
  },

  blockedTiles: [
    {
      x: 2,
      y: 2,
    },
    {
      x: 3,
      y: 2,
    },
    {
      x: 4,
      y: 2,
    },
    {
      x: 5,
      y: 2,
    },
  ],

  objects: [testChest, lunaWorldObject],
};
