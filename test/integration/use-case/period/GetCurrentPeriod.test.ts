import { GetCurrentPeriod } from "../../../../src/domain/use-case/period/GetCurrentPeriod";
import { Period } from "../../../../src/domain/entity/Period";

import { MissingPeriodForDateError } from "../../../../src/domain/error/MissingPeriodForDateError";

import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("GetCurrentPeriod Integration Tests", () => {
  let repository: InMemoryPeriodRepository;
  let getCurrentPeriod: GetCurrentPeriod;

  beforeEach(() => {
    repository = new InMemoryPeriodRepository();
    getCurrentPeriod = new GetCurrentPeriod(repository);
  });

  test("should successfully retrieve the current period", async () => {
    const now = new Date();
    const period = new Period(
      "1",
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0),
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        23,
        59,
        59,
      ),
      "Current Period",
    );
    await repository.savePeriod(period);

    const retrievedPeriod = await getCurrentPeriod.execute();

    expect(retrievedPeriod).toBeInstanceOf(Period);
    expect(retrievedPeriod.name).toBe("Current Period");
  });

  test("should throw MissingPeriodForDateError when no period exists for the current date", async () => {
    await expect(getCurrentPeriod.execute()).rejects.toThrow(
      MissingPeriodForDateError,
    );
  });
});
