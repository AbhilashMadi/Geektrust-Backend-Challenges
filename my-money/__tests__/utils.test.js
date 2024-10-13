const { getMonthsList } = require("../src/utils");

describe("getMonthsList", () => {
  test("should return an array of month names in uppercase", () => {
    const expectedMonths = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER"
    ];
    const months = getMonthsList();
    expect(months).toEqual(expectedMonths);
  });
});
