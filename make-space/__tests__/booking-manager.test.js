// booking-manager.test.js
const BookingManager = require("../src/make-space/booking-manager.js");
const { IpOpMessages, MIN_PERSON_CAPACITY, MAX_PERSON_CAPACITY } = require("../src/utils/constants.js");

describe("BookingManager class", () => {
  let manager;

  beforeEach(() => {
    manager = new BookingManager(); // Initialize the manager before each test
  });

  test("should initialize with rooms and buffer times", () => {
    expect(manager.rooms.length).toBe(3); // 3 rooms: C-Cave, D-Tower, G-Mansion
    expect(manager.bufferTimes.length).toBe(3); // 3 buffer times
  });

  test("should convert time to slot correctly", () => {
    expect(manager.timeToSlot("00:00")).toBe(0);
    expect(manager.timeToSlot("09:00")).toBe(36); // 09:00 is the 36th slot (9 * 4)
    expect(manager.timeToSlot("23:45")).toBe(95); // Last slot of the day
  });

  test("should validate slot times correctly", () => {
    expect(manager.isValidSlotTime(10, 20)).toBe(true); // Valid time (10 < 20)
    expect(manager.isValidSlotTime(95, 96)).toBe(false); // Invalid, exceeds boundary (96 is out of bounds)
    expect(manager.isValidSlotTime(50, 30)).toBe(false); // Invalid, endSlot < startSlot (50 > 30)
    expect(manager.isValidSlotTime(0, 15)).toBe(true); // Valid, starting at the beginning (0 < 15)
    expect(manager.isValidSlotTime(15, 15)).toBe(false); // Invalid, endSlot equals startSlot (15 == 15)
  });

  test("should mark buffer times as unavailable", () => {
    // Check that buffer times are booked in all rooms
    manager.rooms.forEach((room) => {
      expect(room.schedule[36]).toBe(true); // Buffer from 09:00 to 09:15
      expect(room.schedule[53]).toBe(true); // Buffer from 13:15 to 13:45
      expect(room.schedule[75]).toBe(true); // Buffer from 18:45 to 19:00
    });
  });

  test("should not allow booking during buffer time", () => {
    expect(manager.book("09:00", "09:15", 4)).toBe(IpOpMessages.NO_VACANT_ROOM); // Buffer time
    expect(manager.book("13:30", "13:45", 4)).toBe(IpOpMessages.NO_VACANT_ROOM); // Buffer time
    expect(manager.book("18:45", "19:00", 4)).toBe(IpOpMessages.NO_VACANT_ROOM); // Buffer time
  });

  test("should return INCORRECT_INPUT for invalid times", () => {
    expect(manager.book("25:00", "26:00", 4)).toBe(IpOpMessages.INCORRECT_INPUT); // Invalid hour
    expect(manager.book("10:00", "09:00", 4)).toBe(IpOpMessages.INCORRECT_INPUT); // End before start
    expect(manager.book("10:01", "10:15", 4)).toBe(IpOpMessages.INCORRECT_INPUT); // Invalid minute
    expect(manager.book("10:00", "10:03", 4)).toBe(IpOpMessages.INCORRECT_INPUT); // Invalid minute
  });

  test("should return NO_VACANT_ROOM for invalid person capacity", () => {
    expect(manager.book("10:00", "11:00", 1)).toBe(IpOpMessages.NO_VACANT_ROOM); // Less than MIN_PERSON_CAPACITY
    expect(manager.book("10:00", "11:00", 21)).toBe(IpOpMessages.NO_VACANT_ROOM); // More than MAX_PERSON_CAPACITY
  });

  test("should book the most optimal room based on person capacity", () => {
    // Booking for 2 people, should allocate C-Cave
    expect(manager.book("10:00", "11:00", 2)).toBe("C-Cave");

    // Booking for 5 people, should allocate D-Tower (next available)
    expect(manager.book("11:00", "12:00", 5)).toBe("D-Tower");

    // Booking for 15 people, should allocate G-Mansion
    expect(manager.book("12:00", "13:00", 15)).toBe("G-Mansion");
  });

  test("should return NO_VACANT_ROOM if no rooms are available", () => {
    // Book all rooms for the same time range
    manager.book("10:00", "11:00", 2); // C-Cave
    manager.book("10:00", "11:00", 5); // D-Tower
    manager.book("10:00", "11:00", 15); // G-Mansion

    // No room left for the same time range
    expect(manager.book("10:00", "11:00", 4)).toBe(IpOpMessages.NO_VACANT_ROOM);
  });

  test("should correctly check for room vacancies", () => {
    // Initially, all rooms should be available
    expect(manager.checkVacancy("10:00", "11:00")).toBe("C-Cave D-Tower G-Mansion");

    // After booking C-Cave and D-Tower, only G-Mansion should remain
    manager.book("10:00", "11:00", 2); // C-Cave
    manager.book("10:00", "11:00", 5); // D-Tower
    expect(manager.checkVacancy("10:00", "11:00")).toBe("G-Mansion");

    // After booking G-Mansion, no rooms should be available
    manager.book("10:00", "11:00", 15); // G-Mansion
    expect(manager.checkVacancy("10:00", "11:00")).toBe(IpOpMessages.NO_VACANT_ROOM);
  });

  test("should return INCORRECT_INPUT for invalid vacancy check times", () => {
    expect(manager.checkVacancy("25:00", "26:00")).toBe(IpOpMessages.INCORRECT_INPUT); // Invalid hour
    expect(manager.checkVacancy("11:00", "10:00")).toBe(IpOpMessages.INCORRECT_INPUT); // End before start
    expect(manager.checkVacancy("10:01", "10:15")).toBe(IpOpMessages.INCORRECT_INPUT); // Invalid minute
    expect(manager.checkVacancy("10:00", "10:03")).toBe(IpOpMessages.INCORRECT_INPUT); // Invalid minute
  });
});
