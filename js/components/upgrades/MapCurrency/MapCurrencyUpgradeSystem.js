// MapCurrencyUpgradeSystem.js
// Centralizes all map currency upgrade logic and state for the game.
// Handles the state, logic, and UI for upgrading map currency drops.
// Used by Augments.js to manage map currency upgrades in one place.

import { currencyMap, currencyData } from '../../currency/CurrencyData.js';
import { SnackBar } from '../../../UIInitializer.js';
import { hoverUpgrades, removeHoverCurrencies } from '../../currency/HoverState.js';
import { generateUpgradeCellsHTML } from '../../ui/UpgradeUI.js';
import { mapCurrencyUpgradeLevels } from './MapCurrencyUpgradeLevels.js';
import State from '../../../State.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

// Constants for IDs to maintain consistency
const ROW_ID = 'MapCurrencyMapUpgrade';
const BUTTON_ID = 'MapCurrencyMapBtn';

/**
 * MapCurrencyUpgradeSystem centralizes all map currency upgrade logic and state for the game.
 * Handles upgrade purchases, currency consumption, and UI updates for map currency drops.
 * Used by Augments.js to manage map currency upgrades in one place.
 *
 * @namespace MapCurrencyUpgradeSystem
 * @property {number} mappingCurrencyLevel - Current upgrade level for map currency drops.
 * @property {Function} mapCurrency - Rolls for currency drops from maps, factoring in upgrades.
 * @property {Function} rollMapCurrency - Consumes required currencies and triggers mapCurrency if requirements are met.
 * @property {Function} buyMapCurrency - Handles the purchase/upgrade of map currency drop levels, updating state and UI.
 * @property {Function} showOrUpdateMapCurrencyUpgrade - Renders or updates the UI for the next available map currency upgrade.
 * @property {Function|null} getUpgradeDropRate - Accessor for global upgrade drop rate (set externally).
 * @property {Function|null} setUpgradeDropRate - Mutator for global upgrade drop rate (set externally).
 * @property {Function|null} getDivStashTab - Accessor for Div Stash Tab state (set externally).
 */
const MapCurrencyUpgradeSystem = {
    // mappingCurrencyLevel: Tracks the current upgrade level for map currency drops.
    mappingCurrencyLevel: 0,

    // mapCurrency(): Rolls for currency drops from maps, factoring in upgrades.
    mapCurrency() {
        for (let i = 0; i < currencyData.length; i++) {
            let c = currencyData[i].rollCurrencyRNG();
            if (c <= currencyData[i].rate * (500 + this.getUpgradeDropRate())) {
                currencyData[i].total += 1 + (currencyData[i].rate * (500 + this.getUpgradeDropRate()));
                if (currencyData[i].name == 'Mirror') {
                    SnackBar("Mirror of Kalandra dropped!");
                }
            }
        }
    },

    // rollMapCurrency(): Consumes required currencies and triggers mapCurrency if requirements are met.
    rollMapCurrency(getUpgradeDropRate, getDivStashTab) {
        // getUpgradeDropRate and getDivStashTab are functions to access Upgrades state
        const consumables = [
            {
                level: 0, check: () => getDivStashTab() >= 1,
                items: [{ currency: currencyMap['StackedDeck'], amount: 1 }]
            },
            {
                level: 1, check: () => this.mappingCurrencyLevel >= 1,
                items: [{ currency: currencyMap['Alchemy'], amount: 2 }, { currency: currencyMap['Scouring'], amount: 1 }]
            },
            {
                level: 2, check: () => this.mappingCurrencyLevel >= 2,
                items: [{ currency: currencyMap['Chisel'], amount: 4 }]
            },
            {
                level: 3, check: () => this.mappingCurrencyLevel >= 3,
                items: [{ currency: currencyMap['SimpleSextant'], amount: 1 }]
            },
            {
                level: 4, check: () => this.mappingCurrencyLevel >= 4,
                items: [{ currency: currencyMap['PrimeSextant'], amount: 1 }]
            },
            {
                level: 5, check: () => this.mappingCurrencyLevel >= 5,
                items: [{ currency: currencyMap['AwakenedSextant'], amount: 1 }]
            },
            {
                level: 6, check: () => this.mappingCurrencyLevel >= 6,
                items: [{ currency: currencyMap['Vaal'], amount: 1 }]
            },
            {
                level: 7, check: () => this.mappingCurrencyLevel >= 7,
                items: [{ currency: currencyMap['SilverCoin'], amount: 4 }]
            }
        ];

        for (const consumable of consumables) {
            if (consumable.check()) {
                const hasEnough = consumable.items.every(item => item.currency.total >= item.amount);
                if (hasEnough) {
                    consumable.items.forEach(item => item.currency.total -= item.amount);
                    this.mapCurrency();
                }
            }
        }
    },

    /**
     * Apply hover effects to the map currency upgrade row
     * Consistent hover function following standardized pattern
     */
    applyHover() {
        hoverUpgrades(ROW_ID, "Exalted");
    },

    // buyMapCurrency(): Handles the purchase/upgrade of map currency drop levels, updating state and UI.
    buyMapCurrency(getUpgradeDropRate, setUpgradeDropRate) {
        handleMapCurrencyUpgrade(getUpgradeDropRate, setUpgradeDropRate, this.mappingCurrencyLevel);
    },

    // showOrUpdateMapCurrencyUpgrade(): Renders or updates the UI for the next available map currency upgrade.
    showOrUpdateMapCurrencyUpgrade(getUpgradeDropRate, setUpgradeDropRate) {
        // Only show if Ascendant is at least level 68
        if (!State.exileMap['Ascendant'] || State.exileMap['Ascendant'].level < 68) {
            return;
        }
        
        const idx = this.mappingCurrencyLevel;
        if (idx >= mapCurrencyUpgradeLevels.length) {
            $('#MapCurrencyMapUpgrade').remove();
            return;
        }
        
        const level = mapCurrencyUpgradeLevels[idx];
        
        // Check if the row exists but needs initialization
        const rowExists = $(`#${ROW_ID}`).length > 0;
        const rowNeedsInit = rowExists && !document.getElementById(BUTTON_ID);
        
        // Only create the row if it doesn't exist
        if (!rowExists) {
            const rowHtml = `<tr id="${ROW_ID}"></tr>`;
            $("#UpgradeTable").append(rowHtml);
            this._renderMapCurrencyRow(level, getUpgradeDropRate, setUpgradeDropRate);
        } 
        // If row exists but button doesn't, re-initialize it
        else if (rowNeedsInit) {
            this._renderMapCurrencyRow(level, getUpgradeDropRate, setUpgradeDropRate);
        }
        // Otherwise, do nothing - avoid unnecessary updates that would disrupt hover
        // We'll only update the content when actually needed, like after a purchase
    },
    
    // Helper method to render or re-render the map currency row
    _renderMapCurrencyRow(level, getUpgradeDropRate, setUpgradeDropRate) {
        // Use generateUpgradeCellsHTML for rendering
        const requirementsText = `${numeral(level.cost).format('0,0')} Exalted`; // Format cost
        const cellsHTML = generateUpgradeCellsHTML(
            'MapCurrency',
            'Map',
            level.description,
            '+1.5',
            requirementsText,
            level.buttonText,
            BUTTON_ID
        );
        
        $(`#${ROW_ID}`).html(cellsHTML);
        
        // Attach the click handler
        const boundHandler = this.buyMapCurrency.bind(this, getUpgradeDropRate, setUpgradeDropRate);
        const btn = document.getElementById(BUTTON_ID);
        if (btn) {
            // Remove any previous click handlers to avoid duplicates
            $(btn).off('click').on('click', boundHandler);
        }
        
        // Apply hover effect using the standardized approach
        this.applyHover();
    },

    // getUpgradeDropRate, setUpgradeDropRate, getDivStashTab: Accessors set by Augments.js to interact with shared state.
    getUpgradeDropRate: null, // to be set by Augments.js
    setUpgradeDropRate: null, // to be set by Augments.js
    getDivStashTab: null // to be set by Augments.js
};

export default MapCurrencyUpgradeSystem;

/**
 * Generic handler for Map Currency upgrade purchase.
 */
function handleMapCurrencyUpgrade(getUpgradeDropRate, setUpgradeDropRate, mappingCurrencyLevel) {
    const currentLevelIndex = mappingCurrencyLevel;
    const currentLevelData = mapCurrencyUpgradeLevels[currentLevelIndex];
    if (!currentLevelData) {
        console.warn("Attempted to buy map currency upgrade beyond max level.");
        return;
    }
    const row = document.getElementById(ROW_ID);
    if (!row) {
        console.error(`Upgrade row with ID ${ROW_ID} not found.`);
        return;
    }
    const requirements = [
        { currency: currencyMap['Exalted'], amount: currentLevelData.cost },
        ...currentLevelData.consume.map(req => ({ currency: currencyMap[req.currency], amount: req.amount }))
    ];
    
    handlePurchase({
        requirements,
        onSuccess: () => {
            MapCurrencyUpgradeSystem.mappingCurrencyLevel++;
            setUpgradeDropRate(getUpgradeDropRate() + 1.5);
        },
        uiUpdateConfig: {
            rowElement: row,
            costElement: row.querySelector('.upgrade-cost'),
            benefitElement: row.querySelector('.upgrade-benefit'),
            getNextLevelData: () => {
                const nextLevelIndex = currentLevelIndex + 1;
                if (nextLevelIndex >= mapCurrencyUpgradeLevels.length) {
                    return null;
                }
                const nextLevelData = mapCurrencyUpgradeLevels[nextLevelIndex];
                return {
                    cost: `${window.numeral(nextLevelData.cost).format('0,0')} Exalted`,
                    benefit: '+1.5'
                };
            },
            removeRowOnMaxLevel: true,
            hoverClassesToRemoveOnMaxLevel: ['Exalted']
        },
        updateUI: () => {
            const globalRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
            if (globalRateElem) {
                globalRateElem.innerHTML = getUpgradeDropRate().toFixed(1);
            }
            
            // After a successful purchase, check if we've reached max level
            const nextLevelIndex = MapCurrencyUpgradeSystem.mappingCurrencyLevel;
            if (nextLevelIndex < mapCurrencyUpgradeLevels.length) {
                const nextLevelData = mapCurrencyUpgradeLevels[nextLevelIndex];
                
                // Use the helper method to completely refresh the row
                MapCurrencyUpgradeSystem._renderMapCurrencyRow(
                    nextLevelData,
                    getUpgradeDropRate,
                    setUpgradeDropRate
                );
            }
            // No else needed - the hoverClassesToRemoveOnMaxLevel will handle cleanup
        },
        successMessage: "Map strategy upgraded!"
    });
}
