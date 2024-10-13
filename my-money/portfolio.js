import { getMonthsList } from "./utils.js";
import { DesiredEquity, IpOpMsgs } from "./constants.js";

class Portfolio {
    constructor() {
        this.equity = 0;
        this.debt = 0;
        this.gold = 0;
        this.sipEquity = 0;
        this.sipDebt = 0;
        this.sipGold = 0;

        this.monthsData = {};

        this.months = getMonthsList();
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
        if (month !== this.months[0]) {
            this.equity += this.sipEquity;
            this.debt += this.sipDebt;
            this.gold += this.sipGold;
        }

        this.equity = Math.floor(this.equity * (1 + eqChange / 100));
        this.debt = Math.floor(this.debt * (1 + debtChange / 100));
        this.gold = Math.floor(this.gold * (1 + goldChange / 100));

        this.monthsData[month] = {
            equity: this.equity,
            debt: this.debt,
            gold: this.gold,
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
        if (months.length < 6 || (!months.includes(this.months[5]) && !months.includes(this.months(11)))) {
            console.log(IpOpMsgs.CANT_REBALANCE);
            return;
        }

        const lastMonth = months[months.length - 1];
        const total = this.monthsData[lastMonth].equity + this.monthsData[lastMonth].debt + this.monthsData[lastMonth].gold;

        const desiredEquity = total * DesiredEquity.EQUITY;
        const desiredDebt = total * DesiredEquity.DEPT;
        const desiredGold = total * DesiredEquity.GOLD;

        this.equity = Math.floor(desiredEquity);
        this.debt = Math.floor(desiredDebt);
        this.gold = Math.floor(desiredGold);

        console.log(`${this.equity} ${this.debt} ${this.gold}`);
    }
}

export default Portfolio;
