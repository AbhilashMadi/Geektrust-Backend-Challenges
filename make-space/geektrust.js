// Required modules
const fs = require("node:fs");
const path = require("node:path");

// Custom modules
const { Operations } = require("./src/utils/constants.js");
const BookingManager = require("./src/make-space/booking-manager.js");

class Main {
  constructor(filePath) {
    this.filePath = filePath;
    this.bookings = new BookingManager();
    this.validateFilePath();
    this.processFile();
  }

  /**
   * Validates the provided file path
   * Throws an error if the path is invalid or the file does not exist
   */
  validateFilePath() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`File not found at: ${this.filePath}`);
    }

    if (!fs.lstatSync(this.filePath).isFile()) {
      throw new Error("The provided path is not a file");
    }
  }

  /**
   * Reads and processes the file line-by-line
   * Splits each line and delegates processing based on operation type
   */
  processFile() {
    try {
      const inputs = fs.readFileSync(this.filePath, "utf-8").trim().split("\n");

      inputs.forEach((line) => {
        this.processLine(line.trim());
      });
    } catch (error) {
      console.error(`Error processing file: ${error.message}`);
      // process.exit(1);
    }
  }

  /**
   * Handles booking operation and logs the result
   * @param {Array} params - Array of parameters [startTime, endTime, personCapacity]
   */
  handleBook(params) {
    const [startTime, endTime, capacity] = params;
    console.log(this.bookings.book(startTime, endTime, parseInt(capacity)));
  }

  /**
   * Handles vacancy check operation and logs the result
   * @param {Array} params - Array of parameters [startTime, endTime]
   */
  handleCheckVacancy(params) {
    const [startTime, endTime] = params;
    console.log(this.bookings.checkVacancy(startTime, endTime));
  }

  /**
   * Processes each line of the input file, determines the operation type,
   * and delegates to the appropriate handler
   * @param {string} line - A single line from the input file
   */
  processLine(line) {
    const [operation, ...params] = line.split(/\s+/);

    if (!Object.values(Operations).includes(operation)) {
      throw new Error(`Invalid operation: ${operation}`);
    }

    switch (operation) {
      case Operations.BOOK:
        this.handleBook(params);
        break;
      case Operations.VACANCY:
        this.handleCheckVacancy(params);
        break;
      default:
        console.error("Unknown operation");
    }
  }
}

// Entry point
(() => {
  try {
    const args = process.argv;

    if (args.length < 3) {
      throw new Error("No file path provided. Please provide a valid file path as an argument.");
    }

    const filePath = path.resolve(args[2]);
    new Main(filePath);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1);
  }
})();

module.exports = Main