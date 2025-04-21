import { exileMap, totalLevel, SnackBar } from '../../Main.js'
import { currencyMap, currencyData } from './currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from './UpgradeUI.js';
import { handleGenericUpgrade } from './exile/ExileUtils.js'; // Import the new handler

// Upgrades module encapsulating all state and logic
const Upgrades = {
	// State
	upgradeDropRate: 0,
	sulphiteDropRate: 350,
	currencyStashTab: 0,
	delveStashTab: 0,
	quadStashTab: 0,
	divStashTab: 0,
	nikoScarab: 0,
	iiqDropRate: 1,
	iiqCost: 10,
	incDropRate: 0,
	incubatorCost: 10,
	mappingCurrencyLevel: 0,
	flippingSpeed: 1,
	flippingSpeedCost: 1,

	// UI state flags
	currencyTabShown: false,
	delveTabShown: false,
	quadTabShown: false,
	divTabShown: false,
	delveScarabShown: false,
	iiqUpgradeShown: false,
	incubatorUpgradeShown: false,
	flipSpeedUpgradeShown: false,

	// Methods
	noOp() { },

	// UI helpers
	hoverUpgrades(name, a, b) {
		$('#' + name).hover(
			function () {
				$("." + a).addClass('hover');
				if (b) $("." + b).addClass('hover');
			}, function () {
				$("." + a).removeClass('hover');
				if (b) $("." + b).removeClass('hover');
			}
		);
	},

	// Map currency logic
	mapCurrency() {
		for (let i = 0; i < currencyData.length; i++) {
			let c = currencyData[i].rollCurrencyRNG();
			if (c <= currencyData[i].rate * (500 + this.upgradeDropRate)) {
				currencyData[i].total += 1 + (currencyData[i].rate * (500 + this.upgradeDropRate));
				if (currencyData[i].name == 'Mirror') {
					SnackBar("Mirror of Kalandra dropped!");
				}
			}
		}
	},

	rollMapCurrency() {
		const consumables = [
			{
				level: 0, check: () => this.divStashTab >= 1,
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

	// Method to handle conqueror upgrades
	buyConqueror(conqueror) {
		handleGenericUpgrade({
			requirements: [{ currency: conqueror, amount: 1 }],
			onSuccess: () => {
				this.upgradeDropRate += 1;
			},
			updateUI: () => {
				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
				if (conqueror.total < 1) { // Check remaining amount *after* deduction
					$(`#${conqueror.name}Upgrade`).hide();
					$(`.${conqueror.name}`).removeClass("hover");
				}
			},
			successMessage: "Conqueror influence consumed!"
		});
	},

	// Methods for specific upgrades that need special handling
	buyCurrencyTab() {
		this.handleStashTabUpgrade('currency', currencyMap['StackedDeck'], 5);
	},
	buyDelveTab() {
		this.handleStashTabUpgrade('delve', currencyMap['StackedDeck'], 50, currencyMap['Annulment'], 10, () => this.delveScarab());
	},
	buyQuadTab() {
		this.handleStashTabUpgrade('quad', currencyMap['Eternal'], 1);
	},
	buyDivTab() {
		this.handleStashTabUpgrade('div', currencyMap['Annulment'], 50, currencyMap['Exalted'], 1);
	},

	// Generic stash tab upgrade handler
	handleStashTabUpgrade(tabType, currency1, amount1, currency2, amount2, extraAction) {
		const requirements = [{ currency: currency1, amount: amount1 }];
		if (currency2) {
			requirements.push({ currency: currency2, amount: amount2 });
		}

		handleGenericUpgrade({
			requirements,
			onSuccess: () => {
				this[`${tabType}StashTab`] = 1;
				this.upgradeDropRate += 1;
				if (extraAction) extraAction(); // Call extra action on success
			},
			updateUI: () => {
				$(`.${currency1.name}`).removeClass("hover");
				if (currency2) $(`.${currency2.name}`).removeClass("hover");
				$(`#${tabType}Tab`).remove();
				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
			},
			successMessage: "Stash tab purchased!"
		});
	},

	// Scarab upgrade handlers
	delveScarab() {
		if (this.delveStashTab == 1 && !this.delveScarabShown) {
			renderUpgradeRow(upgradeConfigs.find(c => c.key === 'delveScarab'));
			this.delveScarab = this.noOp;
		}
	},

	// Map currency upgrade handler (refactored to be fully data-driven)
	mapCurrencyUpgradeLevels: [
		{
			cost: 1,
			buttonText: "Alch/Scour Maps",
			description: "Consume (2) Alchemy, (1) Scour to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['Alchemy'], amount: 2 },
				{ currency: currencyMap['Scouring'], amount: 1 }
			]
		},
		{
			cost: 1,
			buttonText: "Chisel Maps",
			description: "Consume (4) Cartographer's Chisel to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['Chisel'], amount: 4 }
			]
		},
		{
			cost: 1,
			buttonText: "Simple Sextant Maps",
			description: "Consume (1) Simple Sextant to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['SimpleSextant'], amount: 1 }
			]
		},
		{
			cost: 2,
			buttonText: "Prime Sextant Maps",
			description: "Consume (1) Prime Sextant to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['PrimeSextant'], amount: 1 }
			]
		},
		{
			cost: 2,
			buttonText: "Awakened Sextant Maps",
			description: "Consume (1) Awakened Sextant to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['AwakenedSextant'], amount: 1 }
			]
		},
		{
			cost: 2,
			buttonText: "Vaal Maps",
			description: "Consume (1) Vaal Orb to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['Vaal'], amount: 1 }
			]
		},
		{
			cost: 3,
			buttonText: "Use Prophecies",
			description: "Consume (4) Silver Coins to increase drop rate from maps<br>(per tick)",
			consume: [
				{ currency: currencyMap['SilverCoin'], amount: 4 }
			]
		}
	],

	buyMapCurrency() {
		const idx = this.mappingCurrencyLevel;
		const level = this.mapCurrencyUpgradeLevels[idx];
		if (!level) return;

		const requirements = [
			{ currency: currencyMap['Exalted'], amount: level.cost },
			...level.consume // Add consumable requirements
		];

		handleGenericUpgrade({
			requirements,
			onSuccess: () => {
				this.mappingCurrencyLevel++;
				this.upgradeDropRate += 1.5;
			},
			updateUI: () => {
				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
				if (this.mappingCurrencyLevel < this.mapCurrencyUpgradeLevels.length) {
					this.showOrUpdateMapCurrencyUpgrade();
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

	showOrUpdateMapCurrencyUpgrade() {
		// Only show if Ascendant is at least level 68
		if (!exileMap['Ascendant'] || exileMap['Ascendant'].level < 68) {
			return;
		}
		const idx = this.mappingCurrencyLevel;
		if (idx >= this.mapCurrencyUpgradeLevels.length) {
			$('#MapCurrencyMapUpgrade').remove();
			return;
		}
		const level = this.mapCurrencyUpgradeLevels[idx];
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

		// Explicitly bind 'this' for the event handler
		const boundHandler = this.buyMapCurrency.bind(this); // Should work now

		// Attach the listener separately
		const btn = document.getElementById('MapCurrencyMapBtn');
		if (btn) {
			btn.onclick = boundHandler; // Use onclick for simplicity
		}

		this.hoverUpgrades(rowId, "Exalted");
	},

};

// --- Upgrade Configurations --- 
const upgradeConfigs = [
	{
		key: 'iiq',
		shownFlag: 'iiqUpgradeShown',
		unlock: () => exileMap['Ascendant'].level >= 50,
		rowId: 'iiqUpgrade',
		buttonId: 'btn-iiq-upgrade',
		buttonClass: 'iiqUpgradeButton',
		buttonText: 'IIQ Gear',
		description: 'Buy Increased Item Quantity gear for exiles',
		benefitClass: 'iiqDropRate',
		benefit: () => `+${Upgrades.iiqDropRate.toFixed(1)}`,
		costClass: 'iiqUpgradeCostDisplay',
		costText: () => `+${numeral(Upgrades.iiqCost).format('0,0')} Chaos`,
		requirements: () => [{ currency: currencyMap['Chaos'], amount: Upgrades.iiqCost }],
		hover: () => Upgrades.hoverUpgrades('iiqUpgrade', 'Chaos'),
		buy: () => handleGenericUpgrade({
			requirements: [{ currency: currencyMap['Chaos'], amount: Upgrades.iiqCost }],
			onSuccess: () => {
				Upgrades.iiqCost = Math.floor(Upgrades.iiqCost * 1.4);
				if (Upgrades.iiqDropRate === 1) {
					Upgrades.upgradeDropRate += Upgrades.iiqDropRate;
				} else {
					Upgrades.upgradeDropRate += 0.1;
				}
				Upgrades.iiqDropRate += 0.1;
			},
			updateUI: () => {
				const row = document.getElementById('iiqUpgrade');
				if (!row) return; // Safety check

				const costCell = row.querySelector('.iiqUpgradeCostDisplay');
				if (costCell) {
					costCell.innerHTML = numeral(Upgrades.iiqCost).format('0,0') + ' Chaos';
				}

				// Update global display separately
				const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
				if (globalUpgradeRateElem) {
					 globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
				}

				const benefitCell = row.querySelector('.iiqDropRate');
				if (benefitCell) {
					benefitCell.innerHTML = `+${Upgrades.iiqDropRate.toFixed(1)}`; // Update the benefit cell
				}
			}
		})
	},
	{
		key: 'incubator',
		shownFlag: 'incubatorUpgradeShown',
		unlock: () => exileMap['Ascendant'].level >= 75,
		rowId: 'incubatorUpgrade',
		buttonId: 'btn-incubator-upgrade',
		buttonClass: 'incubatorUpgradeButton',
		buttonText: 'Equip Incubators',
		description: 'Equip Incubators to exile gear',
		benefitClass: 'incDropRate',
		benefit: () => `+${Upgrades.incDropRate.toFixed(1)}`,
		costClass: 'incubatorUpgradeCostDisplay',
		costText: () => `+${numeral(Upgrades.incubatorCost).format('0,0')} Chaos`,
		requirements: () => [{ currency: currencyMap['Chaos'], amount: Upgrades.incubatorCost }],
		hover: () => Upgrades.hoverUpgrades('incubatorUpgrade', 'Chaos'),
		buy: () => handleGenericUpgrade({
			requirements: [{ currency: currencyMap['Chaos'], amount: Upgrades.incubatorCost }],
			onSuccess: () => {
				Upgrades.incubatorCost = Math.floor(Upgrades.incubatorCost * 1.2);
				if (Upgrades.incDropRate === 0) {
					Upgrades.incDropRate = 1;
				} else {
					Upgrades.incDropRate += 0.1;
				}
			},
			updateUI: () => {
				const row = document.getElementById('incubatorUpgrade');
				if (!row) return;

				const costCell = row.querySelector('.incubatorUpgradeCostDisplay');
				if (costCell) {
					costCell.innerHTML = `+${numeral(Upgrades.incubatorCost).format('0,0')} Chaos`;
				}

				const benefitCell = row.querySelector('.incDropRate');
				if (benefitCell) {
					benefitCell.innerHTML = `+${Upgrades.incDropRate.toFixed(1)}`;
				}
			}
		})
	},
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
		hover: () => Upgrades.hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
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
			}
		})
	},
	{
		key: 'currencyTab',
		shownFlag: 'currencyTabShown',
		unlock: (totalLevel) => totalLevel >= 250,
		rowId: 'currencyTab',
		buttonId: 'btn-currency-tab',
		buttonClass: 'currencyTabButton',
		buttonText: 'Currency Stash Tab',
		description: 'Purchase the Currency Stash Tab',
		benefitClass: '',
		benefit: () => '+1.0',
		costClass: '',
		costText: () => '5 Stacked Deck',
		requirements: () => [{ currency: currencyMap['StackedDeck'], amount: 5 }],
		hover: () => Upgrades.hoverUpgrades('currencyTab', 'StackedDeck'),
		buy: () => Upgrades.buyCurrencyTab()
	},
	{
		key: 'delveTab',
		shownFlag: 'delveTabShown',
		unlock: (totalLevel) => totalLevel >= 500,
		rowId: 'delveTab',
		buttonId: 'btn-delve-tab',
		buttonClass: 'delveTabButton',
		buttonText: 'Delve Stash Tab',
		description: 'Purchase the Delve Stash Tab',
		benefitClass: '',
		benefit: () => '+1.0',
		costClass: '',
		costText: () => '50 Stacked Deck<br>10 Orb of Annulment',
		requirements: () => [
			{ currency: currencyMap['StackedDeck'], amount: 50 },
			{ currency: currencyMap['Annulment'], amount: 10 }
		],
		hover: () => Upgrades.hoverUpgrades('delveTab', 'StackedDeck', 'Annulment'),
		buy: () => Upgrades.buyDelveTab()
	},
	{
		key: 'quadTab',
		shownFlag: 'quadTabShown',
		unlock: (totalLevel) => totalLevel >= 1000,
		rowId: 'quadTab',
		buttonId: 'btn-quad-tab',
		buttonClass: 'quadTabButton',
		buttonText: 'Quad Stash Tab',
		description: 'Purchase the Quad Stash Tab',
		benefitClass: '',
		benefit: () => '+1.0',
		costClass: '',
		costText: () => '1 Eternal Orb',
		requirements: () => [{ currency: currencyMap['Eternal'], amount: 1 }],
		hover: () => Upgrades.hoverUpgrades('quadTab', 'Eternal'),
		buy: () => Upgrades.buyQuadTab()
	},
	{
		key: 'divTab',
		shownFlag: 'divTabShown',
		unlock: (totalLevel) => totalLevel >= 750,
		rowId: 'divTab',
		buttonId: 'btn-div-tab',
		buttonClass: 'divTabButton',
		buttonText: 'Divination Stash Tab',
		description: 'Consume (1) Stacked Deck<br>(per tick)',
		benefitClass: '',
		benefit: () => '+1.0',
		costClass: '',
		costText: () => '50 Orb of Annulment<br>1 Exalted',
		requirements: () => [
			{ currency: currencyMap['Annulment'], amount: 50 },
			{ currency: currencyMap['Exalted'], amount: 1 }
		],
		hover: () => Upgrades.hoverUpgrades('divTab', 'Exalted', 'Annulment'),
		buy: () => Upgrades.buyDivTab()
	},
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
		hover: () => Upgrades.hoverUpgrades('delveScarab', 'Exalted'),
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

	// Create the row element
	const row = $(`<tr id="${cfg.rowId}"></tr>`);

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
	row.html(cellsHTML);

	// Add CSS classes to specific cells if needed (using the generated HTML structure)
	if (cfg.benefitClass) {
		row.children().eq(2).addClass(cfg.benefitClass);
	}
	if (cfg.costClass) {
		row.children().eq(3).addClass(cfg.costClass);
	}

	// Append the row to the table
	$("#UpgradeTable").append(row);

	// Apply hover effects
	cfg.hover();

	// Attach the click listener to the button using its ID
	document.getElementById(cfg.buttonId)?.addEventListener('click', cfg.buy);

	// Mark as shown
	Upgrades[cfg.shownFlag] = true;
}

// --- Upgrade Loop --- 
setInterval(function updateTick() {
	// Render generic upgrades
	for (const cfg of upgradeConfigs) {
		renderUpgradeRow(cfg, typeof totalLevel !== 'undefined' ? totalLevel : 0);
	}
	Upgrades.showOrUpdateMapCurrencyUpgrade();

	// Handle conqueror upgrades
	const conquerors = [
		currencyMap['Crusader'],
		currencyMap['Hunter'],
		currencyMap['Redeemer'],
		currencyMap['Warlord']
	];

	for (const currency of conquerors) {
		const name = currency.name; // or use the key if you prefer
		if (currency && currency.total >= 1) {
			$(`#${name}Upgrade`).show();
			Upgrades.hoverUpgrades(`${name}Upgrade`, name);
		} else {
			$(`#${name}Upgrade`).hide();
		}
	}

	// Update Flipping Speed display in the Flipping tab
	const flipSpeedDisplayElem = document.querySelector('#divFlipping .flipSpeedMulti');
	if (flipSpeedDisplayElem) {
		flipSpeedDisplayElem.innerHTML = Upgrades.flippingSpeed;
	}

	// Run map currency logic
	Upgrades.rollMapCurrency();
}, 500);

export default Upgrades;