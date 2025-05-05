import State from '../../../State.js';
import { SnackBar } from '../../../UIInitializer.js';
import { hoverUpgrades } from '../../currency/HoverState.js';
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
 * Generic handler for Incubator upgrade purchase.
 */
function handleIncubatorUpgrade() {
    const row = document.getElementById(IncubatorUpgradeConfig.rowId);
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
                // Make sure numeral is defined here - it's likely coming from a global scope
                return { cost: `${window.numeral(nextCost).format('0,0')} Chaos`, benefit: nextBenefit };
            },
            // Since this is an infinite upgrade that doesn't max out,
            // we need to preserve hover state after purchases
            preserveHover: true,
            // For consistency, define which hover classes would be removed if it did max out
            hoverClassesToRemoveOnMaxLevel: ['Chaos']
        },
        // Using the standard pattern - no updateUI needed for hover management
        // The preserveHover flag handles hover state maintenance automatically
        successMessage: 'Incubator upgraded!'
    });
}

/**
 * Configuration object for the Incubator upgrade.
 * Follows standardized upgrade config format used across the game.
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
    costText: () => `${window.numeral(UpgradesRef.incubatorCost).format('0,0')} Chaos`, // Use global numeral
    requirements: () => [{ currency: currencyMap['Chaos'], amount: UpgradesRef.incubatorCost }],
    hover: () => hoverUpgrades('incubatorUpgrade', 'Chaos'),
    buy: handleIncubatorUpgrade
};

export default IncubatorUpgradeConfig;
