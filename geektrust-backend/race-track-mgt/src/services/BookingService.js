const {
  REG_TRACK_LIMIT,
  REG_TRACK_PRICE_PER_HR,
  TRACK_TYPES,
  VEHICLE_TYPES,
  VIP_TRACK_LIMIT,
  VIP_TRACK_PRICE_PER_HR
} = require("../utils/constants.js");

const TimeUtils = require("../utils/TimeUtils.js");
const RaceTrack = require("../entities/RaceTrack.js");

class BookingService {

  constructor() {
    this.tracks = {
      [TRACK_TYPES.REGULAR]: {
        [VEHICLE_TYPES.BIKE]: new RaceTrack(
          TRACK_TYPES.REGULAR,
          VEHICLE_TYPES.BIKE,
          REG_TRACK_LIMIT.BIKE,
          REG_TRACK_PRICE_PER_HR.BIKE
        ),
        [VEHICLE_TYPES.CAR]: new RaceTrack(
          TRACK_TYPES.REGULAR,
          VEHICLE_TYPES.CAR,
          REG_TRACK_LIMIT.CAR,
          REG_TRACK_PRICE_PER_HR.CAR
        ),
        [VEHICLE_TYPES.SUV]: new RaceTrack(
          TRACK_TYPES.REGULAR,
          VEHICLE_TYPES.SUV,
          REG_TRACK_LIMIT.SUV,
          REG_TRACK_PRICE_PER_HR.SUV
        ),
      },
      [TRACK_TYPES.VIP]: {
        [VEHICLE_TYPES.CAR]: new RaceTrack(
          TRACK_TYPES.VIP,
          VEHICLE_TYPES.CAR,
          VIP_TRACK_LIMIT.CAR,
          VIP_TRACK_PRICE_PER_HR.CAR
        ),
        [VEHICLE_TYPES.SUV]: new RaceTrack(
          TRACK_TYPES.VIP,
          VEHICLE_TYPES.SUV,
          VIP_TRACK_LIMIT.SUV,
          VIP_TRACK_PRICE_PER_HR.SUV
        ),
      },
    };
  }

  handleBooking(vehicleType, vehicleNumber, entryTime) {
    const time = TimeUtils.parseTime(entryTime);
    if (!TimeUtils.isValidEntryTime(time)) {
      return "INVALID_ENTRY_TIME"
    };

    const track = this.tracks[TRACK_TYPES.REGULAR]?.[vehicleType] || null;
    if (!track) {
      return "INVALID_ENTRY_TIME"
    };

    let result = track.book(vehicleNumber, time);
    if (result === "RACETRACK_FULL" && this.tracks[TRACK_TYPES.VIP]?.[vehicleType]) {
      result = this.tracks[TRACK_TYPES.VIP][vehicleType].book(vehicleNumber, time);
    }

    return result;
  }

  handleAdditional(vehicleNumber, exitTime) {
    const time = TimeUtils.parseTime(exitTime);

    for (const trackType of Object.values(TRACK_TYPES)) {
      for (const track of Object.values(this.tracks[trackType])) {
        if (track.extendBooking(vehicleNumber, time) === "SUCCESS") {
          return "SUCCESS";
        }
      }
    }

    return "INVALID_EXIT_TIME";
  }

  calculateRevenue = (trackType) => Object.values(this.tracks[trackType])
    .reduce((total, track) => total + track.calculateRevenue(), 0)

  handleRevenue() {
    const regularRevenue = this.calculateRevenue(TRACK_TYPES.REGULAR);
    const vipRevenue = this.calculateRevenue(TRACK_TYPES.VIP);

    return `${regularRevenue} ${vipRevenue}`;
  }
}

module.exports = BookingService;
