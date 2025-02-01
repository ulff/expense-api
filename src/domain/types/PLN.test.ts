import { sumPLN, PLN } from "./PLN";

describe("sumPLN method tests", () => {
  test("verifies that 1.00 PLN + 2.00 PLN is 3.00 PLN", () => {
    const a: PLN = {
      zloty: 1,
      groszy: 0,
    };

    const b: PLN = {
      zloty: 2,
      groszy: 0,
    };

    const expectedSum: PLN = {
      zloty: 3,
      groszy: 0,
    };

    expect(sumPLN(a, b)).toStrictEqual(expectedSum);
  });

  test("verifies that 1.99 PLN + 2.99 PLN is 4.98 PLN", () => {
    const a: PLN = {
      zloty: 1,
      groszy: 99,
    };

    const b: PLN = {
      zloty: 2,
      groszy: 99,
    };

    const expectedSum: PLN = {
      zloty: 4,
      groszy: 98,
    };

    expect(sumPLN(a, b)).toStrictEqual(expectedSum);
  });

  test("verifies that 3.75 PLN + 0.00 PLN is 3.75 PLN", () => {
    const a: PLN = {
      zloty: 3,
      groszy: 75,
    };

    const b: PLN = {
      zloty: 0,
      groszy: 0,
    };

    const expectedSum: PLN = {
      zloty: 3,
      groszy: 75,
    };

    expect(sumPLN(a, b)).toStrictEqual(expectedSum);
  });
});
