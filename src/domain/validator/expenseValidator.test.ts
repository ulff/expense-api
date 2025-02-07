import { ExpenseValidator } from "./ExpenseValidator";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";

import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";
import { InvalidCategoryValidationError } from "./error/InvalidCategoryValidationError";

describe("ExpenseValidator tests", () => {
  describe("validateData method tests", () => {
    it("should not throw an error for valid data", () => {
      const command: AddExpenseCommand = {
        zloty: 1,
        groszy: 25,
        category: "food-orders",
        spentOn: new Date("2024-02-07 12:00"),
      };

      expect(() => {
        ExpenseValidator.validateData(command);
      }).not.toThrow();
    });

    describe("amount property test scenarios", () => {
      it("should throw InvalidFieldValidationError if zloty is not an integer", () => {
        const command: AddExpenseCommand = {
          zloty: 12.5,
          groszy: 50,
          category: "food-orders",
          spentOn: new Date("2024-02-07 12:00"),
        };

        try {
          ExpenseValidator.validateData(command);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidFieldValidationError);
          if (error instanceof InvalidFieldValidationError) {
            expect(error.field).toBe("zloty");
            expect(error.message).toBe("Invalid value for property: zloty");
          }
        }
      });

      it("should throw InvalidFieldValidationError if zloty is negative", () => {
        const command: AddExpenseCommand = {
          zloty: -1,
          groszy: 50,
          category: "food-orders",
          spentOn: new Date("2024-02-07 12:00"),
        };

        try {
          ExpenseValidator.validateData(command);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidFieldValidationError);
          if (error instanceof InvalidFieldValidationError) {
            expect(error.field).toBe("zloty");
            expect(error.message).toBe("Invalid value for property: zloty");
          }
        }
      });

      it("should throw InvalidFieldValidationError if groszy is not an integer", () => {
        const command: AddExpenseCommand = {
          zloty: 1,
          groszy: 50.5,
          category: "food-orders",
          spentOn: new Date("2024-02-07 12:00"),
        };
        try {
          ExpenseValidator.validateData(command);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidFieldValidationError);
          if (error instanceof InvalidFieldValidationError) {
            expect(error.field).toBe("groszy");
            expect(error.message).toBe("Invalid value for property: groszy");
          }
        }
      });

      it("should throw InvalidFieldValidationError if groszy is negative", () => {
        const command: AddExpenseCommand = {
          zloty: 1,
          groszy: -50,
          category: "food-orders",
          spentOn: new Date("2024-02-07 12:00"),
        };
        try {
          ExpenseValidator.validateData(command);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidFieldValidationError);
          if (error instanceof InvalidFieldValidationError) {
            expect(error.field).toBe("groszy");
            expect(error.message).toBe("Invalid value for property: groszy");
          }
        }
      });

      it("should throw InvalidFieldValidationError if groszy is 100 or more", () => {
        const command: AddExpenseCommand = {
          zloty: 1,
          groszy: 100,
          category: "food-orders",
          spentOn: new Date("2024-02-07 12:00"),
        };
        try {
          ExpenseValidator.validateData(command);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidFieldValidationError);
          if (error instanceof InvalidFieldValidationError) {
            expect(error.field).toBe("groszy");
            expect(error.message).toBe("Invalid value for property: groszy");
          }
        }
      });

      it("should throw InvalidCategoryValidationError if unknown Category", () => {
        const command = {
          zloty: 12,
          groszy: 50,
          category: "does-not-exist",
          spentOn: new Date("2024-02-07 12:00"),
        };

        try {
          ExpenseValidator.validateData(command as AddExpenseCommand);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidCategoryValidationError);
          if (error instanceof InvalidCategoryValidationError) {
            expect(error.field).toBe("category");
            expect(error.message).toBe(
              "Invalid category provided: does-not-exist",
            );
          }
        }
      });

      it("should throw InvalidFieldValidationError if empty spentOn", () => {
        const command = {
          zloty: 12,
          groszy: 50,
          category: "fuel",
        };

        try {
          ExpenseValidator.validateData(command as AddExpenseCommand);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidFieldValidationError);
          if (error instanceof InvalidFieldValidationError) {
            expect(error.field).toBe("spentOn");
            expect(error.message).toBe("Invalid value for property: spentOn");
          }
        }
      });
    });
  });
});
