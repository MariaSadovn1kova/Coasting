import { useCallback, useEffect, useState } from "react";

interface IUseTypewriterTextParams {
  text: string;

  speed?: number;

  onCharacter?: (character: string, index: number) => void;
}

export function useTypewriterText({
  text,
  speed = 28,
  onCharacter,
}: IUseTypewriterTextParams) {
  const [visibleLength, setVisibleLength] = useState(0);

  const isComplete = visibleLength >= text.length;

  useEffect(() => {
    setVisibleLength(0);
  }, [text]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setVisibleLength((currentLength) => {
        const nextLength = Math.min(currentLength + 1, text.length);

        const character = text[currentLength];

        if (character) {
          onCharacter?.(character, currentLength);
        }

        return nextLength;
      });
    }, speed);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [text, speed, visibleLength, isComplete, onCharacter]);

  const complete = useCallback(() => {
    setVisibleLength(text.length);
  }, [text]);

  return {
    visibleText: text.slice(0, visibleLength),

    isComplete,

    complete,
  };
}
