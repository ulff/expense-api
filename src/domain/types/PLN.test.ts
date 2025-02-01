import { sumPLN, PLN } from "./PLN";

describe("sumPLN tests", () => {
  test("adds 1.00 PLN and 2.00 PLN properly", () => {
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
});
