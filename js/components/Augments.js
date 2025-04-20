import { exileMap, totalLevel, SnackBar } from '../../Main.js'
import { currencyMap, currencyData } from './currency/CurrencyData.js';

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

	// Generic handler for upgrades to reduce code duplication
	handleUpgrade({
		requirements = [],
		onSuccess = () => { },
		onFail = () => SnackBar("Requirements not met."),
		onComplete = () => { },
		costDeduct = () => { },
		updateUI = () => { },
		check = () => true
	}) {
		if (check() && requirements.every(req => req.currency.total >= req.amount)) {
			requirements.forEach(req => req.currency.total -= req.amount);
			costDeduct();
			onSuccess();
			updateUI();
			onComplete();
			SnackBar("Upgrade purchased!");
			return true;
		} else {
			onFail();
			return false;
		}
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
		if (conqueror.total >= 1) {
			conqueror.total -= 1;
			this.upgradeDropRate += 1;
			SnackBar("Upgrade purchased!");
			document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
			if (conqueror.total < 1) {
				$(`#${conqueror.name}Upgrade`).hide();
				$(`.${conqueror.name}`).removeClass("hover");
			}
		}
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

		this.handleUpgrade({
			requirements,
			onSuccess: () => {
				this[`${tabType}StashTab`] = 1;
				// Removed window assignments for stash tab flags
				this.upgradeDropRate += 1;
			},
			updateUI: () => {
				$(`.${currency1.name}`).removeClass("hover");
				if (currency2) $(`.${currency2.name}`).removeClass("hover");
				$(`#${tabType}Tab`).remove();
				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
				if (extraAction) extraAction();
			}
		});
	},

	// Scarab upgrade handlers
	delveScarab() {
		if (this.delveStashTab == 1 && !this.delveScarabShown) {
			renderUpgradeRow(upgradeConfigs.find(c => c.key === 'delveScarab'));
			this.delveScarab = this.noOp;
		}
	},

	// Map currency upgrade handler
	consumeMapCurrencyUpgrade() {
		if (exileMap['Ascendant'].level >= 68 && !this.mapCurrencyUpgradeShown) {
			$("#UpgradeTable").append(
				'<tr id="consumeMapCurrency">' +
				'<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored consumeMapCurrencyButton" id="btn-consume-map-currency">Alch/Scour Maps</button></td>' +
				'<td class="mdl-data-table__cell--non-numeric consumeMapCurrenydiv">Consume (2) Alchemy, (1) Scour to increase drop rate from maps<br>(per tick)</td>' +
				'<td class="mdl-data-table__cell--non-numeric">+1.5</td>' +
				'<td class="mdl-data-table__cell--non-numeric mapCurrencyCost">1 Exalted</td>' +
				'</tr>'
			);
			this.hoverUpgrades("consumeMapCurrency", "Exalted");
			document.getElementById('btn-consume-map-currency')?.addEventListener('click', () => this.buyMapCurrency());
			this.mapCurrencyUpgradeShown = true;
		}
	},

	buyMapCurrency() {
		const levels = [
			{ cost: 1, nextText: "Chisel Maps", nextDesc: "Consume (4) Cartographer's Chisel to increase drop rate from maps<br>(per tick)" },
			{ cost: 1, nextText: "Simple Sextant Maps", nextDesc: "Consume (1) Simple Sextant to increase drop rate from maps<br>(per tick)" },
			{ cost: 2, nextText: "Prime Sextant Maps", nextDesc: "Consume (1) Prime Sextant to increase drop rate from maps<br>(per tick)" },
			{ cost: 2, nextText: "Awakened Sextant Maps", nextDesc: "Consume (1) Awakened Sextant to increase drop rate from maps<br>(per tick)" },
			{ cost: 2, nextText: "Vaal Maps", nextDesc: "Consume (1) Vaal Orb to increase drop rate from maps<br>(per tick)" },
			{ cost: 2, nextText: "Use Prophecies", nextDesc: "Consume (4) Silver Coins to increase drop rate from maps<br>(per tick)" },
			{ cost: 3, nextText: "", nextDesc: "" }
		];

		if (this.mappingCurrencyLevel < levels.length) {
			const level = levels[this.mappingCurrencyLevel];
			if (Exalted.total >= level.cost) {
				Exalted.total -= level.cost;
				this.mappingCurrencyLevel++;
				this.upgradeDropRate += 1.5;
				SnackBar("Upgrade purchased!");

				if (this.mappingCurrencyLevel < levels.length) {
					const nextLevel = levels[this.mappingCurrencyLevel];
					document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = `${nextLevel.cost} Exalted`;
					document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = nextLevel.nextText;
					document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = nextLevel.nextDesc;
				} else {
					$(".Exalted").removeClass("hover");
					$('#consumeMapCurrency').remove();
				}

				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
			} else {
				SnackBar("Requirements not met.");
			}
		}
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
		requirements: () => [{ currency: Chaos, amount: Upgrades.iiqCost }],
		hover: () => Upgrades.hoverUpgrades('iiqUpgrade', 'Chaos'),
		buy: () => Upgrades.handleUpgrade({
			requirements: [{ currency: Chaos, amount: Upgrades.iiqCost }],
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
				document.getElementsByClassName('iiqUpgradeCostDisplay')[0].innerHTML =
					numeral(Upgrades.iiqCost).format('0,0') + ' Chaos';
				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML =
					Upgrades.upgradeDropRate.toFixed(1);
				document.getElementsByClassName('iiqDropRate')[0].innerHTML =
					Upgrades.iiqDropRate.toFixed(1);
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
		requirements: () => [{ currency: Chaos, amount: Upgrades.incubatorCost }],
		hover: () => Upgrades.hoverUpgrades('incubatorUpgrade', 'Chaos'),
		buy: () => Upgrades.handleUpgrade({
			requirements: [{ currency: Chaos, amount: Upgrades.incubatorCost }],
			onSuccess: () => {
				Upgrades.incubatorCost = Math.floor(Upgrades.incubatorCost * 1.2);
				if (Upgrades.incDropRate === 0) {
					Upgrades.incDropRate = 1;
				} else {
					Upgrades.incDropRate += 0.1;
				}
			},
			updateUI: () => {
				document.getElementsByClassName('incubatorUpgradeCostDisplay')[0].innerHTML =
					numeral(Upgrades.incubatorCost).format('0,0') + ' Chaos';
				document.getElementsByClassName('incDropRate')[0].innerHTML =
					Upgrades.incDropRate.toFixed(1);
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
		buy: () => Upgrades.handleUpgrade({
			requirements: [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
			onSuccess: () => {
				Upgrades.flippingSpeedCost = Math.floor(Upgrades.flippingSpeedCost * 2);
				Upgrades.flippingSpeed++;
				Upgrades.upgradeDropRate += 0.5;
			},
			updateUI: () => {
				document.getElementsByClassName('flipSpeedUpgradeCostDisplay')[0].innerHTML =
					numeral(Upgrades.flippingSpeedCost).format('0,0') + ' Eternal';
				document.getElementsByClassName('UpgradeDropRate')[0].innerHTML =
					Upgrades.upgradeDropRate.toFixed(1);
				document.getElementsByClassName('flipSpeedMulti')[0].innerHTML =
					Upgrades.flippingSpeed;
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
				? [{ currency: Exalted, amount: costs[Upgrades.nikoScarab] }]
				: [];
		},
		hover: () => Upgrades.hoverUpgrades('delveScarab', 'Exalted'),
		buy: () => {
			const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
			const costs = [1, 5, 10];

			Upgrades.handleUpgrade({
				requirements: [{ currency: Exalted, amount: costs[Upgrades.nikoScarab] || 99999 }],
				onSuccess: () => {
					Upgrades.nikoScarab++;
					Upgrades.sulphiteDropRate += 100;
					Upgrades.upgradeDropRate += 1;
				},
				updateUI: () => {
					if (Upgrades.nikoScarab >= scarabTypes.length) {
						$(".Exalted").removeClass("hover");
						$('#delveScarab').remove();
						Upgrades.delveScarabShown = true;
					} else {
						document.getElementsByClassName('delveScarabCost')[0].innerHTML =
							`${costs[Upgrades.nikoScarab]} Exalted`;
						document.getElementsByClassName('nikoScarab')[0].innerHTML =
							scarabTypes[Upgrades.nikoScarab];
					}
					document.getElementsByClassName('UpgradeDropRate')[0].innerHTML =
						Upgrades.upgradeDropRate.toFixed(1);
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

	$("#UpgradeTable").append(
		`<tr id="${cfg.rowId}">
		<td class="mdl-data-table__cell--non-numeric">
		  <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${cfg.buttonClass}" 
			id="${cfg.buttonId}">${typeof cfg.buttonText === 'function' ? cfg.buttonText() : cfg.buttonText}</button>
		</td>
		<td class="mdl-data-table__cell--non-numeric">${cfg.description}</td>
		<td class="mdl-data-table__cell--non-numeric ${cfg.benefitClass}">${cfg.benefit()}</td>
		<td class="mdl-data-table__cell--non-numeric ${cfg.costClass}">${typeof cfg.costText === 'function' ? cfg.costText() : cfg.costText
		}</td>
	  </tr>`
	);
	cfg.hover();
	document.getElementById(cfg.buttonId)?.addEventListener('click', cfg.buy);
	Upgrades[cfg.shownFlag] = true;
}

// --- Upgrade Loop ---
setInterval(function updateTick() {
	// Render generic upgrades
	for (const cfg of upgradeConfigs) {
		renderUpgradeRow(cfg, typeof totalLevel !== 'undefined' ? totalLevel : 0);
	}
	Upgrades.consumeMapCurrencyUpgrade();

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

	// Run map currency logic
	Upgrades.rollMapCurrency();
}, 500);

export default Upgrades;