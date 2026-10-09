import type { ITalkWorldObject } from "../../game/world/world-object";

import { luna } from "../npcs/luna";

export const lunaWorldObject: ITalkWorldObject = {
  id: "luna",

  type: "interactive",

  interactionAction: "talk",

  npcId: luna.id,

  position: {
    ...luna.position,
  },

  blocksMovement: true,
};
