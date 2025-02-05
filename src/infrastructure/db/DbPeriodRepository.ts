import { execute, fetchOne, fetchMany } from "./core";

import { Period } from "../../domain/model/Period";
import { MissingPeriodForDateError } from "../../domain/validator/error/expense/MissingPeriodForDateError";
import { PeriodRepository } from "../../domain/repository/PeriodRepository";

export class DbPeriodRepository implements PeriodRepository {
  constructor() {}
  async savePeriod(period: Period): Promise<Period> {
    const sql: string = `
      INSERT INTO 
      periods (
        id, 
        date_start, 
        date_end, 
        name
      ) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT ON CONSTRAINT periods_pkey DO 
      UPDATE SET 
        date_start = EXCLUDED.date_start, 
        date_end = EXCLUDED.date_end, 
        name = EXCLUDED.name 
      WHERE (periods.id = EXCLUDED.id);
      `;
    const params: any[] = [
      period.id,
      period.dateStart,
      period.dateEnd,
      period.name,
    ];

    await execute(sql, params);

    return this.getPeriod(period.id);
  }

  async deletePeriod(id: string): Promise<void> {
    const sql: string = `DELETE FROM periods WHERE id = $1;`;
    const params: any[] = [id];

    await execute(sql, params);

    return;
  }

  async getPeriod(id: string): Promise<Period | null> {
    const sql: string = `SELECT * FROM periods WHERE id = $1;`;
    const params: any[] = [id];

    const result = await fetchOne(sql, params);
    if (result.length === 0) {
      return null;
    }

    const period: Period = new Period(
      result.id,
      new Date(result.date_start),
      new Date(result.date_end),
      result.name,
    );

    return period;
  }

  async getPeriodForDate(date: Date): Promise<Period> {
    const sql: string = `SELECT * FROM periods WHERE date_start < $1 AND date_end > $1;`;
    const params: any[] = [date];

    const result = await fetchOne(sql, params);
    if (result.length === 0) {
      throw new MissingPeriodForDateError(date);
    }

    const period: Period = new Period(
      result.id,
      new Date(result.date_start),
      new Date(result.date_end),
      result.name,
    );

    return period;
  }

  async listPeriods(): Promise<Period[]> {
    const sql: string = `SELECT * FROM periods ORDER BY date_start;`;
    const params: any[] = [];

    const results = await fetchMany(sql, params);
    if (!results || results.length === 0) {
      return [];
    }

    return results.map(
      (result) =>
        new Period(
          result.id,
          new Date(result.date_start),
          new Date(result.date_end),
          result.name,
        ),
    );
  }
}
