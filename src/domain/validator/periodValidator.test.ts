import { Period } from "../entity/Period";
import { PeriodValidator } from "./PeriodValidator";
import { AddPeriodCommand } from "../use-case/period/AddPeriod";
import { PeriodRepository } from "../repository/PeriodRepository";

import { InvalidDateRangeValidationError } from "./error/InvalidDateRangeValidationError";
import { EmptyFieldValidationError } from "./error/EmptyFieldValidationError";
import { DatesCollisionValidationError } from "./error/DatesCollisionValidationError";
import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";

const mockRepository: PeriodRepository = {
  savePeriod: jest.fn(),
  listPeriods: jest.fn(),
  getPeriod: jest.fn(),
  getPeriodForDate: jest.fn(),
  deletePeriod: jest.fn(),
};

describe("PeriodValidator tests", () => {
  describe("validateData method tests", () => {
    it("should not throw an error for valid data", () => {
      const command: AddPeriodCommand = {
        dateStart: new Date("2024-02-07"),
        dateEnd: new Date("2024-02-08"),
        name: "Valid Period",
      };

      expect(() => {
        PeriodValidator.validateData(command);
      }).not.toThrow();
    });

    it("should throw EmptyFieldValidationError if name is empty", () => {
      const command: AddPeriodCommand = {
        dateStart: new Date("2024-02-07"),
        dateEnd: new Date("2024-02-08"),
        name: "",
      };

      try {
        PeriodValidator.validateData(command);
      } catch (error) {
        expect(error).toBeInstanceOf(EmptyFieldValidationError);
        if (error instanceof EmptyFieldValidationError) {
          expect(error.field).toBe("name");
          expect(error.message).toBe("Missing value for property: name");
        }
      }
    });

    it("should throw InvalidDateRangeValidationError if dateStart is after dateEnd", () => {
      const command: AddPeriodCommand = {
        dateStart: new Date("2024-02-09"),
        dateEnd: new Date("2024-02-08"),
        name: "Test Period",
      };
      expect(() => {
        PeriodValidator.validateData(command);
      }).toThrow(InvalidDateRangeValidationError);
    });

    it("should throw InvalidFieldValidationError if empty dateStart", () => {
      const command = {
        dateEnd: new Date("2024-02-08"),
        name: "Test Period",
      };

      try {
        PeriodValidator.validateData(command as AddPeriodCommand);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidFieldValidationError);
        if (error instanceof InvalidFieldValidationError) {
          expect(error.field).toBe("dateStart");
          expect(error.message).toBe("Invalid value for property: dateStart");
        }
      }
    });

    it("should throw InvalidFieldValidationError if empty dateEnd", () => {
      const command = {
        dateStart: new Date("2024-02-09"),
        name: "Test Period",
      };

      try {
        PeriodValidator.validateData(command as AddPeriodCommand);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidFieldValidationError);
        if (error instanceof InvalidFieldValidationError) {
          expect(error.field).toBe("dateEnd");
          expect(error.message).toBe("Invalid value for property: dateEnd");
        }
      }
    });
  });

  describe("checkCollisions method tests", () => {
    it("should not throw an error if periods do not overlap", async () => {
      const repository = mockRepository;
      const validator = new PeriodValidator(repository);
      const existingPeriods: Period[] = [
        new Period(
          "1",
          new Date("2024-02-01"),
          new Date("2024-02-05"),
          "Old Period",
        ),
      ];
      repository.listPeriods = jest.fn().mockResolvedValue(existingPeriods);
      const newPeriod = new Period(
        "2",
        new Date("2024-02-07"),
        new Date("2024-02-10"),
        "New Period",
      );

      await expect(validator.checkCollisions(newPeriod)).resolves.not.toThrow();
    });

    it("should throw DatesCollisionValidationError if periods overlap", async () => {
      const repository = mockRepository;
      const validator = new PeriodValidator(repository);
      const existingPeriods: Period[] = [
        new Period(
          "1",
          new Date("2024-02-07"),
          new Date("2024-02-09"),
          "Existing Period",
        ),
      ];
      repository.listPeriods = jest.fn().mockResolvedValue(existingPeriods);
      const newPeriod = new Period(
        "2",
        new Date("2024-02-08"),
        new Date("2024-02-10"),
        "New Period",
      );

      await expect(validator.checkCollisions(newPeriod)).rejects.toThrow(
        DatesCollisionValidationError,
      );
    });
  });
});
