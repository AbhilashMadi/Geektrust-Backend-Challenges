const path = require("node:path");
const fs = require("node:fs");
const process = require("node:process");

const BookingService = require("./src/services/BookingService.js");

const args = process.argv;

if (args.length < 3) {
    console.error("Error: File path not provided.");
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), args[2]);

try {
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        throw new Error("The provided path is not a valid file.");
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const commands = fileContent.split("\n").filter(Boolean);

    const bookingService = new BookingService();

    commands.forEach((line, index) => {
        try {
            const [command, ...params] = line.trim().split(" ");

            switch (command) {
                case "BOOK":
                    console.log(bookingService.handleBooking(...params));
                    break;
                case "ADDITIONAL":
                    console.log(bookingService.handleAdditional(...params));
                    break;
                case "REVENUE":
                    console.log(bookingService.handleRevenue());
                    break;
                default:
                    throw new Error(`Invalid command "${command}" at line ${index + 1}`);
            }
        } catch (cmdError) {
            console.error(`Error processing command at line ${index + 1}: ${cmdError.message}`);
        }
    });

} catch (error) {
    if (error.code === "ENOENT") {
        console.error(`Error: The file at path "${filePath}" does not exist.`);
    } else {
        console.error(`Error: ${error.message}`);
    }
    process.exit(1);
}
