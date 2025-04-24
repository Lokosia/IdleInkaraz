import { exileMap, totalLevel, SnackBar, hoverUpgrades } from '../../../Main.js'
import { currencyMap, currencyData } from '../currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from '../ui/UpgradeUI.js';
import { handleGenericUpgrade } from '../exile/ExileUtils.js'; // Import the new handler
import MapCurrencyUpgradeSystem from './MapCurrency/MapCurrencyUpgradeSystem.js';
import { renderConquerorUpgrades } from './Conquerors/ConquerorUpgrades.js';
import { stashTabUpgradeConfigs, buyCurrencyTab, buyDelveTab, buyQuadTab, buyDivTab, syncStashTabStateToUpgrades } from './StashTab/StashTabUpgrades.js';
import { IIQUpgradeConfig, IIQState } from './IIQ/IIQUpgrade.js';
import IncubatorUpgradeConfig, { setUpgradesRef } from './Incubator/IncubatorUpgrade.js';

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

// Set Upgrades reference for IncubatorUpgrade
setUpgradesRef(Upgrades);

// --- Upgrade Configurations --- 
const upgradeConfigs = [
	IIQUpgradeConfig,
	IncubatorUpgradeConfig,
	{
		key: 'flipSpeed',
		shownFlag: 'flipSpeedUpgradeShown',
		unlock: (totalLevel) => totalLevel >= 1000,
		rowId: 'flipSpeedUpgrade',
		buttonId: 'btn-flip-speed',
		buttonClass: 'flipSpeedUpgradeButton',
		buttonText: 'Flipping Speed',
		description: 'Increase the rate The Singularity flips currency',
		benefitClass: 'flipSpeedMulti',
		benefit: () => '+0.5',
		costClass: 'flipSpeedUpgradeCostDisplay',
		costText: () => `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`,
		requirements: () => [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
		hover: () => hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
		buy: () => handleGenericUpgrade({
			requirements: [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
			onSuccess: () => {
				Upgrades.flippingSpeedCost = Math.floor(Upgrades.flippingSpeedCost * 2);
				Upgrades.flippingSpeed++;
				Upgrades.upgradeDropRate += 0.5;
			},
			updateUI: () => {
				const row = document.getElementById('flipSpeedUpgrade');
				if (!row) return;

				const costCell = row.querySelector('.flipSpeedUpgradeCostDisplay');
				if (costCell) {
					costCell.innerHTML = `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`;
				}

				// Update global display separately
				const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
				if (globalUpgradeRateElem) {
					 globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
				}

				const benefitCell = row.querySelector('.flipSpeedMulti');
				if (benefitCell) {
					 // Correctly display the benefit per level, not the total speed level
					benefitCell.innerHTML = '+0.5';
				}
			},
			keepHoverOnSuccess: true // Keep hover for repeatable upgrade
		})
	},
	// Stash tab upgrades (imported)
	...stashTabUpgradeConfigs.map(cfg => ({
		...cfg,
		buy: () => cfg.buy(incUpgradeDropRate)
	})),
	{
		key: 'delveScarab',
		shownFlag: 'delveScarabShown',
		unlock: () => Upgrades.delveStashTab === 1 && !Upgrades.delveScarabShown,
		rowId: 'delveScarab',
		buttonId: 'btn-niko-scarab',
		buttonClass: 'nikoScarab',
		buttonText: () => {
			const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
			return scarabTypes[Upgrades.nikoScarab] || 'Maxed';
		},
		description: 'Use Sulphite Scarab to increase Sulphite quantity',
		benefitClass: '',
		benefit: () => '+1.0',
		costClass: 'delveScarabCost',
		costText: () => {
			const costs = ['1 Exalted', '5 Exalted', '10 Exalted'];
			return costs[Upgrades.nikoScarab] || 'Maxed';
		},
		requirements: () => {
			const costs = [1, 5, 10];
			return Upgrades.nikoScarab < costs.length
				? [{ currency: currencyMap['Exalted'], amount: costs[Upgrades.nikoScarab] }]
				: [];
		},
		hover: () => hoverUpgrades('delveScarab', 'Exalted'),
		buy: () => {
			const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
			const costs = [1, 5, 10];
			const currentCost = costs[Upgrades.nikoScarab];

			handleGenericUpgrade({
				requirements: currentCost !== undefined ? [{ currency: currencyMap['Exalted'], amount: currentCost }] : [],
				check: () => Upgrades.nikoScarab < scarabTypes.length, // Ensure not maxed
				onSuccess: () => {
					Upgrades.nikoScarab++;
					Upgrades.sulphiteDropRate += 100;
					Upgrades.upgradeDropRate += 1;
				},
				updateUI: () => {
					const row = document.getElementById('delveScarab');
					if (!row) return;

					if (Upgrades.nikoScarab >= scarabTypes.length) {
						$(".Exalted").removeClass("hover");
						$(row).remove();
						Upgrades.delveScarabShown = true; // Mark as shown only when maxed and removed
					} else {
						const costCell = row.querySelector('.delveScarabCost');
						if (costCell) costCell.innerHTML = `${costs[Upgrades.nikoScarab]} Exalted`;
						const button = row.querySelector('.nikoScarab');
						if (button) button.innerHTML = scarabTypes[Upgrades.nikoScarab];
					}
					const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
					if (globalUpgradeRateElem) globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
				},
				onFailure: () => {
					if (Upgrades.nikoScarab >= scarabTypes.length) {
						SnackBar("Scarab upgrades already maxed!");
					} else {
						SnackBar("Requirements not met.");
					}
				}
			});
		}
	}
];

// --- Generic Upgrade Renderer --- 
function renderUpgradeRow(cfg, totalLevel) {
	if (Upgrades[cfg.shownFlag]) return;
	// Pass totalLevel to unlock if it expects it
	if (cfg.unlock.length > 0 ? !cfg.unlock(totalLevel) : !cfg.unlock()) return;

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
	const description = cfg.description;
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

export { upgradeConfigs, renderUpgradeRow };

export default Upgrades;