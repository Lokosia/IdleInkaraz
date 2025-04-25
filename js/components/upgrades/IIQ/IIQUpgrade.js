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
    costText: () => `${numeral(IIQState.iiqCost).format('0,0')} Chaos`, // Use numeral directly
    requirements: () => [{ currency: currencyMap['Chaos'], amount: IIQState.iiqCost }],
    hover: () => hoverUpgrades('iiqUpgrade', 'Chaos'),
    buy: () => {
        const row = document.getElementById('iiqUpgrade');
        if (!row) return false;

        const currentCost = IIQState.iiqCost;
        const currentDropRate = IIQState.iiqDropRate;

        return handlePurchase({
            requirements: [{ currency: currencyMap['Chaos'], amount: currentCost }],
            onSuccess: () => {
                // Increment global upgrade drop rate (specific logic)
                import('../Augments.js').then(({ default: Upgrades }) => {
                    Upgrades.upgradeDropRate += (currentDropRate === 1) ? 1 : 0.1;
                });

                // Update IIQ state
                IIQState.iiqCost = Math.floor(currentCost * 1.4);
                IIQState.iiqDropRate += 0.1;
            },
            uiUpdateConfig: {
                rowElement: row,
                costElement: row.querySelector('.iiqUpgradeCostDisplay'),
                benefitElement: row.querySelector('.iiqDropRate'),
                getNextLevelData: () => {
                    const nextCost = Math.floor(currentCost * 1.4);
                    const nextBenefit = `+${formatEfficiency(currentDropRate + 0.1)}`;
                    // Return the fully formatted cost string
                    return { cost: `${numeral(nextCost).format('0,0')} Chaos`, benefit: nextBenefit };
                },
                // This upgrade doesn't have a max level
            },
            updateUI: () => {
                // Update global display (keep this custom logic here for now)
                const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
                if (globalUpgradeRateElem) {
                    import('../Augments.js').then(({ default: Upgrades }) => {
                        // Use the updated Upgrades.upgradeDropRate after onSuccess runs
                        globalUpgradeRateElem.innerHTML = formatEfficiency(Upgrades.upgradeDropRate);
                    });
                }
                // Cost and benefit cell updates are now handled by uiUpdateConfig

                // Re-apply hover effect
                hoverUpgrades(IIQUpgradeConfig.rowId, 'Chaos');
                // Manually add hover class back
                document.querySelectorAll('.Chaos').forEach(el => el.classList.add('hover'));
            },
            successMessage: 'IIQ upgraded!'
        });
    }
};

export { IIQUpgradeConfig, IIQState };