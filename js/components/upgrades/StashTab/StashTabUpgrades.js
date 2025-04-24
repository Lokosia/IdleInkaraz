// StashTabUpgrades.js
// Handles logic and configs for stash tab upgrades
import { currencyMap } from '../../currency/CurrencyData.js';
import { handleGenericUpgrade } from '../../exile/ExileUtils.js';
import { hoverUpgrades, SnackBar } from '../../../../Main.js';
import { formatEfficiency } from '../Augments.js';

// State for stash tab upgrades
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

// Generic handler for stash tab upgrades
// Accepts an optional onUpgrade callback to increment efficiency
function handleStashTabUpgrade(tabType, currency1, amount1, currency2, amount2, extraAction, onUpgrade) {
    const requirements = [{ currency: currency1, amount: amount1 }];
    if (currency2) {
        requirements.push({ currency: currency2, amount: amount2 });
    }
    handleGenericUpgrade({
        requirements,
        onSuccess: () => {
            StashTabState[`${tabType}StashTab`] = 1;
            if (onUpgrade) onUpgrade();
            if (extraAction) extraAction();
        },
        updateUI: () => {
            $(`.${currency1.name}`).removeClass('hover');
            if (currency2) $(`.${currency2.name}`).removeClass('hover');
            $(`#${tabType}Tab`).remove();
        },
        successMessage: 'Stash tab purchased!'
    });
}

// Methods for each tab
// Update tab methods to accept onUpgrade
function buyCurrencyTab(onUpgrade) {
    handleStashTabUpgrade('currency', currencyMap['StackedDeck'], 5, undefined, undefined, undefined, onUpgrade);
}
function buyDelveTab(onUpgrade) {
    handleStashTabUpgrade('delve', currencyMap['StackedDeck'], 50, currencyMap['Annulment'], 10, undefined, onUpgrade);
}
function buyQuadTab(onUpgrade) {
    handleStashTabUpgrade('quad', currencyMap['Eternal'], 1, undefined, undefined, undefined, onUpgrade);
}
function buyDivTab(onUpgrade) {
    handleStashTabUpgrade('div', currencyMap['Annulment'], 50, currencyMap['Exalted'], 1, undefined, onUpgrade);
}

// Upgrade configs for each tab
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

// Synchronize StashTabState with Upgrades for compatibility
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

export { StashTabState, handleStashTabUpgrade, buyCurrencyTab, buyDelveTab, buyQuadTab, buyDivTab, stashTabUpgradeConfigs, syncStashTabStateToUpgrades };