import { useTranslation } from "react-i18next";

import { useGameUiStore } from "../../../game/store/use-game-ui-store";
import { useInventoryStore } from "../../../game/store/use-inventory-store";

export function InventoryPanel() {
  const { t } = useTranslation();

  const isInventoryOpen = useGameUiStore((state) => state.isInventoryOpen);

  const closeInventory = useGameUiStore((state) => state.closeInventory);

  const items = useInventoryStore((state) => state.items);

  if (!isInventoryOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "rgba(0, 0, 0, 0.55)",

        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 560,
          minHeight: 360,

          padding: 24,

          border: "1px solid #454545",
          borderRadius: 16,

          background: "#1b1b1b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            marginBottom: 24,
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            {t("inventory.title")}
          </h2>

          <button type="button" onClick={closeInventory}>
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p>{t("inventory.empty")}</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              gap: 12,
            }}
          >
            {items.map((entry) => (
              <div
                key={entry.item.id}
                style={{
                  padding: 16,

                  border: "1px solid #353535",
                  borderRadius: 10,

                  background: "#242424",
                }}
              >
                <strong>{t(entry.item.nameKey)}</strong>

                <p>{t(entry.item.descriptionKey)}</p>

                <span>× {entry.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
