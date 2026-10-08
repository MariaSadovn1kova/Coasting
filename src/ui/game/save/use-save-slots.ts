import { useEffect } from "react";

import { SaveManager } from "../../../game/save/save-manager";

import { useSaveSlotsStore } from "../../../game/store/use-save-slots-store";

const saveManager = new SaveManager();

export function useSaveSlots(isEnabled: boolean) {
  const setSlots = useSaveSlotsStore((state) => state.setSlots);

  const setLoading = useSaveSlotsStore((state) => state.setLoading);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isCancelled = false;

    const loadSlots = async () => {
      setLoading(true);

      try {
        const slots = await saveManager.getSlotsInfo();

        if (isCancelled) {
          return;
        }

        setSlots(slots);
      } catch (error) {
        console.error("Failed to load save slots", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      isCancelled = true;
    };
  }, [isEnabled, setSlots, setLoading]);
}
