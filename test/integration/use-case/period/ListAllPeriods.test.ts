import { ListAllPeriods } from "../../../../src/domain/use-case/period/ListAllPeriods";
import { Period } from "../../../../src/domain/entity/Period";

import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("ListAllPeriods Integration Tests", () => {
  let repository: InMemoryPeriodRepository;
  let listAllPeriods: ListAllPeriods;

  beforeEach(() => {
    repository = new InMemoryPeriodRepository();
    listAllPeriods = new ListAllPeriods(repository);
  });

  test("should return an empty list when there are no periods", async () => {
    const periods = await listAllPeriods.execute();
    expect(periods).toEqual([]);
  });

  test("should return all stored periods", async () => {
    const period1 = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-10 23:59:59"),
      "Period 1",
    );
    const period2 = new Period(
      "2",
      new Date("2025-03-01 00:00:00"),
      new Date("2025-03-10 23:59:59"),
      "Period 2",
    );
    await repository.savePeriod(period1);
    await repository.savePeriod(period2);

    const periods = await listAllPeriods.execute();
    expect(periods.length).toBe(2);
    expect(periods).toContainEqual(period1);
    expect(periods).toContainEqual(period2);
  });
});
