import type { TContainerContent } from "../inventory/container-content";

import type { IWorldObject } from "./world-object";
import type { IWorldObjectState } from "./world-object-state";

import type { IWorldObjectView } from "./create-world-object-view";

interface IWorldObjectControllerParams {
  object: IWorldObject;
  view: IWorldObjectView;
}

export class WorldObjectController {
  private object: IWorldObject;
  private view: IWorldObjectView;

  private state: IWorldObjectState;

  private contents: TContainerContent = [];

  constructor({ object, view }: IWorldObjectControllerParams) {
    this.object = object;
    this.view = view;

    this.state = {
      isOpen: false,
    };

    if (
      object.type === "interactive" &&
      object.interactionAction === "open-container"
    ) {
      this.contents = object.contents.map((entry) => ({
        ...entry,
      }));
    }

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

  takeAllContents() {
    const contents = this.getContents();

    this.contents = [];

    return contents;
  }
}
