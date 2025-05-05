// IIQUpgrade.js - Handles the IIQ (Increased Item Quantity) upgrade config and logic
import State from '../../../State.js';
import { SnackBar } from '../../../UIInitializer.js';
import { hoverUpgrades } from '../../currency/HoverState.js';
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
 * Generic handler for IIQ upgrade purchase.
 */
function handleIIQUpgrade() {
    const row = document.getElementById(IIQUpgradeConfig.rowId);
    if (!row) return false;
    const currentCost = IIQState.iiqCost;
    const currentDropRate = IIQState.iiqDropRate;
    return handlePurchase({
        requirements: [{ currency: currencyMap['Chaos'], amount: currentCost }],
        onSuccess: () => {
            import('../Augments.js').then(({ default: Upgrades }) => {
                Upgrades.upgradeDropRate += (currentDropRate === 1) ? 1 : 0.1;
            });
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
                return { cost: `${numeral(nextCost).format('0,0')} Chaos`, benefit: nextBenefit };
            },
            // Since this is an infinite upgrade that doesn't max out,
            // we need to preserve hover state after purchases
            preserveHover: true,
            // For consistency, define which hover classes would be removed if it did max out
            hoverClassesToRemoveOnMaxLevel: ['Chaos']
        },
        updateUI: () => {
            const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
            if (globalUpgradeRateElem) {
                import('../Augments.js').then(({ default: Upgrades }) => {
                    globalUpgradeRateElem.innerHTML = formatEfficiency(Upgrades.upgradeDropRate);
                });
            }
            // Don't call hoverUpgrades here - it's handled by preserveHover flag
        },
        successMessage: 'IIQ upgraded!'
    });
}

/**
 * Configuration object for the IIQ upgrade.
 * Follows standardized upgrade config format used across the game.
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
    costText: () => `${numeral(IIQState.iiqCost).format('0,0')} Chaos`,
    requirements: () => [{ currency: currencyMap['Chaos'], amount: IIQState.iiqCost }],
    hover: () => hoverUpgrades('iiqUpgrade', 'Chaos'),
    buy: handleIIQUpgrade
};

export { IIQUpgradeConfig, IIQState };