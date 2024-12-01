
class Member {
  #name;
  #id;
  #coins;
  #registeredEvents;

  static idgenerator = 1;

  constructor(name, coins) {
    this.#id = Member.idgenerator++;
    this.#name = name;
    this.#coins = coins;
    this.#registeredEvents = new Set();
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getCoins() {
    return this.#coins;
  }

  getRegisteredEvents() {
    return this.#registeredEvents;
  }

  deductCoins(amount) {
    if (amount > this.#coins) {
      throw new Error("Not enough coins");
    }
    this.#coins -= amount;
  }

  registerEvent(eventId) {
    if (this.#registeredEvents.has(eventId)) {
      throw new Error("Already registered for this event");
    }
    this.#registeredEvents.add(eventId);
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      coins: this.#coins,
      registeredEvents: Array.from(this.#registeredEvents),
    };
  }
}

module.exports = Member;
