const { getMonthsList } = require("./utils.js");
const { DesiredEquity, IpOpMsgs } = require("./constants.js");

class Portfolio {
    constructor() {
        // Initialize asset amounts
        this.equity = 0;  // Amount invested in equity
        this.debt = 0;    // Amount invested in debt
        this.gold = 0;    // Amount invested in gold
        this.sipEquity = 0; // Monthly SIP amount for equity
        this.sipDebt = 0;   // Monthly SIP amount for debt
        this.sipGold = 0;   // Monthly SIP amount for gold

        // Object to hold monthly data
        this.monthsData = {};

        // Get the list of months for tracking
        this.months = getMonthsList();
    }

    // Method to allocate initial amounts to each asset class
    allocate(eq, debt, gold) {
        this.equity = eq;
        this.debt = debt;
        this.gold = gold;
    }

    // Method to set the monthly SIP amounts
    sip(eq, debt, gold) {
        this.sipEquity = eq;
        this.sipDebt = debt;
        this.sipGold = gold;
    }

    // Method to apply changes based on monthly growth/loss rates
    change(eqChange, debtChange, goldChange, month) {
        // If it's not the first month, add SIP amounts
        if (month !== this.months[0]) {
            this.equity += this.sipEquity;
            this.debt += this.sipDebt;
            this.gold += this.sipGold;
        }

        // Update asset amounts based on percentage changes, flooring the results
        this.equity = Math.floor(this.equity * (1 + eqChange / 100));
        this.debt = Math.floor(this.debt * (1 + debtChange / 100));
        this.gold = Math.floor(this.gold * (1 + goldChange / 100));

        // Store the current month's data
        this.monthsData[month] = {
            equity: this.equity,
            debt: this.debt,
            gold: this.gold,
        };
    }

    // Method to print the balance for a given month
    balance(month) {
        const data = this.monthsData[month];
        if (data) {
            console.log(`${data.equity} ${data.debt} ${data.gold}`);
        } else {
            console.log(`No data for the Month: ${month}`);
        }
    }

    // Method to rebalance the portfolio according to the desired equity distribution
    rebalance() {
        const months = Object.keys(this.monthsData);

        // Check if there is enough data for rebalancing
        if (months.length < 6 || (!months.includes(this.months[5]) && !months.includes(this.months[11]))) {
            console.log(IpOpMsgs.CANT_REBALANCE);
            return;
        }

        // Get the total value of the portfolio
        const lastMonth = months[months.length - 1];
        const total = this.monthsData[lastMonth].equity + this.monthsData[lastMonth].debt + this.monthsData[lastMonth].gold;

        // Calculate desired amounts based on the predefined allocation percentages
        const desiredEquity = total * DesiredEquity.EQUITY;
        const desiredDebt = total * DesiredEquity.DEPT;
        const desiredGold = total * DesiredEquity.GOLD;

        // Update asset amounts to the desired values, flooring the results
        this.equity = Math.floor(desiredEquity);
        this.debt = Math.floor(desiredDebt);
        this.gold = Math.floor(desiredGold);

        // Print the rebalanced amounts
        console.log(`${this.equity} ${this.debt} ${this.gold}`);
    }
}

module.exports = Portfolio;
