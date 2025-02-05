export class MissingPeriodError extends Error {
  constructor(id: string) {
    super(`Missing period with id: ${id}.`);
  }
}
