class Portfolio {
  constructor() {
    this.equity = 0;
    this.debt = 0;
    this.gold = 0;
    this.sipEquity = 0;
    this.sipDebt = 0;
    this.sipGold = 0;
    this.monthsData = {};
  }

  allocate(eq, debt, gold) {
    this.equity = eq;
    this.debt = debt;
    this.gold = gold;
  }

  sip(eq, debt, gold) {
    this.sipEquity = eq;
    this.sipDebt = debt;
    this.sipGold = gold;
  }

  change(eqChange, debtChange, goldChange, month) {
    if (month !== "JANUARY") {
      this.equity += this.sipEquity;
      this.debt += this.sipDebt;
      this.gold += this.sipGold;
    }

    this.equity += Math.floor(this.equity * (eqChange / 100));
    this.debt += Math.floor(this.debt * (debtChange / 100));
    this.gold += Math.floor(this.gold * (goldChange / 100));

    this.monthsData[month] = {
      equity: Math.floor(this.equity),
      debt: Math.floor(this.debt),
      gold: Math.floor(this.gold),
    };
  }

  balance(month) {
    const data = this.monthsData[month];
    if (data) {
      console.log(`${data.equity} ${data.debt} ${data.gold}`);
    } else {
      console.log("No data for this month");
    }
  }

  rebalance() {
    const months = Object.keys(this.monthsData);
    if (months.length < 6 || (!months.includes("JUNE") && !months.includes("DECEMBER"))) {
      console.log("CANNOT_REBALANCE");
      return;
    }

    const lastMonth = months[months.length - 1];
    const total = this.equity + this.debt + this.gold;
    const desiredEquity = total * 0.6;
    const desiredDebt = total * 0.3;
    const desiredGold = total * 0.1;

    this.equity = desiredEquity;
    this.debt = desiredDebt;
    this.gold = desiredGold;

    console.log(`${Math.floor(this.equity)} ${Math.floor(this.debt)} ${Math.floor(this.gold)}`);
  }
}

const portfolio = new Portfolio();

portfolio.allocate(8000, 6000, 3500);
portfolio.sip(3000, 2000, 1000);
portfolio.change(11, 9, 4, "JANUARY");
portfolio.change(-6, 21, -3, "FEBRUARY");
portfolio.change(12.5, 18, 12.5, "MARCH");
portfolio.change(23, -3, 7, "APRIL");
portfolio.balance("MARCH");
portfolio.balance("APRIL");
portfolio.rebalance();