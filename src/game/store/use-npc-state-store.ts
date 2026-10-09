import { create } from "zustand";

import type { INpcRuntimeState, TNpcRuntimeStateMap } from "../npc/npc-state";

interface INpcStateStore {
  npcs: TNpcRuntimeStateMap;

  getNpcState: (npcId: string) => INpcRuntimeState | undefined;

  initializeNpc: (npcId: string, initialRelationship: number) => void;

  setRelationship: (npcId: string, value: number) => void;

  changeRelationship: (npcId: string, amount: number) => void;

  setChoice: (npcId: string, choiceId: string, optionId: string) => void;

  completeDialogue: (npcId: string, dialogueId: string) => void;

  setFlag: (npcId: string, flagId: string, value: boolean) => void;

  setNpcState: (npcId: string, state: INpcRuntimeState) => void;

  setNpcStates: (npcs: TNpcRuntimeStateMap) => void;

  resetNpcStates: () => void;
}

export const useNpcStateStore = create<INpcStateStore>((set, get) => ({
  npcs: {},

  getNpcState: (npcId) => {
    return get().npcs[npcId];
  },

  initializeNpc: (npcId, initialRelationship) => {
    set((state) => {
      if (state.npcs[npcId]) {
        return state;
      }

      return {
        npcs: {
          ...state.npcs,

          [npcId]: {
            relationship: initialRelationship,

            choices: {},

            completedDialogues: [],

            flags: {},
          },
        },
      };
    });
  },

  setRelationship: (npcId, value) => {
    set((state) => {
      const npc = state.npcs[npcId];

      if (!npc) {
        return state;
      }

      return {
        npcs: {
          ...state.npcs,

          [npcId]: {
            ...npc,
            relationship: value,
          },
        },
      };
    });
  },

  changeRelationship: (npcId, amount) => {
    set((state) => {
      const npc = state.npcs[npcId];

      if (!npc) {
        return state;
      }

      return {
        npcs: {
          ...state.npcs,

          [npcId]: {
            ...npc,

            relationship: npc.relationship + amount,
          },
        },
      };
    });
  },

  setChoice: (npcId, choiceId, optionId) => {
    set((state) => {
      const npc = state.npcs[npcId];

      if (!npc) {
        return state;
      }

      return {
        npcs: {
          ...state.npcs,

          [npcId]: {
            ...npc,

            choices: {
              ...npc.choices,

              [choiceId]: optionId,
            },
          },
        },
      };
    });
  },

  completeDialogue: (npcId, dialogueId) => {
    set((state) => {
      const npc = state.npcs[npcId];

      if (!npc) {
        return state;
      }

      if (npc.completedDialogues.includes(dialogueId)) {
        return state;
      }

      return {
        npcs: {
          ...state.npcs,

          [npcId]: {
            ...npc,

            completedDialogues: [...npc.completedDialogues, dialogueId],
          },
        },
      };
    });
  },

  setFlag: (npcId, flagId, value) => {
    set((state) => {
      const npc = state.npcs[npcId];

      if (!npc) {
        return state;
      }

      return {
        npcs: {
          ...state.npcs,

          [npcId]: {
            ...npc,

            flags: {
              ...npc.flags,

              [flagId]: value,
            },
          },
        },
      };
    });
  },

  setNpcState: (npcId, npcState) => {
    set((state) => ({
      npcs: {
        ...state.npcs,

        [npcId]: structuredClone(npcState),
      },
    }));
  },

  setNpcStates: (npcs) => {
    set({
      npcs: structuredClone(npcs),
    });
  },

  resetNpcStates: () => {
    set({
      npcs: {},
    });
  },
}));
