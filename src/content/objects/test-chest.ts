import { oldKey } from "../items/old-key";

import type { IContainerWorldObject } from "../../game/world/world-object";

export const testChest: IContainerWorldObject = {
  id: "test-chest",

  type: "interactive",
  interactionAction: "open-container",

  position: {
    x: 6,
    y: 4,
  },

  blocksMovement: true,

  contents: [
    {
      item: oldKey,
      quantity: 1,
    },
  ],
};
