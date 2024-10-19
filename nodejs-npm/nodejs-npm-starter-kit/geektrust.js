const fs = require("node:fs");
const path = require("node:path");

const MetroCard = require("./metro-card/metro-card.js");
const { Operations } = require("./utils/constants.js")

try {
    const filePath = process.argv[2];

    if (!filePath) throw new Error("File path is required as an argument.");

    const resolvedPath = path.resolve(filePath);
    const lines = fs.readFileSync(resolvedPath, "utf-8").split("\n").map((l) => l.trim());

    const metroCard = new MetroCard();

    for (const line of lines) {
        const [operation, ...params] = line.split(" ");

        if (!Object.values(Operations).includes(operation)) {
            throw new Error("Invalid operation provided");
        }

        switch (operation) {
            case (Operations.BALANCE): {
                const [cardNumber, balance] = params;
                metroCard.addBalance(cardNumber, parseInt(balance));
                break;
            }
            case (Operations.CHECK_IN): {
                const [cardNumber, passengerType, fromStation] = params;
                metroCard.checkIn(cardNumber, passengerType, fromStation);
                break;
            }
            case (Operations.PRINT_SUMMARY): {
                metroCard.printSummary();
                break;
            }
            default: {
                break;
            }
        }
    }
} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
} finally {
    process.exit(0)
}
