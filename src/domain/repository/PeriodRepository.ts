import { Period } from "../model/Period";

export interface PeriodRepository {
  savePeriod(period: Period): Promise<Period>;
  listPeriods(): Promise<Period[]>;
  getPeriod(id: string): Promise<Period | null>;
  getPeriodForDate(date: Date): Promise<Period>;
  deletePeriod(id: string): Promise<void>;
}
