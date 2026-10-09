import { useNpcStateStore } from "../store/use-npc-state-store";

import type {
  IDialogue,
  IDialogueChoiceOption,
  TDialogueNode,
} from "./dialogue";

interface IDialogueControllerParams {
  dialogue: IDialogue;
}

export class DialogueController {
  private dialogue: IDialogue;

  private currentNodeId: string;

  constructor({ dialogue }: IDialogueControllerParams) {
    this.dialogue = dialogue;

    this.currentNodeId = dialogue.startNodeId;
  }

  getDialogue() {
    return this.dialogue;
  }

  getCurrentNode(): TDialogueNode | null {
    return this.dialogue.nodes[this.currentNodeId] ?? null;
  }

  goToNode(nodeId: string) {
    if (!this.dialogue.nodes[nodeId]) {
      return false;
    }

    this.currentNodeId = nodeId;

    return true;
  }

  advance() {
    const node = this.getCurrentNode();

    if (!node) {
      return false;
    }

    if (node.type !== "line") {
      return false;
    }

    if (!node.nextNodeId) {
      this.completeDialogue();

      return false;
    }

    this.currentNodeId = node.nextNodeId;

    return true;
  }

  choose(option: IDialogueChoiceOption) {
    const node = this.getCurrentNode();

    if (!node || node.type !== "choice") {
      return false;
    }

    const validOption = node.options.find(
      (currentOption) => currentOption.id === option.id,
    );

    if (!validOption) {
      return false;
    }

    const npcState = useNpcStateStore.getState();

    npcState.setChoice(this.dialogue.npcId, node.choiceId, validOption.id);

    if (validOption.effects?.relationshipChange) {
      npcState.changeRelationship(
        this.dialogue.npcId,
        validOption.effects.relationshipChange,
      );
    }

    if (validOption.effects?.setFlags) {
      Object.entries(validOption.effects.setFlags).forEach(
        ([flagId, value]) => {
          npcState.setFlag(this.dialogue.npcId, flagId, value);
        },
      );
    }

    if (!validOption.nextNodeId) {
      this.completeDialogue();

      return false;
    }

    this.currentNodeId = validOption.nextNodeId;

    return true;
  }

  private completeDialogue() {
    useNpcStateStore
      .getState()
      .completeDialogue(this.dialogue.npcId, this.dialogue.id);
  }
}
