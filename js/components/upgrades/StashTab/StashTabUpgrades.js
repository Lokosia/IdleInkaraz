// StashTabUpgrades.js
// Handles logic and configs for stash tab upgrades
import State from '../../../State.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { hoverUpgrades } from '../../currency/HoverState.js';
import { formatEfficiency } from '../Augments.js';
import { select } from '../../../../js/libs/DOMUtils.js';

/**
 * Generic handler for stash tab upgrades.
 * @param {Object} config - The upgrade config object.
 * @param {Function} [onUpgrade] - Optional callback after upgrade.
 */
function handleStashTabUpgrade(config, onUpgrade) {
    const row = select(`#${config.rowId}`);
    if (!row) return;
    handlePurchase({
        requirements: config.requirements(),
        onSuccess: () => {
            State[config.key] = 1;
            if (onUpgrade) onUpgrade();
        },
        uiUpdateConfig: {
            rowElement: row,
            getNextLevelData: () => null, // One-time purchase
            removeRowOnMaxLevel: true,
            hoverClassesToRemoveOnMaxLevel: config.requirements().map(r => r.currency.name)
        },
        updateUI: () => {},
        successMessage: 'Stash tab purchased!'
    });
}

/**
 * Array of configuration objects for each stash tab upgrade.
 * Each object defines unlock logic, UI row IDs, button text, requirements, and buy logic.
 *
 * @type {Array<Object>}
 */
const stashTabUpgradeConfigs = [
    {
        key: 'currencyStashTab',
        shownFlag: 'currencyTabShown',
        unlock: (totalLevel) => totalLevel >= 250 && State.currencyStashTab === 0,
        rowId: 'currencyTab',
        buttonId: 'btn-currency-tab',
        buttonClass: 'currencyTabButton',
        buttonText: 'Currency Stash Tab',
        description: 'Purchase the Currency Stash Tab',
        benefitClass: '',
        benefit: () => `+${formatEfficiency(1)}`,
        costClass: '',
        costText: () => '5 Stacked Deck',
        requirements: () => [{ currency: currencyMap['StackedDeck'], amount: 5 }],
        hover: () => hoverUpgrades('currencyTab', 'StackedDeck'),
        buy: (onUpgrade) => handleStashTabUpgrade(stashTabUpgradeConfigs[0], onUpgrade)
    },
    {
        key: 'delveStashTab',
        shownFlag: 'delveTabShown',
        unlock: (totalLevel) => totalLevel >= 500 && State.delveStashTab === 0,
        rowId: 'delveTab',
        buttonId: 'btn-delve-tab',
        buttonClass: 'delveTabButton',
        buttonText: 'Delve Stash Tab',
        description: 'Purchase the Delve Stash Tab',
        benefitClass: '',
        benefit: () => `+${formatEfficiency(1)}`,
        costClass: '',
        costText: () => '50 Stacked Deck<br>10 Orb of Annulment',
        requirements: () => [
            { currency: currencyMap['StackedDeck'], amount: 50 },
            { currency: currencyMap['Annulment'], amount: 10 }
        ],
        hover: () => hoverUpgrades('delveTab', 'StackedDeck', 'Annulment'),
        buy: (onUpgrade) => handleStashTabUpgrade(stashTabUpgradeConfigs[1], onUpgrade)
    },
    {
        key: 'quadStashTab',
        shownFlag: 'quadTabShown',
        unlock: (totalLevel) => totalLevel >= 1000 && State.quadStashTab === 0,
        rowId: 'quadTab',
        buttonId: 'btn-quad-tab',
        buttonClass: 'quadTabButton',
        buttonText: 'Quad Stash Tab',
        description: 'Purchase the Quad Stash Tab',
        benefitClass: '',
        benefit: () => `+${formatEfficiency(1)}`,
        costClass: '',
        costText: () => '1 Eternal Orb',
        requirements: () => [{ currency: currencyMap['Eternal'], amount: 1 }],
        hover: () => hoverUpgrades('quadTab', 'Eternal'),
        buy: (onUpgrade) => handleStashTabUpgrade(stashTabUpgradeConfigs[2], onUpgrade)
    },
    {
        key: 'divStashTab',
        shownFlag: 'divTabShown',
        unlock: (totalLevel) => totalLevel >= 750 && State.divStashTab === 0,
        rowId: 'divTab',
        buttonId: 'btn-div-tab',
        buttonClass: 'divTabButton',
        buttonText: 'Divination Stash Tab',
        description: 'Consume (1) Stacked Deck<br>(per tick)',
        benefitClass: '',
        benefit: () => `+${formatEfficiency(1)}`,
        costClass: '',
        costText: () => '50 Orb of Annulment<br>1 Exalted',
        requirements: () => [
            { currency: currencyMap['Annulment'], amount: 50 },
            { currency: currencyMap['Exalted'], amount: 1 }
        ],
        hover: () => hoverUpgrades('divTab', 'Exalted', 'Annulment'),
        buy: (onUpgrade) => handleStashTabUpgrade(stashTabUpgradeConfigs[3], onUpgrade)
    }
];

export { stashTabUpgradeConfigs };