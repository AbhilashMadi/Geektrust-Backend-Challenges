const fs = require("node:fs");
const { Operations } = require("./src/constants.js");
const Portfolio = require("./src/portfolio.js");

const args = process.argv;

// Validate the number of arguments provided
if (args.length < 3) {
  console.error("Error: Missing required argument: File Path");
  process.exit(1);
}

const filePath = args[2];

// Check if the file path is valid
if (!fs.existsSync(filePath)) {
  console.error("Error: Invalid file path provided");
  process.exit(1);
}

try {
  const portfolio = new Portfolio();
  const inputs = fs.readFileSync(filePath, "utf-8").trim().split("\n");

  for (const line of inputs) {
    const [operation, ...params] = line.trim().split(/\s+/);

    // Validate the operation
    if (!Object.values(Operations).includes(operation)) {
      throw new Error("Invalid operation provided");
    }

    switch (operation) {
      case Operations.ALLOCATE: {
        const [eqAmt, debtAmt, goldAmt] = params.map(Number);
        portfolio.allocate(eqAmt, debtAmt, goldAmt);
        break;
      }
      case Operations.SIP: {
        const [eqAmt, debtAmt, goldAmt] = params.map(Number);
        portfolio.sip(eqAmt, debtAmt, goldAmt);
        break;
      }
      case Operations.CHANGE: {
        const [eqPercent, debtPercent, goldPercent, month] = params;
        const getPercent = (p) => parseFloat(p.slice(0, -1));

        portfolio.change(getPercent(eqPercent), getPercent(debtPercent), getPercent(goldPercent), month);
        break;
      }
      case Operations.BALANCE: {
        const [month] = params;
        portfolio.balance(month);
        break;
      }
      case Operations.REBALANCE: {
        portfolio.rebalance();
        break;
      }
      default:
        console.error("Error: Unknown operation");
        break;
    }
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} finally {
  process.exit(0);
}
