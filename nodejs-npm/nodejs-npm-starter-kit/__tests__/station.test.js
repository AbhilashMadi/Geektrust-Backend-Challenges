const Station = require("../metro-card/station.js");
const { Stations, PassengerTypes } = require("../utils/constants.js");

describe("Station Tests", () => {
  let station;

  /* Tests Parameters */
  const collection = 200;
  const discount = 50;
  const serviceFee = 10;

  beforeEach(() => {
    station = new Station(Stations.CENTRAL);
  });

  it("should initialize with correct name", () => {
    expect(station.name).toBe(Stations.CENTRAL);
    expect(station.totalCollection).toBe(0);
    expect(station.totalDiscount).toBe(0);
    expect(station.serviceFeeCollection).toBe(0);
    expect(station.passengerSummary).toEqual({});
  });

  it("should throw an error for invalid station name", () => {
    expect(() => new Station("INVALID_STATION")).toThrow("Invalid station name entered");
  });

  it("should update total collection correctly", () => {

    station.updateCollection(collection, discount, serviceFee); // Update with amount, discount, and service fee
    expect(station.totalCollection).toBe(collection);
    expect(station.totalDiscount).toBe(discount);
    expect(station.serviceFeeCollection).toBe(serviceFee);
  });

  it("should add a passenger correctly", () => {
    station.addPassenger(PassengerTypes.ADULT);
    expect(station.passengerSummary[PassengerTypes.ADULT]).toBe(1);
  });

  it("should correctly update passenger count when adding the same type", () => {
    station.addPassenger(PassengerTypes.ADULT);
    station.addPassenger(PassengerTypes.ADULT);
    expect(station.passengerSummary[PassengerTypes.ADULT]).toBe(2);
  });

  it("should print summary correctly", () => {
    // Mocking console.log to test print output
    console.log = jest.fn();

    station.updateCollection(collection, discount, serviceFee);
    station.addPassenger(PassengerTypes.ADULT)
    station.addPassenger(PassengerTypes.KID);
    station.addPassenger(PassengerTypes.ADULT); // Adding another adult

    station.printSummary();

    expect(console.log).toHaveBeenCalledWith(`TOTAL_COLLECTION ${Stations.CENTRAL} 210 50`); // Total collection should include service fee
    expect(console.log).toHaveBeenCalledWith("PASSENGER_TYPE_SUMMARY");
    expect(console.log).toHaveBeenCalledWith(`${PassengerTypes.ADULT} 2`);
    expect(console.log).toHaveBeenCalledWith(`${PassengerTypes.KID} 1`);
  });

  it("should sort passengers by count and name correctly in summary", () => {
    // Resetting and adding passengers
    console.log = jest.fn(); // Reset mock
    station.addPassenger(PassengerTypes.KID);
    station.addPassenger(PassengerTypes.SENIOR_CITIZEN);
    station.addPassenger(PassengerTypes.ADULT);
    station.addPassenger(PassengerTypes.ADULT); // Adding another adult
    station.addPassenger(PassengerTypes.KID); // Adding another kid

    station.printSummary();

    // Expected order: ADULT 2, KID 2, SENIOR_CITIZEN 1
    expect(console.log).toHaveBeenCalledWith(`${PassengerTypes.ADULT} 2`);
    expect(console.log).toHaveBeenCalledWith(`${PassengerTypes.KID} 2`);
    expect(console.log).toHaveBeenCalledWith(`${PassengerTypes.SENIOR_CITIZEN} 1`);
  });
});
