const { Stations } = require("../utils/constants.js");

class Station {
  constructor(name) {
    if (!Object.values(Stations).includes(name)) throw new Error("Invalid station name entered");

    this.name = name;

    this.totalCollection = 0;
    this.totalDiscount = 0;
    this.serviceFeeCollection = 0;
    this.passengerSummary = {};
  }

  updateCollection(amount, discount, serviceFee = 0) {
    this.totalCollection += amount;
    this.totalDiscount += discount;
    this.serviceFeeCollection += serviceFee;
  }

  addPassenger(type) {
    this.passengerSummary[type] = (this.passengerSummary[type] ?? 0) + 1;
  }

  printSummary() {
    console.log(`TOTAL_COLLECTION ${this.name} ${this.totalCollection + this.serviceFeeCollection} ${this.totalDiscount}`);
    console.log("PASSENGER_TYPE_SUMMARY");

    Object.entries(this.passengerSummary)
      .sort(((a, b) => {
        //in case the passenger count is same sorting the stations based on there name
        return b[1] === a[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]
      }))
      .forEach(([type, count]) => { console.log(`${type} ${count}`) })
  }
}

module.exports = Station;