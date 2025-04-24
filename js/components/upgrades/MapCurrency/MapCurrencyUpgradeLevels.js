// Contains the configuration for map currency upgrade levels used in the map currency upgrade system.
// Each object represents a level, its cost, description, and the currencies consumed per upgrade.
// Used by MapCurrencyUpgradeSystem.js to drive upgrade logic and UI.

/**
 * Array of configuration objects for map currency upgrade levels.
 * Each object defines the cost, button text, description, and currencies consumed per upgrade level.
 * Used by the MapCurrencyUpgradeSystem to drive upgrade logic and UI.
 *
 * @type {Array<{cost: number, buttonText: string, description: string, consume: Array<{currency: string, amount: number}>}>}
 */
const mapCurrencyUpgradeLevels = [
	{
		cost: 1,
		buttonText: "Alch/Scour Maps",
		description: "Consume (2) Alchemy, (1) Scour to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'Alchemy', amount: 2 },
			{ currency: 'Scouring', amount: 1 }
		]
	},
	{
		cost: 1,
		buttonText: "Chisel Maps",
		description: "Consume (4) Cartographer's Chisel to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'Chisel', amount: 4 }
		]
	},
	{
		cost: 1,
		buttonText: "Simple Sextant Maps",
		description: "Consume (1) Simple Sextant to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'SimpleSextant', amount: 1 }
		]
	},
	{
		cost: 2,
		buttonText: "Prime Sextant Maps",
		description: "Consume (1) Prime Sextant to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'PrimeSextant', amount: 1 }
		]
	},
	{
		cost: 2,
		buttonText: "Awakened Sextant Maps",
		description: "Consume (1) Awakened Sextant to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'AwakenedSextant', amount: 1 }
		]
	},
	{
		cost: 2,
		buttonText: "Vaal Maps",
		description: "Consume (1) Vaal Orb to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'Vaal', amount: 1 }
		]
	},
	{
		cost: 3,
		buttonText: "Use Prophecies",
		description: "Consume (4) Silver Coins to increase drop rate from maps<br>(per tick)",
		consume: [
			{ currency: 'SilverCoin', amount: 4 }
		]
	}
];

export { mapCurrencyUpgradeLevels };