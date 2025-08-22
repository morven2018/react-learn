export enum Forms {
  Uncontrolled = 'Uncontrolled',
  HookForm = 'HookForm',
}

export interface Submission {
  type: Forms;
  name: string;
}
