import { ValidationError } from "./ValidationError";

export class DatesCollisionValidationError extends ValidationError {
  public message: string = "Date range collides with other period.";
  public field: string = "dateStart";
}
