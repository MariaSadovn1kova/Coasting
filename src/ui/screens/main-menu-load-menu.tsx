import { useTranslation } from "react-i18next";

import type { TSaveSlot } from "../../game/save/save-slot";

import { useAppStore } from "../../app/store/use-app-store";

import { usePendingLoadStore } from "../../game/store/use-pending-load-store";
import { useSaveSlotsStore } from "../../game/store/use-save-slots-store";

import { useSaveSlots } from "../game/save/use-save-slots";

import "./main-menu-load-menu.css";

interface IMainMenuLoadMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MainMenuLoadMenu({ isOpen, onClose }: IMainMenuLoadMenuProps) {
  const { t } = useTranslation();

  useSaveSlots(isOpen);

  const setScreen = useAppStore((state) => state.setScreen);

  const setPendingLoad = usePendingLoadStore((state) => state.setPendingLoad);

  const slots = useSaveSlotsStore((state) => state.slots);

  const isLoading = useSaveSlotsStore((state) => state.isLoading);

  if (!isOpen) {
    return null;
  }

  const handleLoad = (slot: TSaveSlot) => {
    setPendingLoad(slot);

    onClose();

    setScreen("game");
  };

  return (
    <div className="main-menu-load-overlay">
      <section className="main-menu-load">
        <header className="main-menu-load__header">
          <h2 className="main-menu-load__title">{t("saveMenu.loadTitle")}</h2>

          <button
            type="button"
            className="main-menu-load__close"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            ×
          </button>
        </header>

        {isLoading ? (
          <p className="main-menu-load__loading">{t("saveMenu.loading")}</p>
        ) : (
          <div className="main-menu-load__slots">
            {slots.map((slot) => {
              const isDisabled = !slot.exists || slot.isCorrupted;

              const description = slot.isCorrupted
                ? t("saveMenu.corrupted")
                : slot.exists
                  ? slot.locationId
                  : t("saveMenu.empty");

              return (
                <button
                  key={slot.slot}
                  type="button"
                  className="main-menu-load__slot"
                  disabled={isDisabled}
                  onClick={() => handleLoad(slot.slot)}
                >
                  <div className="main-menu-load__slot-content">
                    <strong className="main-menu-load__slot-title">
                      {t("saveMenu.slot", {
                        slot: slot.slot,
                      })}
                    </strong>

                    <div
                      className={[
                        "main-menu-load__slot-description",
                        slot.isCorrupted
                          ? "main-menu-load__slot-description--corrupted"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {description}
                    </div>
                  </div>

                  {slot.exists && !slot.isCorrupted && slot.updatedAt && (
                    <span className="main-menu-load__slot-date">
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
