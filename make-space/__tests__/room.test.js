// room.test.js
const Room = require("../src/make-space/room.js");
const { POSSIBLE_SLOT_INTERVALS } = require("../src/utils/constants.js");

describe("Room class", () => {
  let room;

  beforeEach(() => {
    room = new Room("C-Cave", 3); // Example: Room with 3-person capacity
  });

  test("should initialize room with correct name and person capacity", () => {
    expect(room.name).toBe("C-Cave");
    expect(room.personCapacity).toBe(3);
    expect(room.schedule.length).toBe(POSSIBLE_SLOT_INTERVALS);
    expect(room.schedule.every((slot) => slot === false)).toBe(true); // All slots should be false (available)
  });

  test("should mark the room as unavailable after booking", () => {
    room.bookRoom(4, 8); // Booking from slot 4 to 8

    for (let i = 4; i < 8; i++) {
      expect(room.schedule[i]).toBe(true); // These slots should be marked as booked (true)
    }
  });

  test("should mark the room as available after unbooking", () => {
    room.bookRoom(4, 8); // Booking from slot 4 to 8
    room.unBookRoom(4, 8); // Unbooking same slots

    for (let i = 4; i < 8; i++) {
      expect(room.schedule[i]).toBe(false); // These slots should be marked as available again (false)
    }
  });

  test("should correctly check room availability", () => {
    room.bookRoom(4, 8); // Booking from slot 4 to 8

    expect(room.isAvailable(0, 4)).toBe(true); // Slots before booking should be available
    expect(room.isAvailable(4, 8)).toBe(false); // Slots during booking should be unavailable
    expect(room.isAvailable(8, 12)).toBe(true); // Slots after booking should be available
  });

  test("should be available for slots outside booking range", () => {
    room.bookRoom(10, 15);
    expect(room.isAvailable(0, 10)).toBe(true);
    expect(room.isAvailable(15, 20)).toBe(true);
  });
});
