export interface IValidation {
  valid: boolean;
  fields: {
    [key: string]: string;
  };
}
