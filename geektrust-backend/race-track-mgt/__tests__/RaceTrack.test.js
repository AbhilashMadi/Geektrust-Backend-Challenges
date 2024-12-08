const RaceTrack = require("../src/entities/RaceTrack.js");
const TimeUtils = require("../src/utils/TimeUtils.js");

describe("RaceTrack Class", () => {
  let raceTrack;

  beforeEach(() => {
    raceTrack = new RaceTrack("REGULAR", "CAR", 2, 100);
  });

  describe("isAvailable", () => {
    test("should return true when track has availability", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      expect(raceTrack.isAvailable(entryTime)).toBe(true);
    });

    test("should return false when track is full", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      raceTrack.book("CAR1", entryTime);
      raceTrack.book("CAR2", entryTime);

      expect(raceTrack.isAvailable(entryTime)).toBe(false);
    });
  });

  describe("book", () => {
    test("should successfully book when track is available", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      const result = raceTrack.book("CAR1", entryTime);

      expect(result).toBe("SUCCESS");
    });

    test("should return 'RACETRACK_FULL' when track is full", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      raceTrack.book("CAR1", entryTime);
      raceTrack.book("CAR2", entryTime);

      const result = raceTrack.book("CAR3", entryTime);
      expect(result).toBe("RACETRACK_FULL");
    });
  });

  describe("extendBooking", () => {
    test("should successfully extend booking when exit time is valid", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      const exitTime = TimeUtils.parseTime("18:00");
      raceTrack.book("CAR1", entryTime);

      const result = raceTrack.extendBooking("CAR1", exitTime);
      expect(result).toBe("SUCCESS");

      const booking = raceTrack.bookings.get("CAR1");
      expect(booking.endTime).toEqual(exitTime);
      expect(booking.extendedHours).toBe(1); // 1 extra hour over 15 min free extra time
    });

    test("should return 'INVALID_EXIT_TIME' for non-existent booking", () => {
      const exitTime = TimeUtils.parseTime("18:00");
      const result = raceTrack.extendBooking("CAR1", exitTime);

      expect(result).toBe("INVALID_EXIT_TIME");
    });

    test("should return 'INVALID_EXIT_TIME' when exit time is before original end time", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      const invalidExitTime = TimeUtils.parseTime("16:00"); // Before default end time
      raceTrack.book("CAR1", entryTime);

      const result = raceTrack.extendBooking("CAR1", invalidExitTime);
      expect(result).toBe("INVALID_EXIT_TIME");
    });
  });

  describe("calculateRevenue", () => {
    test("should calculate revenue correctly for default bookings", () => {
      const entryTime1 = TimeUtils.parseTime("14:00");
      const entryTime2 = TimeUtils.parseTime("15:00");

      raceTrack.book("CAR1", entryTime1);
      raceTrack.book("CAR2", entryTime2);

      const revenue = raceTrack.calculateRevenue();
      expect(revenue).toBe(600); // 3 hours * 100 per hour * 2 bookings
    });

    test("should calculate revenue correctly for bookings with extensions", () => {
      const entryTime = TimeUtils.parseTime("14:00");
      const exitTime = TimeUtils.parseTime("18:00");

      raceTrack.book("CAR1", entryTime);
      raceTrack.extendBooking("CAR1", exitTime);

      const revenue = raceTrack.calculateRevenue();
      expect(revenue).toBe(350); // 3 hours * 100 + 50 (1 additional hour)
    });
  });
});
