export interface IWorldObjectRuntimeState {
  isOpen?: boolean;
  removedItemIds?: string[];
  isCollected?: boolean;
}

export interface ILocationRuntimeState {
  objects: Record<string, IWorldObjectRuntimeState>;
}

export interface IWorldRuntimeState {
  locations: Record<string, ILocationRuntimeState>;
}
