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

  constructor({ object, view }: IWorldObjectControllerParams) {
    this.object = object;
    this.view = view;

    this.state = {
      isOpen: false,
    };

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

  isOpen() {
    return this.state.isOpen;
  }

  open() {
    if (this.state.isOpen) {
      return false;
    }

    this.state.isOpen = true;

    this.view.setOpen(true);

    return true;
  }
}
