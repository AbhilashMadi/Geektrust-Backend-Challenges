const PortfolioManager = require("./src/portfolio-manager");

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
