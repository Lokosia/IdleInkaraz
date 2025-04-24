import { currencyData } from './components/currency/CurrencyData.js';

/**
 * Adds a click event listener to a DOM element by its ID.
 *
 * @param {string} id - The DOM element ID.
 * @param {Function} handler - The click event handler function.
 * @returns {void}
 */
export function addClickListener(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
}

/**
 * Processes a named operation on all currency objects in currencyData.
 * Optionally passes a parameter to the operation.
 *
 * @param {string} operation - The name of the method to call on each currency.
 * @param {*} [param] - Optional parameter to pass to the method.
 * @returns {void}
 */
export function processCurrencyOperation(operation, param) {
    for (let i = 0; i < currencyData.length; i++) {
        if (param !== undefined) {
            currencyData[i][operation](param);
        } else {
            currencyData[i][operation]();
        }
    }
}