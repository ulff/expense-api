export default class DatabaseQueryError extends Error {
  constructor(sql: string, error: Error) {
    super(
      `Database returned an error during perfoming the query: ${sql}. The error is: ${error.message}`,
    );
  }
}
