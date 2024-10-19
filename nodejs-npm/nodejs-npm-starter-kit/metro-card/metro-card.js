const { Charges, Discounts, Stations, ServiceFee } = require("../utils/constants.js");
const Station = require("../metro-card/station.js");

class MetroCard {
  constructor() {
    /**
     * @typedef {object} CardDetails
     * @property {number} balance
     * @property {number} journeys
     */

    /**
     * A collection of metro-cards
     * @type {object.<string, CardDetails>}
     */
    this.cards = {};
    this.stations = {
      CENTRAL: new Station(Stations.CENTRAL),
      AIRPORT: new Station(Stations.AIRPORT),
    };
  }

  // Method to add balance to a metro card
  addBalance(cardNumber, balance) {
    this.cards[cardNumber] = { balance, journeys: 0 };
  }

  checkIn(cardNumber, passengerType, fromStation) {
    if (!this.cards[cardNumber]) throw new Error("Card not found!");

    const station = this.stations[fromStation];
    const card = this.cards[cardNumber];

    // Determine if this is a return journey
    const isReturnJourney = card.journeys % 2 === 1;

    // Base fare for the given passenger type
    const baseFare = Charges[passengerType];

    // Apply a 50% discount on the fare if it's a return journey
    const discount = isReturnJourney ? baseFare * Discounts[passengerType] : 0;
    const totalFare = baseFare - discount;
    let serviceFee = 0;

    // Check if the balance is sufficient; if not, trigger auto-recharge
    if (card.balance < totalFare) {
      const rechargeAmount = totalFare - card.balance;
      serviceFee = Math.ceil(rechargeAmount * ServiceFee[passengerType]); // 2% service fee, rounded up

      // Auto-recharge: Add the required amount to the card balance
      card.balance += rechargeAmount;
    }

    // Deduct the travel fare from the balance after recharge (if needed)
    card.balance -= totalFare;
    card.journeys += 1;

    // Update the station's collection with the fare and discount
    station.updateCollection(totalFare, discount, serviceFee);
    station.addPassenger(passengerType);
  }

  // Print summary for all stations
  printSummary() {
    Object.keys(this.stations).forEach((stationName) => {
      this.stations[stationName].printSummary();
    });
  }
}

module.exports = MetroCard;
