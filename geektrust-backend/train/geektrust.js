const fs = require("node:fs");
const path = require("node:path");

const { OPERATIONS, TRAIN_A_STATIONS, TRAIN_B_STATIONS } = require("./utils/constants.js");
const TrainAB = require("./train-merging/train-ab.js");
const Train = require("./train-merging/train.js");

try {
    const filePath = process.argv[2];

    if (!filePath) throw new Error("File path is required as an argument.");

    const resolvedPath = path.resolve(filePath);
    const lines = fs.readFileSync(resolvedPath, "utf-8").split("\n").map((l) => l.trim());

    const trainA = new Train(OPERATIONS.TRAIN_A, TRAIN_A_STATIONS, lines[0].split(" ").slice(1));
    const trainB = new Train(OPERATIONS.TRAIN_B, TRAIN_B_STATIONS, lines[1].split(" ").slice(1));

    const trainAB = new TrainAB(trainA, trainB);
    trainAB.printOutput();

    // for (const line of lines) {
    //     const [operation, ...params] = line.split(" ");

    //     if (!Object.values(OPERATIONS).includes(operation)) {
    //         throw new Error("Invalid operation provided");
    //     }

    //     switch (operation) {
    //         case OPERATIONS.TRAIN_A:

    //             break;
    //         case OPERATIONS.TRAIN_B:
    //             break;
    //         default: {
    //             break;
    //         }
    //     }
    // }
} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
} finally {
    process.exit(0)
}
