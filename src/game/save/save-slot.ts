export const saveSlots = [1, 2, 3] as const;

export type TSaveSlot = (typeof saveSlots)[number];

export function getSaveFileName(slot: TSaveSlot) {
  return `save-${slot}.json`;
}
