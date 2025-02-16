export default class FoundMultipleRowsError extends Error {
  constructor(sql: string, number: number) {
    super(
      `fetchOne method found ${number} rows while it expects one, during perfoming the query: ${sql}`,
    );
  }
}
