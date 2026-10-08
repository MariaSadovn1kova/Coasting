import type { IContainerItem } from "./container-content";

export class InventoryController {
  private items: IContainerItem[] = [];

  getItems() {
    return this.items.map((entry) => ({
      ...entry,
    }));
  }

  setItems(items: IContainerItem[]) {
    this.items = items.map((entry) => ({
      ...entry,
    }));
  }

  clear() {
    this.items = [];
  }

  addItem(entry: IContainerItem) {
    const existingItem = this.items.find(
      (item) => item.item.id === entry.item.id,
    );

    if (existingItem && entry.item.stackable) {
      existingItem.quantity = Math.min(
        existingItem.quantity + entry.quantity,
        entry.item.maxStack,
      );

      return;
    }

    this.items.push({
      ...entry,
    });
  }

  addItems(items: IContainerItem[]) {
    items.forEach((item) => {
      this.addItem(item);
    });
  }

  hasItem(itemId: string) {
    return this.items.some((entry) => entry.item.id === itemId);
  }

  getItemQuantity(itemId: string) {
    const entry = this.items.find((item) => item.item.id === itemId);

    return entry?.quantity ?? 0;
  }
}
