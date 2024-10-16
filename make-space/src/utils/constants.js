// constants.js
exports.MIN_SLOT_INTERVAL = 15;  // Each slot represents 15 minutes
exports.POSSIBLE_SLOT_INTERVALS = (24 * 60) / exports.MIN_SLOT_INTERVAL;  // Total 96 slots in a day

// Room configurations
exports.ROOMS = {
  C_CAVE: {
    personCapacity: 3,
    name: "C-Cave",
  },
  D_TOWER: {
    personCapacity: 7,
    name: "D-Tower",
  },
  G_MANSION: {
    personCapacity: 20,
    name: "G-Mansion",
  },
};

// Capacity constraints
exports.MIN_PERSON_CAPACITY = 2;
exports.MAX_PERSON_CAPACITY = Math.max(...Object.values(exports.ROOMS).map((o) => o.personCapacity));

// Buffer times during which no rooms can be booked
exports.BUFFER_TIMES = [
  { start: "09:00", end: "09:15" },
  { start: "13:15", end: "13:45" },
  { start: "18:45", end: "19:00" },
];

// Messages
exports.IpOpMessages = {
  NO_VACANT_ROOM: "NO_VACANT_ROOM",
  INCORRECT_INPUT: "INCORRECT_INPUT",
};


exports.Operations = {
  BOOK: "BOOK",
  VACANCY: "VACANCY"
}