import type { IPickupWorldObject } from "../../game/world/world-object";

import { lunaBrokenPendantItem } from "../items/luna-broken-pendant";

export const lunaBrokenPendant: IPickupWorldObject = {
  id: "luna-broken-pendant",

  type: "interactive",

  interactionAction: "pickup",

  position: {
    x: 6,
    y: 6,
  },

  item: lunaBrokenPendantItem,

  quantity: 1,

  blocksMovement: false,

  effects: [
    {
      type: "set-fact",
      key: "luna.pendant-found",
      value: true,
    },
  ],
};
