// ConquerorUpgrades.js
// Handles conqueror upgrades system logic and UI
import State from '../../../State.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from '../../ui/UpgradeUI.js';
import { hoverUpgrades, removeHoverCurrencies } from '../../currency/HoverState.js';
import { select, findByClass, show, hide, on } from '../../../../js/libs/DOMUtils.js';

// Track which conqueror rows have been rendered to avoid re-applying hover effects
const renderedRows = new Set();

/**
 * Handles the purchase of a conqueror upgrade.
 * Consumes a conqueror currency, increases upgrade drop rate, updates UI, and shows a success message.
 *
 * @param {Object} conqueror - The conqueror currency object (should have name and total).
 * @returns {void}
 */
export function buyConqueror(conqueror) {
    const rowId = `${conqueror.name}Upgrade`;
    const row = select(`#${rowId}`);
    if (!row) {
        console.error(`Conqueror upgrade row ${rowId} not found.`);
        return;
    }

    // Track if the row is being hovered before purchase
    const isBeingHovered = row.querySelector(':hover') !== null;

    handlePurchase({
        requirements: [{ currency: conqueror, amount: 1 }],
        onSuccess: () => {
            State.upgradeDropRate += 1;
        },
        uiUpdateConfig: {
            rowElement: row,
            // No cost/benefit elements to update dynamically after purchase
            getNextLevelData: () => null, // Signal that this is a one-time purchase (per orb)
            removeRowOnMaxLevel: false, // Don't remove the row, just hide it (handled in updateUI)
            // Use standard hover cleanup pattern and preserve hover if the row is being hovered
            preserveHover: isBeingHovered,
            hoverClassesToRemoveOnMaxLevel: [conqueror.name]
        },
        updateUI: () => {
            // Update global drop rate display
            const globalRateElem = findByClass('UpgradeDropRate')[0];
            if (globalRateElem) {
                globalRateElem.innerHTML = State.upgradeDropRate.toFixed(1);
            }
            // Hide the row if the currency is now depleted
            if (conqueror.total < 1) {
                hide(row);
                // Use the standard hover cleanup function rather than manual DOM manipulation
                removeHoverCurrencies(conqueror.name);
                // Remove from rendered set when hidden
                renderedRows.delete(rowId);
            } 
            // If the row is still visible and it was being hovered, make sure it stays in rendered set
            else if (isBeingHovered) {
                renderedRows.add(rowId);
            }
        },
        successMessage: 'Conqueror influence consumed!'
    });
}

/**
 * Apply hover effects for a conqueror upgrade row
 * @param {string} rowId - The ID of the row element
 * @param {string} currencyName - The currency name to hover
 */
function applyConquerorHover(rowId, currencyName) {
    hoverUpgrades(rowId, currencyName);
}

/**
 * Renders conqueror upgrade rows in the upgrade table and attaches event listeners.
 * Shows/hides rows based on currency availability and applies hover effects.
 *
 * @returns {void}
 */
export function renderConquerorUpgrades() {
    const conquerors = [
        currencyMap['Crusader'],
        currencyMap['Hunter'],
        currencyMap['Redeemer'],
        currencyMap['Warlord']
    ];

    for (const currency of conquerors) {
        const name = currency.name;
        const rowId = `${name}Upgrade`;
        
        // Check if the row needs to be created
        let row = select(`#${rowId}`);
        if (!row) {
            // Create new row
            row = document.createElement('tr');
            row.id = rowId;
            
            const buttonId = `btn-${name.toLowerCase()}-upgrade`;
            const buttonText = `${name}'s Exalted Orb`;
            const description = `Use ${name}'s Exalted Orb`;
            const benefit = '+1';
            const cost = `1 ${name}'s Exalted Orb`;

            const cellsHTML = generateUpgradeCellsHTML(
                name,           // upgradeKey
                'Conqueror',    // upgradeType
                description,
                benefit,
                cost,           // requirements text
                buttonText,
                buttonId
            );

            row.innerHTML = cellsHTML;
            
            // Add row to the table
            const table = select('#UpgradeTable');
            if (table) {
                table.insertBefore(row, table.firstChild);
                
                const button = select(`#${buttonId}`);
                if (button) {
                    on(button, 'click', () => buyConqueror(currency));
                }
            }
        }
        
        // Show or hide the row based on currency availability
        if (currency && currency.total >= 1) {
            show(row);
            
            // Only apply hover effects if this is the first time rendering the row
            // or if it was previously hidden and now shown again
            if (!renderedRows.has(rowId)) {
                applyConquerorHover(rowId, name);
                renderedRows.add(rowId);
            }
        } else {
            hide(row);
            // Ensure hover is removed when hidden
            removeHoverCurrencies(name);
            // Remove from rendered set when hidden
            renderedRows.delete(rowId);
        }
    }
}
