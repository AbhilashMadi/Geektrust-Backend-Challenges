const fs = require("node:fs");

const { Operations } = require("./src/constants.js");
const Portfolio = require("./src/portfolio.js");

/*  CODE MAP
    START

    1.PARSE command-line arguments to get the file path
      - Command-line arguments provided: args
      - IF arguments < 3:
        - PRINT error message: "Missing required argument: File Path"
        - EXIT the program

    2.VALIDATE if the file path exists
      - IF file path does not exist:
        - PRINT error message: "Invalid file path provided"
        - EXIT the program

    3.INITIALIZE a new portfolio object
      - portfolio = new Portfolio()

    4.READ the file content
      - READ the file located at filePath
      - SPLIT the content into individual lines

    5.FOR each line in the file:
      - TRIM the line and SPLIT it into the operation and parameters
      - SWITCH based on the operation:
        
        a.IF operation is ALLOCATE:
            - PARSE parameters as numbers
            - CALL portfolio.allocate(eqAmt, debtAmt, goldAmt)
        
        b.IF operation is SIP:
            - PARSE parameters as numbers
            - CALL portfolio.sip(eqAmt, debtAmt, goldAmt)
        
        c.IF operation is CHANGE:
            - PARSE parameters: percentages and month
            - CONVERT percentage strings into float values (removing '%')
            - CALL portfolio.change(eqPercent, debtPercent, goldPercent, month)
        
        d.IF operation is BALANCE:
            - PARSE parameters: month
            - CALL portfolio.balance(month)
        
        e.IF operation is REBALANCE:
            - CALL portfolio.rebalance()

    6.HANDLE any errors:
      - IF an unknown operation is encountered:
      - THROW an error: "Invalid operation provided"
      - CATCH any other errors and PRINT the error message
      - EXIT the program

    7.EXIT the program once all operations are processed

    END
*/

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

// Main execution
const args = process.argv;
if (args.length < 3) {
  console.error("Error: Missing required argument: File Path");
  process.exit(1);
}

try {
  const filePath = args[2];
  new PortfolioManager(filePath);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} finally {
  process.exit(1);
}
