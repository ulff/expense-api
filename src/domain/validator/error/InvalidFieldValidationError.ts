import { ValidationError } from "./ValidationError";

export class InvalidFieldValidationError extends ValidationError {
  public message: string;
  public field: string;

  constructor(fieldName: string) {
    super();
    this.message = `Invalid value for property: ${fieldName}`;
    this.field = fieldName;
  }
}
