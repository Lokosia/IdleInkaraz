import { handleGenericUpgrade, getMirrorUpgrade } from './ExileUtils.js'; // Import the new handler
// Import the refactored function
import { generateUpgradeCellsHTML } from '../ui/UpgradeUI.js';
import { SnackBar } from '../../../Main.js';

/**
 * Represents an Exile character in the game
 * Handles progression, upgrades, and UI interactions for a specific character
 */
class Exile {
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
     * Increases exile's experience and levels them up when threshold is reached
     * Updates drop rate based on level gains
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
     * Updates the exile's UI elements based on current state
     * Handles level 100 cap and reroll button display
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

    lvlGear() {
        this.upgradeExile('Gear', this.getNextGearUpgrade.bind(this), this.applyGearUpgrade.bind(this));
    }

    lvlLinks() {
        this.upgradeExile('Links', this.getNextLinksUpgrade.bind(this), this.applyLinksUpgrade.bind(this));
    }

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

    getNextLinksUpgrade(level, upgrades) {
        const currentIndex = upgrades.findIndex(upgrade => upgrade.level === level);
        if (currentIndex === -1) return null;
        return upgrades[currentIndex];
    }

    applyGearUpgrade(upgrade) {
        this.dropRate += upgrade.benefit;
    }

    applyLinksUpgrade(upgrade) {
        this.dropRate += upgrade.benefit;
        const linksElem = document.getElementsByClassName(this.name + 'Links')[0];
        if (linksElem) linksElem.innerHTML = upgrade.displayValue;
        // Final upgrade UI removal logic moved to upgradeExile's updateUI callback
    }

    // REFACTORED upgradeExile method
    upgradeExile(upgradeType, getNextUpgrade, applyUpgrade) {
        const propertyName = upgradeType.toLowerCase(); // 'gear' or 'links'
        const currentLevel = this[propertyName];
        const upgradesArrayName = propertyName + 'Upgrades'; // 'gearUpgrades' or 'linksUpgrades'
        const currentUpgrade = getNextUpgrade(currentLevel, this[upgradesArrayName]);

        if (!currentUpgrade) {
            console.warn(`No next ${upgradeType} upgrade found for ${this.name} at level ${currentLevel}`);
            // Optionally show a message if needed, but likely just means it's maxed or config error
            // SnackBar(`${upgradeType} upgrades already maxed or unavailable.`);
            return; // No upgrade available
        }

        handleGenericUpgrade({
            requirements: currentUpgrade.requirements,
            onSuccess: () => {
                applyUpgrade(currentUpgrade); // Apply benefit (e.g., increase dropRate, update links display)
                this[propertyName] += currentUpgrade.specialIncrement || 1; // Increment gear/links level
            },
            updateUI: () => {
                const nextUpgrade = getNextUpgrade(this[propertyName], this[upgradesArrayName]);
                if (nextUpgrade) {
                    this.updateUpgradeUI(upgradeType, nextUpgrade);
                } else {
                    // Handle final upgrade UI removal
                    const rowId = `${this.name}${upgradeType}Upgrade`;
                    $(`#${rowId}`).off('mouseenter mouseleave'); // Remove hover listeners
                    $(`#${rowId}`).remove(); // Remove the row
                    // Remove hover effect from related currency elements of the *last* upgrade
                    currentUpgrade.requirements.forEach(req => $(`.${req.currency.name}`).removeClass("hover"));
                    SnackBar(`${this.name} ${upgradeType} upgrades completed!`); // Specific completion message
                }
            },
            successMessage: `${this.name} ${upgradeType} upgraded!` // Specific success message
            // onFailure is handled by the default SnackBar in handleGenericUpgrade
        });
    }

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
        this.setupHover(upgradeType, ...hoverCurrencies);
    }

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
        this.setupHover("Gear", ...gearCurrencies);
        this.setupHover("Links", ...linksCurrencies);
    }

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

    setupHover(upgradeType, firstCurrency, secondCurrency = null) {
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

export { Exile };