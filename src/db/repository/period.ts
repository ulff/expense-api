import { v4 } from "uuid";
import { execute, fetchMany, fetchOne } from "..";
import type { Period } from "../../domain/types/period";

const listPeriods: () => Promise<Period[]> = async () => {
  const sql: string = "SELECT * FROM periods ORDER BY date_start;";
  const params: any[] = [];

  return (await fetchMany(sql, params)) as Period[];
};

const getPeriod: (id: string) => Promise<Period | null> = async (id) => {
  const sql: string = "SELECT * FROM periods WHERE id = $1;";
  const params: any[] = [id];

  const result = await fetchOne(sql, params);
  if (result.length === 0) {
    return null;
  }
  return result as Period;
};

const getPeriodForDate: (date: Date) => Promise<Period | null> = async (
  date,
) => {
  const sql: string =
    "SELECT * FROM periods WHERE date_start < $1 AND date_end > $1;";
  const params: any[] = [date];

  const result = await fetchOne(sql, params);
  if (result.length === 0) {
    return null;
  }
  return result as Period;
};

type addPeriodInputType = {
  dateStart: Date;
  dateEnd: Date;
  name: string;
};

const addPeriod: (o: addPeriodInputType) => Promise<Period> = async ({
  dateStart,
  dateEnd,
  name,
}) => {
  const id = v4();

  const sql: string =
    "INSERT INTO " +
    "periods(id, date_start, date_end, name) " +
    "VALUES ($1, $2, $3, $4);";
  const params: any[] = [id, dateStart, dateEnd, name];

  await execute(sql, params);

  return getPeriod(id);
};

type updatePeriodInputType = {
  periodId: string;
} & addPeriodInputType;

const updatePeriod: (o: updatePeriodInputType) => Promise<Period> = async ({
  periodId,
  dateStart,
  dateEnd,
  name,
}) => {
  const sql: string =
    "UPDATE periods " +
    "SET date_start = $2, date_end = $3, name = $4 " +
    "WHERE (id = $1);";
  const params: any[] = [periodId, dateStart, dateEnd, name];

  await execute(sql, params);

  return getPeriod(periodId);
};

export { listPeriods, getPeriodForDate, addPeriod, updatePeriod };
