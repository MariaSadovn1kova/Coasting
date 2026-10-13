import type { IGameConditionGroup, TGameCondition } from "./game-condition";

import type { IGameConditionContext } from "./game-condition-context";

export class GameConditionEvaluator {
  check(
    conditions: IGameConditionGroup | undefined,
    context: IGameConditionContext,
  ): boolean {
    if (!conditions) {
      return true;
    }

    const { all = [], any = [], none = [] } = conditions;

    if (
      all.length > 0 &&
      !all.every((condition) => this.checkCondition(condition, context))
    ) {
      return false;
    }

    if (
      any.length > 0 &&
      !any.some((condition) => this.checkCondition(condition, context))
    ) {
      return false;
    }

    if (none.some((condition) => this.checkCondition(condition, context))) {
      return false;
    }

    return true;
  }

  private checkCondition(
    condition: TGameCondition,
    context: IGameConditionContext,
  ): boolean {
    switch (condition.type) {
      case "fact": {
        const actualValue = context.getFact(condition.key);

        const expectedValue = condition.equals ?? true;

        return actualValue === expectedValue;
      }

      case "has-item": {
        const quantity = context.getItemQuantity(condition.itemId);

        return quantity >= (condition.quantity ?? 1);
      }

      case "relationship": {
        const relationship = context.getRelationship(condition.npcId);

        if (relationship === undefined) {
          return false;
        }

        if (condition.min !== undefined && relationship < condition.min) {
          return false;
        }

        if (condition.max !== undefined && relationship > condition.max) {
          return false;
        }

        return true;
      }
    }
  }
}
