// Currency.js - Currency class module
import Upgrades from '../upgrades/Augments.js';
import State from '../../State.js';
import { currencyMap } from './CurrencyData.js';

/**
 * Represents a game currency with trading and drop functionality.
 * Handles currency drops, trading toggles, and buy/sell execution.
 *
 * @class
 * @property {string} name - The currency name.
 * @property {number} rate - Drop rate of the currency.
 * @property {number} total - Current amount of the currency.
 * @property {number} sellRate - Exchange rate when selling.
 * @property {number} sellPercent - Whether selling is active (0 or 1).
 * @property {number} buyRate - Exchange rate when buying.
 * @property {number} buyPercent - Whether buying is active (0 or 1).
 * @property {string} tradingCurrency - The currency to trade with.
 * @property {number} sellGain - Amount of trading currency gained when selling.
 * @property {number} sellLost - Amount of this currency lost when selling.
 * @property {number} buyGain - Amount of this currency gained when buying.
 * @property {number} buyLost - Amount of trading currency lost when buying.
 * @property {string} displayName - Display name of currency.
 */
class Currency {
    /**
     * Create a new currency.
     * @param {string} name - The currency name.
     * @param {number|string} rate - Drop rate of the currency (decimal, typically very small).
     * @param {number|string} total - Initial amount of the currency.
     * @param {number|string} sellRate - Exchange rate when selling.
     * @param {number|string} sellPercent - Whether selling is active (0 or 1).
     * @param {number|string} buyRate - Exchange rate when buying.
     * @param {number|string} buyPercent - Whether buying is active (0 or 1).
     * @param {string} tradingCurrency - The currency to trade with.
     * @param {number} [sellGain] - Override for amount of trading currency gained when selling.
     * @param {number} [sellLost] - Override for amount of this currency lost when selling.
     * @param {number} [buyGain] - Override for amount of this currency gained when buying.
     * @param {number} [buyLost] - Override for amount of trading currency lost when buying.
     * @param {string} displayName - Display name of currency.
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

    /**
     * Generate a random number for currency drop chance.
     * @returns {number} Random float between 0.0000001 and 1 (as a string with 7 decimals).
     */
    rollCurrencyRNG() {
        let min = 0.0000001;
        let max = 1;
        let c = (Math.random() * (max - min) + min).toFixed(7);
        return c;
    }

    /**
     * Attempt to drop this currency for a given exile.
     * Increases total if drop is successful.
     * @param {Object} exileName - The exile object (should have dropRate property).
     * @returns {void}
     */
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
                this.total += Math.floor((Math.random() * (Upgrades.sulphiteDropRate - (Upgrades.sulphiteDropRate / 2)) + (Upgrades.sulphiteDropRate / 2)));
            }
        }
    }

    /**
     * Set the sell toggle for this currency. Disables buy if active.
     * @param {number} value - 0 or 1 to disable/enable selling.
     * @returns {void}
     */
    sellSetCurrency(value) {
        if (this.buyPercent > 0) {
            this.buyPercent = 0;
            $('#' + this.name + 'BuySlider').trigger('click');
        }
        this.sellPercent = value;
    }

    /**
     * Set the buy toggle for this currency. Disables sell if active.
     * @param {number} value - 0 or 1 to disable/enable buying.
     * @returns {void}
     */
    buySetCurrency(value) {
        if (this.sellPercent > 0) {
            this.sellPercent = 0;
            $('#' + this.name + 'SellSlider').trigger('click');
        }
        this.buyPercent = value;
    }

    /**
     * Execute a sell trade for this currency if conditions are met.
     * @returns {void}
     */
    sellCurrency() {
        if (State.exileMap['Singularity'] && State.exileMap['Singularity'].level >= 1 && this.sellPercent == 1) {
            for (let i = 0; i < Upgrades.flippingSpeed; i++) {
                const targetCurrency = currencyMap[this.tradingCurrency];
                if (this.total >= this.sellLost) {
                    this.total -= this.sellLost;
                    targetCurrency.total += this.sellGain;
                }
            }
        }
    }

    /**
     * Execute a buy trade for this currency if conditions are met.
     * @returns {void}
     */
    buyCurrency() {
        if (State.exileMap['Singularity'] && State.exileMap['Singularity'].level >= 1 && this.buyPercent == 1) {
            for (let i = 0; i < Upgrades.flippingSpeed; i++) {
                const targetCurrency = currencyMap[this.tradingCurrency];
                if (targetCurrency.total >= this.buyLost) {
                    this.total += this.buyGain;
                    targetCurrency.total -= this.buyLost;
                }
            }
        }
    }
}

export default Currency;