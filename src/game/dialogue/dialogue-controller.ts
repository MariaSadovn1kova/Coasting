import type {
  IDialogue,
  IDialogueChoiceOption,
  TDialogueNode,
} from "./dialogue";

import { GameEffectApplier } from "../effects/game-effect-applier";
import type { IGameEffectContext } from "../effects/game-effect-context";

import { useNpcStateStore } from "../store/use-npc-state-store";

interface IDialogueControllerOptions {
  dialogue: IDialogue;
  effectContext: IGameEffectContext;
}

export class DialogueController {
  private readonly dialogue: IDialogue;

  private readonly effectContext: IGameEffectContext;

  private readonly effectApplier = new GameEffectApplier();

  private currentNodeId: string;

  constructor({ dialogue, effectContext }: IDialogueControllerOptions) {
    this.dialogue = dialogue;

    this.effectContext = effectContext;

    this.currentNodeId = dialogue.startNodeId;
  }

  getDialogue() {
    return this.dialogue;
  }

  getCurrentNode(): TDialogueNode | null {
    return this.dialogue.nodes[this.currentNodeId] ?? null;
  }

  goToNode(nodeId: string): boolean {
    const node = this.dialogue.nodes[nodeId];

    if (!node) {
      return false;
    }

    this.currentNodeId = nodeId;

    return true;
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

    return this.goToNode(node.nextNodeId);
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

    useNpcStateStore
      .getState()
      .setChoice(this.dialogue.npcId, node.choiceId, selectedOption.id);

    this.effectApplier.apply(selectedOption.effects, this.effectContext);

    if (!selectedOption.nextNodeId) {
      this.completeDialogue();

      return false;
    }

    return this.goToNode(selectedOption.nextNodeId);
  }

  private completeDialogue() {
    this.effectApplier.apply(
      this.dialogue.completionEffects,
      this.effectContext,
    );

    useNpcStateStore
      .getState()
      .completeDialogue(this.dialogue.npcId, this.dialogue.id);
  }
}
