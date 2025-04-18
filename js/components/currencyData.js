// currencyData.js - Currency data and initialization
import Currency from './Currency.js';
import { CURRENCY_CONFIG } from '../../currency-config.js';

const currencyData = [];
const currencyMap = {};

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
    window[config.name] = currency; // For backward compatibility
});

export { currencyData, currencyMap };