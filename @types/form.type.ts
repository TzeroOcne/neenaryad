export interface InputValidation {
  message: string;
  init: boolean;
}

export type Validation<Type> = {
  [Property in keyof Type]: InputValidation;
};
