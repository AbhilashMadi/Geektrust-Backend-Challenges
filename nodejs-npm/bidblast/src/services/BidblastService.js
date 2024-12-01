const Member = require("../entities/Member.js");
const Event = require("../entities/Event.js");

class BidBlastService {
  constructor() {
    this.members = new Map();
    this.events = new Map();
    this.winners = new Map();
  }

  addMember(name, coins) {
    if (coins <= 0) {
      throw new Error("coins must be greater than 0");
    }

    const member = new Member(name, coins);
    const memberId = member.getId();

    this.members.set(memberId, member);
    return `MEMBER_ADDED ${memberId}`;
  }

  addEvent(name, prize, date) {
    const event = new Event(name, prize, date);
    const eventId = event.id;

    this.events.set(eventId, event);
    return `EVENT_ADDED ${eventId}`;
  }

  registerMember(memberId, eventId) {
    const member = this.members.get(memberId);
    const event = this.events.get(eventId);

    if (!member) return "MEMBER_NOT_EXIST";
    if (!event) return "EVENT_NOT_EXIST";

    member.registerEvent(eventId);
    event.addMember(memberId);

    return `MEMBER_REGISTERED ${member.getName()} ${event.name}`;
  }

  submitBids(memberId, eventId, bids) {
    const member = this.members.get(memberId);
    const event = this.events.get(eventId);

    if (!member) throw new Error(`Member with the id:${memberId} does not exist`);
    if (!event) throw new Error(`Event with the id:${eventId} does not exist`);

    const maxBid = Math.max(...bids);
    if (member.getCoins() < maxBid) {
      throw new Error("Insufficient Coins");
    }

    event.submitBids(memberId, bids);
    member.deductCoins(maxBid);

    return "BIDS_SUBMITTED";
  }

  declareWinner(eventId) {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event with the given id:${eventId} does not exist`);

    const winnerId = event.getWinner();
    if (!winnerId) throw new Error("No bids were submitted");

    const winner = this.members.get(winnerId);
    this.winners.set(eventId, winner);

    return winner.getName();
  }
}

module.exports = BidBlastService;
