// booking-manager.js
const Room = require("./room.js");
const {
  ROOMS,
  MIN_SLOT_INTERVAL,
  POSSIBLE_SLOT_INTERVALS,
  BUFFER_TIMES,
  IpOpMessages,
  MIN_PERSON_CAPACITY,
  MAX_PERSON_CAPACITY,
} = require("../utils/constants.js");

class BookingManager {
  constructor() {
    // Initialize rooms
    this.rooms = [
      new Room(ROOMS.C_CAVE.name, ROOMS.C_CAVE.personCapacity),
      new Room(ROOMS.D_TOWER.name, ROOMS.D_TOWER.personCapacity),
      new Room(ROOMS.G_MANSION.name, ROOMS.G_MANSION.personCapacity),
    ];

    // Define buffer times
    this.bufferTimes = BUFFER_TIMES.map(({ start, end }) => ({
      start: this.timeToSlot(start),
      end: this.timeToSlot(end),
    }));

    // Mark buffer times as unavailable in the schedule
    this.markBufferTimes();
  }

  // Convert HH:MM time format to slot index (15-minute intervals)
  timeToSlot(time) {
    const [H, M] = time.split(":").map(Number);
    return (H * 60 + M) / MIN_SLOT_INTERVAL;
  }

  // Validate if the time slot range is correct
  isValidSlotTime(startSlot, endSlot) {
    const isValidInterval = (slot) => {
      return slot % (MIN_SLOT_INTERVAL / 15) === 0;
    };

    // Check if both start and end slots are valid intervals
    if (!isValidInterval(startSlot) || !isValidInterval(endSlot)) {
      return false;
    }

    // Ensure end slot is greater than start slot and within the valid range
    return (
      endSlot > startSlot &&
      startSlot >= 0 &&
      endSlot < POSSIBLE_SLOT_INTERVALS
    );
  }

  // Mark buffer times in all rooms
  markBufferTimes() {
    for (const room of this.rooms) {
      for (const { start, end } of this.bufferTimes) {
        room.bookRoom(start, end);
      }
    }
  }

  // Check if the requested time range overlaps with buffer times
  overlapsWithBuffer(startSlot, endSlot) {
    for (const { start, end } of this.bufferTimes) {
      if (start < endSlot && end > startSlot) {
        return true; // Overlaps with buffer time
      }
    }
    return false;
  }

  // Greedily find the smallest available room that can fit the required capacity
  findAvailableRoom(startSlot, endSlot, personCapacity) {
    for (const room of this.rooms) {
      if (room.personCapacity >= personCapacity && room.isAvailable(startSlot, endSlot)) {
        return room;
      }
    }
    return null; // No available room found
  }

  // Book a room if available
  book(startTime, endTime, capacity) {
    const startSlot = this.timeToSlot(startTime);
    const endSlot = this.timeToSlot(endTime);

    // Check if the capacity is within the defined limits
    if (capacity < MIN_PERSON_CAPACITY || capacity > MAX_PERSON_CAPACITY) {
      return IpOpMessages.NO_VACANT_ROOM;
    }

    // Check if time slots are valid
    if (!this.isValidSlotTime(startSlot, endSlot)) {
      return IpOpMessages.INCORRECT_INPUT;
    }

    // Check if booking overlaps with buffer time
    if (this.overlapsWithBuffer(startSlot, endSlot)) {
      return IpOpMessages.NO_VACANT_ROOM;
    }

    // Check for room availability and book if possible
    const room = this.findAvailableRoom(startSlot, endSlot, capacity);
    if (room) {
      room.bookRoom(startSlot, endSlot);
      return room.name;
    } else {
      return IpOpMessages.NO_VACANT_ROOM;
    }
  }

  // Check for room vacancies within a given time range
  checkVacancy(startTime, endTime) {
    const startSlot = this.timeToSlot(startTime);
    const endSlot = this.timeToSlot(endTime);

    // Validate time slot input
    if (!this.isValidSlotTime(startSlot, endSlot)) {
      return IpOpMessages.INCORRECT_INPUT;
    }

    // Filter rooms based on availability during the specified range
    const availableRooms = this.rooms.filter((room) => room.isAvailable(startSlot, endSlot));
    return availableRooms.length ? availableRooms.map((r) => r.name).join(" ") : IpOpMessages.NO_VACANT_ROOM;
  }
}

module.exports = BookingManager;
