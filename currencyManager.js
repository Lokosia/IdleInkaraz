// Modularized currency.js
import Currency from './js/components/Currency.js';
import { currencyData, currencyMap } from './js/components/currencyData.js';
import { setupCurrencyUI } from './js/components/CurrencyUI.js';

/**
 * Generic currency operation processor that applies a method to all currencies
 * 
 * This function serves as a central dispatcher for applying operations across all currencies.
 * It dynamically invokes the specified method on each currency object, passing optional
 * parameters when provided.
 * 
 * @param {string} operation - The Currency method name to call on each currency
 *                             (e.g., 'rollCurrency', 'sellCurrency', 'buyCurrency')
 * @param {Object} [param] - Optional parameter to pass to the method
 *                           For 'rollCurrency', this is the exile character object
 * 
 * @example
 * // Process buy operations for all currencies
 * processCurrencyOperation('buyCurrency');
 * 
 * // Process currency drops with a specific exile
 * processCurrencyOperation('rollCurrency', exileData[0]);
 */
function processCurrencyOperation(operation, param) {
    for (let i = 0; i < currencyData.length; i++) {
        if (param !== undefined) {
            currencyData[i][operation](param);
        } else {
            currencyData[i][operation]();
        }
    }
}

/**
 * Updates displayed currency values in the UI
 * Called periodically by game loop
 */
function updateCurrencyClass() {
    for (let i = 0; i < currencyData.length; i++) {
        document.getElementsByClassName(currencyData[i].name)[0].innerHTML = numeral(currencyData[i].total).format('0,0', Math.floor);
    }
}

setInterval(function gameTick() {
    for (let i = 0; i < exileData.length; i++) {
        if (exileData[i].dropRate > 0) {
            processCurrencyOperation('rollCurrency', exileData[i]);
        }
    }
    processCurrencyOperation('sellCurrency');
    processCurrencyOperation('buyCurrency');

    updateCurrencyClass();
}, 100);

//---Sliders

// Create switches when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setupCurrencyUI();
});

/**
 * Initializes test mode with predefined currency amounts
 * Used for development and debugging
 */
function initTestMode() {
    // Set 99999 of every currency
    currencyData.forEach(currency => {
        currency.total = 99999;
    });
    
    console.log('Test mode initialized with 99999 of each currency');
}

// Make it available globally
window.initTestMode = initTestMode;

// Automatically run test mode if URL has ?test=true parameter
if (window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', initTestMode);
}