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
    benefitClass: '',
    benefit: () => `+${formatEfficiency(1)}`,
    costClass: 'delveScarabCost',
    costText: () => {
        const costs = ['1 Exalted', '5 Exalted', '10 Exalted'];
        return costs[UpgradesRef.nikoScarab] || 'Maxed';
    },
    requirements: () => {
        const costs = [1, 5, 10];
        return UpgradesRef.nikoScarab < costs.length
            ? [{ currency: currencyMap['Exalted'], amount: costs[UpgradesRef.nikoScarab] }]
            : [];
    },
    hover: () => hoverUpgrades('delveScarab', 'Exalted'),
    buy: () => {
        const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
        const costs = [1, 5, 10];
        const currentCost = costs[UpgradesRef.nikoScarab];
        return handlePurchase({
            requirements: currentCost !== undefined ? [{ currency: currencyMap['Exalted'], amount: currentCost }] : [],
            onSuccess: () => {
                UpgradesRef.nikoScarab++;
                UpgradesRef.sulphiteDropRate += 100;
                UpgradesRef.upgradeDropRate += 1;
            },
            updateUI: () => {
                const row = document.getElementById('delveScarab');
                if (!row) return;
                if (UpgradesRef.nikoScarab >= scarabTypes.length) {
                    $(".Exalted").removeClass("hover");
                    $(row).remove();
                    UpgradesRef.delveScarabShown = true;
                } else {
                    const costCell = row.querySelector('.delveScarabCost');
                    if (costCell) costCell.innerHTML = `${costs[UpgradesRef.nikoScarab]} Exalted`;
                    const button = row.querySelector('.nikoScarab');
                    if (button) button.textContent = scarabTypes[UpgradesRef.nikoScarab];
                    const descCell = row.children[1];
                    if (descCell) descCell.innerHTML = `Use ${scarabTypes[UpgradesRef.nikoScarab] || 'Sulphite Scarab'} to increase Sulphite quantity`;
                }
                const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
                if (globalUpgradeRateElem) globalUpgradeRateElem.innerHTML = formatEfficiency(UpgradesRef.upgradeDropRate);
            },
            onFailure: () => {
                if (UpgradesRef.nikoScarab >= scarabTypes.length) {
                    SnackBar("Scarab upgrades already maxed!");
                } else {
                    SnackBar("Requirements not met.");
                }
            },
            successMessage: 'Scarab upgraded!'
        });
    }
};

export default DelveScarabUpgradeConfig;
export { DelveScarabUpgradeConfig };
