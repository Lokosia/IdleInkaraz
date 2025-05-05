// HoverState.js
// Streamlined hover system that manages currency hover states
// Game UI has list of currencies and their value on the left side of screen
// In main tab, in the middle of a screen there is a table with upgrades, that can appear or be deleted depending on requirements
// All of those upgrades have a cost in currencies
// When player hovers over an upgrade, appropriate currencies from upgrade cost should be highlighted
// When player removes mouse from upgrade, the currencies should be unhighlighted
// When player hovers over another upgrade, the currencies from the first upgrade should be unhighlighted and the currencies from the second upgrade should be highlighted

// Track which currencies are being hovered by which elements
const hoverState = {
    // Which elements are hovering which currencies
    elementCurrencies: new Map(), // elementId -> Set(currencyNames)
    // Reference count for each currency
    currencyCounts: new Map()     // currencyName -> count
};

/**
 * Check if an element with given ID exists in the DOM
 * @param {string} elementId - Element ID to check
 * @returns {boolean} - True if element exists, false otherwise
 * @private
 */
function _elementExists(elementId) {
    return document.getElementById(elementId) !== null;
}

/**
 * Apply hover class to all elements with the given currency class
 * @param {string} currencyName - Currency class name
 * @private
 */
function _applyHoverClass(currencyName) {
    if (!currencyName) return;
    document.querySelectorAll(`.${currencyName}`).forEach(el => el.classList.add('hover'));
}

/**
 * Remove hover class from all elements with the given currency class
 * @param {string} currencyName - Currency class name
 * @private
 */
function _removeHoverClass(currencyName) {
    if (!currencyName) return;
    document.querySelectorAll(`.${currencyName}`).forEach(el => el.classList.remove('hover'));
}

/**
 * Add hover effect for an element and its currencies
 * @param {string} elementId - ID of the element causing the hover
 * @param {string[]} currencyNames - Array of currency names to highlight
 * @private
 */
function _addHover(elementId, currencyNames) {
    // Check if element exists before proceeding
    if (!_elementExists(elementId)) {
        console.warn(`Element #${elementId} doesn't exist for hover effect`);
        return;
    }
    
    // Filter out null/undefined currencies
    const validCurrencies = currencyNames.filter(Boolean);
    if (validCurrencies.length === 0) return;
    
    // Clean up any existing currencies for this element
    const existingCurrencies = hoverState.elementCurrencies.get(elementId);
    if (existingCurrencies) {
        [...existingCurrencies].forEach(oldCurrency => {
            if (!validCurrencies.includes(oldCurrency)) {
                // Decrement ref count for currencies no longer being hovered
                const count = hoverState.currencyCounts.get(oldCurrency) || 0;
                if (count <= 1) {
                    hoverState.currencyCounts.delete(oldCurrency);
                    _removeHoverClass(oldCurrency);
                } else {
                    hoverState.currencyCounts.set(oldCurrency, count - 1);
                }
            }
        });
    }
    
    // Store the new set of currencies for this element
    hoverState.elementCurrencies.set(elementId, new Set(validCurrencies));
    
    // Increment ref count and apply hover class
    validCurrencies.forEach(currency => {
        const count = hoverState.currencyCounts.get(currency) || 0;
        hoverState.currencyCounts.set(currency, count + 1);
        _applyHoverClass(currency);
    });
}

/**
 * Remove hover effect for an element
 * @param {string} elementId - ID of the element that was hovering
 * @private
 */
function _removeHover(elementId) {
    // Get currencies this element was hovering
    const currencies = hoverState.elementCurrencies.get(elementId);
    if (!currencies || currencies.size === 0) return;
    
    // Clean up element tracking
    hoverState.elementCurrencies.delete(elementId);
    
    // Decrement ref count and remove hover class if needed
    [...currencies].forEach(currency => {
        const count = hoverState.currencyCounts.get(currency) || 0;
        
        if (count <= 1) {
            // This was the last reference, remove the hover class
            hoverState.currencyCounts.delete(currency);
            _removeHoverClass(currency);
        } else {
            // Decrement the count
            hoverState.currencyCounts.set(currency, count - 1);
        }
    });
}

/**
 * Explicitly remove hover effects for specific currencies
 * @param {...string} currencyNames - Currency names to remove hover from
 */
function removeHoverCurrencies(...currencyNames) {
    currencyNames.filter(Boolean).forEach(currency => {
        // Force remove the hover class
        _removeHoverClass(currency);
        
        // Reset reference count
        hoverState.currencyCounts.delete(currency);
        
        // Update element tracking for this currency
        hoverState.elementCurrencies.forEach((currencies, elementId) => {
            if (currencies.has(currency)) {
                currencies.delete(currency);
                if (currencies.size === 0) {
                    hoverState.elementCurrencies.delete(elementId);
                }
            }
        });
    });
}

/**
 * Clear all hover states
 */
function clearAllHoverCurrencies() {
    // Remove all hover classes
    hoverState.currencyCounts.forEach((_, currency) => {
        _removeHoverClass(currency);
    });
    
    // Reset all state
    hoverState.elementCurrencies.clear();
    hoverState.currencyCounts.clear();
}

/**
 * Clean up hover effects for elements that no longer exist in the DOM
 * @private
 */
function _cleanupOrphanedHoverStates() {
    const elementsToRemove = [];
    
    // Find elements that don't exist in the DOM anymore
    hoverState.elementCurrencies.forEach((_, elementId) => {
        if (!_elementExists(elementId)) {
            elementsToRemove.push(elementId);
        }
    });
    
    // Remove hover effects for orphaned elements
    elementsToRemove.forEach(elementId => {
        _removeHover(elementId);
    });
}

/**
 * Set up hover effects for an element
 * @param {string} elementId - Element ID to attach hover to
 * @param {string} currencyClass1 - First currency to highlight
 * @param {string} [currencyClass2] - Second currency to highlight (optional)
 * @param {string[]} [...additionalCurrencies] - Additional currencies to highlight (optional)
 */
function hoverUpgrades(elementId, currencyClass1, currencyClass2, ...additionalCurrencies) {
    // First clean up any orphaned hover states
    _cleanupOrphanedHoverStates();
    
    const element = $(`#${elementId}`);
    if (!element.length) {
        console.warn(`Element with ID #${elementId} not found for hover effect.`);
        return;
    }
    
    // Create array of currencies for this element
    const currencies = [currencyClass1, currencyClass2, ...additionalCurrencies].filter(Boolean);
    
    // Clean up any existing hover state for this element
    if (hoverState.elementCurrencies.has(elementId)) {
        _removeHover(elementId);
    }
    
    // Remove any existing hover handlers
    element.off('mouseenter mouseleave');
    
    // Add new hover handlers with checks to prevent race conditions
    element.on('mouseenter', function() {
        _addHover(elementId, currencies);
    });
    
    element.on('mouseleave', function() {
        _removeHover(elementId);
    });
}

// Export the public API
export { 
    hoverUpgrades,
    removeHoverCurrencies, 
    clearAllHoverCurrencies
};
