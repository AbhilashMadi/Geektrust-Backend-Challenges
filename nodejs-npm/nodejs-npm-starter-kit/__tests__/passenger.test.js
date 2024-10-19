const { Charges, Discounts, PassengerTypes } = require("../utils/constants.js");
const Passenger = require("../metro-card/passenger.js");

describe("Passenger class", () => {
  it("should initialize the correct passenger type", () => {
    const passenger = new Passenger(PassengerTypes.ADULT);
    expect(passenger.type).toBe(PassengerTypes.ADULT);
  });

  it("should throw an error for an invalid passenger type", () => {
    expect(() => new Passenger("INVALID_TYPE")).toThrow("Invalid passenger type");
  });

  describe("getFare method", () => {
    it("should return the correct fare for ADULT", () => {
      const passenger = new Passenger(PassengerTypes.ADULT);
      expect(passenger.getFare()).toBe(Charges[PassengerTypes.ADULT]);
    });

    it("should return the correct fare for SENIOR_CITIZEN", () => {
      const passenger = new Passenger(PassengerTypes.SENIOR_CITIZEN);
      expect(passenger.getFare()).toBe(Charges[PassengerTypes.SENIOR_CITIZEN]);
    });

    it("should return the correct fare for KID", () => {
      const passenger = new Passenger(PassengerTypes.KID);
      expect(passenger.getFare()).toBe(Charges[PassengerTypes.KID]);
    });
  });

  describe("calculateFare method", () => {
    it("should return the correct fare for a single journey", () => {
      const passenger = new Passenger(PassengerTypes.ADULT);
      expect(passenger.calculateFare()).toBe(Charges[PassengerTypes.ADULT]);
    });

    it("should return the correct fare for a return journey with a discount for ADULT", () => {
      const passenger = new Passenger(PassengerTypes.ADULT);
      passenger.markAsReturn();
      expect(passenger.calculateFare()).toBe(Charges[PassengerTypes.ADULT] * Discounts[PassengerTypes.ADULT]);
    });

    it("should return the correct fare for a return journey with a discount for SENIOR_CITIZEN", () => {
      const passenger = new Passenger(PassengerTypes.SENIOR_CITIZEN);
      passenger.markAsReturn();
      expect(passenger.calculateFare()).toBe(Charges[PassengerTypes.SENIOR_CITIZEN] * Discounts[PassengerTypes.SENIOR_CITIZEN]);
    });

    it("should return the correct fare for a return journey with a discount for KID", () => {
      const passenger = new Passenger(PassengerTypes.KID);
      passenger.markAsReturn();
      expect(passenger.calculateFare()).toBe(Charges[PassengerTypes.KID] * Discounts[PassengerTypes.KID]);
    });
  });

  describe("markAsReturn method", () => {
    it("should correctly mark the journey as a return journey", () => {
      const passenger = new Passenger(PassengerTypes.ADULT);
      passenger.markAsReturn();
      expect(passenger.isReturn).toBe(true);
    });
  });
});
