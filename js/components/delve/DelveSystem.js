// DelveSystem.js - Contains delving state and logic
import { fossilData } from './Fossil.js';

let sulphiteDepth = 1;
let sulphiteCost = 110;
let delveLoadingProgress = 0;

/**
 * Rolls for fossil drops for all fossils using the provided drop rates.
 * @param {number} dropRate - The drop rate of the delving exile (Melvin).
 * @param {number} upgradeDropRate - The global upgrade drop rate.
 * @returns {void}
 */
function rollFossilTick(dropRate, upgradeDropRate) {
    for (let i = 0; i < fossilData.length; i++) {
        fossilData[i].rollFossil(dropRate, upgradeDropRate);
    }
}

/**
 * Handles a delve action: spends sulphite, increases depth, updates costs, and rolls fossils.
 * Also updates UI and triggers the loading bar.
 * @param {Object} Sulphite - The sulphite currency object.
 * @param {Object} Melvin - The Melvin exile object.
 * @param {number} upgradeDropRate - The global upgrade drop rate.
 * @returns {void}
 */
function delve(Sulphite, Melvin, upgradeDropRate) {
    if (Sulphite.total >= sulphiteCost) {
                Sulphite.total -= sulphiteCost;
        sulphiteCost = Math.floor((50 + sulphiteDepth) * 2.2);
        sulphiteDepth++;
        Melvin.dropRate += 0.05;
        delveLoadingProgress = 1;
        // Show the loading bar when delving starts
        const loader = document.getElementById('delveLoader');
        if (loader) loader.classList.remove('hidden');

        document.getElementsByClassName('Sulphite')[0].innerHTML = numeral(Sulphite.total).format('0,0');
        document.getElementsByClassName('SulphiteDepth')[0].innerHTML = numeral(sulphiteDepth).format('0,0');
        document.getElementsByClassName('SulphiteCost')[0].innerHTML = numeral(sulphiteCost).format('0,0');
        document.getElementsByClassName('MelvinEfficiency')[0].innerHTML = "x" + numeral(Melvin.dropRate).format('0,0.0');

        rollFossilTick(Melvin.dropRate, upgradeDropRate);
    }
}

/**
 * Animates the delve loading bar and hides it when complete.
 * @returns {void}
 */
function delveLoadingBarAnimate() {
    const { delveLoadingProgress } = getDelveState();
    if (delveLoadingProgress >= 1) {
        incrementDelveLoadingProgress(5);
        let e = document.querySelector('#delveLoader');
        if (e && e.MaterialProgress) {
            componentHandler.upgradeElement(e);
            e.MaterialProgress.setProgress(getDelveState().delveLoadingProgress);
            if (getDelveState().delveLoadingProgress >= 100) {
                setDelveLoadingProgress(0);
                e.MaterialProgress.setProgress(0);
                // Hide the loading bar when done
                e.classList.add('hidden');
            }
        }
    }
}

/**
 * Gets the current delve state (depth, cost, progress, and delving status).
 * @returns {Object} The current delve state.
 */
function getDelveState() {
    return {
        sulphiteDepth,
        sulphiteCost,
        delveLoadingProgress,
        isDelving: delveLoadingProgress > 0 // Add isDelving property
    };
}

/**
 * Sets the delve loading progress value.
 * @param {number} val - The new progress value.
 * @returns {void}
 */
function setDelveLoadingProgress(val) {
    delveLoadingProgress = val;
}

/**
 * Increments the delve loading progress value.
 * @param {number} val - The amount to increment progress by.
 * @returns {void}
 */
function incrementDelveLoadingProgress(val) {
    delveLoadingProgress += val;
}

export {
    delve,
    rollFossilTick,
    getDelveState,
    setDelveLoadingProgress,
    incrementDelveLoadingProgress,
    delveLoadingBarAnimate
};