import type { INpc } from "./npc";
import type { INpcDialogueCondition, INpcDialogueRule } from "./npc-dialogue";
import type { INpcRuntimeState } from "./npc-state";

import { GameConditionEvaluator } from "../conditions/game-condition-evaluator";
import type { IGameConditionContext } from "../conditions/game-condition-context";

export class NpcDialogueResolver {
  private readonly conditionEvaluator = new GameConditionEvaluator();

  resolve(
    npc: INpc,
    state: INpcRuntimeState,
    gameConditionContext?: IGameConditionContext,
  ) {
    const rule = npc.dialogueRules?.find((currentRule) =>
      this.matchesRule(currentRule, state, gameConditionContext),
    );

    return rule?.dialogueId ?? npc.initialDialogueId;
  }

  private matchesRule(
    rule: INpcDialogueRule,
    state: INpcRuntimeState,
    gameConditionContext?: IGameConditionContext,
  ) {
    if (rule.gameConditions) {
      if (!gameConditionContext) {
        return false;
      }

      const matchesGameConditions = this.conditionEvaluator.check(
        rule.gameConditions,
        gameConditionContext,
      );

      if (!matchesGameConditions) {
        return false;
      }
    }

    if (!rule.conditions || rule.conditions.length === 0) {
      return true;
    }

    return rule.conditions.every((condition) =>
      this.matchesCondition(condition, state),
    );
  }

  private matchesCondition(
    condition: INpcDialogueCondition,
    state: INpcRuntimeState,
  ) {
    if (
      condition.completedDialogueId &&
      !state.completedDialogues.includes(condition.completedDialogueId)
    ) {
      return false;
    }

    if (
      condition.notCompletedDialogueId &&
      state.completedDialogues.includes(condition.notCompletedDialogueId)
    ) {
      return false;
    }

    if (
      condition.minRelationship !== undefined &&
      state.relationship < condition.minRelationship
    ) {
      return false;
    }

    if (
      condition.maxRelationship !== undefined &&
      state.relationship > condition.maxRelationship
    ) {
      return false;
    }

    if (condition.choice) {
      const selectedOption = state.choices[condition.choice.choiceId];

      if (selectedOption !== condition.choice.optionId) {
        return false;
      }
    }

    if (condition.flag) {
      const flagValue = state.flags[condition.flag.flagId];

      if (flagValue !== condition.flag.value) {
        return false;
      }
    }

    return true;
  }
}
