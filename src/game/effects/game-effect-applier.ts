import type { TGameEffect } from "./game-effect";

import type { IGameEffectContext } from "./game-effect-context";

export class GameEffectApplier {
  apply(effects: TGameEffect[] | undefined, context: IGameEffectContext): void {
    if (!effects) {
      return;
    }

    effects.forEach((effect) => {
      this.applyEffect(effect, context);
    });
  }

  private applyEffect(effect: TGameEffect, context: IGameEffectContext): void {
    switch (effect.type) {
      case "set-fact": {
        context.setFact(effect.key, effect.value);

        break;
      }

      case "change-relationship": {
        context.changeRelationship(effect.npcId, effect.amount);

        break;
      }

      case "add-item": {
        context.addItem(effect.itemId, effect.quantity ?? 1);

        break;
      }

      case "remove-item": {
        context.removeItem(effect.itemId, effect.quantity ?? 1);

        break;
      }
    }
  }
}
