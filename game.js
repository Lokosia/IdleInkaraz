import { generateExileCards } from './js/components/ExileUI.js';
import { ExileFactory } from './js/components/ExileFactory.js';
import { currencyData } from './js/components/currencyData.js';
import { updateCurrencyClass, setupCurrencyUI } from './js/components/CurrencyUI.js';
import { initDelvingUI } from './js/components/DelveUI.js';
import { delve, getDelveState, setDelveLoadingProgress, incrementDelveLoadingProgress } from './js/components/DelveSystem.js';
import Upgrades from './upgrades.js';
import { fossilData } from './js/components/Fossil.js';

/**
 * Initializes the game by hiding all UI sections except the welcome screen
 * Called when the page first loads
 */
function gameStart() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	$("#CrusaderUpgrade").hide();
	$("#HunterUpgrade").hide();
	$("#RedeemerUpgrade").hide();
	$("#WarlordUpgrade").hide();

	// Don't hide craft cards here - let the crafting tab logic control this
	// $(".craft").hide();

	$("#loader").hide();

}

/**
 * Initiates the game after the player creates a guild
 * Reveals all main UI sections and navigates to the guild screen
 */
function welcome() {

	$("#welcomePre").hide();
	$("#main").removeClass("hidden");
	$("#guild").removeClass("hidden");
	$("#crafting").removeClass("hidden");
	$("#delving").removeClass("hidden");
	$("#info").removeClass("hidden");
	showGuild();
}

//----------------------------------Menu
/**
 * Shows the main game screen and hides all other sections
 * Configures layout for the main currency display
 */
function showMain() {

	$("#main").show();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	$("#divBuyCurrency").hide();
	$("#divSellCurrency").hide();
	$("#divTheorycrafting").show();
	$("#divSingularity").hide();
	$("#divFlipping").hide();
	$("#MainCurrency").removeClass("mdl-cell--4-col");
	$("#MainCurrency").removeClass("mdl-cell--4-col-tablet");
	$("#MainCurrency").addClass("mdl-cell--3-col");
	$("#MainCurrency").addClass("mdl-cell--3-col-tablet");
}

/**
 * Shows the guild management screen where players recruit and manage Exiles
 * Dynamically generates exile cards in the guild grid
 */
function showGuild() {

	$("#main").hide();
	$("#guild").show();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();

	// Get the guild grid container
	const guildGrid = document.querySelector('#guild .mdl-grid');

	// Generate exile cards dynamically
	generateExileCards(guildGrid, window.exileData);
	// Ensure reroll and other dynamic UI is correct after card generation
	window.exileData.forEach(exile => exile.updateExileClass());
}

/**
 * Shows the currency flipping interface where players can trade currencies
 * Configures the layout and visibility of trading components
 */
function showFlipping() {

	$("#main").show();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	$("#divBuyCurrency").show();
	$("#divSellCurrency").show();
	$("#divTheorycrafting").hide();
	$("#divSingularity").show();
	$("#divFlipping").show();
	$("#MainCurrency").removeClass("mdl-cell--3-col");
	$("#MainCurrency").removeClass("mdl-cell--3-col-tablet");
	$("#MainCurrency").addClass("mdl-cell--4-col");
	$("#MainCurrency").addClass("mdl-cell--4-col-tablet");

}

/**
 * Shows the crafting interface where players can craft items
 * Renders the crafting UI components and applies visibility rules based on player progress
 */
function showCrafting() {
	// Hide all other sections
	$("#main").hide();
	$("#guild").hide();
	$("#delving").hide();
	$("#info").hide();

	// Show crafting section
	$("#crafting").show();

	// Avoid running the code if the welcome screen is visible
	// (this handles the test for crafting requiring guild creation)
	if ($("#welcomePre").is(":visible")) {
		return;
	}

	// Generate the header cards (Artificer and description)
	craftingSystem.renderCraftingHeader();

	// Generate the crafting cards dynamically
	craftingSystem.renderCraftingCards();

	// Get the current Artificer owned state
	const artificerOwned = typeof exileData !== 'undefined' &&
		exileData.some(e => e.name === 'Artificer' && e.owned === true);

	// Always apply visibility rules based on current state
	if (artificerOwned) {
		// When the Artificer is owned, hide all recruitment elements
		$(".ArtificerBuy, .ArtificerHide").hide();

		// Force display:block on all craft cards to ensure they're visible
		$(".craft").css("display", "block");
		$(".craft").show();

		// Double-check visibility
		console.log("After showing craft cards:", $(".craft").is(":visible"));
	} else {
		// When the Artificer is not owned, hide crafting cards
		$(".craft").hide();
	}

	// Check for Quad Stash Tab requirement
	if (window.quadStashTab !== 1) {
		$("#heavierCrafting, .advancedCrafting").hide();
	}
}

/**
 * Shows the delving interface where players can manage delve-related activities
 */
function showDelving() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").show();
	$("#info").hide();

}

/**
 * Shows the information screen with game details and help
 */
function showInfo() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").show();

}

//---Show upgrades
/**
 * Shows all upgrade tables in the upgrade interface
 * Displays general, gear, and links upgrade options
 */
function showAllUpgrades() {
	$("#UpgradeTable").show();
	$("#UpgradeGearTable").show();
	$("#UpgradeLinksTable").show();
}

/**
 * Shows only the general upgrades table
 * Hides gear and links upgrade options
 */
function showGeneralUpgrades() {
	$("#UpgradeTable").show();
	$("#UpgradeGearTable").hide();
	$("#UpgradeLinksTable").hide();
}

/**
 * Shows only the gear upgrades table
 * Hides general and links upgrade options
 */
function showGearUpgrades() {
	$("#UpgradeTable").hide();
	$("#UpgradeGearTable").show();
	$("#UpgradeLinksTable").hide();
}

/**
 * Shows only the links upgrades table
 * Hides general and gear upgrade options
 */
function showLinksUpgrades() {
	$("#UpgradeTable").hide();
	$("#UpgradeGearTable").hide();
	$("#UpgradeLinksTable").show();
}

//---Misc.

//---Snackbar
/**
 * Displays a temporary notification message to the user
 * Implements a cooldown to prevent message spam
 * 
 * @param {string} input - The message to display in the snackbar
 */
function SnackBar(input) {
	if (window.snackBarTimer <= 0) {
		'use strict';
		var snackbarContainer = document.querySelector('#snackBar');
		var data = { message: input, timeout: 1500 };
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
		window.snackBarTimer = 1500;
	}
}

/**
 * Initializes the welcome screen UI when the DOM is loaded
 * Creates the welcome card and sets up event handlers
 */
document.addEventListener('DOMContentLoaded', function () {
	setupCurrencyUI();
	const welcomeCard = UICard.create({
		id: 'welcome-card',
		title: 'Welcome, Exile',
		content: `
            <p>It's the start of a new league in Path of Exile, you decide to create a guild with the
                sole intention of sharing resources and growing as a team.</p>
            <p>Recruit Exiles, Delvers, Currency Flippers, and Crafters. Dominate the economy and
                upgrade your guild members.</p>
            <div id="create-guild-button"></div>
        `,
		size: 'full',
		extraClasses: ['cardBG', 'imgBG']
	});

	document.querySelector('#welcomePre .mdl-grid').appendChild(welcomeCard);

	// Initialize the button inside the card
	const createGuildButton = UIButton.create('Create Guild', welcome);
	document.getElementById('create-guild-button').appendChild(createGuildButton);

	/**
	 * Adds hover effects to currency text elements
	 * 
	 * @param {HTMLElement} switchElement - The switch element to attach hover events to
	 * @param {string} currencyName - The name of the currency to highlight on hover
	 */
	function addCurrencyHoverEffect(switchElement, currencyName) {
		$(switchElement).hover(
			function () {
				$(`.${currencyName}Text`).addClass('mdl-color-text--blue-grey-600');
			},
			function () {
				$(`.${currencyName}Text`).removeClass('mdl-color-text--blue-grey-600');
			}
		);
	}
	initDelvingUI(); // Initialize Delving UI
});

document.addEventListener('DOMContentLoaded', () => {
	// Navigation
	document.getElementById('nav-main')?.addEventListener('click', showMain);
	document.getElementById('nav-guild')?.addEventListener('click', showGuild);
	document.getElementById('nav-flipping')?.addEventListener('click', showFlipping);
	document.getElementById('nav-delving')?.addEventListener('click', showDelving);
	document.getElementById('nav-crafting')?.addEventListener('click', showCrafting);
	document.getElementById('nav-info')?.addEventListener('click', showInfo);

	// Recruit Singularity
	document.getElementById('recruit-singularity')?.addEventListener('click', () => recruitExile('Singularity'));

	// Main tab upgrade filters
	document.getElementById('btn-all-upgrades')?.addEventListener('click', showAllUpgrades);
	document.getElementById('btn-general-upgrades')?.addEventListener('click', showGeneralUpgrades);
	document.getElementById('btn-gear-upgrades')?.addEventListener('click', showGearUpgrades);
	document.getElementById('btn-links-upgrades')?.addEventListener('click', showLinksUpgrades);

	// Upgrade buttons
	document.getElementById('btn-crusader-upgrade')?.addEventListener('click', () => Upgrades.buyConqueror(Crusader));
	document.getElementById('btn-hunter-upgrade')?.addEventListener('click', () => Upgrades.buyConqueror(Hunter));
	document.getElementById('btn-redeemer-upgrade')?.addEventListener('click', () => Upgrades.buyConqueror(Redeemer));
	document.getElementById('btn-warlord-upgrade')?.addEventListener('click', () => Upgrades.buyConqueror(Warlord));
});

//----------------------------------Start Functions
gameStart();

window.showMain = showMain;
window.showGuild = showGuild;
window.showFlipping = showFlipping;
window.showDelving = showDelving;
window.showCrafting = showCrafting;
window.showInfo = showInfo;
window.SnackBar = SnackBar;
window.showGeneralUpgrades = showGeneralUpgrades;
window.showGearUpgrades = showGearUpgrades;
window.showLinksUpgrades = showLinksUpgrades;
window.showAllUpgrades = showAllUpgrades;

//---Main (global state)
window.totalLevel = 0;
window.dropRate = 0;
window.playTime = 0;
window.snackBarTimer = 0;

//---Define Exiles (global)
window.exileData = ExileFactory.createAllExiles();
// make exiles globally accessible
window.exileData.forEach(exile => {
	window[exile.name] = exile;
});

//---Main game loop
setInterval(function gameTick() {
	let tempLevel = 1000;
	let tempDropRate = 0; // Start efficiency at 0
	// Add Upgrades.upgradeDropRate and Upgrades.incDropRate only if they are > 0
	if (Upgrades.upgradeDropRate > 0) tempDropRate += Upgrades.upgradeDropRate;
	if (Upgrades.incDropRate > 0) tempDropRate += Upgrades.incDropRate;
	for (let i = 0; i < window.exileData.length; i++) {
		const exile = window.exileData[i];
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
	window.totalLevel = tempLevel;
	window.dropRate = tempDropRate;
	document.getElementsByClassName('TotalLevel')[0].innerHTML = "Levels: " + numeral(window.totalLevel).format('0,0');
	document.getElementsByClassName('TotalDR')[0].innerHTML = "Efficiency: x" + numeral(window.dropRate).format('0,0.0');
	window.snackBarTimer -= 100;
	window.playTime += 0.1;
	document.getElementById("timePlayed").innerHTML = numeral(window.playTime).format('00:00:00');

	// --- Currency operations (merged from currencyManager.js) ---
	for (let i = 0; i < window.exileData.length; i++) {
		if (window.exileData[i].dropRate > 0) {
			processCurrencyOperation('rollCurrency', window.exileData[i]);
		}
	}
	processCurrencyOperation('sellCurrency');
	processCurrencyOperation('buyCurrency');
	updateCurrencyClass();
}, 100);

//---Delve system integration---
setInterval(function delveTick() {
	if (window.Melvin && window.Melvin.level >= 1 && window.Sulphite) {
		// Use upgradeDropRate if available, else 0
		delve(window.Sulphite, window.Melvin, window.upgradeDropRate || 0);
	}
}, 2500);

setInterval(function delveLoadingBarAnimate() {
	const { delveLoadingProgress } = getDelveState();
	if (delveLoadingProgress >= 1) {
		incrementDelveLoadingProgress(5);
		let e = document.querySelector('#delveLoader');
		if (e && e.MaterialProgress) {
			componentHandler.upgradeElement(e);
			e.MaterialProgress.setProgress(getDelveState().delveLoadingProgress);
			if (getDelveState().delveLoadingProgress >= 100) {
				setDelveLoadingProgress(0);
				e.MaterialProgress.setProgress(0);
			}
		}
	}
}, 100);

//---Unlocking Exiles (moved from exiles.js)
function recruitExile(exileName) {
	const exile = window.exileData.find(e => e.name === exileName);
	if (!exile) {
		console.error(`Exile ${exileName} not found`);
		return;
	}
	if (window.totalLevel < exile.levelRequirement) {
		SnackBar(`Level requirement not met. Required: ${exile.levelRequirement}, Current: ${window.totalLevel}`);
		return;
	}
	if (exile.specialRequirement) {
		let [reqType, reqValue] = exile.specialRequirement;
		if (window[reqType] !== reqValue) {
			SnackBar(`Special requirement not met. Required: ${reqType} = ${reqValue}, Current: ${window[reqType] || 0}`);
			return;
		}
	}
	if (exileName === 'Singularity') {
		exile.level++;
		$(".SingularityHide").remove();
		$(".SingularityBuy").remove();
		$('.flip').removeClass('hidden');
		return;
	} else if (exileName === 'Artificer') {
		exile.level++;
		$(".ArtificerHide").hide();
		$(".ArtificerBuy").hide();
		exile.owned = true;
		$(".craft").show();
		return;
	} else if (exileName === 'Melvin') {
		exile.level += 1;
		exile.dropRate += 0.1;
		$(".MelvinBuy").hide();
		$(".MelvinHide").html('Level ' + exile.level + ' ' + exile.name);
		const firstGearUpgrade = exile.gearUpgrades[0];
		const requirementsText = firstGearUpgrade.requirements
			.map(req => `${req.amount} ${req.currency.name}`)
			.join('<br>');
		const firstLinksUpgrade = exile.linksUpgrades[0];
		const linksRequirementsText = firstLinksUpgrade.requirements
			.map(req => `${req.amount} ${req.currency.name}`)
			.join('<br>');
		$("#UpgradeGearTable").append(
			'<tr id="' + exile.name + 'GearUpgrade">' +
			'<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + exile.name + 'GearButton" onclick="' + exile.name + '.lvlGear();">' + exile.name + ' Gear' + '</button></td>' +
			'<td class="mdl-data-table__cell--non-numeric">' + firstGearUpgrade.description.replace('{name}', exile.name) + '</td>' +
			'<td class="mdl-data-table__cell--non-numeric">+' + firstGearUpgrade.benefit + ' (' + exile.name + ')</td>' +
			'<td class="mdl-data-table__cell--non-numeric">' + requirementsText + '</td>' +
			'</tr>'
		);
		$("#UpgradeLinksTable").append(
			'<tr id="' + exile.name + 'LinksUpgrade">' +
			'<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + exile.name + 'LinksButton" onclick="' + exile.name + '.lvlLinks();">' + exile.name + ' Links' + '</button></td>' +
			'<td class="mdl-data-table__cell--non-numeric">' + firstLinksUpgrade.description.replace('{name}', exile.name) + '</td>' +
			'<td class="mdl-data-table__cell--non-numeric">+' + firstLinksUpgrade.benefit + ' (' + exile.name + ')</td>' +
			'<td class="mdl-data-table__cell--non-numeric">' + linksRequirementsText + '</td>' +
			'</tr>'
		);
		document.getElementsByClassName(exile.name + 'Efficiency')[0].innerHTML = "x" + exile.dropRate.toFixed(1);
		document.getElementsByClassName(exile.name + 'Level')[0].innerHTML = exile.level;
		if (exile.level == 100) {
			document.getElementsByClassName('MelvinEXP')[0].innerHTML = "Max";
			$(".MelvinRerollButton").removeClass('hidden');
		} else {
			document.getElementsByClassName('MelvinEXP')[0].innerHTML = numeral(exile.exp).format('0,0') + "/" + numeral(exile.expToLevel).format('0,0');
		}
		const gearCurrencies = firstGearUpgrade.requirements.map(req => req.currency.name);
		const linksCurrencies = firstLinksUpgrade.requirements.map(req => req.currency.name);
		exile.setupHover("Gear", ...gearCurrencies);
		exile.setupHover("Links", ...linksCurrencies);
		return;
	}
	exile.recruitExile();
}
window.recruitExile = recruitExile;

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
		window[fossil.name] = fossil;
		window[fossil.name + 'Fossil'] = fossil;
		// Update the UI if the element exists
		const el = document.getElementsByClassName(fossil.name + 'Total')[0];
		if (el) {
			el.innerHTML = numeral(fossil.total).format('0,0', Math.floor);
		}
	});
	console.log('Test mode initialized with 99999 of each currency and fossil');
}
window.initTestMode = initTestMode;

// Automatically run test mode if URL has ?test=true parameter
if (window.location.search.includes('test=true')) {
	document.addEventListener('DOMContentLoaded', initTestMode);
}