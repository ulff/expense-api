export default class DuplicateKeyError extends Error {
  constructor(sql: string, constraint: string) {
    super(
      `Database returned the duplication error during perfoming the query: ${sql}. Duplicate key violates constraint: ${constraint}`,
    );
  }
}
