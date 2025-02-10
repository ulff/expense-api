import {
  AddPeriod,
  AddPeriodCommand,
} from "../../../../src/domain/use-case/period/AddPeriod";
import { Period } from "../../../../src/domain/entity/Period";

import { DatesCollisionValidationError } from "../../../../src/domain/validator/error/DatesCollisionValidationError";
import { InvalidDateRangeValidationError } from "../../../../src/domain/validator/error/InvalidDateRangeValidationError";
import { EmptyFieldValidationError } from "../../../../src/domain/validator/error/EmptyFieldValidationError";

import { InMemoryPeriodRepository } from "../../../../src/infrastructure/in-memory/InMemoryPeriodRepository";

describe("AddPeriod Integration Tests", () => {
  let repository: InMemoryPeriodRepository;
  let addPeriod: AddPeriod;

  beforeEach(() => {
    repository = new InMemoryPeriodRepository();
    addPeriod = new AddPeriod(repository);
  });

  test("should successfully add a period", async () => {
    const command: AddPeriodCommand = {
      dateStart: new Date("2025-02-01 00:00:00"),
      dateEnd: new Date("2025-02-10 23:59:59"),
      name: "Test Period",
    };

    const period = await addPeriod.execute(command);
    expect(period).toBeInstanceOf(Period);
    expect(period.name).toBe("Test Period");
    expect(period.dateStart).toEqual(new Date("2025-02-01 00:00:00"));
    expect(period.dateEnd).toEqual(new Date("2025-02-10 23:59:59"));

    const storedPeriods = await repository.listPeriods();
    expect(storedPeriods.length).toBe(1);
    expect(storedPeriods[0]).toEqual(period);
  });

  test("should fail when adding a period with an invalid date range", async () => {
    const command: AddPeriodCommand = {
      dateStart: new Date("2025-02-10 00:00:00"),
      dateEnd: new Date("2025-02-01 23:59:59"),
      name: "Invalid Period",
    };

    await expect(addPeriod.execute(command)).rejects.toThrow(
      InvalidDateRangeValidationError,
    );
  });

  test("should fail when adding a period with an empty name", async () => {
    const command: AddPeriodCommand = {
      dateStart: new Date("2025-02-01 00:00:00"),
      dateEnd: new Date("2025-02-10 23:59:59"),
      name: "",
    };

    await expect(addPeriod.execute(command)).rejects.toThrow(
      EmptyFieldValidationError,
    );
  });

  test("should fail when adding a period that collides with an existing period", async () => {
    const firstCommand: AddPeriodCommand = {
      dateStart: new Date("2025-02-01 00:00:00"),
      dateEnd: new Date("2025-02-10 23:59:59"),
      name: "First Period",
    };
    await addPeriod.execute(firstCommand);

    const overlappingCommand: AddPeriodCommand = {
      dateStart: new Date("2025-02-05 00:00:00"),
      dateEnd: new Date("2025-02-15 23:59:59"),
      name: "Overlapping Period",
    };

    await expect(addPeriod.execute(overlappingCommand)).rejects.toThrow(
      DatesCollisionValidationError,
    );
  });

  test("should allow adding non-overlapping periods", async () => {
    const firstCommand: AddPeriodCommand = {
      dateStart: new Date("2025-02-01 00:00:00"),
      dateEnd: new Date("2025-02-10 23:59:59"),
      name: "First Period",
    };
    await addPeriod.execute(firstCommand);

    const secondCommand: AddPeriodCommand = {
      dateStart: new Date("2025-02-11 00:00:00"),
      dateEnd: new Date("2025-02-20 23:59:59"),
      name: "Second Period",
    };
    const period = await addPeriod.execute(secondCommand);
    expect(period).toBeInstanceOf(Period);
    expect(period.name).toBe("Second Period");
  });
});
