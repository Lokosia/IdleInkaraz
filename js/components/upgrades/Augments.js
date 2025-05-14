import State, { subscribe } from '../../State.js';
import { SnackBar } from '../../UIInitializer.js';
import { hoverUpgrades } from '../currency/HoverState.js';
import { currencyMap, currencyData } from '../currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from '../ui/UpgradeUI.js';
import MapCurrencyUpgradeSystem from './MapCurrency/MapCurrencyUpgradeSystem.js';
import { renderConquerorUpgrades } from './Conquerors/ConquerorUpgrades.js';
import { stashTabUpgradeConfigs } from './StashTab/StashTabUpgrades.js';
import { IIQUpgradeConfig } from './IIQ/IIQUpgrade.js';
import IncubatorUpgradeConfig from './Incubator/IncubatorUpgrade.js';
import createFlipSpeedUpgrade from './FlipSpeed/FlipSpeedUpgrade.js';
import DelveScarabUpgradeConfig from './Scarabs/DelveScarabUpgrade.js';
import { select, on } from '../../../js/libs/DOMUtils.js';

/**
 * Formats an efficiency value as an integer if whole, or as a float otherwise.
 * @param {number} val - The efficiency value.
 * @returns {string|number} Formatted efficiency value.
 */
function formatEfficiency(val) {
    return Number.isInteger(val) ? val : val.toFixed(1);
}

/**
 * Increments the global upgrade drop rate by 1.
 * @returns {void}
 */
function incUpgradeDropRate() { 
    State.upgradeDropRate += 1; 
}

/**
 * Shows the delve scarab upgrade if conditions are met.
 * @returns {void}
 */
function checkDelveScarabUpgrade() {
    if (State.delveStashTab === 1 && !State.delveScarabShown) {
        renderUpgradeRow(upgradeConfigs.find(c => c.key === 'delveScarab'));
    }
}

// Set up accessors for MapCurrencyUpgradeSystem to interact with State
MapCurrencyUpgradeSystem.getUpgradeDropRate = () => State.upgradeDropRate;
MapCurrencyUpgradeSystem.setUpgradeDropRate = val => { State.upgradeDropRate = val; };
MapCurrencyUpgradeSystem.getDivStashTab = () => State.divStashTab;

// Subscribe to relevant state changes
subscribe('delveStashTab', checkDelveScarabUpgrade);

// --- Upgrade Configurations --- 
/**
 * Array of all upgrade configuration objects for the game.
 * @type {Array<Object>}
 */
const upgradeConfigs = [
    IIQUpgradeConfig,
    IncubatorUpgradeConfig,
    createFlipSpeedUpgrade(),
    // Stash tab upgrades (imported)
    // We're not using incUpgradeDropRate here because StashTabUpgrades.js already handles this
    ...stashTabUpgradeConfigs.map(cfg => ({
        ...cfg,
        buy: () => cfg.buy(null) // Pass null instead of incUpgradeDropRate to avoid double incrementing
    })),
    DelveScarabUpgradeConfig
];

/**
 * Renders a row in the upgrade table for a given upgrade configuration.
 * Handles dynamic values, attaches event listeners, and marks upgrades as shown.
 *
 * @param {Object} cfg - The upgrade configuration object.
 * @param {number} [totalLevel] - Optional total level for unlock checks.
 * @returns {void}
 */
function renderUpgradeRow(cfg, totalLevel) {
    if (State[cfg.shownFlag]) return;
    if (!cfg.unlock(totalLevel)) return;

    // Only create and append the row if it does not already exist
    let row = select(`#${cfg.rowId}`);
    if (!row) {
        row = document.createElement('tr');
        row.id = cfg.rowId;
        // Append the row to the table
        const upgradeTable = select('#UpgradeTable');
        if (upgradeTable) {
            upgradeTable.appendChild(row);
        }
    }

    // Evaluate dynamic values
    const buttonText = typeof cfg.buttonText === 'function' ? cfg.buttonText() : cfg.buttonText;
    const description = typeof cfg.description === 'function' ? cfg.description() : cfg.description;
    const benefit = cfg.benefit();
    const costText = typeof cfg.costText === 'function' ? cfg.costText() : cfg.costText;

    // Generate the inner HTML using the new function
    const cellsHTML = generateUpgradeCellsHTML(
        cfg.key,
        'Augment', // Use a generic type or derive if needed
        description,
        benefit,
        costText,
        buttonText,
        cfg.buttonId // Pass the specific button ID from config
    );

    // Set the inner HTML of the row
    row.innerHTML = cellsHTML;

    // Add CSS classes to specific cells if needed (using the row's children)
    if (cfg.benefitClass && row.children[2]) {
        row.children[2].classList.add(cfg.benefitClass);
    }
    if (cfg.costClass && row.children[3]) {
        row.children[3].classList.add(cfg.costClass);
    }

    // Apply hover effects
    cfg.hover();

    // Attach the click listener to the button using its ID
    const button = select(`#${cfg.buttonId}`);
    if (button) {
        on(button, 'click', cfg.buy);
    }

    // Mark as shown
    State[cfg.shownFlag] = true;
}

/**
 * Updates the Theorycrafting (Upgrade Efficiency) UI string to reflect the sum of all sources.
 * Includes global upgrades, incubator, and only the gear/links upgrades of exiles (excluding level bonuses).
 */
function updateTheorycraftingEfficiencyUI() {
    const elem = document.querySelector('.UpgradeDropRate');
    if (!elem || !State.exileMap) return;
    
    // Calculate total upgrade efficiency only (excluding level-based bonuses)
    // Start with global upgrade rate + incubator bonus
    let total = State.upgradeDropRate + (State.incDropRate || 0);
    
    // Add the contribution from gear and links upgrades (not the base levels)
    Object.values(State.exileMap).forEach(exile => {
        if (exile && exile.owned) {
            // Count benefits from gear upgrades
            if (exile.gear > 0 && exile.gearUpgrades) {
                exile.gearUpgrades.forEach(upgrade => {
                    if (upgrade.level < exile.gear) {
                        total += upgrade.benefit;
                    }
                });
            }
            
            // Count benefits from links upgrades
            if (exile.links > 0 && exile.linksUpgrades) {
                exile.linksUpgrades.forEach(upgrade => {
                    if (upgrade.level < exile.links) {
                        total += upgrade.benefit;
                    }
                });
            }
        }
    });
    
    elem.innerHTML = formatEfficiency(total);
}

export { upgradeConfigs, renderUpgradeRow, formatEfficiency, incUpgradeDropRate, updateTheorycraftingEfficiencyUI };

// For backward compatibility, re-export State as Upgrades
export default State;