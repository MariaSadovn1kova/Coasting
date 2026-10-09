export interface INpcDialogueChoiceCondition {
  choiceId: string;
  optionId: string;
}

export interface INpcDialogueFlagCondition {
  flagId: string;
  value: boolean;
}

export interface INpcDialogueCondition {
  completedDialogueId?: string;

  notCompletedDialogueId?: string;

  minRelationship?: number;
  maxRelationship?: number;

  choice?: INpcDialogueChoiceCondition;

  flag?: INpcDialogueFlagCondition;
}

export interface INpcDialogueRule {
  dialogueId: string;

  conditions?: INpcDialogueCondition[];
}
