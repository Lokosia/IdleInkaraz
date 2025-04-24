import State from '../../State.js';
import { SnackBar, hoverUpgrades } from '../../UIInitializer.js';
import { currencyMap, currencyData } from '../currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from '../ui/UpgradeUI.js';
import { handleGenericUpgrade } from '../exile/ExileUtils.js'; // Import the new handler
import MapCurrencyUpgradeSystem from './MapCurrency/MapCurrencyUpgradeSystem.js';
import { renderConquerorUpgrades } from './Conquerors/ConquerorUpgrades.js';
import { stashTabUpgradeConfigs, buyCurrencyTab, buyDelveTab, buyQuadTab, buyDivTab, syncStashTabStateToUpgrades } from './StashTab/StashTabUpgrades.js';
import { IIQUpgradeConfig, IIQState } from './IIQ/IIQUpgrade.js';
import IncubatorUpgradeConfig, { setUpgradesRef } from './Incubator/IncubatorUpgrade.js';
import createFlipSpeedUpgrade from './FlipSpeed/FlipSpeedUpgrade.js';
import DelveScarabUpgradeConfig, { setUpgradesRef as setDelveScarabUpgradesRef } from './Scarabs/DelveScarabUpgrade.js';

// Upgrades module encapsulating all state and logic
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
function getUpgradeDropRate() { return Upgrades.upgradeDropRate; }
function incUpgradeDropRate() { Upgrades.upgradeDropRate += 1; }

// Helper to format efficiency as int if whole, float otherwise
function formatEfficiency(val) {
    return Number.isInteger(val) ? val : val.toFixed(1);
}

// Set Upgrades reference for IncubatorUpgrade
setUpgradesRef(Upgrades);
setDelveScarabUpgradesRef(Upgrades);

// --- Upgrade Configurations --- 
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

// --- Generic Upgrade Renderer --- 
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