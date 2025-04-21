import { currencyMap } from '../currency/CurrencyData.js';
import { SnackBar } from '../../../Main.js'; // Import SnackBar for notifications

// Exile utility functions - Refactored for generic upgrade handling

/**
 * Checks if all currency requirements are met.
 * @param {Array<Object>} requirements - An array of requirement objects { currency: Currency, amount: number }
 * @returns {boolean} - True if all requirements are met, false otherwise.
 * @private
 */
function _checkRequirements(requirements) {
    if (!requirements || requirements.length === 0) {
        return true; // No requirements means they are met
    }
    for (const req of requirements) {
        if (!req.currency || typeof req.currency.total === 'undefined') {
            console.error("Invalid currency object in requirements:", req);
            SnackBar("Error checking requirements."); // User feedback
            return false;
        }
        if (req.currency.total < req.amount) {
            return false; // Requirement not met
        }
    }
    return true; // All requirements met
}

/**
 * Deducts currency costs based on the requirements array.
 * Assumes _checkRequirements has already passed.
 * @param {Array<Object>} requirements - An array of requirement objects { currency: Currency, amount: number }
 * @private
 */
function _deductCosts(requirements) {
    if (!requirements) return;
    for (const req of requirements) {
        if (req.currency && typeof req.currency.total !== 'undefined') {
            req.currency.total -= req.amount;
        } else {
            // This case should ideally not happen if checkRequirements passed
            console.error("Attempted to deduct invalid currency:", req);
        }
    }
}

/**
 * Handles a generic upgrade attempt, checking requirements, deducting costs,
 * and executing callbacks on success or failure.
 *
 * @param {object} options - Configuration for the upgrade attempt.
 * @param {Array<object>} [options.requirements=[]] - Array of { currency: Currency, amount: number }.
 * @param {function} [options.check=() => true] - An additional synchronous check function. Return true if check passes.
 * @param {function} [options.onSuccess=() => {}] - Callback function executed on successful upgrade (after cost deduction).
 * @param {function} [options.onFailure=() => SnackBar("Requirements not met.")] - Callback function executed on failed upgrade.
 * @param {function} [options.updateUI=() => {}] - Callback function executed after onSuccess to update the UI.
 * @param {function} [options.onComplete=() => {}] - Callback function executed at the very end, regardless of success/failure.
 * @param {string} [options.successMessage="Upgrade purchased!"] - Message to show on success.
 * @returns {boolean} - True if the upgrade was successful, false otherwise.
 */
function handleGenericUpgrade({
    requirements = [],
    check = () => true,
    onSuccess = () => { },
    onFailure = () => SnackBar("Requirements not met."),
    updateUI = () => { },
    onComplete = () => { },
    successMessage = "Upgrade purchased!"
}) {
    let success = false;
    if (check() && _checkRequirements(requirements)) {
        _deductCosts(requirements);
        try {
            onSuccess(); // Execute success logic
            updateUI(); // Update UI after success
            if (successMessage) {
                SnackBar(successMessage);
            }
            success = true;
        } catch (error) {
            console.error("Error during onSuccess/updateUI:", error);
            SnackBar("An error occurred during the upgrade.");
            // Attempt to rollback costs? Difficult without knowing the exact state change.
            // For now, log the error and notify the user.
            success = false; // Mark as failed due to error
            // Do not call onFailure here as it's for requirement failure
        }
    } else {
        onFailure(); // Execute failure logic (requirements not met)
        success = false;
    }

    try {
        onComplete(); // Execute completion logic regardless of success/failure
    } catch (error) {
        console.error("Error during onComplete:", error);
        // Log error, but don't change the success status or notify user further
    }

    return success;
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
            { currency: currencyMap['Exalted'], amount: gearLevel },
            { currency: currencyMap['Mirror'], amount: 1 }
        ],
        specialIncrement: 10,
        benefit: 2.5,
        description: "Mirror gear for {name}"
    };
}

// Export the new handler and keep getMirrorUpgrade
export { handleGenericUpgrade, getMirrorUpgrade };