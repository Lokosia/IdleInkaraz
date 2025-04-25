import State from './js/State.js';
import { ExileFactory } from './js/components/exile/ExileFactory.js';
import { currencyData, currencyMap } from './js/components/currency/CurrencyData.js';
import { updateCurrencyClass, setupCurrencyUI, showDefaultCurrencyView, showFlippingView } from './js/components/currency/CurrencyUI.js';
import { initDelvingUI, showDelving } from './js/components/delve/DelveUI.js';
import { delve, getDelveState, setDelveLoadingProgress } from './js/components/delve/DelveSystem.js';
import Upgrades, { upgradeConfigs, renderUpgradeRow } from './js/components/upgrades/Augments.js';
import MapCurrencyUpgradeSystem from './js/components/upgrades/MapCurrency/MapCurrencyUpgradeSystem.js';
import { renderConquerorUpgrades } from './js/components/upgrades/Conquerors/ConquerorUpgrades.js';
import { syncStashTabStateToUpgrades } from './js/components/upgrades/StashTab/StashTabUpgrades.js';
import { fossilData } from './js/components/delve/Fossil.js';
import { createWelcomeCard } from './js/components/ui/Cards.js';
import { showCrafting } from './js/components/crafting/CraftingUI.js';
import UIManager from './js/components/ui/UIManager.js';
import { showGuild } from './js/components/exile/ExileUI.js';
import { showAllUpgrades, showGeneralUpgrades, showGearUpgrades, showLinksUpgrades } from './js/components/ui/UpgradeUI.js';
import { initializeLayout } from './js/components/layout/layoutInitializer.js';
import { initTestMode } from './js/DebugMode.js';
import { startGameLoops } from './js/GameLoop.js';
import { SnackBar, hoverUpgrades } from './js/UIInitializer.js';
//import { addClickListener, processCurrencyOperation } from './js/Utils.js';

// Initialize exileData and exileMap after all imports
State.exileData = ExileFactory.createAllExiles();
State.exileMap = Object.fromEntries(State.exileData.map(e => [e.name, e]));

document.addEventListener('DOMContentLoaded', function () {
    initializeLayout();

	setupCurrencyUI(); // Initialize currency UI

	// Initialize the welcome card and add it to the UI
	createWelcomeCard(document.querySelector('#welcomePre .mdl-grid'));

	initDelvingUI(); // Initialize Delving UI

	// Navigation
    [
        ['nav-main', () => {
            UIManager.show('main');
            showDefaultCurrencyView();
        }],
        ['nav-guild', () => {
            UIManager.show('guild');
            showGuild(State.exileData, recruitExile);
        }],
        ['nav-flipping', () => {
            UIManager.show('main');
            showFlippingView();
        }],
        ['nav-delving', () => {
            UIManager.show('delving');
            showDelving();
        }],
        ['nav-crafting', () => {
            UIManager.show('crafting');
            showCrafting(State.exileData, Upgrades);
        }],
        ['nav-info', () => {
            UIManager.show('info');
        }],
        ['recruit-singularity', () => recruitExile('Singularity')],
        ['btn-all-upgrades', showAllUpgrades],
        ['btn-general-upgrades', showGeneralUpgrades],
        ['btn-gear-upgrades', showGearUpgrades],
        ['btn-links-upgrades', showLinksUpgrades],
        ['btn-crusader-upgrade', () => Upgrades.buyConqueror(currencyMap['Crusader'])],
        ['btn-hunter-upgrade', () => Upgrades.buyConqueror(currencyMap['Hunter'])],
        ['btn-redeemer-upgrade', () => Upgrades.buyConqueror(currencyMap['Redeemer'])],
        ['btn-warlord-upgrade', () => Upgrades.buyConqueror(currencyMap['Warlord'])],
    ].forEach(([id, handler]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', handler);
    });

    // Recruit Singularity
	/*
    addClickListener('recruit-singularity', () => recruitExile('Singularity'));

    // Main tab upgrade filters
    addClickListener('btn-all-upgrades', showAllUpgrades);
    addClickListener('btn-general-upgrades', showGeneralUpgrades);
    addClickListener('btn-gear-upgrades', showGearUpgrades);
    addClickListener('btn-links-upgrades', showLinksUpgrades);

    // Upgrade buttons - Pass currencyMap entries instead of exileMap entries
    addClickListener('btn-crusader-upgrade', () => Upgrades.buyConqueror(currencyMap['Crusader']));
    addClickListener('btn-hunter-upgrade', () => Upgrades.buyConqueror(currencyMap['Hunter']));
    addClickListener('btn-redeemer-upgrade', () => Upgrades.buyConqueror(currencyMap['Redeemer']));
    addClickListener('btn-warlord-upgrade', () => Upgrades.buyConqueror(currencyMap['Warlord']));
	*/
});

//---Main game loop
startGameLoops();

/**
 * Attempts to recruit an exile by name, checking level and special requirements.
 * Updates state and UI, and shows feedback via SnackBar.
 *
 * @param {string} exileName - The name of the exile to recruit.
 * @returns {void}
 */
function recruitExile(exileName) {
	const exile = State.exileMap[exileName];
	if (!exile) {
		console.error(`Exile ${exileName} not found`);
		return;
	}
	// Check level requirement
	if (State.totalLevel < exile.levelRequirement) {
		// Corrected template literal syntax
		SnackBar(`Level requirement not met. Required: ${exile.levelRequirement}, Current: ${State.totalLevel}`);
		return;
	}
	// Check special requirement (e.g., stash tabs for Melvin)
	if (exile.specialRequirement) {
		let [reqType, reqValue] = exile.specialRequirement;
		if ((Upgrades[reqType] ?? 0) < reqValue) { // Use < for cases like needing at least 1 tab
			// Corrected template literal syntax
			SnackBar(`Special requirement not met. Required: ${reqType} >= ${reqValue}, Current: ${Upgrades[reqType] ?? 0}`);
			return;
		}
	}

	// Handle specific recruitment logic
	if (exileName === 'Singularity') {
		exile.level = 1; // Set level explicitly
		exile.owned = true; // Mark as owned
		$(".SingularityHide").remove();
		$(".SingularityBuy").remove();
		$('.flip').removeClass('hidden');
		SnackBar("Singularity recruited!");
		// No need to call onRecruited as Singularity doesn't have standard upgrades
		return;
	} else if (exileName === 'Artificer') {
		exile.level = 1; // Set level explicitly
		exile.owned = true; // Mark as owned
		$(".ArtificerHide").hide();
		$(".ArtificerBuy").hide();
		$(".craft").show(); // Show crafting cards
		SnackBar("Artificer recruited!");
		// No need to call onRecruited as Artificer doesn't have standard upgrades
		return;
	} else if (exileName === 'Melvin') {
		// Melvin has standard upgrades, so use onRecruited
		exile.owned = true; // Mark as owned before calling onRecruited
		exile.onRecruited(); // This now handles level increase, UI updates, and initial upgrade setup
		$(".MelvinBuy").hide(); // Hide the recruitment button
		SnackBar("Melvin recruited!");
		// The specific UI updates previously here are now handled within onRecruited
		return;
	}

	// For all other standard exiles
	if (!exile.owned) { // Prevent re-recruiting
		exile.owned = true; // Mark as owned before calling onRecruited
		exile.onRecruited();
		// Corrected template literal syntax
		SnackBar(`${exileName} recruited!`);
	} else {
		// Corrected template literal syntax
		SnackBar(`${exileName} is already recruited.`);
	}
}

export { recruitExile };