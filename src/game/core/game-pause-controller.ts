export type TGamePauseReason =
  | "inventory"
  | "container"
  | "save-menu"
  | "dialogue"
  | "pause-menu";

class GamePauseController {
  private reasons = new Set<TGamePauseReason>();

  pause(reason: TGamePauseReason) {
    this.reasons.add(reason);
  }

  resume(reason: TGamePauseReason) {
    this.reasons.delete(reason);
  }

  isPaused() {
    return this.reasons.size > 0;
  }

  has(reason: TGamePauseReason) {
    return this.reasons.has(reason);
  }

  clear() {
    this.reasons.clear();
  }
}

export const gamePauseController = new GamePauseController();
