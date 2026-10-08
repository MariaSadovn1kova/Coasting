import { create } from "zustand";

import type { TSaveSlot } from "../save/save-slot";

export interface ISaveSlotInfo {
  slot: TSaveSlot;

  exists: boolean;
  isCorrupted: boolean;

  updatedAt: string | null;
  locationId: string | null;
}

interface ISaveSlotsState {
  slots: ISaveSlotInfo[];

  isLoading: boolean;

  setSlots: (slots: ISaveSlotInfo[]) => void;

  setLoading: (isLoading: boolean) => void;

  updateSlot: (slot: TSaveSlot, data: Partial<ISaveSlotInfo>) => void;
}

const initialSlots: ISaveSlotInfo[] = [
  {
    slot: 1,
    exists: false,
    isCorrupted: false,
    updatedAt: null,
    locationId: null,
  },
  {
    slot: 2,
    exists: false,
    isCorrupted: false,
    updatedAt: null,
    locationId: null,
  },
  {
    slot: 3,
    exists: false,
    isCorrupted: false,
    updatedAt: null,
    locationId: null,
  },
];

export const useSaveSlotsStore = create<ISaveSlotsState>((set) => ({
  slots: initialSlots,

  isLoading: false,

  setSlots: (slots) => {
    set({
      slots,
    });
  },

  setLoading: (isLoading) => {
    set({
      isLoading,
    });
  },

  updateSlot: (slot, data) => {
    set((state) => ({
      slots: state.slots.map((currentSlot) =>
        currentSlot.slot === slot
          ? {
              ...currentSlot,
              ...data,
            }
          : currentSlot,
      ),
    }));
  },
}));
