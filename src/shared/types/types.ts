export enum Forms {
  Uncontrolled = 'Uncontrolled',
  HookForm = 'HookForm',
}

export interface Submission {
  type: Forms;
  name: string;
  age: string;
  email: string;
  password: string;
  gender: string;
  acceptTerms: string;
  picture: string;
  country: string;
}
