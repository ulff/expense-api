import { ValidationError } from "./ValidationError";

export class InvalidDateRangeValidationError extends ValidationError {
  public message: string =
    "Invalid date range. Start date could not be newer than end date.";
  public field: string = "dateStart";
}
