class Event {

  constructor(id, name, prize, date) {
    this.id = id;
    this.name = name;
    this.prize = prize;
    this.date = new Date(date);
    this.registeredMembers = new Set();
    this.bids = new Map();
  }

  addMember(memberId) {
    if (this.registeredMembers.has(memberId)) {
      throw new Error("Member already registered for this event");
    }
    this.registeredMembers.add(memberId);
  }

  submitBids(memberId, bids) {
    if (!this.registeredMembers.has(memberId)) {
      throw new Error("Member not registered for this event");
    }
    if (bids.length > 5) {
      throw new Error("Can submit at most 5 bids");
    }
    if (new Set(bids).size !== bids.length) {
      throw new Error("All bids must be unique");
    }
    if (Math.min(...bids) <= 0) {
      throw new Error("Bids must be greater than zero");
    }
    this.bids.set(memberId, bids);
  }

  getWinner() {
    let highestBid = -Infinity;
    let winnerId = null;
    let firstSubmissionTime = new Map();

    for (const [memberId, bids] of this.bids.entries()) {
      const maxBid = Math.max(...bids);
      if (
        maxBid > highestBid ||
        (maxBid === highestBid && !firstSubmissionTime.has(maxBid))
      ) {
        highestBid = maxBid;
        winnerId = memberId;
        firstSubmissionTime.set(maxBid, memberId);
      }
    }
    return winnerId;
  }
}

module.exports = Event;
