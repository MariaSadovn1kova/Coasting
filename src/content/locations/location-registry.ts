import type { ILocation } from "../../game/world/location";

import { hallway } from "./hallway";
import { testRoom } from "./test-room";

const locations: Record<string, ILocation> = {
  [testRoom.id]: testRoom,
  [hallway.id]: hallway,
};

export function getLocationById(locationId: string) {
  return locations[locationId] ?? null;
}
