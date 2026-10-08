import type {
  IContainerItem,
  TContainerContent,
} from "../inventory/container-content";

import type { IWorldObjectView } from "./create-world-object-view";
import type { IWorldObject } from "./world-object";
import type { IWorldObjectRuntimeState } from "./world-state";
import type { IWorldObjectState } from "./world-object-state";

interface IWorldObjectControllerParams {
  object: IWorldObject;
  view: IWorldObjectView;
  runtimeState?: IWorldObjectRuntimeState;
}

export class WorldObjectController {
  private object: IWorldObject;
  private view: IWorldObjectView;

  private state: IWorldObjectState;

  private contents: TContainerContent = [];

  constructor({ object, view, runtimeState }: IWorldObjectControllerParams) {
    this.object = object;
    this.view = view;

    this.state = {
      isOpen: false,
    };

    this.applyRuntimeState(runtimeState);

    this.view.setOpen(this.state.isOpen);
  }

  getObject() {
    return this.object;
  }

  getState() {
    return {
      ...this.state,
    };
  }

  getContents() {
    return this.contents.map((entry) => ({
      ...entry,
    }));
  }

  isOpen() {
    return this.state.isOpen;
  }

  isEmpty() {
    return this.contents.length === 0;
  }

  open() {
    if (this.state.isOpen) {
      return false;
    }

    this.state.isOpen = true;

    this.view.setOpen(true);

    return true;
  }

  applyRuntimeState(runtimeState?: IWorldObjectRuntimeState) {
    this.state = {
      isOpen: runtimeState?.isOpen ?? false,
    };

    if (
      this.object.type === "interactive" &&
      this.object.interactionAction === "open-container"
    ) {
      const removedItemIds = runtimeState?.removedItemIds ?? [];

      this.contents = this.object.contents
        .filter((entry) => !removedItemIds.includes(entry.item.id))
        .map((entry) => ({
          ...entry,
        }));
    }

    this.view.setOpen(this.state.isOpen);
  }

  takeItem(itemId: string, quantity = 1): IContainerItem | null {
    const index = this.contents.findIndex((entry) => entry.item.id === itemId);

    if (index === -1) {
      return null;
    }

    const entry = this.contents[index];

    const takenQuantity = Math.min(quantity, entry.quantity);

    const takenItem: IContainerItem = {
      item: entry.item,
      quantity: takenQuantity,
    };

    entry.quantity -= takenQuantity;

    if (entry.quantity <= 0) {
      this.contents.splice(index, 1);
    }

    return takenItem;
  }

  takeAllContents() {
    const contents = this.getContents();

    this.contents = [];

    return contents;
  }
}
