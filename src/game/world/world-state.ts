export interface IWorldObjectRuntimeState {
  isOpen?: boolean;
  removedItemIds?: string[];
}

export interface ILocationRuntimeState {
  objects: Record<string, IWorldObjectRuntimeState>;
}

export interface IWorldRuntimeState {
  locations: Record<string, ILocationRuntimeState>;
}
