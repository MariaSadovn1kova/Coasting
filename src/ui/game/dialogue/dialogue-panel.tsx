import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { getNpcById } from "../../../content/npcs/npc-registry";

import type { IDialogueChoiceOption } from "../../../game/dialogue/dialogue";
import { DialogueVoice } from "../../../game/dialogue/dialogue-voice";

import { useDialogueStore } from "../../../game/store/use-dialogue-store";

import { useDialogueKeyboard } from "./use-dialogue-keyboard";
import { useTypewriterText } from "./use-typewriter-text";

import "./dialogue-panel.css";

export function DialoguePanel() {
  const { t } = useTranslation();

  const [dialogueVoice] = useState(() => new DialogueVoice());

  const isOpen = useDialogueStore((state) => state.isOpen);

  const npcId = useDialogueStore((state) => state.npcId);

  const currentNode = useDialogueStore((state) => state.currentNode);

  const controller = useDialogueStore((state) => state.controller);

  const refreshNode = useDialogueStore((state) => state.refreshNode);

  const closeDialogue = useDialogueStore((state) => state.closeDialogue);

  const npc = npcId ? getNpcById(npcId) : null;

  const lineText = currentNode?.type === "line" ? t(currentNode.textKey) : "";

  useEffect(() => {
    if (!npc) {
      return;
    }

    dialogueVoice.setVoice(npc.speechSound);
  }, [npc, dialogueVoice]);

  useEffect(() => {
    return () => {
      dialogueVoice.destroy();
    };
  }, [dialogueVoice]);

  const handleCharacter = useCallback(
    (character: string, index: number) => {
      if (!npc) {
        return;
      }

      const isLetterOrNumber = /[\p{L}\p{N}]/u.test(character);

      if (!isLetterOrNumber) {
        return;
      }

      if (index % 3 !== 0) {
        return;
      }

      dialogueVoice.play();
    },
    [npc, dialogueVoice],
  );

  const { visibleText, isComplete, complete } = useTypewriterText({
    text: lineText,
    speed: 28,
    onCharacter: handleCharacter,
  });

  const handleAdvance = useCallback(() => {
    if (!currentNode || !controller) {
      return;
    }

    if (currentNode.type === "line" && !isComplete) {
      dialogueVoice.stop();

      complete();

      return;
    }

    dialogueVoice.stop();

    const moved = controller.advance();

    if (!moved) {
      closeDialogue();

      return;
    }

    refreshNode();
  }, [
    currentNode,
    controller,
    isComplete,
    dialogueVoice,
    complete,
    closeDialogue,
    refreshNode,
  ]);

  const handleChoice = useCallback(
    (option: IDialogueChoiceOption) => {
      if (!controller) {
        return;
      }

      dialogueVoice.stop();

      const moved = controller.choose(option);

      if (!moved) {
        closeDialogue();

        return;
      }

      refreshNode();
    },
    [controller, dialogueVoice, closeDialogue, refreshNode],
  );

  const handleSelectOption = useCallback(
    (index: number) => {
      if (!currentNode || currentNode.type !== "choice") {
        return;
      }

      const option = currentNode.options[index];

      if (!option) {
        return;
      }

      handleChoice(option);
    },
    [currentNode, handleChoice],
  );

  const isChoice = currentNode?.type === "choice";

  const optionsCount =
    currentNode?.type === "choice" ? currentNode.options.length : 0;

  const { selectedOptionIndex } = useDialogueKeyboard({
    isEnabled: isOpen,
    isChoice,
    optionsCount,
    onAdvance: handleAdvance,
    onSelectOption: handleSelectOption,
  });

  if (!isOpen || !npc || !currentNode || !controller) {
    return null;
  }

  const portrait =
    currentNode.type === "line"
      ? (npc.portraits[currentNode.emotion] ?? npc.portraits.neutral)
      : npc.portraits.neutral;

  return (
    <div className="dialogue-overlay">
      <section className="dialogue-panel">
        <div className="dialogue-panel__portrait">
          <img
            src={portrait}
            alt={t(npc.nameKey)}
            className="dialogue-panel__portrait-image"
          />
        </div>

        <div className="dialogue-panel__content">
          <strong className="dialogue-panel__name">{t(npc.nameKey)}</strong>

          {currentNode.type === "line" ? (
            <>
              <p className="dialogue-panel__text">{visibleText}</p>

              <button
                type="button"
                className="dialogue-panel__continue"
                onClick={handleAdvance}
              >
                {t("common.continue")}
              </button>
            </>
          ) : (
            <div className="dialogue-panel__choices">
              {currentNode.options.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    "dialogue-panel__choice",

                    index === selectedOptionIndex
                      ? "dialogue-panel__choice--selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleChoice(option)}
                >
                  <span>{index + 1}.</span> {t(option.textKey)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
