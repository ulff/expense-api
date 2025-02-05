export class ValidationError extends Error {
  public message: string;
  public field: string;
}
