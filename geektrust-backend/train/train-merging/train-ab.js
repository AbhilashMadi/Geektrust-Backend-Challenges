// Define station distances from Hyderabad for sorting and filtering
const trainAStations = {
  'CHN': 0, 'SLM': 350, 'BLR': 550, 'KRN': 900, 'HYB': 1200,
  'NGP': 1600, 'ITJ': 1900, 'BPL': 2000, 'AGA': 2500, 'NDL': 2700, 'GHY': 4700, 'NJP': 4200
};
const trainBStations = {
  'TVC': 0, 'SRR': 300, 'MAQ': 600, 'MAO': 1000, 'PNE': 1400, 'HYB': 2000,
  'NGP': 2400, 'ITJ': 2700, 'BPL': 2800, 'PTA': 3800, 'NJP': 4200, 'GHY': 4700
};

// Parse input to get train name and bogies
function parseInput(trainStr) {
  const parts = trainStr.split(" ");
  return { trainName: parts[0], bogies: parts.slice(1) };
}

// Filter and sort bogies for arrival at Hyderabad and departure
function filterAndSortBogies(bogies, stationDistances, hybDistance) {
  const arrivalOrder = ["ENGINE"];
  const filteredBogies = [];

  bogies.forEach(bogie => {
    if (stationDistances[bogie] > hybDistance) {
      arrivalOrder.push(bogie);
      filteredBogies.push({ bogie, distance: stationDistances[bogie] });
    }
  });

  // Sort bogies in descending order of their distance for departure
  const departureOrder = filteredBogies.sort((a, b) => b.distance - a.distance);

  return { arrivalOrder, departureOrder };
}

function main() {
  // Sample input
  const trainAInput = "TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR";
  const trainBInput = "TRAIN_B ENGINE NJP GHY AGA PNE MAO BPL PTA";

  // Parse input
  const { trainName: trainAName, bogies: trainABogies } = parseInput(trainAInput);
  const { trainName: trainBName, bogies: trainBBogies } = parseInput(trainBInput);

  // Define Hyderabad distances
  const hybDistanceA = trainAStations['HYB'];
  const hybDistanceB = trainBStations['HYB'];

  // Get arrival and departure orders
  const { arrivalOrder: arrivalA, departureOrder: departureA } = filterAndSortBogies(trainABogies, trainAStations, hybDistanceA);
  const { arrivalOrder: arrivalB, departureOrder: departureB } = filterAndSortBogies(trainBBogies, trainBStations, hybDistanceB);

  // Prepare merged departure order for Train_AB
  const departureAB = ["ENGINE", "ENGINE"].concat([...departureA, ...departureB].map(item => item.bogie));

  // Output results in required format
  console.log("ARRIVAL", trainAName, ...arrivalA);
  console.log("ARRIVAL", trainBName, ...arrivalB);
  console.log("DEPARTURE TRAIN_AB", ...departureAB);
}

// Run the main function
main();
