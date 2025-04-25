import { currencyMap } from '../currency/CurrencyData.js';
import { SnackBar } from '../../UIInitializer.js';
import { handlePurchase } from '../shared/PurchaseUtils.js';

/**
 * Generates a Mirror upgrade configuration for high gear levels.
 * @param {number} gearLevel - Current gear level.
 * @returns {Object} A Mirror upgrade configuration object.
 */
function getMirrorUpgrade(gearLevel) {
    return {
        level: gearLevel,
        name: "Mirror gear",
        requirements: [
            { currency: currencyMap['Exalted'], amount: gearLevel },
            { currency: currencyMap['Mirror'], amount: 1 }
        ],
        specialIncrement: 10,
        benefit: 2.5,
        description: "Mirror gear for {name}"
    };
}

// Export the new handler and keep getMirrorUpgrade
export { getMirrorUpgrade };