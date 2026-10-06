export type TItemType = "consumable" | "quest" | "equipment" | "misc";

export interface IItem {
  id: string;

  nameKey: string;
  descriptionKey: string;

  type: TItemType;

  stackable: boolean;
  maxStack: number;
}
