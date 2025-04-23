// MapCurrencyUpgradeSystem.js
// Centralizes all map currency upgrade logic and state for the game.
// Handles the state, logic, and UI for upgrading map currency drops.
// Used by Augments.js to manage map currency upgrades in one place.

import { currencyMap, currencyData } from '../../currency/CurrencyData.js';
import { SnackBar, hoverUpgrades } from '../../../../Main.js'; // Import hoverUpgrades
import { generateUpgradeCellsHTML } from '../../ui/UpgradeUI.js';
import { handleGenericUpgrade } from '../../exile/ExileUtils.js';
import { mapCurrencyUpgradeLevels } from './MapCurrencyUpgradeLevels.js';
import { exileMap } from '../../../../Main.js';

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
        const idx = this.mappingCurrencyLevel;
        const level = mapCurrencyUpgradeLevels[idx];
        if (!level) return;

        const requirements = [
            { currency: currencyMap['Exalted'], amount: level.cost },
            ...level.consume // Add consumable requirements
        ];

        handleGenericUpgrade({
            requirements,
            onSuccess: () => {
                this.mappingCurrencyLevel++;
                setUpgradeDropRate(getUpgradeDropRate() + 1.5);
            },
            updateUI: () => {
                document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = getUpgradeDropRate().toFixed(1);
                if (this.mappingCurrencyLevel < mapCurrencyUpgradeLevels.length) {
                    this.showOrUpdateMapCurrencyUpgrade(getUpgradeDropRate, setUpgradeDropRate);
                } else {
                    $(".Exalted").removeClass("hover");
                    // Remove hover from consumables as well
                    level.consume.forEach(req => $(`.${req.currency.name}`).removeClass("hover"));
                    $('#MapCurrencyMapUpgrade').remove();
                }
            },
            successMessage: "Map strategy upgraded!"
        });
    },

    // showOrUpdateMapCurrencyUpgrade(): Renders or updates the UI for the next available map currency upgrade.
    showOrUpdateMapCurrencyUpgrade(getUpgradeDropRate, setUpgradeDropRate) {
        // Only show if Ascendant is at least level 68
        if (!exileMap['Ascendant'] || exileMap['Ascendant'].level < 68) {
            return;
        }
        const idx = this.mappingCurrencyLevel;
        if (idx >= mapCurrencyUpgradeLevels.length) {
            $('#MapCurrencyMapUpgrade').remove();
            return;
        }
        const level = mapCurrencyUpgradeLevels[idx];
        const rowId = 'MapCurrencyMapUpgrade';
        if (!$(`#${rowId}`).length) {
            $("#UpgradeTable").append(`<tr id="${rowId}"></tr>`);
        }
        const requirements = `${level.cost} Exalted`;

        // Use generateUpgradeCellsHTML for rendering, passing buttonText
        const cellsHTML = generateUpgradeCellsHTML(
            'MapCurrency',
            'Map',
            level.description,
            '+1.5',
            requirements,
            level.buttonText,
            'MapCurrencyMapBtn' // Provide the button ID
        );
        // Set the innerHTML of the row
        $(`#${rowId}`).html(cellsHTML);

        // Attach the listener separately
        const boundHandler = this.buyMapCurrency.bind(this, getUpgradeDropRate, setUpgradeDropRate);
        const btn = document.getElementById('MapCurrencyMapBtn');
        if (btn) {
            btn.onclick = boundHandler;
        }

        // Hover effect - Use imported hoverUpgrades
        hoverUpgrades(rowId, "Exalted");
    },

    // getUpgradeDropRate, setUpgradeDropRate, getDivStashTab: Accessors set by Augments.js to interact with shared state.
    getUpgradeDropRate: null, // to be set by Augments.js
    setUpgradeDropRate: null, // to be set by Augments.js
    getDivStashTab: null // to be set by Augments.js
};

export default MapCurrencyUpgradeSystem;
