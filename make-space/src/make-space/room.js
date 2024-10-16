// room.js
const { POSSIBLE_SLOT_INTERVALS } = require("../utils/constants");

class Room {
  constructor(name, personCapacity) {
    this.name = name;
    this.personCapacity = personCapacity;
    this.schedule = Array(POSSIBLE_SLOT_INTERVALS).fill(false); // 96 slots representing 24 hours in 15-minute intervals
  }

  // Check availability in the given slot range
  isAvailable(startSlot, endSlot) {
    for (let i = startSlot; i < endSlot; i++) {
      if (this.schedule[i]) return false; // Slot is already booked
    }
    return true;
  }

  // Book the room for the given slot range
  bookRoom(startSlot, endSlot) {
    for (let i = startSlot; i < endSlot; i++) {
      this.schedule[i] = true;
    }
  }

  // Unbook the room for the given slot range (not used here but useful)
  unBookRoom(startSlot, endSlot) {
    for (let i = startSlot; i < endSlot; i++) {
      this.schedule[i] = false;
    }
  }
}

module.exports = Room;
