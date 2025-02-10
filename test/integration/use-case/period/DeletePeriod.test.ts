import {
  DeletePeriod,
  DeletePeriodCommand,
} from "../../../../src/domain/use-case/period/DeletePeriod";
import { Period } from "../../../../src/domain/entity/Period";

import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("DeletePeriod Integration Tests", () => {
  let repository: InMemoryPeriodRepository;
  let deletePeriod: DeletePeriod;

  beforeEach(() => {
    repository = new InMemoryPeriodRepository();
    deletePeriod = new DeletePeriod(repository);
  });

  test("should successfully delete an existing period", async () => {
    const period = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-10 23:59:59"),
      "Test Period",
    );
    await repository.savePeriod(period);

    const command: DeletePeriodCommand = { id: "1" };
    await deletePeriod.execute(command);

    const retrievedPeriod = await repository.getPeriod("1");
    expect(retrievedPeriod).toBeNull();
  });

  test("should not throw an error when deleting a non-existent period", async () => {
    const command: DeletePeriodCommand = { id: "999" };
    await expect(deletePeriod.execute(command)).resolves.not.toThrow();
  });
});
