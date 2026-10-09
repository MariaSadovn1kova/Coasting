export interface INpcRuntimeState {
  relationship: number;

  choices: Record<string, string>;

  completedDialogues: string[];

  flags: Record<string, boolean>;
}

export type TNpcRuntimeStateMap = Record<string, INpcRuntimeState>;
