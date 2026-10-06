import type { IItem } from "./item";

export interface IContainerItem {
  item: IItem;
  quantity: number;
}

export type TContainerContent = IContainerItem[];
