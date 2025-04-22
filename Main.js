import { ExileFactory } from './js/components/exile/ExileFactory.js';
import { currencyData, currencyMap } from './js/components/currency/CurrencyData.js';
import { updateCurrencyClass, setupCurrencyUI, showDefaultCurrencyView, showFlippingView } from './js/components/currency/CurrencyUI.js';
import { initDelvingUI, showDelving } from './js/components/delve/DelveUI.js';
import { delve, getDelveState, setDelveLoadingProgress } from './js/components/delve/DelveSystem.js';
import Upgrades from './js/components/Augments.js';
import { fossilData } from './js/components/delve/Fossil.js';
import { createWelcomeCard } from './js/components/ui/Cards.js';
import { showCrafting } from './js/components/crafting/CraftingUI.js';
import UIManager from './js/components/ui/UIManager.js';
import { showGuild } from './js/components/exile/ExileUI.js';
import { showAllUpgrades, showGeneralUpgrades, showGearUpgrades, showLinksUpgrades } from './js/components/ui/UpgradeUI.js';

/**
 * Initiates the game after the player creates a guild
 * Reveals all main UI sections and navigates to the guild screen
 */
function welcome() {
	$("#welcomePre").hide();
	// Show the guild section using UIManager
	UIManager.show('guild');
	showGuild(exileData, recruitExile);
}

//---Snackbar
/**
 * Displays a temporary notification message to the user
 * Implements a cooldown to prevent message spam
 * 
 * @param {string} input - The message to display in the snackbar
 */
export function SnackBar(input) {
	if (snackBarTimer <= 0) {
		'use strict';
		var snackbarContainer = document.querySelector('#snackBar');
		var data = { message: input, timeout: 1500 };
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
		snackBarTimer = 1500;
	}
}

function addClickListener(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
}

document.addEventListener('DOMContentLoaded', function () {
	setupCurrencyUI(); // Initialize currency UI

	// Initialize the welcome card and add it to the UI
	const welcomeCard = createWelcomeCard(welcome);
	document.querySelector('#welcomePre .mdl-grid').appendChild(welcomeCard);

	initDelvingUI(); // Initialize Delving UI

	// Navigation
    addClickListener('nav-main', () => {
        UIManager.show('main');
        showDefaultCurrencyView();
    });
    addClickListener('nav-guild', () => {
        UIManager.show('guild');
        showGuild(exileData, recruitExile);
    });
    addClickListener('nav-flipping', () => {
        UIManager.show('main');
        showFlippingView();
    });
    addClickListener('nav-delving', () => {
        UIManager.show('delving');
        showDelving();
    });
    addClickListener('nav-crafting', () => {
        UIManager.show('crafting');
        showCrafting(exileData, Upgrades);
    });
    addClickListener('nav-info', () => {
        UIManager.show('info');
    });

    // Recruit Singularity
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
});

//---Main (global state)
let totalLevel = 0;
let dropRate = 0;
let playTime = 0;
let snackBarTimer = 0;

//---Define Exiles (module scope, not global)
const exileData = ExileFactory.createAllExiles();
const exileMap = Object.fromEntries(exileData.map(e => [e.name, e]));

//---Main game loop
setInterval(function gameTick() {
	let tempLevel = 1000;
	let tempDropRate = 0; // Start efficiency at 0
	if (Upgrades.upgradeDropRate > 0) tempDropRate += Upgrades.upgradeDropRate;
	if (Upgrades.incDropRate > 0) tempDropRate += Upgrades.incDropRate;
	for (let i = 0; i < exileData.length; i++) {
		const exile = exileData[i];
		if (exile.level >= 1) {
			if (exile.name === 'Singularity' || exile.name === 'Artificer') {
				// Don't add to tempDropRate for special exiles
			} else {
				exile.updateExileClass();
				tempDropRate += exile.dropRate;
				tempLevel += exile.level;
				tempLevel += exile.rerollLevel;
			}
		}
	}
	totalLevel = tempLevel;
	dropRate = tempDropRate;
	document.getElementsByClassName('TotalLevel')[0].innerHTML = "Levels: " + numeral(totalLevel).format('0,0');
	document.getElementsByClassName('TotalDR')[0].innerHTML = "Efficiency: x" + numeral(dropRate).format('0,0.0');
	snackBarTimer -= 100;
	playTime += 0.1;
	document.getElementById("timePlayed").innerHTML = numeral(playTime).format('00:00:00');

	// --- Currency operations (merged from currencyManager.js) ---
	for (let i = 0; i < exileData.length; i++) {
		if (exileData[i].dropRate > 0) {
			processCurrencyOperation('rollCurrency', exileData[i]);
		}
	}
	processCurrencyOperation('sellCurrency');
	processCurrencyOperation('buyCurrency');
	updateCurrencyClass();
}, 100);

//---Delve system integration---
setInterval(function delveTick() {
	if (exileMap['Melvin'] && exileMap['Melvin'].level >= 1 && currencyMap['Sulphite']) {
		delve(currencyMap['Sulphite'], exileMap['Melvin'], Upgrades.upgradeDropRate || 0);
	}
}, 2500);

setInterval(function delveLoadingBarAnimate() {
    const { delveLoadingProgress, isDelving } = getDelveState(); // Check if delving is active
    const delveLoader = document.querySelector('#delveLoader');

    if (!isDelving) {
        // Reset progress bar if delving is not active
        if (delveLoader && delveLoader.MaterialProgress) {
            delveLoader.MaterialProgress.setProgress(0);
        }
        return;
    }

    if (delveLoader) {
        delveLoader.classList.remove('hidden'); // Ensure the progress bar is visible
        delveLoader.style.display = 'block'; // Explicitly set display to block

        if (typeof componentHandler !== 'undefined') {
            try {
                componentHandler.upgradeElement(delveLoader);
            } catch (e) {
                console.error('Error upgrading MDL component:', e);
            }
        }

        if (delveLoader.MaterialProgress) {
            const increment = 100 / (2500 / 100); // Calculate increment for 2.5 seconds
            const newProgress = Math.min(delveLoadingProgress + increment, 100);
            setDelveLoadingProgress(newProgress);
            delveLoader.MaterialProgress.setProgress(newProgress);

            if (newProgress >= 100) {
                setDelveLoadingProgress(0);
                delveLoader.MaterialProgress.setProgress(0);
            }
        } else {
            console.warn('MaterialProgress is not initialized on delveLoader.');
        }
    } else {
        console.error('delveLoader element not found.');
    }
}, 100);

//---Unlocking Exiles (moved from exiles.js)
function recruitExile(exileName) {
	const exile = exileMap[exileName];
	if (!exile) {
		console.error(`Exile ${exileName} not found`);
		return;
	}
	// Check level requirement
	if (totalLevel < exile.levelRequirement) {
		// Corrected template literal syntax
		SnackBar(`Level requirement not met. Required: ${exile.levelRequirement}, Current: ${totalLevel}`);
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

function processCurrencyOperation(operation, param) {
	for (let i = 0; i < currencyData.length; i++) {
		if (param !== undefined) {
			currencyData[i][operation](param);
		} else {
			currencyData[i][operation]();
		}
	}
}

function initTestMode() {
	// Set 99999 of every currency
	currencyData.forEach(currency => {
		currency.total = 99999;
	});

	// Set 99999 of every fossil
	fossilData.forEach(fossil => {
		fossil.total = 99999;
		// Update the UI if the element exists
		const el = document.getElementsByClassName(fossil.name + 'Total')[0];
		if (el) {
			el.innerHTML = numeral(fossil.total).format('0,0', Math.floor);
		}
	});
	console.log('Test mode initialized with 99999 of each currency and fossil');
}

// Automatically run test mode if URL has ?test=true parameter
if (window.location.search.includes('test=true')) {
	document.addEventListener('DOMContentLoaded', initTestMode);
}

export { exileMap, exileData, totalLevel, recruitExile };