//---Main
var totalLevel = 0;
var dropRate = 0;
var playTime = 0;
var snackBarTimer = 0;

//---Define Class
class Exile {
    constructor(name, level, exp, expToLevel, dropRate, gear, links, rerollLevel) {
        this.name = name;
        this.level = Number(level);
        this.exp = Number(exp);
        this.expToLevel = Number(expToLevel);
        this.dropRate = Number(dropRate); //efficiency
        this.gear = Number(gear);
        this.links = Number(links);
        this.rerollLevel = Number(rerollLevel);
        this.gearUpgrades = [
            {
                level: 0,  // First upgrade, applied at gear level 0
                requirements: [
                    { currency: Transmutation, amount: 5 },
                    { currency: Augmentation, amount: 5 }
                ],
                benefit: 0.1,
                description: "Upgrade {name} flasks to Magic rarity"
            },
            {
                level: 1,
                requirements: [
                    { currency: Transmutation, amount: 10 },
                    { currency: Augmentation, amount: 10 }
                ],
                benefit: 0.1,
                description: "Upgrade {name} gear to Magic rarity"
            },
            {
                level: 2,
                requirements: [
                    { currency: Alteration, amount: 50 },
                    { currency: Augmentation, amount: 50 }
                ],
                benefit: 0.2,
                description: "Roll {name} flasks"
            },
            {
                level: 3,
                requirements: [
                    { currency: Alteration, amount: 100 },
                    { currency: Augmentation, amount: 100 }
                ],
                benefit: 0.2,
                description: "Roll {name} gear"
            },
            {
                level: 4,
                requirements: [
                    { currency: Blacksmith, amount: 20 }
                ],
                benefit: 0.2,
                description: "20% quality {name} weapon"
            },
            {
                level: 5,
                requirements: [
                    { currency: Armourer, amount: 200 }
                ],
                benefit: 0.2,
                description: "20% quality {name} gear"
            },
            {
                level: 6,
                requirements: [
                    { currency: Regal, amount: 10 }
                ],
                benefit: 0.3,
                description: "Upgrade {name} gear to Rare rarity"
            },
            {
                level: 7,
                requirements: [
                    { currency: Chaos, amount: 30 }
                ],
                benefit: 0.4,
                description: "Buy upgrades for {name} gear"
            },
            {
                level: 8,
                requirements: [
                    { currency: Chaos, amount: 50 }
                ],
                benefit: 0.4,
                description: "Buy jewels for {name} gear"
            },
            {
                level: 9,
                requirements: [
                    { currency: Blessed, amount: 30 }
                ],
                benefit: 0.4,
                description: "Blessed implicits for {name} gear"
            },
            {
                level: 10,
                requirements: [
                    { currency: Chaos, amount: 100 }
                ],
                benefit: 0.5,
                description: "Buy upgrades for {name} gear"
            },
            {
                level: 11,
                requirements: [
                    { currency: Regret, amount: 15 },
                    { currency: Chance, amount: 150 }
                ],
                benefit: 0.5,
                description: "Enchant {name} gloves"
            },
            {
                level: 12,
                requirements: [
                    { currency: Regret, amount: 40 },
                    { currency: Chance, amount: 400 }
                ],
                benefit: 0.5,
                description: "Enchant {name} boots"
            },
            {
                level: 13,
                requirements: [
                    { currency: Glassblower, amount: 50 }
                ],
                benefit: 0.5,
                description: "20% quality {name} flasks"
            },
            {
                level: 14,
                requirements: [
                    { currency: Exalted, amount: 1 },
                    { currency: Chaos, amount: 50 }
                ],
                benefit: 0.6,
                description: "Anoint {name} amulet"
            },
            {
                level: 15,
                requirements: [
                    { currency: Chaos, amount: 250 }
                ],
                benefit: 0.6,
                description: "Buy upgrades for {name} gear"
            },
            {
                level: 16,
                requirements: [
                    { currency: Exalted, amount: 2 },
                    { currency: Chaos, amount: 200 }
                ],
                benefit: 0.7,
                description: "Buy unique flasks for {name}"
            },
            {
                level: 17,
                requirements: [
                    { currency: Divine, amount: 10 }
                ],
                benefit: 0.7,
                description: "Divine {name} gear"
            },
            {
                level: 18,
                requirements: [
                    { currency: Exalted, amount: 3 }
                ],
                benefit: 0.8,
                description: "Buy upgrades for {name} gear"
            },
            {
                level: 19,
                requirements: [
                    { currency: Regret, amount: 250 },
                    { currency: Chance, amount: 2500 }
                ],
                benefit: 0.9,
                description: "Enchant {name} helmet"
            },
            {
                level: 20,
                requirements: [
                    { currency: Exalted, amount: 10 }
                ],
                benefit: 1,
                description: "Exalt {name} gear"
            },
            {
                level: 21,
                requirements: [
                    { currency: Exalted, amount: 5 },
                    { currency: Awakener, amount: 1 }
                ],
                benefit: 1.5,
                description: "Craft explode chest for {name}"
            },
            {
                level: 22,
                requirements: [
                    { currency: Exalted, amount: 50 }
                ],
                benefit: 1.5,
                description: "Buy Watchers Eye for {name}"
            },
            {
                level: 23,
                requirements: [
                    { currency: Exalted, amount: 150 }
                ],
                benefit: 2,
                specialIncrement: 7,
                description: "Buy Headhunter for {name}"
            }
        ];
        this.linksUpgrades = [
            {
                level: 0,
                requirements: [
                    { currency: Fusing, amount: 10 },
                    { currency: Jeweller, amount: 10 }
                ],
                benefit: 0.5,
                displayValue: "4L",
                description: "Upgrade {name} links to 4L"
            },
            {
                level: 1,
                requirements: [
                    { currency: Chromatic, amount: 100 }
                ],
                benefit: 0.5,
                displayValue: "4L",
                description: "Colour {name} links"
            },
            {
                level: 2,
                requirements: [
                    { currency: Fusing, amount: 150 },
                    { currency: Jeweller, amount: 150 }
                ],
                benefit: 0.6,
                displayValue: "5L",
                description: "Upgrade {name} links to 5L"
            },
            {
                level: 3,
                requirements: [
                    { currency: Fusing, amount: 1500 },
                    { currency: Jeweller, amount: 1500 }
                ],
                benefit: 1.0,
                displayValue: "6L",
                description: "Upgrade {name} links to 6L"
            },
            {
                level: 4,
                requirements: [
                    { currency: Vaal, amount: 50 }
                ],
                benefit: 1.5,
                displayValue: "6L (+1 Gems)",
                description: "Corrupt {name} gear to +1 gems"
            },
            {
                level: 5,
                requirements: [
                    { currency: GCP, amount: 120 }
                ],
                benefit: 1.5,
                displayValue: "6L (+1/20% Gems)",
                description: "20% quality {name} gems"
            },
            {
                level: 6,
                requirements: [
                    { currency: Vaal, amount: 100 }
                ],
                benefit: 1.5,
                displayValue: "6L (+2/20% Gems)",
                description: "Corrupt {name} gems to +1"
            },
            {
                level: 7,
                requirements: [
                    { currency: Vaal, amount: 150 }
                ],
                benefit: 2.0,
                displayValue: "6L (+2/23% Gems)",
                description: "Double corrupt {name} gems to +1/23%"
            },
            {
                level: 8,
                requirements: [
                    { currency: Vaal, amount: 200 }
                ],
                benefit: 2.5,
                displayValue: "6L (+5/23% Gems)",
                description: "Double corrupt {name} gear to +4 gems",
                finalUpgrade: true
            }
        ];
    }

    lvlExile() {
        if (this.level > 0 && this.level <= 99) {
            this.exp += Math.floor((Math.random() * (25 - 15) + 15) + (this.dropRate * 3) + (this.level / 5)); // delete *100
            while (this.exp > this.expToLevel) {
                this.expToLevel = Math.floor((this.expToLevel * 1.10)); //updates level requirement
                this.level++;
                if (this.rerollLevel <= 100) {
                    this.dropRate += 0.1; // default is 0.1
                } else {
                    this.dropRate += 0.05; //makes rerolls less efficient
                }
            }
        }
    }

    updateExileClass() {
        if (this.level > 0 && this.level <= 99) {
            this.lvlExile();
            document.getElementsByClassName(this.name + 'Level')[0].innerHTML = this.level;
            document.getElementsByClassName(this.name + 'EXP')[0].innerHTML = numeral(this.exp).format('0,0') + "/" + numeral(this.expToLevel).format('0,0');
            document.getElementsByClassName(this.name + 'Efficiency')[0].innerHTML = "x" + numeral(this.dropRate).format('0,0.0');
        }
        if (this.level == 100) {
            document.getElementsByClassName(this.name + 'EXP')[0].innerHTML = "Max";
            $('.' + this.name + 'RerollButton').removeClass('hidden');
        }
    };

    lvlGear() {
        this.upgradeExile('Gear', this.getNextGearUpgrade.bind(this), this.applyGearUpgrade.bind(this));
    }

    lvlLinks() {
        this.upgradeExile('Links', this.getNextLinksUpgrade.bind(this), this.applyLinksUpgrade.bind(this));
    }

    /**
 * Gets the next gear upgrade based on current gear level
 * @param {number} level - Current gear level
 * @param {Array} upgrades - Array of available upgrades 
 * @returns {Object} The next upgrade object
 */
    getNextGearUpgrade(level, upgrades) {
        if (level >= 0 && level <= 23) {
            const currentIndex = upgrades.findIndex(upgrade => upgrade.level === level);
            if (currentIndex === -1) return null;
            return upgrades[currentIndex];
        } else if (level >= 24) {
            return getMirrorUpgrade(level);
        }
        return null;
    }

    /**
     * Gets the next links upgrade based on current links level
     * @param {number} level - Current links level
     * @param {Array} upgrades - Array of available upgrades
     * @returns {Object} The next upgrade object
     */
    getNextLinksUpgrade(level, upgrades) {
        const currentIndex = upgrades.findIndex(upgrade => upgrade.level === level);
        if (currentIndex === -1) return null;
        return upgrades[currentIndex];
    }

    /**
     * Apply gear-specific upgrade effects
     * @param {Object} upgrade - The upgrade configuration object
     */
    applyGearUpgrade(upgrade) {
        this.dropRate += upgrade.benefit;
    }

    /**
     * Apply links-specific upgrade effects
     * @param {Object} upgrade - The upgrade configuration object  
     */
    applyLinksUpgrade(upgrade) {
        this.dropRate += upgrade.benefit;

        // Update the display text for the links
        document.getElementsByClassName(this.name + 'Links')[0].innerHTML = upgrade.displayValue;

        // If this was the final upgrade, remove the upgrade button
        if (upgrade.finalUpgrade) {
            SnackBar(this.name + " Links upgrades completed!");
            $('#' + this.name + 'LinksUpgrade').remove();
        }
    }

    /**
 * Generic method to manage upgrades based on the specified upgrade type
 * @param {string} upgradeType - Type of upgrade ('Gear' or 'Links')
 * @param {function} getNextUpgrade - Function to determine the next upgrade
 * @param {function} applyUpgrade - Function to apply the upgrade effects
 */
    upgradeExile(upgradeType, getNextUpgrade, applyUpgrade) {
        // Get property name for this upgrade type (e.g., 'gear' or 'links')
        const propertyName = upgradeType.toLowerCase();

        // Get the current level of this upgrade type
        const currentLevel = this[propertyName];

        // Get upgrades array name (e.g., 'gearUpgrades' or 'linksUpgrades')
        const upgradesArrayName = propertyName + 'Upgrades';

        // Get the current upgrade
        const currentUpgrade = getNextUpgrade(currentLevel, this[upgradesArrayName]);

        if (!currentUpgrade) return;

        // Process the upgrade
        const success = processUpgrade(currentUpgrade, (upgrade) => {
            // Apply the specific effects for this upgrade type
            applyUpgrade(upgrade);

            // Update the level for this upgrade type
            this[propertyName] += upgrade.specialIncrement || 1;

            // Get the next upgrade
            const nextUpgrade = getNextUpgrade(this[propertyName], this[upgradesArrayName]);

            // If there's a next upgrade, update the UI
            if (nextUpgrade) {
                this.updateUpgradeUI(upgradeType, nextUpgrade);
            }

            SnackBar(this.name + " " + upgradeType + " upgraded!");
        });

        if (!success) {
            SnackBar("Requirements not met.");
        }
    }

    /**
     * Updates the UI for an upgrade
     * @param {string} upgradeType - Type of upgrade ('Gear' or 'Links')
     * @param {Object} nextUpgrade - The next upgrade configuration
     */
    updateUpgradeUI(upgradeType, nextUpgrade) {
        // Generate requirements text 
        const requirementsText = nextUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        // Generate HTML
        generateUpgradeHTML(
            this.name,
            upgradeType,
            nextUpgrade.description.replace('{name}', this.name),
            `+${nextUpgrade.benefit} (${this.name})`,
            requirementsText
        );

        // Extract currency names for hover effects
        const hoverCurrencies = nextUpgrade.requirements.map(req => req.currency.name);

        // Set up hover effects
        this.setupHover(upgradeType, ...hoverCurrencies);
    }

    recruitExile() {
        this.level += 1;
        this.dropRate += 0.1;
        $('.' + this.name + 'Buy').remove();
        $('.' + this.name + 'Hide').remove();

        // Get the first gear upgrade directly from gearUpgrades
        const firstGearUpgrade = this.gearUpgrades[0];
        const requirementsText = firstGearUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        // Get the first links upgrade directly from linksUpgrades
        const firstLinksUpgrade = this.linksUpgrades[0];
        const linksRequirementsText = firstLinksUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        $("#UpgradeGearTable").append(
            '<tr id="' + this.name + 'GearUpgrade">' +
            '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + this.name + 'GearButton" onclick="buyGear(' + this.name + ');">' + this.name + ' Gear' + '</button></td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + firstGearUpgrade.description.replace('{name}', this.name) + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">+' + firstGearUpgrade.benefit + ' (' + this.name + ')</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + requirementsText + '</td>' +
            '</tr>'
        );
        $("#UpgradeLinksTable").append(
            '<tr id="' + this.name + 'LinksUpgrade">' +
            '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + this.name + 'LinksButton" onclick="buyLinks(' + this.name + ');">' + this.name + ' Links</button></td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + firstLinksUpgrade.description.replace('{name}', this.name) + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">+' + firstLinksUpgrade.benefit + ' (' + this.name + ')</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + linksRequirementsText + '</td>' +
            '</tr>'
        );
        document.getElementsByClassName(this.name + 'Efficiency')[0].innerHTML = "x" + this.dropRate.toFixed(1);
        document.getElementsByClassName(this.name + 'Level')[0].innerHTML = this.level;

        // Setup hover effects for both gear and links
        const gearCurrencies = firstGearUpgrade.requirements.map(req => req.currency.name);
        const linksCurrencies = firstLinksUpgrade.requirements.map(req => req.currency.name);

        this.setupHover("Gear", ...gearCurrencies);
        this.setupHover("Links", ...linksCurrencies);
    };

    rerollExile() {
        this.level = 1;
        this.rerollLevel += 100;
        this.exp = 0;
        this.expToLevel = 525;
        $('.' + this.name + 'RerollButton').addClass('hidden');
        $('.' + this.name + 'Reroll').removeClass('hidden');
        document.getElementsByClassName(this.name + 'Reroll')[0].innerHTML = '(+' + this.rerollLevel + ')';
    };

    /**
     * Sets up hover effects for upgrade elements, highlighting the required currencies
     * @param {string} upgradeType - Type of upgrade ('Gear' or 'Links')
     * @param {string} firstCurrency - First currency to highlight
     * @param {string} secondCurrency - Second currency to highlight (optional)
     */
    setupHover(upgradeType, firstCurrency, secondCurrency = null) {
        // First, remove ALL hover classes from any currency
        $(".hover").removeClass("hover");

        $(`#${this.name}${upgradeType}Upgrade`).off('mouseenter mouseleave');
        $(`#${this.name}${upgradeType}Upgrade`).hover(
            function () {
                $(`.${firstCurrency}`).addClass('hover');
                if (secondCurrency) {
                    $(`.${secondCurrency}`).addClass('hover');
                }
            },
            function () {
                $(`.${firstCurrency}`).removeClass('hover');
                if (secondCurrency) {
                    $(`.${secondCurrency}`).removeClass('hover');
                }
            }
        );
    }
}

/**
 * Processes an upgrade for an exile, handling requirements checking, cost deduction and benefit application
 * @param {Object} upgrade - The upgrade configuration object
 * @param {function} onSuccess - Callback to execute if upgrade is successful
 * @returns {boolean} - Whether the upgrade was successful
 */
function processUpgrade(upgrade, onSuccess) {
    if (checkRequirements(upgrade.requirements)) {
        deductCosts(upgrade.requirements);
        onSuccess(upgrade);
        return true;
    }
    return false;
}

/**
 * Generates and updates HTML for upgrade buttons and descriptions
 * @param {string} exile - The exile name
 * @param {string} upgradeType - The type of upgrade (e.g., 'Gear', 'Links')
 * @param {string} description - Description of the upgrade
 * @param {string} benefit - The benefit gained from the upgrade
 * @param {string} requirements - The requirements text
 */
function generateUpgradeHTML(exile, upgradeType, description, benefit, requirements) {
    // Generate button text from exile name and upgradeType
    const buttonText = exile + ' ' + upgradeType;

    const html = `
        <td class="mdl-data-table__cell--non-numeric">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${exile}${upgradeType}Button" 
                    onclick="buy${upgradeType}(${exile});">
                ${buttonText}
            </button>
        </td>
        <td class="mdl-data-table__cell--non-numeric">${description}</td>
        <td class="mdl-data-table__cell--non-numeric">${benefit}</td>
        <td class="mdl-data-table__cell--non-numeric">${requirements}</td>
    `;

    // Update the HTML content directly
    $(`#${exile}${upgradeType}Upgrade`).html(html);
}

/**
 * Checks if all currency requirements are met.
 * @param {Array<Object>} requirements - An array of requirement objects, e.g., [{ currency: Transmutation, amount: 5 }, { currency: Augmentation, amount: 5 }]
 * @returns {boolean} - True if all requirements are met, false otherwise.
 */
function checkRequirements(requirements) {
    for (const req of requirements) {
        // Ensure the currency object exists and has a 'total' property
        if (!req.currency || typeof req.currency.total === 'undefined') {
            console.error("Invalid currency object in requirements:", req);
            return false; // Invalid requirement definition
        }
        if (req.currency.total < req.amount) {
            return false; // Not enough of this currency
        }
    }
    return true; // All requirements met
}

/**
 * Deducts currency costs based on the requirements array.
 * Assumes checkRequirements has already passed.
 * @param {Array<Object>} requirements - An array of requirement objects, e.g., [{ currency: Transmutation, amount: 5 }, { currency: Augmentation, amount: 5 }]
 */
function deductCosts(requirements) {
    for (const req of requirements) {
        if (req.currency && typeof req.currency.total !== 'undefined') {
            req.currency.total -= req.amount;
        } else {
            console.error("Attempted to deduct invalid currency:", req);
        }
    }
}

// For gear levels beyond our defined upgrades
function getMirrorUpgrade(gearLevel) {
    return {
        level: gearLevel,
        name: "Mirror gear",
        requirements: [
            { currency: Exalted, amount: gearLevel },
            { currency: Mirror, amount: 1 }
        ],
        specialIncrement: 10,
        benefit: 2.5,
        description: "Mirror gear for {name}"
    };
}

//---Define Exiles
var exileData = [
    Ascendant = new Exile('Ascendant', '0', '0', '525', '0', '0', '0', '0'),
    Slayer = new Exile('Slayer', '0', '0', '525', '0', '0', '0', '0'),
    Gladiator = new Exile('Gladiator', '0', '0', '525', '0', '0', '0', '0'),
    Champion = new Exile('Champion', '0', '0', '525', '0', '0', '0', '0'),
    Assassin = new Exile('Assassin', '0', '0', '525', '0', '0', '0', '0'),
    Saboteur = new Exile('Saboteur', '0', '0', '525', '0', '0', '0', '0'),
    Trickster = new Exile('Trickster', '0', '0', '525', '0', '0', '0', '0'),
    Juggernaut = new Exile('Juggernaut', '0', '0', '525', '0', '0', '0', '0'),
    Berserker = new Exile('Berserker', '0', '0', '525', '0', '0', '0', '0'),
    Chieftain = new Exile('Chieftain', '0', '0', '525', '0', '0', '0', '0'),
    Necromancer = new Exile('Necromancer', '0', '0', '525', '0', '0', '0', '0'),
    Elementalist = new Exile('Elementalist', '0', '0', '525', '0', '0', '0', '0'),
    Occultist = new Exile('Occultist', '0', '0', '525', '0', '0', '0', '0'),
    Deadeye = new Exile('Deadeye', '0', '0', '525', '0', '0', '0', '0'),
    Raider = new Exile('Raider', '0', '0', '525', '0', '0', '0', '0'),
    Pathfinder = new Exile('Pathfinder', '0', '0', '525', '0', '0', '0', '0'),
    Inquisitor = new Exile('Inquisitor', '0', '0', '525', '0', '0', '0', '0'),
    Hierophant = new Exile('Hierophant', '0', '0', '525', '0', '0', '0', '0'),
    Guardian = new Exile('Guardian', '0', '0', '525', '0', '0', '0', '0'),
    Melvin = new Exile('Melvin', '0', '0', '525', '0', '0', '0', '0'),
];
Singularity = new Exile('Singularity', '0', '0', '525', '0', '0', '0', '0'); //flipper
Artificer = new Exile('Artificer', '0', '0', '525', '0', '0', '0', '0'); //crafter

setInterval(function gameTick() {
    let tempLevel = 250;
    for (let i = 0; i < exileData.length; i++) {
        if (exileData[i].level >= 1) {
            exileData[i].updateExileClass();
        }
        tempLevel += exileData[i].level;
        tempLevel += exileData[i].rerollLevel;
    }

    totalLevel = tempLevel;
    document.getElementsByClassName('TotalLevel')[0].innerHTML = "Levels: " + numeral(totalLevel).format('0,0');
    dropRate = upgradeDropRate + Ascendant.dropRate + Slayer.dropRate + Gladiator.dropRate + Champion.dropRate + Assassin.dropRate + Saboteur.dropRate + Trickster.dropRate + Juggernaut.dropRate + Berserker.dropRate + Chieftain.dropRate + Necromancer.dropRate + Occultist.dropRate + Elementalist.dropRate + Deadeye.dropRate + Raider.dropRate + Pathfinder.dropRate + Inquisitor.dropRate + Hierophant.dropRate + Guardian.dropRate + Melvin.dropRate;
    document.getElementsByClassName('TotalDR')[0].innerHTML = "Efficiency: x" + numeral(dropRate).format('0,0.0');

    snackBarTimer -= 100;
    playTime += 0.1;
    document.getElementById("timePlayed").innerHTML = numeral(playTime).format('00:00:00');
}, 100);

//---Unlocking Exiles
//---Ascendant
function recruitAscendant() {
    if (totalLevel >= 0) {
        Ascendant.recruitExile();
    }
}
//---Slayer
function recruitSlayer() {
    if (totalLevel >= 35) {
        Slayer.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Assassin
function recruitAssassin() {
    if (totalLevel >= 65) {
        Assassin.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Juggernaut
function recruitJuggernaut() {
    if (totalLevel >= 110) {
        Juggernaut.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Necromancer
function recruitNecromancer() {
    if (totalLevel >= 170) {
        Necromancer.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Deadeye
function recruitDeadeye() {

    if (totalLevel >= 245) {
        Deadeye.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Inquisitor
function recruitInquisitor() {
    if (totalLevel >= 335) {
        Inquisitor.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Gladiator
function recruitGladiator() {
    if (totalLevel >= 450) {
        Gladiator.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Saboteur
function recruitSaboteur() {
    if (totalLevel >= 580) {
        Saboteur.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Berserker
function recruitBerserker() {
    if (totalLevel >= 725) {
        Berserker.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Elementalist
function recruitElementalist() {
    if (totalLevel >= 885) {
        Elementalist.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Raider
function recruitRaider() {
    if (totalLevel >= 1060) {
        Raider.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Hierophant
function recruitHierophant() {
    if (totalLevel >= 1250) {
        Hierophant.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Champion
function recruitChampion() {
    if (totalLevel >= 1455) {
        Champion.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Trickster
function recruitTrickster() {
    if (totalLevel >= 1675) {
        Trickster.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Chieftain
function recruitChieftain() {
    if (totalLevel >= 1910) {
        Chieftain.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Occultist
function recruitOccultist() {
    if (totalLevel >= 2160) {
        Occultist.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Pathfinder
function recruitPathfinder() {
    if (totalLevel >= 2425) {
        Pathfinder.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---Guardian
function recruitGuardian() {
    if (totalLevel >= 2715) {
        Guardian.recruitExile();
    } else {
        SnackBar("Requirements not met.");
    }
}
//---The Singulatiry
function recruitSingularity() {
    if (totalLevel >= 250 && currencyStashTab == 1) {
        Singularity.level++;
        $(".SingularityHide").remove();
        $(".SingularityBuy").remove();
        $('.flip').removeClass('hidden');
    } else {
        SnackBar("Requirements not met.");
    }
}

//---Delvin' Melvin
function recruitMelvin() {
    if (totalLevel >= 500 && delveStashTab == 1) {
        Melvin.recruitExile();
        $(".MelvinHide").remove();
        $(".MelvinBuy").remove();
        $("#delveLoader").removeClass("hidden");
    } else {
        SnackBar("Requirements not met.");
    }
}

//---The Artificer
function recruitArtificer() {
    if (totalLevel >= 1000 && quadStashTab == 1) {
        Artificer.level++;
        $(".ArtificerHide").remove();
        $(".ArtificerBuy").remove();
        $(".craft").show();
    } else {
        SnackBar("Requirements not met.");
    }
}

//---Upgrading Exiles
function buyGear(name) {
    name.lvlGear();
}
function buyLinks(name) {
    name.lvlLinks();
}
function buyReroll(name) {
    name.rerollExile();
}
