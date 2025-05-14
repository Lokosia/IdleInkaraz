import State from '../../../State.js';
import { SnackBar } from '../../../UIInitializer.js';
import { hoverUpgrades } from '../../currency/HoverState.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { formatEfficiency, updateTheorycraftingEfficiencyUI } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { select } from '../../../../js/libs/DOMUtils.js';

/**
 * Generic handler for Incubator upgrade purchase.
 */
function handleIncubatorUpgrade() {
    const row = select(`#${IncubatorUpgradeConfig.rowId}`);
    if (!row) return false;
    const currentCost = State.incubatorCost;
    return handlePurchase({
        requirements: [{ currency: currencyMap['Chaos'], amount: currentCost }],
        onSuccess: () => {
            State.incubatorCost = Math.floor(currentCost * 1.2);
            if (State.incDropRate === 0) {
                State.incDropRate = 1;
            } else {
                State.incDropRate += 0.1;
            }
            // Update the Theorycrafting string (Upgrade Efficiency) to include Incubator value
            updateTheorycraftingEfficiencyUI();
        },
        uiUpdateConfig: {
            rowElement: row,
            costElement: row.querySelector('.incubatorUpgradeCostDisplay'),
            benefitElement: row.querySelector('.incDropRate'),
            getNextLevelData: () => {
                const nextCost = Math.floor(currentCost * 1.2);
                const nextDropRate = (State.incDropRate === 0) ? 1 : State.incDropRate + 0.1;
                const nextBenefit = `+${formatEfficiency(nextDropRate)}`;
                return { cost: `${window.numeral(nextCost).format('0,0')} Chaos`, benefit: nextBenefit };
            },
            preserveHover: true,
            hoverClassesToRemoveOnMaxLevel: ['Chaos']
        },
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
    unlock: () => State.exileMap && State.exileMap['Ascendant'] && State.exileMap['Ascendant'].level >= 75,
    rowId: 'incubatorUpgrade',
    buttonId: 'btn-incubator-upgrade',
    buttonClass: 'incubatorUpgradeButton',
    buttonText: 'Equip Incubators',
    description: 'Equip Incubators to exile gear',
    benefitClass: 'incDropRate',
    benefit: () => `+${formatEfficiency(State.incDropRate === 0 ? 1 : State.incDropRate)}`,
    costClass: 'incubatorUpgradeCostDisplay',
    costText: () => `${window.numeral(State.incubatorCost).format('0,0')} Chaos`,
    requirements: () => [{ currency: currencyMap['Chaos'], amount: State.incubatorCost }],
    hover: () => hoverUpgrades('incubatorUpgrade', 'Chaos'),
    buy: handleIncubatorUpgrade
};

export default IncubatorUpgradeConfig;
