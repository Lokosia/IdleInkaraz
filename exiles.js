/**
 * Exiles management module for Idle Inkaraz
 * Manages character (exile) creation, upgrades, and progression
 */

//---Main
var totalLevel = 0;
var dropRate = 0;
var playTime = 0;
var snackBarTimer = 0;

//---Define Class
import { ExileFactory } from './js/components/ExileFactory.js';

//---Define Exiles
var exileData = ExileFactory.createAllExiles();
window.Melvin = exileData.find(e => e.name === 'Melvin');
window.Singularity = exileData.find(e => e.name === 'Singularity');
window.Ascendant = exileData.find(e => e.name === 'Ascendant');
window.totalLevel = totalLevel;
window.exileData = exileData;
window.snackBarTimer = snackBarTimer;

/**
 * Main game loop that runs every 100ms
 * Updates exile levels, calculates total level and drop rate, and updates UI
 */
setInterval(function gameTick() {
    let tempLevel = 1000;
    let tempDropRate = upgradeDropRate;

    for (let i = 0; i < exileData.length; i++) {
        const exile = exileData[i];

        if (exile.level >= 1) {
            // Special exiles handling
            if (exile.name === 'Singularity' || exile.name === 'Artificer') {
                // Don't add to tempDropRate for special exiles
                // Don't add their levels to tempLevel
            } else {
                // Regular exile handling (including Melvin)
                exile.updateExileClass();
                tempDropRate += exile.dropRate;
                tempLevel += exile.level;
                tempLevel += exile.rerollLevel;
            }
        }
    }

    totalLevel = tempLevel;
    dropRate = tempDropRate;

    document.getElementsByClassName('TotalLevel')[0].innerHTML = "Levels: " + numeral(totalLevel).format('0,0');
    document.getElementsByClassName('TotalDR')[0].innerHTML = "Efficiency: x" + numeral(dropRate).format('0,0.0');

    snackBarTimer -= 100;
    playTime += 0.1;
    document.getElementById("timePlayed").innerHTML = numeral(playTime).format('00:00:00');
}, 100);

//---Unlocking Exiles
/**
 * Unified function to recruit any exile
 * @param {string} exileName - Name of the exile to recruit
 */
function recruitExile(exileName) {
    // Find the exile by name
    const exile = exileData.find(e => e.name === exileName);
    if (!exile) {
        console.error(`Exile ${exileName} not found`);
        return;
    }

    // Check level requirement
    if (totalLevel < exile.levelRequirement) {
        SnackBar("Requirements not met.");
        return;
    }

    // Check special requirement if any
    if (exile.specialRequirement) {
        let [reqType, reqValue] = exile.specialRequirement;
        if (window[reqType] !== reqValue) {
            SnackBar("Requirements not met.");
            return;
        }
    }

    // Handle special cases for certain exiles
    if (exileName === 'Singularity') {
        exile.level++;
        $(".SingularityHide").remove();
        $(".SingularityBuy").remove();
        $('.flip').removeClass('hidden');
        return;
    } else if (exileName === 'Artificer') {
        exile.level++;
        // Use hide() instead of remove() to be compatible with dynamic regeneration
        $(".ArtificerHide").hide();
        $(".ArtificerBuy").hide();
        // Update the exile's owned property to track recruitment state
        exile.owned = true;
        $(".craft").show();
        return;
    } else if (exileName === 'Melvin') {
        // Special case for Melvin who has a different HTML structure
        exile.level += 1;
        exile.dropRate += 0.1;
        
        // Hide Melvin's specific buy button container
        $(".MelvinBuy").hide();
        
        // Update Melvin's hide section
        $(".MelvinHide").html('Level ' + exile.level + ' ' + exile.name);
        
        // Get the first gear upgrade directly from gearUpgrades
        const firstGearUpgrade = exile.gearUpgrades[0];
        const requirementsText = firstGearUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        // Get the first links upgrade directly from linksUpgrades
        const firstLinksUpgrade = exile.linksUpgrades[0];
        const linksRequirementsText = firstLinksUpgrade.requirements
            .map(req => `${req.amount} ${req.currency.name}`)
            .join('<br>');

        $("#UpgradeGearTable").append(
            '<tr id="' + exile.name + 'GearUpgrade">' +
            '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + exile.name + 'GearButton" onclick="' + exile.name + '.lvlGear();">' + exile.name + ' Gear' + '</button></td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + firstGearUpgrade.description.replace('{name}', exile.name) + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">+' + firstGearUpgrade.benefit + ' (' + exile.name + ')</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + requirementsText + '</td>' +
            '</tr>'
        );
        $("#UpgradeLinksTable").append(
            '<tr id="' + exile.name + 'LinksUpgrade">' +
            '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + exile.name + 'LinksButton" onclick="' + exile.name + '.lvlLinks();">' + exile.name + ' Links</button></td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + firstLinksUpgrade.description.replace('{name}', exile.name) + '</td>' +
            '<td class="mdl-data-table__cell--non-numeric">+' + firstLinksUpgrade.benefit + ' (' + exile.name + ')</td>' +
            '<td class="mdl-data-table__cell--non-numeric">' + linksRequirementsText + '</td>' +
            '</tr>'
        );
        document.getElementsByClassName(exile.name + 'Efficiency')[0].innerHTML = "x" + exile.dropRate.toFixed(1);
        document.getElementsByClassName(exile.name + 'Level')[0].innerHTML = exile.level;

        // Enable reroll when Melvin reaches level 100
        if (exile.level == 100) {
            document.getElementsByClassName('MelvinEXP')[0].innerHTML = "Max";
            $(".MelvinRerollButton").removeClass('hidden');
        } else {
            // Normal leveling logic - make sure to update EXP display
            document.getElementsByClassName('MelvinEXP')[0].innerHTML = numeral(exile.exp).format('0,0') + "/" + numeral(exile.expToLevel).format('0,0');
        }

        // Setup hover effects for both gear and links
        const gearCurrencies = firstGearUpgrade.requirements.map(req => req.currency.name);
        const linksCurrencies = firstLinksUpgrade.requirements.map(req => req.currency.name);

        exile.setupHover("Gear", ...gearCurrencies);
        exile.setupHover("Links", ...linksCurrencies);
        return;
    }

    // Regular exile recruitment
    exile.recruitExile();
}

window.recruitExile = recruitExile;