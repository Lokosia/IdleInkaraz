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
    costText: () => `${numeral(UpgradesRef.incubatorCost).format('0,0')} Chaos`, // Use numeral directly
    requirements: () => [{ currency: currencyMap['Chaos'], amount: UpgradesRef.incubatorCost }],
    hover: () => hoverUpgrades('incubatorUpgrade', 'Chaos'),
    buy: () => {
        const row = document.getElementById('incubatorUpgrade');
        if (!row) return false;

        const currentCost = UpgradesRef.incubatorCost;
        const currentDropRate = UpgradesRef.incDropRate;

        return handlePurchase({
            requirements: [{ currency: currencyMap['Chaos'], amount: currentCost }],
            onSuccess: () => {
                UpgradesRef.incubatorCost = Math.floor(currentCost * 1.2);
                if (currentDropRate === 0) {
                    UpgradesRef.incDropRate = 1;
                } else {
                    UpgradesRef.incDropRate += 0.1;
                }
            },
            uiUpdateConfig: {
                rowElement: row,
                costElement: row.querySelector('.incubatorUpgradeCostDisplay'),
                benefitElement: row.querySelector('.incDropRate'),
                getNextLevelData: () => {
                    const nextCost = Math.floor(currentCost * 1.2);
                    const nextDropRate = (currentDropRate === 0) ? 1 : currentDropRate + 0.1;
                    const nextBenefit = `+${formatEfficiency(nextDropRate)}`;
                    // Return the fully formatted cost string
                    return { cost: `${numeral(nextCost).format('0,0')} Chaos`, benefit: nextBenefit };
                },
                // This upgrade doesn't have a max level
            },
            updateUI: () => {
                // All UI updates are now handled by uiUpdateConfig
                // Re-apply hover effect
                hoverUpgrades(IncubatorUpgradeConfig.rowId, 'Chaos');
                // Manually add hover class back
                document.querySelectorAll('.Chaos').forEach(el => el.classList.add('hover'));
            },
            successMessage: 'Incubator upgraded!'
        });
    }
};

export default IncubatorUpgradeConfig;
