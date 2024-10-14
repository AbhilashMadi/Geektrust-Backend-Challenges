const fs = require("node:fs");

const { Operations } = require("./constants.js");
const Portfolio = require("./portfolio.js");

class PortfolioManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.portfolio = new Portfolio();
    this.validateFilePath();
    this.processFile();
  }

  validateFilePath() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error("Invalid file path provided");
    }
  }

  processFile() {
    try {
      const inputs = fs.readFileSync(this.filePath, "utf-8").trim().split("\n");

      for (const line of inputs) {
        this.processLine(line.trim());
      }
    } catch (error) {
      console.error(`Error processing file: ${error.message}`);
      process.exit(1);
    }
  }

  handleAllocate(params) {
    const [eqAmt, debtAmt, goldAmt] = params.map(Number);
    this.portfolio.allocate(eqAmt, debtAmt, goldAmt);
  }

  handleSIP(params) {
    const [eqAmt, debtAmt, goldAmt] = params.map(Number);
    this.portfolio.sip(eqAmt, debtAmt, goldAmt);
  }

  handleChange(params) {
    const [eqPercent, debtPercent, goldPercent, month] = params;
    const getPercent = (p) => parseFloat(p.slice(0, -1));

    this.portfolio.change(
      getPercent(eqPercent),
      getPercent(debtPercent),
      getPercent(goldPercent),
      month
    );
  }

  handleBalance(params) {
    const [month] = params;
    this.portfolio.balance(month);
  }

  handleRebalance() {
    this.portfolio.rebalance();
  }

  processLine(line) {
    const [operation, ...params] = line.split(/\s+/);

    if (!Object.values(Operations).includes(operation)) {
      throw new Error(`Invalid operation provided: ${operation}`);
    }

    switch (operation) {
      case Operations.ALLOCATE:
        this.handleAllocate(params);
        break;
      case Operations.SIP:
        this.handleSIP(params);
        break;
      case Operations.CHANGE:
        this.handleChange(params);
        break;
      case Operations.BALANCE:
        this.handleBalance(params);
        break;
      case Operations.REBALANCE:
        this.handleRebalance();
        break;
      default:
        console.error("Unknown operation");
    }
  }
}

module.exports = PortfolioManager