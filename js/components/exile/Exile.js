import { processUpgrade, getMirrorUpgrade } from './ExileUtils.js';
import { generateUpgradeHTML } from './ExileUI.js';
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
        if (upgrade.finalUpgrade) {
            $(".hover").removeClass("hover");
            $(`#${this.name}LinksUpgrade`).off('mouseenter mouseleave');
            $('#' + this.name + 'LinksUpgrade').remove();
            SnackBar(this.name + " Links upgrades completed!");
        }
    }

    upgradeExile(upgradeType, getNextUpgrade, applyUpgrade) {
        const propertyName = upgradeType.toLowerCase();
        const currentLevel = this[propertyName];
        const upgradesArrayName = propertyName + 'Upgrades';
        const currentUpgrade = getNextUpgrade(currentLevel, this[upgradesArrayName]);
        if (!currentUpgrade) return;
        const success = processUpgrade(currentUpgrade, (upgrade) => {
            applyUpgrade(upgrade);
            this[propertyName] += upgrade.specialIncrement || 1;
            const nextUpgrade = getNextUpgrade(this[propertyName], this[upgradesArrayName]);
            if (nextUpgrade) {
                this.updateUpgradeUI(upgradeType, nextUpgrade);
            }
            SnackBar(this.name + " " + upgradeType + " upgraded!");
        });
        if (!success) {
            SnackBar("Requirements not met.");
        }
    }

    updateUpgradeUI(upgradeType, nextUpgrade) {
        const requirementsText = nextUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');
        generateUpgradeHTML(
            this.name,
            upgradeType,
            nextUpgrade.description.replace('{name}', this.name),
            `+${nextUpgrade.benefit} (${this.name})`,
            requirementsText,
            this
        );
        const hoverCurrencies = nextUpgrade.requirements.map(req => req.currency.name);
        this.setupHover(upgradeType, ...hoverCurrencies);
    }

    onRecruited() {
        this.level += 1;
        this.dropRate += 0.1;
        $('.' + this.name + 'ActionSection').hide();
        $('.' + this.name + 'Hide').html('Level ' + this.level + ' ' + this.name);
        const firstGearUpgrade = this.gearUpgrades[0];
        const requirementsText = firstGearUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');
        const firstLinksUpgrade = this.linksUpgrades[0];
        const linksRequirementsText = firstLinksUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');
        $("#UpgradeGearTable").append(
            '<tr id="' + this.name + 'GearUpgrade">' +
            '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + this.name + 'GearButton" id="' + this.name + 'GearBtn">' + this.name + ' Gear' + '</button></td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + firstGearUpgrade.description.replace('{name}', this.name) + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">+' + firstGearUpgrade.benefit + ' (' + this.name + ')</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + requirementsText + '</td>' +
            '</tr>'
        );
        $("#UpgradeLinksTable").append(
            '<tr id="' + this.name + 'LinksUpgrade">' +
            '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + this.name + 'LinksButton" id="' + this.name + 'LinksBtn">' + this.name + ' Links' + '</button></td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + firstLinksUpgrade.description.replace('{name}', this.name) + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">+' + firstLinksUpgrade.benefit + ' (' + this.name + ')</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + linksRequirementsText + '</td>' +
            '</tr>'
        );
        // Add event listeners for Gear and Links upgrade buttons
        const gearBtn = document.getElementById(this.name + 'GearBtn');
        if (gearBtn && typeof this.lvlGear === 'function') {
            gearBtn.addEventListener('click', () => this.lvlGear());
        }
        const linksBtn = document.getElementById(this.name + 'LinksBtn');
        if (linksBtn && typeof this.lvlLinks === 'function') {
            linksBtn.addEventListener('click', () => this.lvlLinks());
        }
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