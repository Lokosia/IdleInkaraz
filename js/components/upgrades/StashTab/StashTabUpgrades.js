// StashTabUpgrades.js
// Handles logic and configs for stash tab upgrades
import { currencyMap } from '../../currency/CurrencyData.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { SnackBar, hoverUpgrades } from '../../../UIInitializer.js';
import { formatEfficiency } from '../Augments.js';

/**
 * State object for stash tab upgrades, including tab ownership and UI flags.
 *
 * @typedef {Object} StashTabState
 * @property {number} currencyStashTab - 1 if owned, 0 otherwise.
 * @property {number} delveStashTab - 1 if owned, 0 otherwise.
 * @property {number} quadStashTab - 1 if owned, 0 otherwise.
 * @property {number} divStashTab - 1 if owned, 0 otherwise.
 * @property {boolean} currencyTabShown - UI flag for currency tab.
 * @property {boolean} delveTabShown - UI flag for delve tab.
 * @property {boolean} quadTabShown - UI flag for quad tab.
 * @property {boolean} divTabShown - UI flag for div tab.
 */
const StashTabState = {
    currencyStashTab: 0,
    delveStashTab: 0,
    quadStashTab: 0,
    divStashTab: 0,
    // UI flags
    currencyTabShown: false,
    delveTabShown: false,
    quadTabShown: false,
    divTabShown: false,
};

/**
 * Methods for each tab
 */
function buyCurrencyTab(onUpgrade) {
    handlePurchase({
        requirements: [{ currency: currencyMap['StackedDeck'], amount: 5 }],
        onSuccess: () => {
            StashTabState.currencyStashTab = 1;
            if (onUpgrade) onUpgrade();
        },
        updateUI: () => {
            $(".StackedDeck").removeClass('hover');
            $("#currencyTab").remove();
        },
        successMessage: 'Stash tab purchased!'
    });
}
function buyDelveTab(onUpgrade) {
    handlePurchase({
        requirements: [
            { currency: currencyMap['StackedDeck'], amount: 50 },
            { currency: currencyMap['Annulment'], amount: 10 }
        ],
        onSuccess: () => {
            StashTabState.delveStashTab = 1;
            if (onUpgrade) onUpgrade();
        },
        updateUI: () => {
            $(".StackedDeck").removeClass('hover');
            $(".Annulment").removeClass('hover');
            $("#delveTab").remove();
        },
        successMessage: 'Stash tab purchased!'
    });
}
function buyQuadTab(onUpgrade) {
    handlePurchase({
        requirements: [{ currency: currencyMap['Eternal'], amount: 1 }],
        onSuccess: () => {
            StashTabState.quadStashTab = 1;
            if (onUpgrade) onUpgrade();
        },
        updateUI: () => {
            $(".Eternal").removeClass('hover');
            $("#quadTab").remove();
        },
        successMessage: 'Stash tab purchased!'
    });
}
function buyDivTab(onUpgrade) {
    handlePurchase({
        requirements: [
            { currency: currencyMap['Annulment'], amount: 50 },
            { currency: currencyMap['Exalted'], amount: 1 }
        ],
        onSuccess: () => {
            StashTabState.divStashTab = 1;
            if (onUpgrade) onUpgrade();
        },
        updateUI: () => {
            $(".Annulment").removeClass('hover');
            $(".Exalted").removeClass('hover');
            $("#divTab").remove();
        },
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
        key: 'currencyTab',
        shownFlag: 'currencyTabShown',
        unlock: (totalLevel) => totalLevel >= 250 && StashTabState.currencyStashTab === 0,
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
        buy: (onUpgrade) => buyCurrencyTab(onUpgrade)
    },
    {
        key: 'delveTab',
        shownFlag: 'delveTabShown',
        unlock: (totalLevel) => totalLevel >= 500 && StashTabState.delveStashTab === 0,
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
        buy: (onUpgrade) => buyDelveTab(onUpgrade)
    },
    {
        key: 'quadTab',
        shownFlag: 'quadTabShown',
        unlock: (totalLevel) => totalLevel >= 1000 && StashTabState.quadStashTab === 0,
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
        buy: (onUpgrade) => buyQuadTab(onUpgrade)
    },
    {
        key: 'divTab',
        shownFlag: 'divTabShown',
        unlock: (totalLevel) => totalLevel >= 750 && StashTabState.divStashTab === 0,
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
        buy: (onUpgrade) => buyDivTab(onUpgrade)
    }
];

/**
 * Synchronizes StashTabState with the main Upgrades object for compatibility.
 *
 * @param {Object} Upgrades - The main Upgrades state object.
 * @returns {void}
 */
function syncStashTabStateToUpgrades(Upgrades) {
    Upgrades.currencyStashTab = StashTabState.currencyStashTab;
    Upgrades.delveStashTab = StashTabState.delveStashTab;
    Upgrades.quadStashTab = StashTabState.quadStashTab;
    Upgrades.divStashTab = StashTabState.divStashTab;
    Upgrades.currencyTabShown = StashTabState.currencyTabShown;
    Upgrades.delveTabShown = StashTabState.delveTabShown;
    Upgrades.quadTabShown = StashTabState.quadTabShown;
    Upgrades.divTabShown = StashTabState.divTabShown;
}

export { StashTabState, buyCurrencyTab, buyDelveTab, buyQuadTab, buyDivTab, stashTabUpgradeConfigs, syncStashTabStateToUpgrades };