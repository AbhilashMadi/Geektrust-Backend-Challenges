const TimeUtils = require("../utils/TimeUtils.js");

class RaceTrack {
  static ADDITION_CHARGE = 50;

  constructor(type, vehicleType, capacity, costPerHour) {
    this.type = type;
    this.vehicleType = vehicleType;
    this.capacity = capacity;
    this.costPerHour = costPerHour;

    this.bookings = new Map();
  }

  isAvailable(entryTime) {
    return Array.from(this.bookings.values())
      .filter(booking => booking.endTime > entryTime)
      .length < this.capacity;
  }

  book(vehicleNumber, entryTime) {
    if (!this.isAvailable(entryTime)) {
      return "RACETRACK_FULL";
    }

    this.bookings.set(
      vehicleNumber, {
      vehicleNumber,
      entryTime,
      endTime: TimeUtils.calculateEndTime(entryTime, TimeUtils.MIN_BOOKING_HRS),
      extendedHours: 0,
    })

    return "SUCCESS";
  }

  extendBooking(vehicleNumber, exitTime) {
    const booking = this.bookings.get(vehicleNumber);

    if (!booking) {
      return "INVALID_EXIT_TIME";
    }

    const originalEndTime = booking.endTime;
    const lastAllowedTime = TimeUtils.parseTime("20:00");

    if (exitTime <= originalEndTime) {
      return "INVALID_EXIT_TIME";
    }

    // If exit time is after 8 PM, return INVALID_TIME
    if (exitTime > lastAllowedTime) {
      return "INVALID_TIME";
    }

    const additionalHours = TimeUtils.calculateAdditionalHours(originalEndTime, exitTime);
    booking.endTime = exitTime;
    booking.extendedHours += additionalHours;

    return "SUCCESS";
  }

  calculateRevenue() {
    return Array.from(this.bookings.values()).reduce((total, booking) => {

      const defaultFee = TimeUtils.MIN_BOOKING_HRS * this.costPerHour;
      const additionalFee = booking.extendedHours * 50;

      return total + defaultFee + additionalFee;
    }, 0);
  }
}

module.exports = RaceTrack;