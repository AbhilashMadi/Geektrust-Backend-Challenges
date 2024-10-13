const Portfolio = require("../src/portfolio");
const { IpOpMsgs } = require("../src/constants.js");

/*

############## TEST Case 01 ##############

INPUT:
ALLOCATE 6000 3000 1000
SIP 2000 1000 500
CHANGE 4.00% 10.00% 2.00% JANUARY
CHANGE -10.00% 40.00% 0.00% FEBRUARY
CHANGE 12.50% 12.50% 12.50% MARCH
CHANGE 8.00% -3.00% 7.00% APRIL
CHANGE 13.00% 21.00% 10.50% MAY
CHANGE 10.00% 8.00% -5.00% JUNE
BALANCE MARCH
REBALANCE

OUTPUT:
10593 7897 2272
23619 11809 3936

############## TEST CASE 02 #############

INPUT:
ALLOCATE 8000 6000 3500
SIP 3000 2000 1000
CHANGE 11.00% 9.00% 4.00% JANUARY
CHANGE -6.00% 21.00% -3.00% FEBRUARY
CHANGE 12.50% 18.00% 12.50% MARCH
CHANGE 23.00% -3.00% 7.00% APRIL
BALANCE MARCH
BALANCE APRIL
REBALANCE

OUTPUT:
15937 14552 6187
23292 16055 7690
CANNOT_REBALANCE

*/



describe("Portfolio", () => {
  let portfolio;

  beforeEach(() => {
    portfolio = new Portfolio();
  });

  test("should handle the given sequence of commands correctly - 01", () => {
    portfolio.allocate(6000, 3000, 1000);
    portfolio.sip(2000, 1000, 500);
    portfolio.change(4.00, 10.00, 2.00, "JANUARY");
    portfolio.change(-10.00, 40.00, 0.00, "FEBRUARY");
    portfolio.change(12.50, 12.50, 12.50, "MARCH");
    portfolio.change(8.00, -3.00, 7.00, "APRIL");
    portfolio.change(13.00, 21.00, 10.50, "MAY");
    portfolio.change(10.00, 8.00, -5.00, "JUNE");

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    portfolio.balance("MARCH");
    portfolio.rebalance();

    expect(consoleSpy).toHaveBeenCalledWith('10593 7897 2272');
    expect(consoleSpy).toHaveBeenCalledWith('23619 11809 3936');

    consoleSpy.mockRestore();
  });

  test("should handle the given sequence of commands correctly - 02", () => {
    portfolio.allocate(8000, 6000, 3500);
    portfolio.sip(3000, 2000, 1000);
    portfolio.change(11.00, 9.00, 4.00, "JANUARY");
    portfolio.change(-6.00, 21.00, -3.00, "FEBRUARY");
    portfolio.change(12.50, 18.00, 12.50, "MARCH");
    portfolio.change(23.00, -3.00, 7.00, "APRIL");

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    portfolio.balance("MARCH");
    portfolio.balance("APRIL");
    portfolio.rebalance();

    expect(consoleSpy).toHaveBeenCalledWith("15937 14552 6187");
    expect(consoleSpy).toHaveBeenCalledWith("23292 16055 7690");
    expect(consoleSpy).toHaveBeenCalledWith(IpOpMsgs.CANT_REBALANCE);

    consoleSpy.mockRestore();
  });
});
