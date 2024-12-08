const MetroCard = require("../metro-card/metro-card.js");
const { Stations, ServiceFee, PassengerTypes, Charges, Discounts } = require("../utils/constants.js");

describe("MetroCard Tests", () => {
  let metroCard;

  const cardNum = "CARD123";
  const adultCharge = Charges[PassengerTypes.ADULT];
  // const kidCharge = Charges[PassengerTypes.KID];
  const adultDiscount = Discounts[PassengerTypes.ADULT];
  const serviceFeeRate = ServiceFee[PassengerTypes.ADULT];
  const insufficientBalance = 50;

  beforeEach(() => {
    metroCard = new MetroCard();
    jest.clearAllMocks();
  });

  it("should initialize with no cards and stations", () => {
    expect(metroCard.cards).toEqual({});
    expect(metroCard.stations).toHaveProperty(Stations.CENTRAL);
    expect(metroCard.stations).toHaveProperty(Stations.AIRPORT);
  });

  it("should add balance to a metro card", () => {
    const balance = 500;
    metroCard.addBalance(cardNum, balance);

    expect(metroCard.cards[cardNum]).toEqual({ balance, journeys: 0 });
  });

  it("should throw an error for non-existent card during check-in", () => {
    expect(() => metroCard.checkIn("NON_EXISTENT_CARD", PassengerTypes.ADULT, Stations.CENTRAL))
      .toThrow("Card not found!");
  });

  it("should allow check-in with sufficient balance", () => {
    metroCard.addBalance(cardNum, adultCharge);
    metroCard.checkIn(cardNum, PassengerTypes.ADULT, Stations.CENTRAL);

    expect(metroCard.cards[cardNum].balance).toBe(0); // Expect balance to be 0 after fare deduction
    expect(metroCard.cards[cardNum].journeys).toBe(1); // Expect journey count to increment by 1
  });

  it("should trigger auto-recharge if balance is insufficient", () => {
    metroCard.addBalance(cardNum, insufficientBalance); // Not enough for a fare of adultCharge
    metroCard.checkIn(cardNum, PassengerTypes.ADULT, Stations.CENTRAL);

    const expectedRecharge = adultCharge - insufficientBalance; // Needs more to cover the charge
    const serviceFee = Math.ceil(expectedRecharge * serviceFeeRate); // Calculate service fee

    expect(metroCard.cards[cardNum].balance).toBe(0); // After fare deduction, should be 0
    expect(metroCard.cards[cardNum].journeys).toBe(1);
    expect(metroCard.stations[Stations.CENTRAL].totalCollection).toBe(adultCharge); // Fare
    expect(metroCard.stations[Stations.CENTRAL].serviceFeeCollection).toBe(serviceFee); // Service fee collected
  });

  it("should correctly handle return journeys with discounts", () => {
    const totalFare = adultCharge * 2; // Total fare for two journeys

    metroCard.addBalance(cardNum, totalFare);
    metroCard.checkIn(cardNum, PassengerTypes.ADULT, Stations.CENTRAL); // First journey
    metroCard.checkIn(cardNum, PassengerTypes.ADULT, Stations.AIRPORT); // Second journey (return)

    const discountAmount = adultCharge * adultDiscount; // Calculate discount for return journey
    /**
     * balance = 400
     * ---journey to CENTRAL --> -200
     * <---return to AIRPORT --- -100 (200 - 100) [50% discount on return charge]
     * balance = 400 - 300 = 100
     */
    expect(metroCard.cards[cardNum].balance).toBe(totalFare - (adultCharge + (adultCharge - discountAmount))); // Expect remaining balance after both journeys
    expect(metroCard.cards[cardNum].journeys).toBe(2); // Expect journey count to increment by 2
    expect(metroCard.stations[Stations.CENTRAL].totalCollection).toBe(adultCharge); // Total for the first journey
    expect(metroCard.stations[Stations.AIRPORT].totalCollection).toBe(adultCharge - discountAmount); // Total after discount for the return journey
  });

  it("should print the summary correctly", () => {
    console.log = jest.fn();

    metroCard.addBalance(cardNum, 250);
    metroCard.checkIn(cardNum, PassengerTypes.ADULT, Stations.CENTRAL);
    metroCard.checkIn(cardNum, PassengerTypes.KID, Stations.AIRPORT);

    metroCard.printSummary();

    expect(console.log).toHaveBeenCalledWith(`TOTAL_COLLECTION ${Stations.CENTRAL} ${adultCharge} 0`); // Total for the adult journey
    expect(console.log).toHaveBeenCalledWith("PASSENGER_TYPE_SUMMARY");
    expect(console.log).toHaveBeenCalledWith(`${PassengerTypes.ADULT} 1`); // Summary for adult passengers
  });
});
