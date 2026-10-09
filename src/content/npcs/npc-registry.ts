import type { INpc } from "../../game/npc/npc";

import { luna } from "./luna";

const npcs: INpc[] = [luna];

const npcRegistry = new Map(npcs.map((npc) => [npc.id, npc]));

export function getNpcById(npcId: string): INpc | null {
  return npcRegistry.get(npcId) ?? null;
}
