const BidBlastService = require("./src/services/BidblastService.js");

const fs = require('node:fs');
const path = require('node:path');

/**
 * Processes the input.txt file and writes to output.txt
 * @param {string} inputFilePath - Path to the input.txt file
 * @param {string} outputFilePath - Path to the output.txt file
 */
function processFiles(inputFilePath, outputFilePath) {
  try {
    const inputData = fs.readFileSync(inputFilePath, 'utf8');
    const lines = inputData.split('\n').map(line => line.trim()).filter(line => line);

    let outputData = '';

    const bidblast = new BidBlastService();

    lines.forEach((line) => {
      const tokens = line.split(",");

      switch (tokens[0]) {
        case "ADD_MEMBER":
          outputData += `${bidblast.addMember(tokens[1], parseInt(tokens[2]))}\n`;
          break;
        case "ADD_EVENT":
          outputData += `${bidblast.addEvent(tokens[1], tokens[2], tokens[3])}\n`;
          break;
        case "REGISTER_MEMBER":
          outputData += `${bidblast.registerMember(parseInt(tokens[1]), parseInt(tokens[2]))}\n`;
          break;
        case "SUBMIT_BID":
          outputData += `${bidblast.submitBids(parseInt(tokens[1]), parseInt(tokens[2]), tokens.slice(3).map(Number))}\n`;
          break;
        case "DECLARE_WINNER":
          outputData += `${bidblast.declareWinner(parseInt(tokens[1]))}`;
          break;
        default:
          return null;
      }
    });

    fs.writeFileSync(outputFilePath, outputData, 'utf8');
    console.log(`Processed and written: ${outputFilePath}`);
  } catch (err) {
    console.error(`Error processing ${inputFilePath}: ${err.message}`);
  }
}

/**
 * Recursively traverses the directory to find input.txt and output.txt
 * @param {string} folderPath - Path to the folder
 */
function traverseDirectory(folderPath) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      traverseDirectory(fullPath); // Recurse into subdirectory
    } else if (entry.isFile() && entry.name === 'input.txt') {
      const outputFilePath = path.join(folderPath, 'output.txt');
      processFiles(fullPath, outputFilePath);
    }
  });
}

const folderPath = process.argv[2];

if (!folderPath) {
  console.error('Error: Please provide the path to the "test_inputs" folder as an argument.');
  process.exit(1);
}

const absolutePath = path.resolve(folderPath);

if (fs.existsSync(absolutePath)) {
  traverseDirectory(absolutePath);
} else {
  console.error(`Error: The folder "${absolutePath}" does not exist.`);
}
