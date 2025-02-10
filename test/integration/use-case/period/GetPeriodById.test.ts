import {
  GetPeriodById,
  GetPeriodByIdCommand,
} from "../../../../src/domain/use-case/period/GetPeriodById";
import { Period } from "../../../../src/domain/entity/Period";

import { MissingPeriodError } from "../../../../src/domain/error/MissingPeriodError";

import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("GetPeriodById Integration Tests", () => {
  let repository: InMemoryPeriodRepository;
  let getPeriodById: GetPeriodById;

  beforeEach(() => {
    repository = new InMemoryPeriodRepository();
    getPeriodById = new GetPeriodById(repository);
  });

  test("should successfully retrieve an existing period by ID", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-10 23:59:59"),
      "Test Period",
    );
    await repository.savePeriod(period);

    const command: GetPeriodByIdCommand = { id: "1" };
    const retrievedPeriod = await getPeriodById.execute(command);

    expect(retrievedPeriod).toBeInstanceOf(Period);
    expect(retrievedPeriod.id).toBe("1");
    expect(retrievedPeriod.name).toBe("Test Period");
  });

  test("should throw MissingPeriodError when period does not exist", async () => {
    const command: GetPeriodByIdCommand = { id: "999" };
    await expect(getPeriodById.execute(command)).rejects.toThrow(
      MissingPeriodError,
    );
  });
});
