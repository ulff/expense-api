export default class FoundMultipleRowsError extends Error {
  constructor(number: number) {
    super(`fetchOne method found ${number} rows while it expects one.`);
  }
}
