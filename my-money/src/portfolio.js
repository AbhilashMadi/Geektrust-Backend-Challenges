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
        // Check if it's not January (SIP should start from February)
        if (month !== this.months[0]) {
            // Apply the SIP for equity, debt, and gold
            this.equity += this.sipEquity;
            this.debt += this.sipDebt;
            this.gold += this.sipGold;
        }

        // Apply percentage change to the portfolio for the current month
        // Growth/loss percentage is applied on the updated amounts (after SIP)
        this.equity = Math.floor(this.equity * (1 + eqChange / 100));
        this.debt = Math.floor(this.debt * (1 + debtChange / 100));
        this.gold = Math.floor(this.gold * (1 + goldChange / 100));

        // Store the updated values for the current month
        this.monthsData[month] = {
            equity: this.equity,
            debt: this.debt,
            gold: this.gold,
        };

        // Debugging log to track the calculations
        console.log(`Month: ${month}, Equity: ${this.equity}, Debt: ${this.debt}, Gold: ${this.gold}`);
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
        const rebalancingMonths = [this.months[5], this.months[11]]; // June and December
        const availableMonths = Object.keys(this.monthsData);

        // Check if rebalancing is allowed (June or December)
        if (!availableMonths.includes(this.months[5]) && !availableMonths.includes(this.months[11])) {
            console.log(IpOpMsgs.CANT_REBALANCE);
            return;
        }

        // Get the most recent balance (for June or December)
        const lastRebalanceMonth = availableMonths.includes(this.months[11]) ? this.months[11] : this.months[5];
        const total = this.monthsData[lastRebalanceMonth].equity + this.monthsData[lastRebalanceMonth].debt + this.monthsData[lastRebalanceMonth].gold;

        // Calculate desired allocations based on the total portfolio value
        const desiredEquity = Math.floor(total * DesiredEquity.EQUITY);  // 60%
        const desiredDebt = Math.floor(total * DesiredEquity.DEBT);     // 30%
        const desiredGold = Math.floor(total * DesiredEquity.GOLD);     // 10%

        // Update the portfolio balances
        this.equity = desiredEquity;
        this.debt = desiredDebt;
        this.gold = desiredGold;

        // Print the rebalanced amounts
        console.log(`${this.equity} ${this.debt} ${this.gold}`);
    }
}

module.exports = Portfolio;
