// ExileFactory module for creating and managing exiles and their upgrades
import { Exile } from './Exile.js';
import { currencyMap } from '../currency/CurrencyData.js';

/**
 * Gear upgrade configuration array for exiles.
 * Each object defines the requirements, benefit, and description for a gear upgrade level.
 * @type {Array<Object>}
 */
const gearUpgrades = [
    {
        level: 0,  // First upgrade, applied at gear level 0
        requirements: [
            { currency: currencyMap['Transmutation'], amount: 5 },
            { currency: currencyMap['Augmentation'], amount: 5 }
        ],
        benefit: 0.1,
        description: "Upgrade {name} flasks to Magic rarity"
    },
    {
        level: 1,
        requirements: [
            { currency: currencyMap['Transmutation'], amount: 10 },
            { currency: currencyMap['Augmentation'], amount: 10 }
        ],
        benefit: 0.1,
        description: "Upgrade {name} gear to Magic rarity"
    },
    {
        level: 2,
        requirements: [
            { currency: currencyMap['Alteration'], amount: 50 },
            { currency: currencyMap['Augmentation'], amount: 50 }
        ],
        benefit: 0.2,
        description: "Roll {name} flasks"
    },
    {
        level: 3,
        requirements: [
            { currency: currencyMap['Alteration'], amount: 100 },
            { currency: currencyMap['Augmentation'], amount: 100 }
        ],
        benefit: 0.2,
        description: "Roll {name} gear"
    },
    {
        level: 4,
        requirements: [
            { currency: currencyMap['Blacksmith'], amount: 20 }
        ],
        benefit: 0.2,
        description: "20% quality {name} weapon"
    },
    {
        level: 5,
        requirements: [
            { currency: currencyMap['Armourer'], amount: 200 }
        ],
        benefit: 0.2,
        description: "20% quality {name} gear"
    },
    {
        level: 6,
        requirements: [
            { currency: currencyMap['Regal'], amount: 10 }
        ],
        benefit: 0.3,
        description: "Upgrade {name} gear to Rare rarity"
    },
    {
        level: 7,
        requirements: [
            { currency: currencyMap['Chaos'], amount: 30 }
        ],
        benefit: 0.4,
        description: "Buy upgrades for {name} gear"
    },
    {
        level: 8,
        requirements: [
            { currency: currencyMap['Chaos'], amount: 50 }
        ],
        benefit: 0.4,
        description: "Buy jewels for {name} gear"
    },
    {
        level: 9,
        requirements: [
            { currency: currencyMap['Blessed'], amount: 30 }
        ],
        benefit: 0.4,
        description: "Blessed implicits for {name} gear"
    },
    {
        level: 10,
        requirements: [
            { currency: currencyMap['Chaos'], amount: 100 }
        ],
        benefit: 0.5,
        description: "Buy upgrades for {name} gear"
    },
    {
        level: 11,
        requirements: [
            { currency: currencyMap['Regret'], amount: 15 },
            { currency: currencyMap['Chance'], amount: 150 }
        ],
        benefit: 0.5,
        description: "Enchant {name} gloves"
    },
    {
        level: 12,
        requirements: [
            { currency: currencyMap['Regret'], amount: 40 },
            { currency: currencyMap['Chance'], amount: 400 }
        ],
        benefit: 0.5,
        description: "Enchant {name} boots"
    },
    {
        level: 13,
        requirements: [
            { currency: currencyMap['Glassblower'], amount: 50 }
        ],
        benefit: 0.5,
        description: "20% quality {name} flasks"
    },
    {
        level: 14,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 1 },
            { currency: currencyMap['Chaos'], amount: 50 }
        ],
        benefit: 0.6,
        description: "Anoint {name} amulet"
    },
    {
        level: 15,
        requirements: [
            { currency: currencyMap['Chaos'], amount: 250 }
        ],
        benefit: 0.6,
        description: "Buy upgrades for {name} gear"
    },
    {
        level: 16,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 2 },
            { currency: currencyMap['Chaos'], amount: 200 }
        ],
        benefit: 0.7,
        description: "Buy unique flasks for {name}"
    },
    {
        level: 17,
        requirements: [
            { currency: currencyMap['Divine'], amount: 10 }
        ],
        benefit: 0.7,
        description: "Divine {name} gear"
    },
    {
        level: 18,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 3 }
        ],
        benefit: 0.8,
        description: "Buy upgrades for {name} gear"
    },
    {
        level: 19,
        requirements: [
            { currency: currencyMap['Regret'], amount: 250 },
            { currency: currencyMap['Chance'], amount: 2500 }
        ],
        benefit: 0.9,
        description: "Enchant {name} helmet"
    },
    {
        level: 20,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 10 }
        ],
        benefit: 1,
        description: "Exalt {name} gear"
    },
    {
        level: 21,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 5 },
            { currency: currencyMap['Awakener'], amount: 1 }
        ],
        benefit: 1.5,
        description: "Craft explode chest for {name}"
    },
    {
        level: 22,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 50 }
        ],
        benefit: 1.5,
        description: "Buy Watchers Eye for {name}"
    },
    {
        level: 23,
        requirements: [
            { currency: currencyMap['Exalted'], amount: 150 }
        ],
        benefit: 2,
        specialIncrement: 7,
        description: "Buy Headhunter for {name}"
    }
];

/**
 * Links upgrade configuration array for exiles.
 * Each object defines the requirements, benefit, display value, and description for a links upgrade level.
 * @type {Array<Object>}
 */
const linksUpgrades = [
    {
        level: 0,
        requirements: [
            { currency: currencyMap['Fusing'], amount: 10 },
            { currency: currencyMap['Jeweller'], amount: 10 }
        ],
        benefit: 0.5,
        displayValue: "4L",
        description: "Upgrade {name} links to 4L"
    },
    {
        level: 1,
        requirements: [
            { currency: currencyMap['Chromatic'], amount: 100 }
        ],
        benefit: 0.5,
        displayValue: "4L",
        description: "Colour {name} links"
    },
    {
        level: 2,
        requirements: [
            { currency: currencyMap['Fusing'], amount: 150 },
            { currency: currencyMap['Jeweller'], amount: 150 }
        ],
        benefit: 0.6,
        displayValue: "5L",
        description: "Upgrade {name} links to 5L"
    },
    {
        level: 3,
        requirements: [
            { currency: currencyMap['Fusing'], amount: 1500 },
            { currency: currencyMap['Jeweller'], amount: 1500 }
        ],
        benefit: 1.0,
        displayValue: "6L",
        description: "Upgrade {name} links to 6L"
    },
    {
        level: 4,
        requirements: [
            { currency: currencyMap['Vaal'], amount: 50 }
        ],
        benefit: 1.5,
        displayValue: "6L (+1 Gems)",
        description: "Corrupt {name} gear to +1 gems"
    },
    {
        level: 5,
        requirements: [
            { currency: currencyMap['GCP'], amount: 120 }
        ],
        benefit: 1.5,
        displayValue: "6L (+1/20% Gems)",
        description: "20% quality {name} gems"
    },
    {
        level: 6,
        requirements: [
            { currency: currencyMap['Vaal'], amount: 100 }
        ],
        benefit: 1.5,
        displayValue: "6L (+2/20% Gems)",
        description: "Corrupt {name} gems to +1"
    },
    {
        level: 7,
        requirements: [
            { currency: currencyMap['Vaal'], amount: 150 }
        ],
        benefit: 2.0,
        displayValue: "6L (+2/23% Gems)",
        description: "Double corrupt {name} gems to +1/23%"
    },
    {
        level: 8,
        requirements: [
            { currency: currencyMap['Vaal'], amount: 200 }
        ],
        benefit: 2.5,
        displayValue: "6L (+5/23% Gems)",
        description: "Double corrupt {name} gear to +4 gems",
        finalUpgrade: true
    }
];

/**
 * ExileFactory provides methods to create standard and special exiles with their upgrade configurations.
 * Also exposes the default gear and links upgrade arrays.
 *
 * @namespace ExileFactory
 * @property {Array<Object>} gearUpgrades - Default gear upgrade configs.
 * @property {Array<Object>} linksUpgrades - Default links upgrade configs.
 * @function createExile - Create a new Exile instance with optional custom upgrades and requirements.
 * @function createSpecialExile - Create a special Exile with a custom requirement type/value.
 * @function createStandardExiles - Get an array of all standard exiles.
 * @function createSpecialExiles - Get an array of all special exiles.
 * @function createAllExiles - Get an array of all exiles (standard + special).
 */
const ExileFactory = {
    gearUpgrades,
    linksUpgrades,
    /**
     * Create a new Exile instance.
     * @param {string} name - Exile's name.
     * @param {number} [levelRequirement=0] - Total level required to recruit.
     * @param {Array|null} [specialRequirement=null] - Special recruitment requirement.
     * @param {Array|null} [customGearUpgrades=null] - Custom gear upgrade configs.
     * @param {Array|null} [customLinksUpgrades=null] - Custom links upgrade configs.
     * @returns {Exile} New Exile instance.
     */
    createExile(name, levelRequirement = 0, specialRequirement = null, customGearUpgrades = null, customLinksUpgrades = null) {
        return new Exile(
            name,
            '0', // level
            '0', // exp
            '525', // expToLevel
            '0', // dropRate
            '0', // gear
            '0', // links
            '0', // rerollLevel
            levelRequirement,
            specialRequirement,
            customGearUpgrades || gearUpgrades,
            customLinksUpgrades || linksUpgrades
        );
    },
    /**
     * Create a special Exile with a custom requirement type/value.
     * @param {string} name - Exile's name.
     * @param {number} levelRequirement - Level requirement for recruitment.
     * @param {string} specialReqType - Type of special requirement (e.g., stash tab).
     * @param {number} specialReqValue - Value for the special requirement.
     * @returns {Exile} New special Exile instance.
     */
    createSpecialExile(name, levelRequirement, specialReqType, specialReqValue) {
        return this.createExile(name, levelRequirement, [specialReqType, specialReqValue]);
    },
    /**
     * Get an array of all standard exiles.
     * @returns {Array<Exile>} Array of standard Exile instances.
     */
    createStandardExiles() {
        return [
            this.createExile('Ascendant'),
            this.createExile('Slayer', 35),
            this.createExile('Assassin', 65),
            this.createExile('Juggernaut', 110),
            this.createExile('Necromancer', 170),
            this.createExile('Deadeye', 245),
            this.createExile('Inquisitor', 335),
            this.createExile('Gladiator', 450),
            this.createExile('Saboteur', 580),
            this.createExile('Berserker', 725),
            this.createExile('Elementalist', 885),
            this.createExile('Raider', 1060),
            this.createExile('Hierophant', 1250),
            this.createExile('Champion', 1455),
            this.createExile('Trickster', 1675),
            this.createExile('Chieftain', 1910),
            this.createExile('Occultist', 2160),
            this.createExile('Pathfinder', 2425),
            this.createExile('Guardian', 2715),
        ];
    },
    /**
     * Get an array of all special exiles.
     * @returns {Array<Exile>} Array of special Exile instances.
     */
    createSpecialExiles() {
        return [
            this.createSpecialExile('Melvin', 500, 'delveStashTab', 1),
            this.createSpecialExile('Singularity', 250, 'currencyStashTab', 1),
            this.createSpecialExile('Artificer', 1000, 'quadStashTab', 1),
        ];
    },
    /**
     * Get an array of all exiles (standard + special).
     * @returns {Array<Exile>} Array of all Exile instances.
     */
    createAllExiles() {
        return [
            ...this.createStandardExiles(),
            ...this.createSpecialExiles()
        ];
    }
};

export { ExileFactory, gearUpgrades, linksUpgrades };