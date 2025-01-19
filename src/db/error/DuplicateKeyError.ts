export default class DuplicateKeyError extends Error {
  constructor(constraint: string) {
    super(`Duplicate key violates constraint: ${constraint}`);
  }
}
