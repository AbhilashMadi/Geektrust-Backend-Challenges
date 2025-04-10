

const STATION_CODES = {
  CHENNAI: "CHN",
  SALEM: "SLM",
  BANGALORE: "BLR",
  KURNOOL: "KRN",
  HYDERABAD: "HYB",
  NAGPUR: "NGP",
  ITARSI: "ITJ",
  BHOPAL: "BPL",
  AGRA: "AGA",
  NEW_DELHI: "NDL",
  TRIVANDRUM: "TVC",
  SHORANUR: "SRR",
  MANGALORE: "MAQ",
  MADGAON: "MAO",
  PUNE: "PNE",
  PATNA: "PTA",
  NEW_JALPAIGURI: "NJP",
  GUWAHATI: "GHY"
};

const TRAIN_A_STATIONS = {
  [STATION_CODES.CHENNAI]: 0,
  [STATION_CODES.SALEM]: 350,
  [STATION_CODES.BANGALORE]: 550,
  [STATION_CODES.KURNOOL]: 900,
  [STATION_CODES.HYDERABAD]: 1200,
  [STATION_CODES.NAGPUR]: 1600,
  [STATION_CODES.ITARSI]: 1900,
  [STATION_CODES.BHOPAL]: 2000,
  [STATION_CODES.AGRA]: 2500,
  [STATION_CODES.NEW_DELHI]: 2700,
};

const TRAIN_B_STATIONS = {
  [STATION_CODES.TRIVANDRUM]: 0,
  [STATION_CODES.SHORANUR]: 300,
  [STATION_CODES.MANGALORE]: 600,
  [STATION_CODES.MADGAON]: 1000,
  [STATION_CODES.PUNE]: 1400,
  [STATION_CODES.HYDERABAD]: 2000,
  [STATION_CODES.NAGPUR]: 2400,
  [STATION_CODES.ITARSI]: 2700,
  [STATION_CODES.BHOPAL]: 2800,
  [STATION_CODES.PATNA]: 3800,
  [STATION_CODES.NEW_JALPAIGURI]: 4200,
  [STATION_CODES.GUWAHATI]: 4700
};

const ORIGIN_A = STATION_CODES.CHENNAI;
const DESTINATION_A = STATION_CODES.NEW_DELHI;

const ORIGIN_B = STATION_CODES.TRIVANDRUM;
const DESTINATION_B = STATION_CODES.GUWAHATI;

const OPERATIONS = {
  TRAIN_A: "TRAIN_A",
  TRAIN_B: "TRAIN_B",
}

module.exports = {
  STATION_CODES,

  ORIGIN_A,
  DESTINATION_A,

  ORIGIN_B,
  DESTINATION_B,

  TRAIN_A_STATIONS,
  TRAIN_B_STATIONS,

  OPERATIONS,
}
