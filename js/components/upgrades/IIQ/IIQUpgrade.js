// IIQUpgrade.js - Handles the IIQ (Increased Item Quantity) upgrade config and logic
import State from '../../../State.js';
import { SnackBar, hoverUpgrades } from '../../../UIInitializer.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { formatEfficiency } from '../Augments.js';

/**
 * State object for the IIQ (Increased Item Quantity) upgrade.
 *
 * @typedef {Object} IIQState
 * @property {number} iiqDropRate - Current IIQ drop rate bonus.
 * @property {number} iiqCost - Current cost for the next IIQ upgrade.
 */
const IIQState = {
    iiqDropRate: 1,
    iiqCost: 10
};

/**
 * Configuration object for the IIQ (Increased Item Quantity) upgrade.
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
const IIQUpgradeConfig = {
    key: 'iiq',
    shownFlag: 'iiqUpgradeShown',
    unlock: () => State.exileMap['Ascendant'].level >= 50,
    rowId: 'iiqUpgrade',
    buttonId: 'btn-iiq-upgrade',
    buttonClass: 'iiqUpgradeButton',
    buttonText: 'IIQ Gear',
    description: 'Buy Increased Item Quantity gear for exiles',
    benefitClass: 'iiqDropRate',
    benefit: () => `+${formatEfficiency(IIQState.iiqDropRate)}`,
    costClass: 'iiqUpgradeCostDisplay',
    costText: () => `+${numeral(IIQState.iiqCost).format('0,0')} Chaos`,
    requirements: () => [{ currency: currencyMap['Chaos'], amount: IIQState.iiqCost }],
    hover: () => hoverUpgrades('iiqUpgrade', 'Chaos'),
    buy: () => handlePurchase({
        requirements: [{ currency: currencyMap['Chaos'], amount: IIQState.iiqCost }],
        onSuccess: () => {
            if (IIQState.iiqDropRate === 1) {
                import('../Augments.js').then(({ default: Upgrades }) => {
                    Upgrades.upgradeDropRate += 1;
                });
            } else {
                import('../Augments.js').then(({ default: Upgrades }) => {
                    Upgrades.upgradeDropRate += 0.1;
                });
            }
            IIQState.iiqCost = Math.floor(IIQState.iiqCost * 1.4);
            IIQState.iiqDropRate += 0.1;
        },
        updateUI: () => {
            const row = document.getElementById('iiqUpgrade');
            if (!row) return;
            const costCell = row.querySelector('.iiqUpgradeCostDisplay');
            if (costCell) {
                costCell.innerHTML = numeral(IIQState.iiqCost).format('0,0') + ' Chaos';
            }
            const benefitCell = row.querySelector('.iiqDropRate');
            if (benefitCell) {
                benefitCell.innerHTML = `+${formatEfficiency(IIQState.iiqDropRate)}`;
            }
            // Update global display
            const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
            if (globalUpgradeRateElem) {
                import('../Augments.js').then(({ default: Upgrades, formatEfficiency }) => {
                    globalUpgradeRateElem.innerHTML = formatEfficiency(Upgrades.upgradeDropRate);
                });
            }
        },
        successMessage: 'IIQ upgraded!'
    })
};

export { IIQUpgradeConfig, IIQState };