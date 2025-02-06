export class MissingExpenseError extends Error {
  constructor(id: string) {
    super(`Missing expense with id: ${id}.`);
  }
}
