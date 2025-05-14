import { handlePurchase } from '../shared/PurchaseUtils.js';
import { getMirrorUpgrade } from './ExileUtils.js'; // Import the new handler
// Import the refactored function
import { generateUpgradeCellsHTML } from '../ui/UpgradeUI.js';
import { SnackBar } from '../../UIInitializer.js';
import { hoverUpgrades } from '../currency/HoverState.js';
import { updateTheorycraftingEfficiencyUI } from '../upgrades/Augments.js';

/**
 * Represents an Exile character in the game.
 * Handles progression, upgrades, and UI interactions for a specific character.
 *
 * @class
 * @property {string} name - The name of the exile.
 * @property {number} level - Current level of the exile.
 * @property {number} exp - Current experience points.
 * @property {number} expToLevel - Experience required for next level.
 * @property {number} dropRate - Efficiency multiplier for the exile.
 * @property {number} gear - Current gear upgrade level.
 * @property {number} links - Current links upgrade level.
 * @property {number} rerollLevel - Number of times the exile has been rerolled (prestiged).
 * @property {number} levelRequirement - Total level required to recruit this exile.
 * @property {Array|null} specialRequirement - Special requirement for recruitment (e.g., stash tab).
 * @property {Array} gearUpgrades - List of gear upgrade configurations.
 * @property {Array} linksUpgrades - List of links upgrade configurations.
 */
class Exile {
    /**
     * Create a new Exile instance.
     * @param {string} name - Exile's name.
     * @param {number|string} level - Initial level.
     * @param {number|string} exp - Initial experience.
     * @param {number|string} expToLevel - Initial experience required for next level.
     * @param {number|string} dropRate - Initial efficiency multiplier.
     * @param {number|string} gear - Initial gear upgrade level.
     * @param {number|string} links - Initial links upgrade level.
     * @param {number|string} rerollLevel - Initial reroll count.
     * @param {number} [levelRequirement=0] - Total level required to recruit.
     * @param {Array|null} [specialRequirement=null] - Special recruitment requirement.
     * @param {Array} [gearUpgrades=[]] - Gear upgrade configs.
     * @param {Array} [linksUpgrades=[]] - Links upgrade configs.
     */
    constructor(name, level, exp, expToLevel, dropRate, gear, links, rerollLevel, levelRequirement = 0, specialRequirement = null, gearUpgrades = [], linksUpgrades = []) {
        this.name = name;
        this.level = Number(level);
        this.exp = Number(exp);
        this.expToLevel = Number(expToLevel);
        this.dropRate = Number(dropRate); //efficiency
        this.gear = Number(gear);
        this.links = Number(links);
        this.rerollLevel = Number(rerollLevel);
        this.levelRequirement = levelRequirement; // Required total level to recruit
        this.specialRequirement = specialRequirement; // Special requirement for certain exiles
        this.gearUpgrades = gearUpgrades;
        this.linksUpgrades = linksUpgrades;
    }

    /**
     * Increase exile's experience and level up if threshold is reached.
     * Updates drop rate based on level and reroll count.
     * @returns {void}
     */
    lvlExile() {
        if (this.level > 0 && this.level <= 99) {
            this.exp += Math.floor((Math.random() * (25 - 15) + 15) + (this.dropRate * 3) + (this.level / 5)) * 1000;
            while (this.exp > this.expToLevel) {
                this.expToLevel = Math.floor((this.expToLevel * 1.10));
                this.level++;
                if (this.rerollLevel <= 100) {
                    this.dropRate += 0.1;
                } else {
                    this.dropRate += 0.05;
                }
            }
        }
    }

    /**
     * Update the exile's UI elements based on current state.
     * Handles level 100 cap and reroll button display.
     * @returns {void}
     */
    updateExileClass() {
        if (this.level > 0 && this.level <= 99) {
            this.lvlExile();
            const levelElem = document.getElementsByClassName(this.name + 'Level')[0];
            if (levelElem) levelElem.innerHTML = this.level;
            const expElem = document.getElementsByClassName(this.name + 'EXP')[0];
            if (expElem) expElem.innerHTML = numeral(this.exp).format('0,0') + "/" + numeral(this.expToLevel).format('0,0');
            const effElem = document.getElementsByClassName(this.name + 'Efficiency')[0];
            if (effElem) effElem.innerHTML = "x" + numeral(this.dropRate).format('0,0.0');
        }
        if (this.level == 100) {
            const expElem = document.getElementsByClassName(this.name + 'EXP')[0];
            if (expElem) expElem.innerHTML = "Max";
            if (this.name === 'Melvin') {
                $(".MelvinRerollButton").removeClass('hidden');
                return;
            }
            $('.' + this.name + 'ActionSection').show();
            const actionButton = document.getElementById(this.name + 'ActionButton');
            if (actionButton) {
                actionButton.innerHTML = `Reroll ${this.name}`;
                actionButton.onclick = () => this.rerollExile();
            }
        }
    }

    /**
     * Attempt to upgrade gear for this exile.
     * @returns {void}
     */
    lvlGear() {
        this.upgradeExile('Gear', this.getNextGearUpgrade.bind(this), this.applyGearUpgrade.bind(this));
    }

    /**
     * Attempt to upgrade links for this exile.
     * @returns {void}
     */
    lvlLinks() {
        this.upgradeExile('Links', this.getNextLinksUpgrade.bind(this), this.applyLinksUpgrade.bind(this));
    }

    /**
     * Get the next available gear upgrade configuration.
     * @param {number} level - Current gear level.
     * @param {Array} upgrades - Gear upgrade configs.
     * @returns {Object|null} Next upgrade config or null if none.
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
     * Get the next available links upgrade configuration.
     * @param {number} level - Current links level.
     * @param {Array} upgrades - Links upgrade configs.
     * @returns {Object|null} Next upgrade config or null if none.
     */
    getNextLinksUpgrade(level, upgrades) {
        const currentIndex = upgrades.findIndex(upgrade => upgrade.level === level);
        if (currentIndex === -1) return null;
        return upgrades[currentIndex];
    }

    /**
     * Apply a gear upgrade's benefit to this exile.
     * @param {Object} upgrade - Gear upgrade config.
     * @returns {void}
     */
    applyGearUpgrade(upgrade) {
        this.dropRate += upgrade.benefit;
    }

    /**
     * Apply a links upgrade's benefit to this exile and update UI.
     * @param {Object} upgrade - Links upgrade config.
     * @returns {void}
     */
    applyLinksUpgrade(upgrade) {
        this.dropRate += upgrade.benefit;
        const linksElem = document.getElementsByClassName(this.name + 'Links')[0];
        if (linksElem) linksElem.innerHTML = upgrade.displayValue;
        // Final upgrade UI removal logic moved to upgradeExile's updateUI callback
    }

    /**
     * Generic handler for upgrading gear or links.
     * Handles requirements, UI updates, and success/failure feedback.
     * @param {string} upgradeType - 'Gear' or 'Links'.
     * @param {Function} getNextUpgrade - Function to get next upgrade config.
     * @param {Function} applyUpgrade - Function to apply upgrade benefit.
     * @returns {void}
     */
    upgradeExile(upgradeType, getNextUpgrade, applyUpgrade) {
        const propertyName = upgradeType.toLowerCase(); // 'gear' or 'links'
        const currentLevel = this[propertyName];
        const upgradesArrayName = propertyName + 'Upgrades'; // 'gearUpgrades' or 'linksUpgrades'
        const currentUpgrade = getNextUpgrade(currentLevel, this[upgradesArrayName]);

        if (!currentUpgrade) {
            console.warn(`No next ${upgradeType} upgrade found for ${this.name} at level ${currentLevel}`);
            return;
        }

        const rowId = `${this.name}${upgradeType}Upgrade`;
        const row = document.getElementById(rowId);
        if (!row) {
            console.error(`Upgrade row ${rowId} not found.`);
            return;
        }

        // Calculate the level *after* the potential purchase
        const potentialNextLevel = this[propertyName] + (currentUpgrade.specialIncrement || 1);

        handlePurchase({
            requirements: currentUpgrade.requirements,
            onSuccess: () => {
                applyUpgrade(currentUpgrade);
                this[propertyName] += currentUpgrade.specialIncrement || 1;
            },
            uiUpdateConfig: {
                rowElement: row,
                // We won't use cost/benefit elements directly, updateUpgradeUI handles it
                getNextLevelData: () => {
                    // Check if there's an upgrade *after* the one being purchased
                    const nextNextUpgrade = getNextUpgrade(potentialNextLevel, this[upgradesArrayName]);
                    return nextNextUpgrade ? {} : null; // Return null if no *further* upgrade exists (signals max level)
                },
                removeRowOnMaxLevel: true,
                // Pass currency names for hover removal on max level
                hoverClassesToRemoveOnMaxLevel: currentUpgrade.requirements.map(req => req.currency.name)
            },
            updateUI: () => {
                // Hover removal is handled by uiUpdateConfig
                // Row removal at max level is handled by uiUpdateConfig

                // Get the upgrade data for the *new* current level
                const nextUpgrade = getNextUpgrade(this[propertyName], this[upgradesArrayName]);

                if (nextUpgrade) {
                    // If there's still another upgrade available, update the row content
                    this.updateUpgradeUI(upgradeType, nextUpgrade);
                } else {
                    // This case should ideally be handled by removeRowOnMaxLevel,
                    // but we can add a fallback message or ensure cleanup if needed.
                    // The row should already be removed by handlePurchase.
                    // We might still want the SnackBar message.
                    $(`#${rowId}`).off('mouseenter mouseleave'); // Clean up potential jQuery listeners if any remain
                    SnackBar(`${this.name} ${upgradeType} upgrades completed!`);
                }

                // --- Update Theorycrafting (Upgrade Efficiency) string ---
                updateTheorycraftingEfficiencyUI();
            },
            successMessage: `${this.name} ${upgradeType} upgraded!`
        });
    }

    /**
     * Update the upgrade UI row for the next available upgrade.
     * @param {string} upgradeType - 'Gear' or 'Links'.
     * @param {Object} nextUpgrade - Next upgrade config.
     * @returns {void}
     */
    updateUpgradeUI(upgradeType, nextUpgrade) {
        const requirementsText = nextUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');
        const buttonId = `${this.name}${upgradeType}Btn`; // Define button ID

        // Generate cells HTML
        const cellsHTML = generateUpgradeCellsHTML(
            this.name,
            upgradeType,
            nextUpgrade.description.replace('{name}', this.name),
            `+${nextUpgrade.benefit} (${this.name})`,
            requirementsText,
            null, // No custom button text needed here
            buttonId // Pass the button ID
        );

        // Update row content
        const rowId = `${this.name}${upgradeType}Upgrade`;
        $(`#${rowId}`).html(cellsHTML);

        // Re-attach listener
        const btn = document.getElementById(buttonId);
        if (btn) {
            const handler = upgradeType === 'Gear' ? this.lvlGear.bind(this) : this.lvlLinks.bind(this);
            // Remove previous listener if any (important for updates)
            // A simple way is to replace the button node, or manage listeners carefully.
            // For simplicity here, let's assume replacing content implicitly removes old listeners
            // or we ensure handlers are idempotent if added multiple times (which they are here).
            // A cleaner way might involve storing and removing specific listeners if needed.
            btn.addEventListener('click', handler);
        }

        const hoverCurrencies = nextUpgrade.requirements.map(req => req.currency.name);
        // Use imported hoverUpgrades
        hoverUpgrades(`${this.name}${upgradeType}Upgrade`, ...hoverCurrencies);
    }

    /**
     * Called when the exile is recruited. Sets up initial upgrades and UI.
     * @returns {void}
     */
    onRecruited() {
        this.level += 1;
        this.dropRate += 0.1;
        $('.' + this.name + 'ActionSection').hide();
        $('.' + this.name + 'Hide').html('Level ' + this.level + ' ' + this.name);
        const firstGearUpgrade = this.gearUpgrades[0];
        const firstLinksUpgrade = this.linksUpgrades[0];

        // --- Gear Upgrade Setup ---
        const gearRowId = `${this.name}GearUpgrade`;
        const gearButtonId = `${this.name}GearBtn`;
        const gearRequirementsText = firstGearUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        if (!$(`#${gearRowId}`).length) {
            $("#UpgradeGearTable").append(`<tr id="${gearRowId}"></tr>`);
        }

        const gearCellsHTML = generateUpgradeCellsHTML(
            this.name,
            'Gear',
            firstGearUpgrade.description.replace('{name}', this.name),
            `+${firstGearUpgrade.benefit} (${this.name})`,
            gearRequirementsText,
            null,
            gearButtonId
        );
        $(`#${gearRowId}`).html(gearCellsHTML);
        const gearBtn = document.getElementById(gearButtonId);
        if (gearBtn) {
            gearBtn.addEventListener('click', this.lvlGear.bind(this));
        }

        // --- Links Upgrade Setup ---
        const linksRowId = `${this.name}LinksUpgrade`;
        const linksButtonId = `${this.name}LinksBtn`;
        const linksRequirementsText = firstLinksUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        if (!$(`#${linksRowId}`).length) {
            $("#UpgradeLinksTable").append(`<tr id="${linksRowId}"></tr>`);
        }

        const linksCellsHTML = generateUpgradeCellsHTML(
            this.name,
            'Links',
            firstLinksUpgrade.description.replace('{name}', this.name),
            `+${firstLinksUpgrade.benefit} (${this.name})`,
            linksRequirementsText,
            null,
            linksButtonId
        );
        $(`#${linksRowId}`).html(linksCellsHTML);
        const linksBtn = document.getElementById(linksButtonId);
        if (linksBtn) {
            linksBtn.addEventListener('click', this.lvlLinks.bind(this));
        }

        // --- Post-setup UI updates ---
        document.getElementsByClassName(this.name + 'Efficiency')[0].innerHTML = "x" + this.dropRate.toFixed(1);
        document.getElementsByClassName(this.name + 'Level')[0].innerHTML = this.level;
        const gearCurrencies = firstGearUpgrade.requirements.map(req => req.currency.name);
        const linksCurrencies = firstLinksUpgrade.requirements.map(req => req.currency.name);
        // Use imported hoverUpgrades
        hoverUpgrades(`${this.name}GearUpgrade`, ...gearCurrencies);
        hoverUpgrades(`${this.name}LinksUpgrade`, ...linksCurrencies);
    }

    /**
     * Reroll (prestige) this exile, resetting level and increasing reroll count.
     * Updates UI accordingly.
     * @returns {void}
     */
    rerollExile() {
        this.level = 1;
        this.rerollLevel += 100;
        this.exp = 0;
        this.expToLevel = 525;
        if (this.name !== 'Melvin') {
            $('.' + this.name + 'ActionSection').hide();
        } else {
            $(".MelvinRerollButton").addClass('hidden');
        }
        $('.' + this.name + 'Reroll').removeClass('hidden');
        const rerollElem = document.getElementsByClassName(this.name + 'Reroll')[0];
        if (rerollElem) rerollElem.innerHTML = '(+' + this.rerollLevel + ')';
        const expElem = document.getElementsByClassName(this.name + 'EXP')[0];
        if (expElem) expElem.innerHTML = "0/525";
        const levelElem = document.getElementsByClassName(this.name + 'Level')[0];
        if (levelElem) levelElem.innerHTML = "1";
    }
}

export { Exile };