const fs = require("node:fs");

const PortfolioManager = require("../src/portfolio-manager.js");
const Portfolio = require("../src/portfolio.js");

jest.mock("node:fs");
jest.mock("../src/portfolio.js");

describe("PortfolioManager", () => {
  let mockPortfolio;

  beforeEach(() => {
    mockPortfolio = {
      allocate: jest.fn(),
      sip: jest.fn(),
      change: jest.fn(),
      balance: jest.fn(),
      rebalance: jest.fn(),
    };
    Portfolio.mockImplementation(() => mockPortfolio);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    // Mock process.exit to prevent it from actually exiting the process
    jest.spyOn(process, "exit").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });  // Mock console.error
  });

  afterAll(() => {
    process.exit.mockRestore();
    console.error.mockRestore();
  });

  test("should throw an error if file path is invalid", () => {
    fs.existsSync.mockReturnValue(false);

    expect(() => {
      new PortfolioManager("invalid-path");
    }).toThrow("Invalid file path provided");
  });

  test("should process valid file with correct operations", () => {
    const filePath = "valid-path";
    const mockFileContent = [
      "ALLOCATE 1000 2000 3000",
      "SIP 100 200 300",
      "CHANGE 5% 10% 15% JANUARY",
      "BALANCE JANUARY",
      "REBALANCE",
    ].join("\n");

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockFileContent);

    new PortfolioManager(filePath);

    expect(mockPortfolio.allocate).toHaveBeenCalledWith(1000, 2000, 3000);
    expect(mockPortfolio.sip).toHaveBeenCalledWith(100, 200, 300);
    expect(mockPortfolio.change).toHaveBeenCalledWith(5, 10, 15, "JANUARY");
    expect(mockPortfolio.balance).toHaveBeenCalledWith("JANUARY");
    expect(mockPortfolio.rebalance).toHaveBeenCalled();
  });

  // test("should throw an error for invalid operation", () => {
  //   const filePath = "valid-path";
  //   const mockFileContent = "INVALID_OPERATION 100 200 300\n";

  //   fs.existsSync.mockReturnValue(true);
  //   fs.readFileSync.mockReturnValue(mockFileContent);

  //   expect(() => {
  //     new PortfolioManager(filePath);
  //   }).toThrow("Invalid operation provided: INVALID_OPERATION");
  // });

  test("should call handleAllocate with correct parameters", () => {
    const filePath = "valid-path";
    const mockFileContent = "ALLOCATE 1000 2000 3000";

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockFileContent);

    new PortfolioManager(filePath);

    expect(mockPortfolio.allocate).toHaveBeenCalledWith(1000, 2000, 3000);
  });

  test("should call handleSIP with correct parameters", () => {
    const filePath = "valid-path";
    const mockFileContent = "SIP 100 200 300";

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockFileContent);

    new PortfolioManager(filePath);

    expect(mockPortfolio.sip).toHaveBeenCalledWith(100, 200, 300);
  });

  test("should call handleChange with correct parameters", () => {
    const filePath = "valid-path";
    const mockFileContent = "CHANGE 5% 10% 15% JANUARY";

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockFileContent);

    new PortfolioManager(filePath);

    expect(mockPortfolio.change).toHaveBeenCalledWith(5, 10, 15, "JANUARY");
  });

  test("should call handleBalance with correct month", () => {
    const filePath = "valid-path";
    const mockFileContent = "BALANCE JANUARY";

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockFileContent);

    new PortfolioManager(filePath);

    expect(mockPortfolio.balance).toHaveBeenCalledWith("JANUARY");
  });

  test("should call handleRebalance correctly", () => {
    const filePath = "valid-path";
    const mockFileContent = "REBALANCE";

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockFileContent);

    new PortfolioManager(filePath);

    expect(mockPortfolio.rebalance).toHaveBeenCalled();
  });
});
