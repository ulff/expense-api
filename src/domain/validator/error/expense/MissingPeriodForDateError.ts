import { ValidationError } from "../ValidationError";

export class MissingPeriodForDateError extends ValidationError {
  constructor(date: Date) {
    super(`Missing period for date: ${date.toString()}.`);
  }
}
