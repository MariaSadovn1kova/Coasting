import type { ITransitionWorldObject } from "../../game/world/world-object";

export const testRoomDoor: ITransitionWorldObject = {
  id: "test-room-door",

  type: "interactive",

  interactionAction: "transition",

  position: {
    x: 5,
    y: 0,
  },

  wallSide: "right",

  blocksMovement: false,

  targetLocationId: "hallway",

  targetPosition: {
    x: 2,
    y: 8,
  },
};
