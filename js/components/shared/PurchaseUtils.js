// PurchaseUtils.js
// Shared utility for handling purchases/upgrades/crafting actions
// Handles requirement checks, cost deduction, and UI feedback

import { SnackBar } from '../../UIInitializer.js';
import { currencyMap } from '../currency/CurrencyData.js';
import { removeHoverCurrencies } from '../currency/HoverState.js';

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
 * @param {Array<{currency: string|object, amount: number}>} options.requirements - Array of requirements
 * @param {Function} options.onSuccess - Called if purchase succeeds
 * @param {Function} [options.onFailure] - Called if purchase fails
 * @param {Function} [options.updateUI] - DEPRECATED: Use uiUpdateConfig instead. Called after success.
 * @param {string} [options.successMessage] - Message to show on success
 * @param {Object} [options.uiUpdateConfig] - Configuration for common UI updates
 * @param {HTMLElement} [options.uiUpdateConfig.costElement] - Element displaying the cost.
 * @param {HTMLElement} [options.uiUpdateConfig.benefitElement] - Element displaying the benefit.
 * @param {Function} [options.uiUpdateConfig.getNextLevelData] - Function returning next level data (e.g., { cost: number, benefit: string|number }). Should return null or undefined if max level reached.
 * @param {HTMLElement} [options.uiUpdateConfig.rowElement] - The row element to potentially remove.
 * @param {boolean} [options.uiUpdateConfig.removeRowOnMaxLevel=true] - Remove row if getNextLevelData signals max level.
 * @param {string[]} [options.uiUpdateConfig.hoverClassesToRemoveOnMaxLevel] - CSS class names (without '.') of currency elements to remove 'hover' class from when row is removed.
 * @param {boolean} [options.uiUpdateConfig.preserveHover=false] - Force preservation of hover effects even at max level or with no next level data.
 * @returns {boolean} True if successful, false otherwise
 */
export function handlePurchase({
    requirements = [],
    onSuccess = () => {},
    onFailure = () => SnackBar('Requirements not met.'),
    updateUI = () => {}, // Keep for backward compatibility for now, but prioritize uiUpdateConfig
    successMessage = 'Purchase successful!',
    uiUpdateConfig = {}
}) {
    if (checkRequirements(requirements)) {
        deductCosts(requirements);
        onSuccess(); // Call main success logic first

        // Handle common UI updates based on config
        const {
            costElement,
            benefitElement,
            getNextLevelData,
            rowElement,
            removeRowOnMaxLevel = true,
            // New property to get hover classes
            hoverClassesToRemoveOnMaxLevel = [],
            // Use explicit selectors if provided
            removeHoverSelectors = [],
            // New flag to force preservation of hover effects
            preserveHover = false
        } = uiUpdateConfig;

        let nextLevelData = null;
        if (getNextLevelData) {
            nextLevelData = getNextLevelData();
        }

        const isMaxLevel = getNextLevelData && (nextLevelData === null || nextLevelData === undefined);

        // --- Start: Remove hover from spent currencies only if appropriate ---
        // Don't remove hover if:
        // 1. The upgrade has more levels available (non-null nextLevelData)
        // 2. preserveHover is explicitly set to true
        if ((isMaxLevel || !getNextLevelData) && !preserveHover) {
            // Use removeHoverCurrencies to properly update the internal hover state tracking
            const spentCurrencyClasses = requirements.map(req => {
                let item = typeof req.currency === 'string' ? currencyMap[req.currency] : req.currency;
                return item ? item.name : null;
            }).filter(name => name !== null);

            if (spentCurrencyClasses.length > 0) {
                removeHoverCurrencies(...spentCurrencyClasses);
            }

            // Also handle any explicit hover selectors that should be removed
            if (removeHoverSelectors.length > 0) {
                // Extract just the class names without the dot prefix for removeHoverCurrencies
                const classNames = removeHoverSelectors.map(selector => 
                    selector.startsWith('.') ? selector.substring(1) : selector
                );
                removeHoverCurrencies(...classNames);
            }
        }
        // --- End: Remove hover from spent currencies ---

        if (rowElement && removeRowOnMaxLevel && isMaxLevel) {
            // Remove hover effect *before* removing the row
            if (hoverClassesToRemoveOnMaxLevel.length > 0 && !preserveHover) {
                removeHoverCurrencies(...hoverClassesToRemoveOnMaxLevel);
            }
            rowElement.remove();
        } else {
            // Update cost and benefit if not max level and elements provided
            if (costElement && nextLevelData?.cost !== undefined) {
                // Directly use the cost string provided by getNextLevelData
                costElement.textContent = nextLevelData.cost;
            }
            if (benefitElement && nextLevelData?.benefit !== undefined) {
                // Handle potential HTML content for benefit
                if (typeof nextLevelData.benefit === 'string' && nextLevelData.benefit.includes('<')) {
                    benefitElement.innerHTML = nextLevelData.benefit;
                } else {
                    benefitElement.textContent = nextLevelData.benefit;
                }
            }
        }

        // Call the old updateUI for any custom logic not covered
        // TODO: Gradually remove this as call sites are refactored
        updateUI();

        if (successMessage) SnackBar(successMessage);
        return true;
    } else {
        onFailure();
        return false;
    }
}
