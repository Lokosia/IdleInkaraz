// Currency.js - Currency class module
import Upgrades from '../../upgrades.js';

/**
 * Represents a game currency with trading functionality
 */
class Currency {
    /**
     * Create a new currency
     * @param {string} name - The currency name
     * @param {number|string} rate - Drop rate of the currency (decimal, typically very small)
     * @param {number|string} total - Initial amount of the currency
     * @param {number|string} sellRate - Exchange rate when selling
     * @param {number|string} sellPercent - Whether selling is active (0 or 1)
     * @param {number|string} buyRate - Exchange rate when buying
     * @param {number|string} buyPercent - Whether buying is active (0 or 1)
     * @param {string} tradingCurrency - The currency to trade with
     * @param {number} [sellGain] - Override for amount of trading currency gained when selling
     * @param {number} [sellLost] - Override for amount of this currency lost when selling
     * @param {number} [buyGain] - Override for amount of this currency gained when buying
     * @param {number} [buyLost] - Override for amount of trading currency lost when buying
     * @param {string} displayName - Display name of currency
     */
    constructor(name, rate, total, sellRate, sellPercent, buyRate, buyPercent, tradingCurrency, sellGain, sellLost, buyGain, buyLost, displayName) {
        this.name = name;
        this.rate = rate; // Keep as-is for floating point precision with very small values
        this.total = Number(total); // Convert to number for math operations
        this.sellRate = Number(sellRate);
        this.sellPercent = Number(sellPercent);
        this.buyRate = Number(buyRate);
        this.buyPercent = Number(buyPercent);
        this.tradingCurrency = tradingCurrency;

        // Selling trade amounts
        this.sellGain = sellGain ?? (this.sellRate <= 1 ? this.sellRate : 1); // how much trading currency you get
        this.sellLost = sellLost ?? (this.sellRate <= 1 ? 1 : this.sellRate); // how much of current currency you spend

        // Buying trade amounts
        this.buyGain = buyGain ?? (this.buyRate <= 1 ? 1 : this.buyRate); // how much of current currency you get
        this.buyLost = buyLost ?? (this.buyRate <= 1 ? this.buyRate : 1); // how much trading currency you spend

        this.displayName = displayName;
    }

    // -------------------------
    // CURRENCY DROP METHODS
    // ------------------------- 
    rollCurrencyRNG() {
        let min = 0.0000001;
        let max = 1;
        let c = (Math.random() * (max - min) + min).toFixed(7);
        return c;
    }

    rollCurrency(exileName) {
        let c = this.rollCurrencyRNG();
        if (this.name != "Sulphite") {
            if (c <= this.rate * (exileName.dropRate + Upgrades.upgradeDropRate)) {
                this.total += 1 + (this.rate * (exileName.dropRate + Upgrades.upgradeDropRate));
                if (this.name == 'Mirror') {
                    SnackBar("Mirror of Kalandra dropped!");
                }
            }
        } else if (this.name == "Sulphite") {
            if (c <= this.rate * (exileName.dropRate + Upgrades.upgradeDropRate)) {
                this.total += Math.floor((Math.random() * (sulphiteDropRate - (sulphiteDropRate / 2)) + (sulphiteDropRate / 2)));
            }
        }
    }

    // -------------------------
    // TRADING TOGGLE METHODS
    // -------------------------
    sellSetCurrency(value) {
        if (this.buyPercent > 0) {
            this.buyPercent = 0;
            $('#' + this.name + 'BuySlider').trigger('click');
        }
        this.sellPercent = value;
    }

    buySetCurrency(value) {
        if (this.sellPercent > 0) {
            this.sellPercent = 0;
            $('#' + this.name + 'SellSlider').trigger('click');
        }
        this.buyPercent = value;
    }

    // -------------------------
    // TRADING EXECUTION METHODS
    // -------------------------
    sellCurrency() {
        if (Singularity.level >= 1 && this.sellPercent == 1) {
            for (let i = 0; i < flippingSpeed; i++) {
                const targetCurrency = window[this.tradingCurrency];
                if (this.total >= this.sellLost) {
                    this.total -= this.sellLost;
                    targetCurrency.total += this.sellGain;
                }
            }
        }
    }

    buyCurrency() {
        if (Singularity.level >= 1 && this.buyPercent == 1) {
            for (let i = 0; i < flippingSpeed; i++) {
                const targetCurrency = window[this.tradingCurrency];
                if (targetCurrency.total >= this.buyLost) {
                    this.total += this.buyGain;
                    targetCurrency.total -= this.buyLost;
                }
            }
        }
    }
}

export default Currency;