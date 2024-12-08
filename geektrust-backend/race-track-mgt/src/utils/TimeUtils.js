
class TimeUtils {
  static MIN_BOOKING_HRS = 3;
  static OPENNING_TIME = 13;
  static CLOSING_TIME = 17;
  static FREE_EXTRA_MIN = 15; //min

  static parseTime(timeString /*HH:mm*/) {
    const timeParts = timeString.split(":");

    if (timeParts.length !== 2) {
      throw new Error(`Invalid time format: "${timeString}". Expected format is HH:mm`);
    }

    const [hours, minutes] = timeParts;

    if (
      isNaN(hours) || isNaN(minutes) ||
      hours < 0 || hours > 23 || // Validate hours
      minutes < 0 || minutes > 59 // Validate minutes
    ) {
      throw new Error(`Invalid time values: "${timeString}". Hours must be 0-23 and minutes must be 0-59`);
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
  }

  static isValidEntryTime(time) {
    const hour = time.getHours();
    return hour >= this.OPENNING_TIME && hour <= this.CLOSING_TIME;
  }

  static calculateEndTime(startTime, hours) {
    return new Date(startTime.getTime() + hours * 60 * 60 * 1000);
  }

  static calculateAdditionalHours(originalEndTime, newEndTime) {
    const extraMinutes = (newEndTime - originalEndTime) / 60000;

    return extraMinutes > this.FREE_EXTRA_MIN
      ? Math.ceil(extraMinutes / 60)
      : 0;
  }
}

module.exports = TimeUtils;