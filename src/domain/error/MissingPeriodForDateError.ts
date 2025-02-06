export class MissingPeriodForDateError extends Error {
  constructor(date: Date) {
    super(`Missing period for date: ${date.toString()}.`);
  }
}
