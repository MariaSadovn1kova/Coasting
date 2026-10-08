import { useTranslation } from "react-i18next";

import type { TSaveSlot } from "../../../game/save/save-slot";

import { useGameEngineStore } from "../../../game/store/use-game-engine-store";
import { useSaveMenuStore } from "../../../game/store/use-save-menu-store";
import { useSaveSlotsStore } from "../../../game/store/use-save-slots-store";

import { useSaveSlots } from "./use-save-slots";

import "./save-menu.css";

export function SaveMenu() {
  const { t } = useTranslation();

  const engine = useGameEngineStore((state) => state.engine);

  const isOpen = useSaveMenuStore((state) => state.isOpen);

  const mode = useSaveMenuStore((state) => state.mode);

  const closeSaveMenu = useSaveMenuStore((state) => state.closeSaveMenu);

  const slots = useSaveSlotsStore((state) => state.slots);

  const isLoading = useSaveSlotsStore((state) => state.isLoading);

  const updateSlot = useSaveSlotsStore((state) => state.updateSlot);

  useSaveSlots(isOpen);

  if (!isOpen) {
    return null;
  }

  const handleSlotClick = async (slot: TSaveSlot, exists: boolean) => {
    if (!engine) {
      return;
    }

    try {
      if (mode === "save") {
        const saveData = await engine.saveGame(slot);

        if (!saveData) {
          return;
        }

        updateSlot(slot, {
          exists: true,
          isCorrupted: false,
          updatedAt: saveData.updatedAt,
          locationId: saveData.player.locationId,
        });

        closeSaveMenu();

        return;
      }

      if (!exists) {
        return;
      }

      const loaded = await engine.loadGame(slot);

      if (loaded) {
        closeSaveMenu();
      }
    } catch (error) {
      console.error("Failed to process save slot", error);
    }
  };

  return (
    <div className="save-menu-overlay">
      <section className="save-menu">
        <header className="save-menu__header">
          <h2 className="save-menu__title">
            {mode === "save"
              ? t("saveMenu.saveTitle")
              : t("saveMenu.loadTitle")}
          </h2>

          <button
            type="button"
            className="save-menu__close"
            onClick={closeSaveMenu}
            aria-label={t("common.close")}
          >
            ×
          </button>
        </header>

        {isLoading ? (
          <p className="save-menu__loading">{t("saveMenu.loading")}</p>
        ) : (
          <div className="save-menu__slots">
            {slots.map((slot) => {
              const isDisabled =
                mode === "load" && (!slot.exists || slot.isCorrupted);

              const description = slot.isCorrupted
                ? t("saveMenu.corrupted")
                : slot.exists
                  ? slot.locationId
                  : t("saveMenu.empty");

              return (
                <button
                  key={slot.slot}
                  type="button"
                  className="save-menu__slot"
                  disabled={isDisabled}
                  onClick={() => handleSlotClick(slot.slot, slot.exists)}
                >
                  <div className="save-menu__slot-content">
                    <strong className="save-menu__slot-title">
                      {t("saveMenu.slot", {
                        slot: slot.slot,
                      })}
                    </strong>

                    <div
                      className={[
                        "save-menu__slot-description",
                        slot.isCorrupted
                          ? "save-menu__slot-description--corrupted"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {description}
                    </div>
                  </div>

                  {slot.exists && !slot.isCorrupted && slot.updatedAt && (
                    <span className="save-menu__slot-date">
                      {new Date(slot.updatedAt).toLocaleString()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
