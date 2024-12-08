
const PassengerTypes = {
  ADULT: "ADULT",
  KID: "KID",
  SENIOR_CITIZEN: "SENIOR_CITIZEN",
}

const Charges = {
  [PassengerTypes.ADULT]: 200,
  [PassengerTypes.SENIOR_CITIZEN]: 100,
  [PassengerTypes.KID]: 50,
}

const Discounts = {
  [PassengerTypes.ADULT]: 0.5, //50%
  [PassengerTypes.SENIOR_CITIZEN]: 0.5,
  [PassengerTypes.KID]: 0.5,
}

const ServiceFee = {
  [PassengerTypes.ADULT]: 0.02, //2%
  [PassengerTypes.SENIOR_CITIZEN]: 0.02,
  [PassengerTypes.KID]: 0.02,
}

const Stations = {
  AIRPORT: "AIRPORT",
  CENTRAL: "CENTRAL",
}

const Operations = {
  BALANCE: "BALANCE",
  CHECK_IN: "CHECK_IN",
  PRINT_SUMMARY: "PRINT_SUMMARY"
}

module.exports = {
  PassengerTypes,
  Charges,
  Discounts,
  Operations,
  Stations,
  ServiceFee,
}