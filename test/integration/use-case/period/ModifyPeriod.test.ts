import {
  ModifyPeriod,
  ModifyPeriodCommand,
} from "../../../../src/domain/use-case/period/ModifyPeriod";
import { Period } from "../../../../src/domain/entity/Period";

import { MissingPeriodError } from "../../../../src/domain/error/MissingPeriodError";

import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("ModifyPeriod Integration Tests", () => {
  let repository: InMemoryPeriodRepository;
  let modifyPeriod: ModifyPeriod;

  beforeEach(() => {
    repository = new InMemoryPeriodRepository();
    modifyPeriod = new ModifyPeriod(repository);
  });

  test("should successfully modify an existing period", async () => {
    const initialPeriod = new Period(
      "1",
      new Date("2025-02-01 00:00:00"),
      new Date("2025-02-10 23:59:59"),
      "Initial Period",
    );
    await repository.savePeriod(initialPeriod);

    const command: ModifyPeriodCommand = {
      id: "1",
      dateStart: new Date("2025-02-02 00:00:00"),
      dateEnd: new Date("2025-02-11 23:59:59"),
      name: "Updated Period",
    };

    const updatedPeriod = await modifyPeriod.execute(command);
    expect(updatedPeriod.dateStart).toEqual(new Date("2025-02-02 00:00:00"));
    expect(updatedPeriod.dateEnd).toEqual(new Date("2025-02-11 23:59:59"));
    expect(updatedPeriod.name).toBe("Updated Period");
  });

  test("should fail when modifying a non-existent period", async () => {
    const command: ModifyPeriodCommand = {
      id: "999",
      dateStart: new Date("2025-02-01 00:00:00"),
      dateEnd: new Date("2025-02-10 23:59:59"),
      name: "Non-existent Period",
    };

    await expect(modifyPeriod.execute(command)).rejects.toThrow(
      MissingPeriodError,
    );
  });
});
