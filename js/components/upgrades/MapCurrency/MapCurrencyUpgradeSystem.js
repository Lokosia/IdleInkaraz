// MapCurrencyUpgradeSystem.js
// Centralizes all map currency upgrade logic and state for the game.
// Handles the state, logic, and UI for upgrading map currency drops.
// Used by Augments.js to manage map currency upgrades in one place.

import { currencyMap, currencyData } from '../../currency/CurrencyData.js';
import { SnackBar, hoverUpgrades } from '../../../UIInitializer.js';
import { generateUpgradeCellsHTML } from '../../ui/UpgradeUI.js';
import { mapCurrencyUpgradeLevels } from './MapCurrencyUpgradeLevels.js';
import State from '../../../State.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

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

    // buyMapCurrency(): Handles the purchase/upgrade of map currency drop levels, updating state and UI.
    buyMapCurrency(getUpgradeDropRate, setUpgradeDropRate) {
        const currentLevelIndex = this.mappingCurrencyLevel;
        const currentLevelData = mapCurrencyUpgradeLevels[currentLevelIndex];

        if (!currentLevelData) {
            console.warn("Attempted to buy map currency upgrade beyond max level.");
            return; // Already maxed or invalid level
        }

        const rowId = 'MapCurrencyMapUpgrade';
        const row = document.getElementById(rowId);
        if (!row) {
            console.error(`Upgrade row with ID ${rowId} not found.`);
            return;
        }

        const requirements = [
            { currency: currencyMap['Exalted'], amount: currentLevelData.cost },
            ...currentLevelData.consume.map(req => ({ currency: currencyMap[req.currency], amount: req.amount }))
        ];

        // Selectors for hover removal (based on current level requirements)
        const hoverSelectorsToRemove = [
            '.Exalted',
            ...currentLevelData.consume.map(req => `.${req.currency}`)
        ];

        handlePurchase({
            requirements,
            onSuccess: () => {
                this.mappingCurrencyLevel++; // Increment level state
                setUpgradeDropRate(getUpgradeDropRate() + 1.5); // Update global drop rate state
            },
            uiUpdateConfig: {
                rowElement: row,
                costElement: row.querySelector('.upgrade-cost'),
                benefitElement: row.querySelector('.upgrade-benefit'), // Assuming a standard class
                getNextLevelData: () => {
                    const nextLevelIndex = currentLevelIndex + 1;
                    if (nextLevelIndex >= mapCurrencyUpgradeLevels.length) {
                        return null; // Signal max level
                    }
                    const nextLevelData = mapCurrencyUpgradeLevels[nextLevelIndex];
                    return {
                        cost: nextLevelData.cost,
                        benefit: '+1.5' // Benefit seems fixed
                        // Description and button text are handled in updateUI
                    };
                },
                removeRowOnMaxLevel: true,
                removeHoverSelectors: hoverSelectorsToRemove
            },
            updateUI: () => {
                // 1. Update global drop rate display (always needed)
                const globalRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
                if (globalRateElem) {
                    globalRateElem.innerHTML = getUpgradeDropRate().toFixed(1);
                }

                // 2. Update description and button text if *not* max level
                const nextLevelIndex = this.mappingCurrencyLevel; // Get the *new* level
                if (nextLevelIndex < mapCurrencyUpgradeLevels.length) {
                    const nextLevelData = mapCurrencyUpgradeLevels[nextLevelIndex];
                    const row = document.getElementById(rowId); // Get row again
                    if (row) {
                        // Update description (assuming it's the second cell)
                        const descCell = row.children[1];
                        if (descCell) descCell.innerHTML = nextLevelData.description;
                        // Update button text
                        const btn = row.querySelector('button');
                        if (btn) btn.textContent = nextLevelData.buttonText;

                        // Re-apply hover listeners for the new requirements
                        hoverUpgrades(rowId, 'Exalted');
                        // Manually add the hover class back immediately
                        document.querySelectorAll('.Exalted').forEach(el => el.classList.add('hover'));
                    }
                }
                // Row removal, cost/benefit update, and hover removal are handled by uiUpdateConfig
            },
            successMessage: "Map strategy upgraded!"
        });
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
        const rowId = 'MapCurrencyMapUpgrade';
        const buttonId = 'MapCurrencyMapBtn';
        // Only create the row if it doesn't exist
        if (!$(`#${rowId}`).length) {
            const rowHtml = `<tr id="${rowId}"></tr>`;
            $("#UpgradeTable").append(rowHtml);
            // Use generateUpgradeCellsHTML for initial rendering
            const requirementsText = `${numeral(level.cost).format('0,0')} Exalted`; // Format cost
            const cellsHTML = generateUpgradeCellsHTML(
                'MapCurrency',
                'Map',
                level.description,
                '+1.5',
                requirementsText,
                level.buttonText,
                buttonId
            );
            $(`#${rowId}`).html(cellsHTML);
            // Attach the click handler ONCE
            const boundHandler = this.buyMapCurrency.bind(this, getUpgradeDropRate, setUpgradeDropRate);
            const btn = document.getElementById(buttonId);
            if (btn) {
                btn.onclick = boundHandler;
            }
            hoverUpgrades(rowId, "Exalted");
        } else {
            // Only update the relevant cells (description, benefit, cost, button text)
            const row = document.getElementById(rowId);
            if (row) {
                // Update description (second cell)
                const descCell = row.children[1];
                if (descCell) descCell.innerHTML = level.description;
                // Update benefit
                const benefitCell = row.querySelector('.upgrade-benefit');
                if (benefitCell) benefitCell.innerHTML = '+1.5';
                // Update cost
                const costCell = row.querySelector('.upgrade-cost');
                const formattedCost = `${numeral(level.cost).format('0,0')} Exalted`;
                if (costCell) costCell.innerHTML = formattedCost;
                // Update button text
                const btn = row.querySelector('button');
                if (btn) btn.textContent = level.buttonText;
            }
        }
    },

    // getUpgradeDropRate, setUpgradeDropRate, getDivStashTab: Accessors set by Augments.js to interact with shared state.
    getUpgradeDropRate: null, // to be set by Augments.js
    setUpgradeDropRate: null, // to be set by Augments.js
    getDivStashTab: null // to be set by Augments.js
};

export default MapCurrencyUpgradeSystem;
