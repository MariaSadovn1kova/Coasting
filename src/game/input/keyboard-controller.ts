type TKeyHandler = (key: string) => void;

export class KeyboardController {
  private pressedKeys = new Set<string>();

  private keyDownHandlers = new Set<TKeyHandler>();

  private handleKeyDown = (event: KeyboardEvent) => {
    const key = event.code;

    this.pressedKeys.add(key);

    this.keyDownHandlers.forEach((handler) => {
      handler(key);
    });
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const key = event.code;

    this.pressedKeys.delete(key);
  };

  mount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    this.pressedKeys.clear();
    this.keyDownHandlers.clear();
  }

  isPressed(key: string) {
    return this.pressedKeys.has(key);
  }

  onKeyDown(handler: TKeyHandler) {
    this.keyDownHandlers.add(handler);

    return () => {
      this.keyDownHandlers.delete(handler);
    };
  }
}
