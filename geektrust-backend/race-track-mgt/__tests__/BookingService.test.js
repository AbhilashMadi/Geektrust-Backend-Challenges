const BookingService = require("../src/services/BookingService.js");

describe("BookingService.js", () => {
  const bookingService = new BookingService();

  it("BOOK", () => { expect(bookingService.handleBooking("BIKE", "M40", "14:00")).toBe("SUCCESS") });
  it("BOOK", () => { expect(bookingService.handleBooking("CAR", "034", "15:00")).toBe("SUCCESS") });
  it("BOOK", () => { expect(bookingService.handleBooking("SUV", "A66", "11:00")).toBe("INVALID_ENTRY_TIME") });

  it("ADDITIONAL", () => { expect(bookingService.handleAdditional("M40", "17:40")).toBe("SUCCESS") });
  it("ADDITIONAL", () => { expect(bookingService.handleAdditional("O34", "20:50")).toBe("INVALID_EXIT_TIME") });

  it("REVENUE", () => { expect(bookingService.handleRevenue()).toBe("590 0") });
})