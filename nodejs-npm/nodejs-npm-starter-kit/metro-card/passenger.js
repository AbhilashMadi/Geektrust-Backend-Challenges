const { Charges, Discounts, PassengerTypes } = require("../utils/constants.js");

class Passenger {
  constructor(type) {
    if (!Object.values(PassengerTypes).includes(type)) throw new Error("Invalid passenger type");

    this.type = type;
    this.isReturn = false;
  }

  getFare() {
    return Charges[this.type]
  }

  calculateFare() {
    const baseFare = this.getFare();

    return this.isReturn
      ? baseFare * Discounts[this.type]
      : baseFare;
  }

  markAsReturn() {
    this.isReturn = true;
  }
}

module.exports = Passenger;