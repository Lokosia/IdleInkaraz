import State from './State.js';
import { currencyMap } from './components/currency/CurrencyData.js';
import { updateCurrencyClass } from './components/currency/CurrencyUI.js';
import { getDelveState, setDelveLoadingProgress, delve } from './components/delve/DelveSystem.js';
import { upgradeConfigs, renderUpgradeRow } from './components/upgrades/Augments.js';
import MapCurrencyUpgradeSystem from './components/upgrades/MapCurrency/MapCurrencyUpgradeSystem.js';
import { renderConquerorUpgrades } from './components/upgrades/Conquerors/ConquerorUpgrades.js';
import { currencyData } from './components/currency/CurrencyData.js';
// Import DOM utilities
import { select, selectAll, findByClass } from './libs/DOMUtils.js';

/**
 * Starts all main game loops, including:
 * - Main game tick (exile progression, currency drops, UI updates)
 * - Delve system tick
 * - Delve loading bar animation
 * - Upgrade/UI/flipping logic
 *
 * @returns {void}
 */
function startGameLoops() {
    // Main game loop
    setInterval(function gameTick() {
        let tempLevel = 1000;
        let tempDropRate = 0;
        let totalGearAndLinksBonus = 0;
        
        // Add global upgrade rate
        if (State.upgradeDropRate > 0) tempDropRate += State.upgradeDropRate;
        
        // Add incubator bonus - ensure it's always counted
        if (State.incDropRate > 0) tempDropRate += State.incDropRate;
        
        for (let i = 0; i < State.exileData.length; i++) {
            const exile = State.exileData[i];
            if (exile.level >= 1) {
                if (exile.name === 'Singularity' || exile.name === 'Artificer') {
                    // Don't add to tempDropRate for special exiles
                } else {
                    exile.updateExileClass();
                    tempDropRate += exile.dropRate;
                    tempLevel += exile.level;
                    tempLevel += exile.rerollLevel;
                }
            }
        }
        
        State.totalLevel = tempLevel;
        State.dropRate = tempDropRate;
        
        // Use findByClass instead of getElementsByClassName
        const totalLevelElement = findByClass('TotalLevel')[0];
        if (totalLevelElement) {
            totalLevelElement.innerHTML = "Levels: " + numeral(tempLevel).format('0,0');
        }
        const totalDRElement = findByClass('TotalDR')[0];
        if (totalDRElement) {
            totalDRElement.innerHTML = "Efficiency: x" + numeral(tempDropRate).format('0,0.0');
        }
        
        // Use select instead of getElementById
        const timePlayedElement = select('#timePlayed');
        if (timePlayedElement) {
            timePlayedElement.innerHTML = numeral(State.playTime).format('00:00:00');
        }
        
        State.snackBarTimer -= 100;
        State.playTime += 0.1;
        
        for (let i = 0; i < State.exileData.length; i++) {
            const exile = State.exileData[i];
            if (exile.dropRate > 0) {
                // For each currency, try to roll a drop for this exile
                for (let j = 0; j < currencyData.length; j++) {
                    currencyData[j].rollCurrency(exile);
                }
            }
        }
        updateCurrencyClass();
    }, 100);

    // Delve system integration
    setInterval(function delveTick() {
        if (State.exileMap['Melvin'] && State.exileMap['Melvin'].level >= 1 && currencyMap['Sulphite']) {
            delve(currencyMap['Sulphite'], State.exileMap['Melvin'], State.upgradeDropRate || 0);
        }
    }, 2500);

    // Delve loading bar animation
    setInterval(function delveLoadingBarAnimate() {
        const { delveLoadingProgress, isDelving } = getDelveState();
        // Use select instead of querySelector
        const delveLoader = select('#delveLoader');
        if (!isDelving) {
            if (delveLoader && delveLoader.MaterialProgress) {
                delveLoader.MaterialProgress.setProgress(0);
            }
            return;
        }
        if (delveLoader) {
            delveLoader.classList.remove('hidden');
            delveLoader.style.display = 'block';
            if (typeof componentHandler !== 'undefined') {
                try {
                    componentHandler.upgradeElement(delveLoader);
                } catch (e) {
                    console.error('Error upgrading MDL component:', e);
                }
            }
            if (delveLoader.MaterialProgress) {
                const increment = 100 / (2500 / 100);
                const newProgress = Math.min(delveLoadingProgress + increment, 100);
                setDelveLoadingProgress(newProgress);
                delveLoader.MaterialProgress.setProgress(newProgress);
                if (newProgress >= 100) {
                    setDelveLoadingProgress(0);
                    delveLoader.MaterialProgress.setProgress(0);
                }
            } else {
                console.warn('MaterialProgress is not initialized on delveLoader.');
            }
        } else {
            console.error('delveLoader element not found.');
        }
    }, 100);

    // Upgrade/UI/Flipping Loop
    setInterval(function updateTick() {
        for (const cfg of upgradeConfigs) {
            renderUpgradeRow(cfg, State.totalLevel);
        }
        MapCurrencyUpgradeSystem.showOrUpdateMapCurrencyUpgrade(
            MapCurrencyUpgradeSystem.getUpgradeDropRate,
            MapCurrencyUpgradeSystem.setUpgradeDropRate
        );
        renderConquerorUpgrades(State);
        
        // Update Flipping Speed display in the Flipping tab
        // Use select instead of querySelector
        const flipSpeedDisplayElem = select('#divFlipping .flipSpeedMulti');
        if (flipSpeedDisplayElem) {
            flipSpeedDisplayElem.innerHTML = State.flippingSpeed;
        }
        
        // Run map currency logic
        MapCurrencyUpgradeSystem.rollMapCurrency(
            MapCurrencyUpgradeSystem.getUpgradeDropRate,
            MapCurrencyUpgradeSystem.getDivStashTab
        );
        
        // Flipping logic: process buy/sell every 500ms (flipping speed applies per tick)
        currencyData.forEach(currency => currency.sellCurrency());
        currencyData.forEach(currency => currency.buyCurrency());
        
        // No need to synchronize state anymore as we're using a centralized State object
    }, 500);
}

export { startGameLoops };