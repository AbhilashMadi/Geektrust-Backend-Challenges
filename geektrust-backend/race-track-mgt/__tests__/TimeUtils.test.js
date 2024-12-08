const TimeUtils = require("../src/utils/TimeUtils.js");

describe("TimeUtils", () => {
  describe("parseTime", () => {
    it("should parse a valid time string into a Date object", () => {
      const time = TimeUtils.parseTime("14:30");
      expect(time).toBeInstanceOf(Date);
      expect(time.getHours()).toBe(14);
      expect(time.getMinutes()).toBe(30);
    });

    it("should throw an error for invalid time strings", () => {
      expect(() => TimeUtils.parseTime("invalid")).toThrow();
    });
  });

  describe("isValidEntryTime", () => {
    it("should return true for a valid entry time within opening hours", () => {
      const validTime = TimeUtils.parseTime("14:00");
      expect(TimeUtils.isValidEntryTime(validTime)).toBe(true);
    });

    it("should return false for an entry time before opening hours", () => {
      const earlyTime = TimeUtils.parseTime("12:00");
      expect(TimeUtils.isValidEntryTime(earlyTime)).toBe(false);
    });

    it("should return false for an entry time after closing hours", () => {
      const lateTime = TimeUtils.parseTime("18:00");
      expect(TimeUtils.isValidEntryTime(lateTime)).toBe(false);
    });
  });

  describe("calculateEndTime", () => {
    it("should calculate the correct end time given a start time and duration", () => {
      const startTime = TimeUtils.parseTime("13:00");
      const endTime = TimeUtils.calculateEndTime(startTime, 3); // 3 hours
      expect(endTime).toBeInstanceOf(Date);
      expect(endTime.getHours()).toBe(16);
      expect(endTime.getMinutes()).toBe(0);
    });
  });

  describe("calculateAdditionalHours", () => {
    it("should calculate additional hours beyond the original end time", () => {
      const originalEndTime = TimeUtils.parseTime("15:00");
      const newEndTime = TimeUtils.parseTime("17:30");

      const additionalHours = TimeUtils.calculateAdditionalHours(originalEndTime, newEndTime);
      expect(additionalHours).toBe(3); // 2.5 hours, rounded up
    });

    it("should return 0 if extra time is within the free extra minutes", () => {
      const originalEndTime = TimeUtils.parseTime("15:00");
      const newEndTime = TimeUtils.parseTime("15:10"); // Only 10 extra minutes

      const additionalHours = TimeUtils.calculateAdditionalHours(originalEndTime, newEndTime);
      expect(additionalHours).toBe(0);
    });

    it("should calculate additional hours correctly for exact free extra minutes", () => {
      const originalEndTime = TimeUtils.parseTime("15:00");
      const newEndTime = TimeUtils.parseTime("15:15"); // Exactly 15 minutes

      const additionalHours = TimeUtils.calculateAdditionalHours(originalEndTime, newEndTime);
      expect(additionalHours).toBe(0); // Free extra minutes apply
    });

    it("should return 1 hour for an extra time just over free minutes", () => {
      const originalEndTime = TimeUtils.parseTime("15:00");
      const newEndTime = TimeUtils.parseTime("15:16"); // 16 extra minutes

      const additionalHours = TimeUtils.calculateAdditionalHours(originalEndTime, newEndTime);
      expect(additionalHours).toBe(1);
    });
  });
});
