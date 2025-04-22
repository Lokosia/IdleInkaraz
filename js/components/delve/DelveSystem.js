// DelveSystem.js - Contains delving state and logic
import { fossilData } from './Fossil.js';

let sulphiteDepth = 1;
let sulphiteCost = 110;
let delveLoadingProgress = 0;

function rollFossilTick(dropRate, upgradeDropRate) {
    for (let i = 0; i < fossilData.length; i++) {
        fossilData[i].rollFossil(dropRate, upgradeDropRate);
    }
}

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

// In the loading bar animation, hide the bar when done
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

function getDelveState() {
    return {
        sulphiteDepth,
        sulphiteCost,
        delveLoadingProgress,
        isDelving: delveLoadingProgress > 0 // Add isDelving property
    };
}

function setDelveLoadingProgress(val) {
    delveLoadingProgress = val;
}

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