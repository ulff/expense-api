import { ValidationError } from "./ValidationError";

export class EmptyFieldError extends ValidationError {
  public message: string;
  public field: string;

  constructor(fieldName: string) {
    super();
    this.message = `Missing value for property: ${fieldName}`;
    this.field = fieldName;
  }
}
