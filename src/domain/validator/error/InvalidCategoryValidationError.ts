import { ValidationError } from "./ValidationError";

export class InvalidCategoryValidationError extends ValidationError {
  constructor(categoryProvided: string) {
    super();
    this.message = `Invalid category provided: ${categoryProvided}`;
    this.field = "category";
  }
}
