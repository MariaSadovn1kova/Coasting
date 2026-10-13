import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { getNpcById } from "../../../content/npcs/npc-registry";

import type { IDialogueChoiceOption } from "../../../game/dialogue/dialogue";
import { DialogueVoice } from "../../../game/dialogue/dialogue-voice";

import { useDialogueStore } from "../../../game/store/use-dialogue-store";

import { useDialogueKeyboard } from "./use-dialogue-keyboard";
import { useTypewriterText } from "./use-typewriter-text";

import "./dialogue-panel.css";

const PORTRAIT_ANIMATION_DURATION = 260;

export function DialoguePanel() {
  const { t } = useTranslation();

  const [dialogueVoice] = useState(() => new DialogueVoice());

  const [displayedPortrait, setDisplayedPortrait] = useState<string | null>(
    null,
  );

  const [previousPortrait, setPreviousPortrait] = useState<string | null>(null);

  const currentPortraitRef = useRef<string | null>(null);

  const portraitTimeoutRef = useRef<number | null>(null);

  const isOpen = useDialogueStore((state) => state.isOpen);

  const npcId = useDialogueStore((state) => state.npcId);

  const currentNode = useDialogueStore((state) => state.currentNode);

  const controller = useDialogueStore((state) => state.controller);

  const refreshNode = useDialogueStore((state) => state.refreshNode);

  const closeDialogue = useDialogueStore((state) => state.closeDialogue);

  const npc = npcId ? getNpcById(npcId) : null;

  const isPlayerLine =
    currentNode?.type === "line" && currentNode.speakerId === "player";

  const speakerNpc =
    currentNode?.type === "line" && currentNode.speakerId !== "player"
      ? getNpcById(currentNode.speakerId)
      : null;

  const lineText = currentNode?.type === "line" ? t(currentNode.textKey) : "";

  const availableOptions =
    currentNode?.type === "choice" && controller
      ? controller.getAvailableOptions()
      : [];

  const portrait =
    currentNode?.type === "line"
      ? isPlayerLine
        ? null
        : speakerNpc
          ? (speakerNpc.portraits[currentNode.emotion] ??
            speakerNpc.portraits.neutral)
          : null
      : currentNode?.type === "choice" && npc
        ? npc.portraits.neutral
        : null;

  useEffect(() => {
    if (!speakerNpc) {
      dialogueVoice.stop();

      return;
    }

    dialogueVoice.setVoice(speakerNpc.speechSound);
  }, [speakerNpc, dialogueVoice]);

  useEffect(() => {
    return () => {
      dialogueVoice.destroy();
    };
  }, [dialogueVoice]);

  useEffect(() => {
    if (portrait === currentPortraitRef.current) {
      return;
    }

    if (portraitTimeoutRef.current !== null) {
      window.clearTimeout(portraitTimeoutRef.current);

      portraitTimeoutRef.current = null;
    }

    const previous = currentPortraitRef.current;

    setPreviousPortrait(previous);
    setDisplayedPortrait(portrait);

    currentPortraitRef.current = portrait;

    if (!previous) {
      setPreviousPortrait(null);

      return;
    }

    portraitTimeoutRef.current = window.setTimeout(() => {
      setPreviousPortrait(null);

      portraitTimeoutRef.current = null;
    }, PORTRAIT_ANIMATION_DURATION);
  }, [portrait]);

  useEffect(() => {
    return () => {
      if (portraitTimeoutRef.current !== null) {
        window.clearTimeout(portraitTimeoutRef.current);
      }
    };
  }, []);

  const handleCharacter = useCallback(
    (character: string, index: number) => {
      if (!speakerNpc) {
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
    [speakerNpc, dialogueVoice],
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
      const option = availableOptions[index];

      if (!option) {
        return;
      }

      handleChoice(option);
    },
    [availableOptions, handleChoice],
  );

  const isChoice = currentNode?.type === "choice";

  const optionsCount = availableOptions.length;

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

  const speakerName =
    currentNode.type === "line"
      ? isPlayerLine
        ? t("common.you")
        : speakerNpc
          ? t(speakerNpc.nameKey)
          : ""
      : t(npc.nameKey);

  return (
    <div className="dialogue-overlay">
      <section className="dialogue-panel">
        {(displayedPortrait || previousPortrait) && (
          <div className="dialogue-panel__portrait">
            {previousPortrait && (
              <img
                src={previousPortrait}
                alt=""
                className="dialogue-panel__portrait-image dialogue-panel__portrait-image--exit"
              />
            )}

            {displayedPortrait && (
              <img
                key={displayedPortrait}
                src={displayedPortrait}
                alt={speakerName}
                className="dialogue-panel__portrait-image dialogue-panel__portrait-image--enter"
              />
            )}
          </div>
        )}

        <div className="dialogue-panel__content">
          <strong className="dialogue-panel__name">{speakerName}</strong>

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
              {availableOptions.map((option, index) => (
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
