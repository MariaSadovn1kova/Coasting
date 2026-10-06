import { useTranslation } from "react-i18next";

import { useGameUiStore } from "../../../game/store/use-game-ui-store";
import { useInventoryStore } from "../../../game/store/use-inventory-store";

import "./inventory-panel.css";

export function InventoryPanel() {
  const { t } = useTranslation();

  const isInventoryOpen = useGameUiStore((state) => state.isInventoryOpen);

  const closeInventory = useGameUiStore((state) => state.closeInventory);

  const items = useInventoryStore((state) => state.items);

  if (!isInventoryOpen) {
    return null;
  }

  return (
    <div className="inventory-overlay">
      <section className="inventory-panel">
        <header className="inventory-panel__header">
          <h2 className="inventory-panel__title">{t("inventory.title")}</h2>

          <button
            type="button"
            className="inventory-panel__close"
            onClick={closeInventory}
            aria-label={t("common.close")}
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className="inventory-panel__empty">{t("inventory.empty")}</p>
        ) : (
          <div className="inventory-panel__grid">
            {items.map((entry) => (
              <article key={entry.item.id} className="inventory-panel__item">
                <strong className="inventory-panel__item-name">
                  {t(entry.item.nameKey)}
                </strong>

                <p className="inventory-panel__item-description">
                  {t(entry.item.descriptionKey)}
                </p>

                <span className="inventory-panel__item-quantity">
                  × {entry.quantity}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
