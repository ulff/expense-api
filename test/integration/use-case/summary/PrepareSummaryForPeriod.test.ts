import {
  PrepareSummaryForPeriod,
  PrepareSummaryForPeriodCommand,
} from "../../../../src/domain/use-case/summary/PrepareSummaryForPeriod";

// @ts-ignore
import categories from "../../../../src/data/static/categories.json";

import { Expense } from "../../../../src/domain/entity/Expense";
import { Period } from "../../../../src/domain/entity/Period";
import { PLN } from "../../../../src/domain/entity/types/PLN";
import { Summary } from "../../../../src/domain/entity/types/Summary";

describe("PrepareSummaryForPeriod Integration Tests", () => {
  let prepareSummaryForPeriod: PrepareSummaryForPeriod;

  beforeEach(() => {
    prepareSummaryForPeriod = new PrepareSummaryForPeriod();
  });

  test("should correctly summarize expenses for a period", () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );

    const expense1 = new Expense(
      "1",
      period,
      new PLN(100, 50),
      new Date("2025-02-15 12:30:45"),
      "food-orders",
      "Lunch",
    );
    const expense2 = new Expense(
      "2",
      period,
      new PLN(200, 75),
      new Date("2025-02-20 18:45:30"),
      "entertainment",
      "Movie",
    );
    const expense3 = new Expense(
      "3",
      period,
      new PLN(50, 25),
      new Date("2025-02-25 10:00:00"),
      "food-orders",
      "Dinner",
    );

    const command: PrepareSummaryForPeriodCommand = {
      period,
      expenses: [expense1, expense2, expense3],
      categories,
    };

    const summary: Summary = prepareSummaryForPeriod.execute(command);

    expect(summary.name).toBe("February 2025");
    expect(summary.dateStart).toEqual(new Date("2025-02-01 00:00:00"));
    expect(summary.dateEnd).toEqual(new Date("2025-02-28 23:59:59"));
    expect(Object.keys(summary.categories)).toContain("food-orders");
    expect(Object.keys(summary.categories)).toContain("entertainment");
    expect(summary.categories["food-orders"].amount).toEqual(new PLN(150, 75));
    expect(summary.categories["entertainment"].amount).toEqual(
      new PLN(200, 75),
    );
  });

  test("should return an empty summary when there are no expenses", () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-28 23:59:59"),
      "February 2025",
    );

    const command: PrepareSummaryForPeriodCommand = {
      period,
      expenses: [],
      categories,
    };

    const summary: Summary = prepareSummaryForPeriod.execute(command);

    expect(summary.name).toBe("February 2025");
    expect(summary.dateStart).toEqual(new Date("2025-02-01 00:00:00"));
    expect(summary.dateEnd).toEqual(new Date("2025-02-28 23:59:59"));
    expect(Object.keys(summary.categories)).toHaveLength(0);
  });
});
