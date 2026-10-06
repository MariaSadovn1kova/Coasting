import { useTranslation } from "react-i18next";

import { gameEventBus } from "../../../game/events/game-event-bus";
import { useContainerStore } from "../../../game/store/use-container-store";

import "./container-panel.css";

export function ContainerPanel() {
  const { t } = useTranslation();

  const isOpen = useContainerStore((state) => state.isOpen);

  const containerId = useContainerStore((state) => state.containerId);

  const items = useContainerStore((state) => state.items);

  const closeContainer = useContainerStore((state) => state.closeContainer);

  if (!isOpen || !containerId) {
    return null;
  }

  const handleTakeItem = (itemId: string) => {
    gameEventBus.emit("container-take-item", {
      containerId,
      itemId,
    });
  };

  const handleTakeAll = () => {
    gameEventBus.emit("container-take-all", {
      containerId,
    });
  };

  return (
    <div className="container-overlay">
      <section className="container-panel">
        <header className="container-panel__header">
          <h2 className="container-panel__title">{t("container.title")}</h2>

          <button
            type="button"
            className="container-panel__close"
            onClick={closeContainer}
            aria-label={t("common.close")}
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className="container-panel__empty">{t("container.empty")}</p>
        ) : (
          <>
            <div className="container-panel__items">
              {items.map((entry) => (
                <article key={entry.item.id} className="container-panel__item">
                  <div className="container-panel__item-content">
                    <strong className="container-panel__item-name">
                      {t(entry.item.nameKey)}
                    </strong>

                    <p className="container-panel__item-description">
                      {t(entry.item.descriptionKey)}
                    </p>

                    <span className="container-panel__item-quantity">
                      × {entry.quantity}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="container-panel__take"
                    onClick={() => handleTakeItem(entry.item.id)}
                  >
                    {t("container.take")}
                  </button>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="container-panel__take-all"
              onClick={handleTakeAll}
            >
              {t("container.takeAll")}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
