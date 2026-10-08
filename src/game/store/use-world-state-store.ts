import { create } from "zustand";

import type {
  ILocationRuntimeState,
  IWorldObjectRuntimeState,
  IWorldRuntimeState,
} from "../world/world-state";

interface IWorldStateStore {
  world: IWorldRuntimeState;

  getLocationState: (locationId: string) => ILocationRuntimeState | undefined;

  getObjectState: (
    locationId: string,
    objectId: string,
  ) => IWorldObjectRuntimeState | undefined;

  setWorld: (world: IWorldRuntimeState) => void;

  setObjectState: (
    locationId: string,
    objectId: string,
    state: IWorldObjectRuntimeState,
  ) => void;

  patchObjectState: (
    locationId: string,
    objectId: string,
    state: Partial<IWorldObjectRuntimeState>,
  ) => void;

  resetWorld: () => void;
}

const createEmptyWorldState = (): IWorldRuntimeState => ({
  locations: {},
});

export const useWorldStateStore = create<IWorldStateStore>((set, get) => ({
  world: createEmptyWorldState(),

  getLocationState: (locationId) => {
    return get().world.locations[locationId];
  },

  getObjectState: (locationId, objectId) => {
    return get().world.locations[locationId]?.objects[objectId];
  },

  setWorld: (world) => {
    set({
      world: structuredClone(world),
    });
  },

  setObjectState: (locationId, objectId, state) => {
    set((currentState) => {
      const currentLocation = currentState.world.locations[locationId];

      return {
        world: {
          ...currentState.world,

          locations: {
            ...currentState.world.locations,

            [locationId]: {
              objects: {
                ...currentLocation?.objects,

                [objectId]: {
                  ...state,
                },
              },
            },
          },
        },
      };
    });
  },

  patchObjectState: (locationId, objectId, state) => {
    set((currentState) => {
      const currentLocation = currentState.world.locations[locationId];

      const currentObject = currentLocation?.objects[objectId];

      return {
        world: {
          ...currentState.world,

          locations: {
            ...currentState.world.locations,

            [locationId]: {
              objects: {
                ...currentLocation?.objects,

                [objectId]: {
                  ...currentObject,
                  ...state,
                },
              },
            },
          },
        },
      };
    });
  },

  resetWorld: () => {
    set({
      world: createEmptyWorldState(),
    });
  },
}));
