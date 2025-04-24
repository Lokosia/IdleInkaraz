// CurrencyData.js - Currency data and initialization
import Currency from './Currency.js';
import { CURRENCY_CONFIG } from './CurrencyConfig.js';

/**
 * currencyData holds all Currency instances used in the game.
 * @type {Array<Currency>}
 */
const currencyData = [];

/**
 * currencyMap provides quick lookup of Currency instances by name.
 * @type {Object.<string, Currency>}
 */
const currencyMap = {};

// Initialize all currencies from CURRENCY_CONFIG
CURRENCY_CONFIG.forEach(config => {
    const currency = new Currency(
        config.name, 
        config.rate, 
        0, // Starting total
        config.sellRate,
        0, // Starting sellPercent 
        config.buyRate,
        0, // Starting buyPercent
        config.tradingCurrency,
        config.sellGain,
        config.sellLost,
        config.buyGain,
        config.buyLost,
        config.displayName
    );
    currencyData.push(currency);
    currencyMap[config.name] = currency;
    // Removed window[config.name] assignment
});

// Removed window.currencyData assignment

export { currencyData, currencyMap };