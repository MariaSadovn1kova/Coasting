import type {
  IDialogue,
  IDialogueChoiceOption,
  TDialogueNode,
} from "./dialogue";

import { GameConditionEvaluator } from "../conditions/game-condition-evaluator";
import type { IGameConditionContext } from "../conditions/game-condition-context";

import { GameEffectApplier } from "../effects/game-effect-applier";
import type { IGameEffectContext } from "../effects/game-effect-context";

import { useNpcStateStore } from "../store/use-npc-state-store";

interface IDialogueControllerOptions {
  dialogue: IDialogue;

  effectContext: IGameEffectContext;

  conditionContext: IGameConditionContext;
}

export class DialogueController {
  private readonly dialogue: IDialogue;

  private readonly effectContext: IGameEffectContext;

  private readonly conditionContext: IGameConditionContext;

  private readonly effectApplier = new GameEffectApplier();

  private readonly conditionEvaluator = new GameConditionEvaluator();

  private currentNodeId: string | null = null;

  private isCompleted = false;

  constructor({
    dialogue,
    effectContext,
    conditionContext,
  }: IDialogueControllerOptions) {
    this.dialogue = dialogue;

    this.effectContext = effectContext;

    this.conditionContext = conditionContext;

    this.enterNode(dialogue.startNodeId);
  }

  getDialogue() {
    return this.dialogue;
  }

  getCurrentNode(): TDialogueNode | null {
    if (!this.currentNodeId) {
      return null;
    }

    return this.dialogue.nodes[this.currentNodeId] ?? null;
  }

  getAvailableOptions(): IDialogueChoiceOption[] {
    const node = this.getCurrentNode();

    if (!node || node.type !== "choice") {
      return [];
    }

    return node.options.filter((option) =>
      this.conditionEvaluator.check(option.conditions, this.conditionContext),
    );
  }

  goToNode(nodeId: string): boolean {
    return this.enterNode(nodeId);
  }

  advance(): boolean {
    const node = this.getCurrentNode();

    if (!node || node.type !== "line") {
      return false;
    }

    if (!node.nextNodeId) {
      this.completeDialogue();

      return false;
    }

    const moved = this.goToNode(node.nextNodeId);

    if (!moved) {
      this.completeDialogue();

      return false;
    }

    return true;
  }

  choose(option: IDialogueChoiceOption): boolean {
    const node = this.getCurrentNode();

    if (!node || node.type !== "choice") {
      return false;
    }

    const selectedOption = node.options.find(
      (currentOption) => currentOption.id === option.id,
    );

    if (!selectedOption) {
      return false;
    }

    const isAvailable = this.conditionEvaluator.check(
      selectedOption.conditions,
      this.conditionContext,
    );

    if (!isAvailable) {
      return false;
    }

    useNpcStateStore
      .getState()
      .setChoice(this.dialogue.npcId, node.choiceId, selectedOption.id);

    this.effectApplier.apply(selectedOption.effects, this.effectContext);

    if (!selectedOption.nextNodeId) {
      this.completeDialogue();

      return false;
    }

    const moved = this.goToNode(selectedOption.nextNodeId);

    if (!moved) {
      this.completeDialogue();

      return false;
    }

    return true;
  }

  private enterNode(nodeId: string): boolean {
    let nextNodeId: string | undefined = nodeId;

    const visited = new Set<string>();

    while (nextNodeId !== undefined) {
      const currentNodeId: string = nextNodeId;

      if (visited.has(currentNodeId)) {
        console.warn(`Dialogue loop while resolving node: ${currentNodeId}`);

        return false;
      }

      visited.add(currentNodeId);

      const node: TDialogueNode | undefined =
        this.dialogue.nodes[currentNodeId];

      if (!node) {
        console.warn(`Dialogue node not found: ${currentNodeId}`);

        return false;
      }

      const isAvailable = this.conditionEvaluator.check(
        node.conditions,
        this.conditionContext,
      );

      if (!isAvailable) {
        nextNodeId = node.nextNodeId;

        continue;
      }

      this.currentNodeId = node.id;

      this.effectApplier.apply(node.effects, this.effectContext);

      return true;
    }

    this.currentNodeId = null;

    return false;
  }

  private completeDialogue() {
    if (this.isCompleted) {
      return;
    }

    this.isCompleted = true;

    this.effectApplier.apply(
      this.dialogue.completionEffects,
      this.effectContext,
    );

    useNpcStateStore
      .getState()
      .completeDialogue(this.dialogue.npcId, this.dialogue.id);
  }
}
