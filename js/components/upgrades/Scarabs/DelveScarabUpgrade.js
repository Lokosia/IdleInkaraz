// DelveScarabUpgrade.js
import { currencyMap } from '../../currency/CurrencyData.js';
import { SnackBar, hoverUpgrades } from '../../../UIInitializer.js';
import { formatEfficiency } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

let UpgradesRef = null;
/**
 * Sets the reference to the main Upgrades state object for use in the delve scarab upgrade config.
 *
 * @param {Object} ref - The Upgrades state object.
 * @returns {void}
 */
export function setUpgradesRef(ref) {
    UpgradesRef = ref;
}

/**
 * Configuration object for the Sulphite Scarab (Delve Scarab) upgrade.
 * Defines unlock logic, UI row IDs, button text, requirements, and buy logic.
 *
 * @type {Object}
 * @property {string} key - Unique key for the upgrade.
 * @property {string} shownFlag - UI flag for whether the upgrade is shown.
 * @property {Function} unlock - Function to determine if the upgrade is unlocked.
 * @property {string} rowId - DOM row ID for the upgrade.
 * @property {string} buttonId - DOM button ID for the upgrade.
 * @property {string} buttonClass - CSS class for the upgrade button.
 * @property {string} buttonText - Button label text.
 * @property {Function} description - Function returning the description string.
 * @property {string} benefitClass - CSS class for the benefit cell.
 * @property {Function} benefit - Function returning the benefit string.
 * @property {string} costClass - CSS class for the cost cell.
 * @property {Function} costText - Function returning the cost string.
 * @property {Function} requirements - Function returning the requirements array.
 * @property {Function} hover - Function to apply hover effects.
 * @property {Function} buy - Function to handle the upgrade purchase.
 */
const DelveScarabUpgradeConfig = {
    key: 'delveScarab',
    shownFlag: 'delveScarabShown',
    unlock: () => UpgradesRef.delveStashTab === 1 && !UpgradesRef.delveScarabShown,
    rowId: 'delveScarab',
    buttonId: 'btn-niko-scarab',
    buttonClass: 'nikoScarab',
    buttonText: 'Sulphite Scarab',
    description: () => {
        const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
        return `Use ${scarabTypes[UpgradesRef.nikoScarab] || 'Sulphite Scarab'} to increase Sulphite quantity`;
    },
    benefitClass: '', // No specific class for benefit, handled by description/button text
    benefit: () => `+${formatEfficiency(1)}`, // Benefit is fixed per level
    costClass: 'delveScarabCost',
    costText: () => {
        const costs = [1, 5, 10];
        const cost = costs[UpgradesRef.nikoScarab];
        return cost !== undefined ? `${numeral(cost).format('0,0')} Exalted` : 'Maxed'; // Use numeral directly
    },
    requirements: () => {
        const costs = [1, 5, 10];
        return UpgradesRef.nikoScarab < costs.length
            ? [{ currency: currencyMap['Exalted'], amount: costs[UpgradesRef.nikoScarab] }]
            : [];
    },
    hover: () => hoverUpgrades('delveScarab', 'Exalted'),
    buy: () => {
        const row = document.getElementById('delveScarab');
        if (!row) return false;

        const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
        const costs = [1, 5, 10];
        const currentLevel = UpgradesRef.nikoScarab;

        if (currentLevel >= costs.length) {
            SnackBar("Scarab upgrades already maxed!");
            return false; // Already maxed, don't proceed
        }

        const currentCost = costs[currentLevel];

        return handlePurchase({
            requirements: [{ currency: currencyMap['Exalted'], amount: currentCost }],
            onSuccess: () => {
                UpgradesRef.nikoScarab++;
                UpgradesRef.sulphiteDropRate += 100;
                UpgradesRef.upgradeDropRate += 1;
                // Set shown flag only when the last level is purchased
                if (UpgradesRef.nikoScarab >= scarabTypes.length) {
                    UpgradesRef.delveScarabShown = true;
                }
            },
            uiUpdateConfig: {
                rowElement: row,
                costElement: row.querySelector('.delveScarabCost'),
                // benefitElement is not used directly, handled in updateUI
                getNextLevelData: () => {
                    const nextLevel = currentLevel + 1;
                    if (nextLevel >= costs.length) {
                        return null; // Signal max level reached
                    }
                    const nextCost = costs[nextLevel];
                    // Return the fully formatted cost string
                    return { cost: `${numeral(nextCost).format('0,0')} Exalted` };
                },
                removeRowOnMaxLevel: true, // Remove row when getNextLevelData returns null
                // Pass currency names for hover removal on max level
                hoverClassesToRemoveOnMaxLevel: ['Exalted']
            },
            updateUI: () => {
                const nextLevel = UpgradesRef.nikoScarab; // Get the *new* level after onSuccess

                // Update description and button text if not maxed out
                if (nextLevel < scarabTypes.length) {
                    const button = row.querySelector('.nikoScarab');
                    if (button) button.textContent = scarabTypes[nextLevel];
                    const descCell = row.children[1]; // Assuming description is the second cell
                    if (descCell) descCell.innerHTML = `Use ${scarabTypes[nextLevel]} to increase Sulphite quantity`;
                }

                // Update global display (keep this custom logic here)
                const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
                if (globalUpgradeRateElem) {
                    globalUpgradeRateElem.innerHTML = formatEfficiency(UpgradesRef.upgradeDropRate);
                }
                // Cost update and row removal are handled by uiUpdateConfig

                // Re-apply hover if not maxed out
                if (nextLevel < scarabTypes.length) {
                    hoverUpgrades(DelveScarabUpgradeConfig.rowId, 'Exalted');
                    // Manually add hover class back
                    document.querySelectorAll('.Exalted').forEach(el => el.classList.add('hover'));
                }
            },
            // onFailure is handled by the default message now
            successMessage: 'Scarab upgraded!'
        });
    }
};

export default DelveScarabUpgradeConfig;
export { DelveScarabUpgradeConfig };
