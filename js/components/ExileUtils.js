// Exile utility functions for requirements, upgrades, and costs

/**
 * Processes an upgrade for an exile, handling requirements checking, cost deduction and benefit application
 * @param {Object} upgrade - The upgrade configuration object
 * @param {function} onSuccess - Callback to execute if upgrade is successful
 * @returns {boolean} - Whether the upgrade was successful
 */
function processUpgrade(upgrade, onSuccess) {
    if (checkRequirements(upgrade.requirements)) {
        deductCosts(upgrade.requirements);
        onSuccess(upgrade);
        return true;
    }
    return false;
}

/**
 * Checks if all currency requirements are met.
 * @param {Array<Object>} requirements - An array of requirement objects
 * @returns {boolean} - True if all requirements are met, false otherwise.
 */
function checkRequirements(requirements) {
    for (const req of requirements) {
        if (!req.currency || typeof req.currency.total === 'undefined') {
            console.error("Invalid currency object in requirements:", req);
            return false;
        }
        if (req.currency.total < req.amount) {
            return false;
        }
    }
    return true;
}

/**
 * Deducts currency costs based on the requirements array.
 * Assumes checkRequirements has already passed.
 * @param {Array<Object>} requirements - An array of requirement objects
 */
function deductCosts(requirements) {
    for (const req of requirements) {
        if (req.currency && typeof req.currency.total !== 'undefined') {
            req.currency.total -= req.amount;
        } else {
            console.error("Attempted to deduct invalid currency:", req);
        }
    }
}

/**
 * Generates a Mirror upgrade for high gear levels
 * @param {number} gearLevel - Current gear level
 * @returns {Object} - A Mirror upgrade configuration
 */
function getMirrorUpgrade(gearLevel) {
    return {
        level: gearLevel,
        name: "Mirror gear",
        requirements: [
            { currency: Exalted, amount: gearLevel },
            { currency: Mirror, amount: 1 }
        ],
        specialIncrement: 10,
        benefit: 2.5,
        description: "Mirror gear for {name}"
    };
}

export { processUpgrade, checkRequirements, deductCosts, getMirrorUpgrade };