import type { ITransitionWorldObject } from "../../game/world/world-object";

export const hallwayDoor: ITransitionWorldObject = {
  id: "hallway-door",

  type: "interactive",

  interactionAction: "transition",

  position: {
    x: 2,
    y: 11,
  },

  wallSide: "left",

  blocksMovement: true,

  targetLocationId: "test-room",

  targetPosition: {
    x: 5,
    y: 1,
  },
};
