import State from '../../../State.js';
import { SnackBar, hoverUpgrades } from '../../../UIInitializer.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { formatEfficiency } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

// These should be provided by the main Upgrades state
let UpgradesRef = null;

/**
 * Sets the reference to the main Upgrades state object for use in the incubator upgrade config.
 *
 * @param {Object} ref - The Upgrades state object.
 * @returns {void}
 */
export function setUpgradesRef(ref) {
    UpgradesRef = ref;
}

/**
 * Configuration object for the Incubator upgrade.
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
 * @property {string} description - Description of the upgrade.
 * @property {string} benefitClass - CSS class for the benefit cell.
 * @property {Function} benefit - Function returning the benefit string.
 * @property {string} costClass - CSS class for the cost cell.
 * @property {Function} costText - Function returning the cost string.
 * @property {Function} requirements - Function returning the requirements array.
 * @property {Function} hover - Function to apply hover effects.
 * @property {Function} buy - Function to handle the upgrade purchase.
 */
const IncubatorUpgradeConfig = {
    key: 'incubator',
    shownFlag: 'incubatorUpgradeShown',
    unlock: () => State.exileMap['Ascendant'].level >= 75,
    rowId: 'incubatorUpgrade',
    buttonId: 'btn-incubator-upgrade',
    buttonClass: 'incubatorUpgradeButton',
    buttonText: 'Equip Incubators',
    description: 'Equip Incubators to exile gear',
    benefitClass: 'incDropRate',
    benefit: () => `+${formatEfficiency(UpgradesRef.incDropRate === 0 ? 1 : UpgradesRef.incDropRate)}`,
    costClass: 'incubatorUpgradeCostDisplay',
    costText: () => `+${numeral(UpgradesRef.incubatorCost).format('0,0')} Chaos`,
    requirements: () => [{ currency: currencyMap['Chaos'], amount: UpgradesRef.incubatorCost }],
    hover: () => hoverUpgrades('incubatorUpgrade', 'Chaos'),
    buy: () => handlePurchase({
        requirements: [{ currency: currencyMap['Chaos'], amount: UpgradesRef.incubatorCost }],
        onSuccess: () => {
            UpgradesRef.incubatorCost = Math.floor(UpgradesRef.incubatorCost * 1.2);
            if (UpgradesRef.incDropRate === 0) {
                UpgradesRef.incDropRate = 1;
            } else {
                UpgradesRef.incDropRate += 0.1;
            }
        },
        updateUI: () => {
            const row = document.getElementById('incubatorUpgrade');
            if (!row) return;
            const costCell = row.querySelector('.incubatorUpgradeCostDisplay');
            if (costCell) {
                costCell.innerHTML = `+${numeral(UpgradesRef.incubatorCost).format('0,0')} Chaos`;
            }
            const benefitCell = row.querySelector('.incDropRate');
            if (benefitCell) {
                benefitCell.innerHTML = `+${formatEfficiency(UpgradesRef.incDropRate === 0 ? 1 : UpgradesRef.incDropRate)}`;
            }
        },
        successMessage: 'Incubator upgraded!'
    })
};

export default IncubatorUpgradeConfig;
