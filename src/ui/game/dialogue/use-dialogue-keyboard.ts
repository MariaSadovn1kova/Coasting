import { useEffect, useState } from "react";

interface IUseDialogueKeyboardParams {
  isEnabled: boolean;

  isChoice: boolean;
  optionsCount: number;

  onAdvance: () => void;

  onSelectOption: (index: number) => void;
}

export function useDialogueKeyboard({
  isEnabled,
  isChoice,
  optionsCount,
  onAdvance,
  onSelectOption,
}: IUseDialogueKeyboardParams) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  useEffect(() => {
    setSelectedOptionIndex(0);
  }, [isChoice, optionsCount]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isChoice) {
        if (event.code === "Enter" || event.code === "Space") {
          event.preventDefault();

          onAdvance();
        }

        return;
      }

      if (event.code === "ArrowUp" || event.code === "KeyW") {
        event.preventDefault();

        setSelectedOptionIndex((currentIndex) => {
          if (optionsCount === 0) {
            return 0;
          }

          return (currentIndex - 1 + optionsCount) % optionsCount;
        });

        return;
      }

      if (event.code === "ArrowDown" || event.code === "KeyS") {
        event.preventDefault();

        setSelectedOptionIndex((currentIndex) => {
          if (optionsCount === 0) {
            return 0;
          }

          return (currentIndex + 1) % optionsCount;
        });

        return;
      }

      if (event.code === "Enter") {
        event.preventDefault();

        if (optionsCount > 0) {
          onSelectOption(selectedOptionIndex);
        }

        return;
      }

      const numberMatch = event.code.match(/^Digit([1-9])$/);

      if (!numberMatch) {
        return;
      }

      const optionIndex = Number(numberMatch[1]) - 1;

      if (optionIndex < 0 || optionIndex >= optionsCount) {
        return;
      }

      event.preventDefault();

      onSelectOption(optionIndex);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isEnabled,
    isChoice,
    optionsCount,
    selectedOptionIndex,
    onAdvance,
    onSelectOption,
  ]);

  return {
    selectedOptionIndex,
  };
}
