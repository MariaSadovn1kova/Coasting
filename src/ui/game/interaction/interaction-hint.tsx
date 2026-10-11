import { useTranslation } from "react-i18next";

import { useInteractionHintStore } from "../../../game/store/use-interaction-hint-store";

import "./interaction-hint.css";

export function InteractionHint() {
  const { t } = useTranslation();

  const isVisible = useInteractionHintStore((state) => state.isVisible);

  const action = useInteractionHintStore((state) => state.action);

  if (!isVisible || !action) {
    return null;
  }

  return (
    <div className="interaction-hint">
      <span className="interaction-hint__key">E</span>

      <span className="interaction-hint__text">
        {t(`interaction.${action}`)}
      </span>
    </div>
  );
}
