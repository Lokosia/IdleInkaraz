// PurchaseUtils.js
// Shared utility for handling purchases/upgrades/crafting actions
// Handles requirement checks, cost deduction, and UI feedback

import { SnackBar } from '../../UIInitializer.js';
import { currencyMap } from '../currency/CurrencyData.js';

/**
 * Checks if all requirements are met (currencies/ingredients).
 * @param {Array<{currency: string|object, amount: number}>} requirements
 * @returns {boolean}
 */
export function checkRequirements(requirements) {
    return requirements.every(req => {
        let item = typeof req.currency === 'string' ? currencyMap[req.currency] : req.currency;
        return item && item.total >= req.amount;
    });
}

/**
 * Deducts the required amounts from currencies/ingredients.
 * @param {Array<{currency: string|object, amount: number}>} requirements
 */
export function deductCosts(requirements) {
    requirements.forEach(req => {
        let item = typeof req.currency === 'string' ? currencyMap[req.currency] : req.currency;
        if (item) item.total -= req.amount;
    });
}

/**
 * Generic purchase handler for upgrades/crafting.
 * @param {Object} options
 * @param {Array} options.requirements - Array of requirements
 * @param {Function} options.onSuccess - Called if purchase succeeds
 * @param {Function} [options.onFailure] - Called if purchase fails
 * @param {Function} [options.updateUI] - Called after success
 * @param {string} [options.successMessage] - Message to show on success
 * @returns {boolean} True if successful, false otherwise
 */
export function handlePurchase({
    requirements = [],
    onSuccess = () => {},
    onFailure = () => SnackBar('Requirements not met.'),
    updateUI = () => {},
    successMessage = 'Purchase successful!'
}) {
    if (checkRequirements(requirements)) {
        deductCosts(requirements);
        onSuccess();
        updateUI();
        if (successMessage) SnackBar(successMessage);
        return true;
    } else {
        onFailure();
        return false;
    }
}
