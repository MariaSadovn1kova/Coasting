import type { IWorldObject } from "../../game/world/world-object";

export const testChest: IWorldObject = {
  id: "test-chest",

  type: "interactive",
  interactionAction: "open-container",

  position: {
    x: 6,
    y: 4,
  },

  blocksMovement: true,
};
