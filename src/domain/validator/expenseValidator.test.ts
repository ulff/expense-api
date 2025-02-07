import { ExpenseValidator } from "./ExpenseValidator";
import { AddExpenseCommand } from "../use-case/expense/AddExpense";

import { InvalidFieldValidationError } from "./error/InvalidFieldValidationError";

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
    });
  });
});
