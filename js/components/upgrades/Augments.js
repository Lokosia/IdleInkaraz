import State from '../../State.js';
import { SnackBar } from '../../UIInitializer.js';
import { hoverUpgrades } from '../currency/HoverState.js';
import { currencyMap, currencyData } from '../currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from '../ui/UpgradeUI.js';
import MapCurrencyUpgradeSystem from './MapCurrency/MapCurrencyUpgradeSystem.js';
import { renderConquerorUpgrades } from './Conquerors/ConquerorUpgrades.js';
import { stashTabUpgradeConfigs, syncStashTabStateToUpgrades } from './StashTab/StashTabUpgrades.js';
import { IIQUpgradeConfig, IIQState } from './IIQ/IIQUpgrade.js';
import IncubatorUpgradeConfig, { setUpgradesRef } from './Incubator/IncubatorUpgrade.js';
import createFlipSpeedUpgrade from './FlipSpeed/FlipSpeedUpgrade.js';
import DelveScarabUpgradeConfig, { setUpgradesRef as setDelveScarabUpgradesRef } from './Scarabs/DelveScarabUpgrade.js';

/**
 * Upgrades module encapsulates all upgrade state, logic, and UI flags for the game.
 * Provides methods and state for handling upgrade effects, rendering, and integration with other systems.
 *
 * @namespace Upgrades
 * @property {number} upgradeDropRate - Global upgrade efficiency multiplier.
 * @property {number} sulphiteDropRate - Sulphite drop rate for delving.
 * @property {number} nikoScarab - Niko scarab upgrade state.
 * @property {number} incDropRate - Incubator drop rate.
 * @property {number} incubatorCost - Cost for incubator upgrades.
 * @property {number} flippingSpeed - Currency flipping speed multiplier.
 * @property {number} flippingSpeedCost - Cost for flipping speed upgrades.
 * @property {boolean} delveScarabShown - UI flag for delve scarab upgrade.
 * @property {boolean} iiQUpgradeShown - UI flag for IIQ upgrade.
 * @property {boolean} incubatorUpgradeShown - UI flag for incubator upgrade.
 * @property {boolean} flipSpeedUpgradeShown - UI flag for flip speed upgrade.
 * @property {Function} noOp - No-operation function.
 * @property {Function} delveScarab - Handler for showing delve scarab upgrade.
 */
const Upgrades = {
	// State
	upgradeDropRate: 0,
	sulphiteDropRate: 350,
	nikoScarab: 0,

	incDropRate: 0,
	incubatorCost: 10,
	flippingSpeed: 1,
	flippingSpeedCost: 1,

	// UI state flags
	delveScarabShown: false,
	iiQUpgradeShown: false,
	incubatorUpgradeShown: false,
	flipSpeedUpgradeShown: false,

	// Methods
	noOp() { },

	// Scarab upgrade handlers
	delveScarab() {
		if (this.delveStashTab == 1 && !this.delveScarabShown) {
			renderUpgradeRow(upgradeConfigs.find(c => c.key === 'delveScarab'));
			this.delveScarab = this.noOp;
		}
	},
};

// Set up accessors for MapCurrencyUpgradeSystem to interact with Upgrades state
MapCurrencyUpgradeSystem.getUpgradeDropRate = () => Upgrades.upgradeDropRate;
MapCurrencyUpgradeSystem.setUpgradeDropRate = val => { Upgrades.upgradeDropRate = val; };
MapCurrencyUpgradeSystem.getDivStashTab = () => Upgrades.divStashTab;

// Patch: ensure tab upgrades increase efficiency
/**
 * Returns the current global upgrade drop rate.
 * @returns {number}
 */
function getUpgradeDropRate() { return Upgrades.upgradeDropRate; }

/**
 * Increments the global upgrade drop rate by 1.
 * @returns {void}
 */
function incUpgradeDropRate() { Upgrades.upgradeDropRate += 1; }

/**
 * Formats an efficiency value as an integer if whole, or as a float otherwise.
 * @param {number} val - The efficiency value.
 * @returns {string|number} Formatted efficiency value.
 */
function formatEfficiency(val) {
    return Number.isInteger(val) ? val : val.toFixed(1);
}

// Set Upgrades reference for IncubatorUpgrade
setUpgradesRef(Upgrades);
setDelveScarabUpgradesRef(Upgrades);

// --- Upgrade Configurations --- 
/**
 * Array of all upgrade configuration objects for the game.
 * @type {Array<Object>}
 */
const upgradeConfigs = [
	IIQUpgradeConfig,
	IncubatorUpgradeConfig,
	createFlipSpeedUpgrade(Upgrades),
	// Stash tab upgrades (imported)
	...stashTabUpgradeConfigs.map(cfg => ({
		...cfg,
		buy: () => cfg.buy(incUpgradeDropRate)
	})),

	DelveScarabUpgradeConfig
];

/**
 * Renders a row in the upgrade table for a given upgrade configuration.
 * Handles dynamic values, attaches event listeners, and marks upgrades as shown.
 *
 * @param {Object} cfg - The upgrade configuration object.
 * @param {number} [totalLevel] - Optional total level for unlock checks.
 * @returns {void}
 */
function renderUpgradeRow(cfg, totalLevel) {
	if (Upgrades[cfg.shownFlag]) return;
	if (!cfg.unlock(totalLevel)) return;

	// Only create and append the row if it does not already exist
	let row = document.getElementById(cfg.rowId);
	if (!row) {
		row = document.createElement('tr');
		row.id = cfg.rowId;
		// Append the row to the table
		document.getElementById('UpgradeTable').appendChild(row);
	} else {
		row = $(row)[0]; // Ensure it's a DOM element
	}

	// Evaluate dynamic values
	const buttonText = typeof cfg.buttonText === 'function' ? cfg.buttonText() : cfg.buttonText;
	const description = typeof cfg.description === 'function' ? cfg.description() : cfg.description;
	const benefit = cfg.benefit();
	const costText = typeof cfg.costText === 'function' ? cfg.costText() : cfg.costText;

	// Generate the inner HTML using the new function
	const cellsHTML = generateUpgradeCellsHTML(
		cfg.key,
		'Augment', // Use a generic type or derive if needed
		description,
		benefit,
		costText,
		buttonText,
		cfg.buttonId // Pass the specific button ID from config
	);

	// Set the inner HTML of the row
	$(row).html(cellsHTML);

	// Add CSS classes to specific cells if needed (using the generated HTML structure)
	if (cfg.benefitClass) {
		$(row).children().eq(2).addClass(cfg.benefitClass);
	}
	if (cfg.costClass) {
		$(row).children().eq(3).addClass(cfg.costClass);
	}

	// Apply hover effects
	cfg.hover();

	// Attach the click listener to the button using its ID
	document.getElementById(cfg.buttonId)?.addEventListener('click', cfg.buy);

	// Mark as shown
	Upgrades[cfg.shownFlag] = true;
}

export { upgradeConfigs, renderUpgradeRow, formatEfficiency };

export default Upgrades;