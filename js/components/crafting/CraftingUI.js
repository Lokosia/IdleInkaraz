import { CraftingSystem } from './CraftingSystem.js';
import UIManager from '../ui/UIManager.js';
import craftingSystem from './CraftingSystem.js';
import { select, selectAll, show, hide } from '../../../js/libs/DOMUtils.js';

/**
 * Handles the logic for showing the crafting section.
 * Renders the crafting header and cards, and applies visibility rules based on Artificer ownership and upgrades.
 *
 * @param {Array<Object>} exileData - Array of exile objects (to check Artificer ownership).
 * @param {Object} Upgrades - Upgrades state object (to check stash tab requirements).
 * @returns {void}
 */
function showCrafting(exileData, Upgrades) {
    UIManager.show('crafting');

    // Render the crafting header and cards
    craftingSystem.renderCraftingHeader();
    craftingSystem.renderCraftingCards();

    // Check if the Artificer is owned
    const artificerOwned = exileData.some(e => e.name === 'Artificer' && e.owned);
    if (artificerOwned) {
        // Replace jQuery with vanilla JS
        selectAll(".ArtificerBuy, .ArtificerHide").forEach(el => {
            el.style.display = 'none';
        });
        
        selectAll(".craft").forEach(el => {
            el.style.display = 'block';
        });
    } else {
        selectAll(".craft").forEach(el => {
            el.style.display = 'none';
        });
    }

    // Check for Quad Stash Tab requirement
    if (Upgrades.quadStashTab !== 1) {
        // Replace jQuery with vanilla JS
        const heavierCrafting = select("#heavierCrafting");
        if (heavierCrafting) heavierCrafting.style.display = 'none';
        
        selectAll(".advancedCrafting").forEach(el => {
            el.style.display = 'none';
        });
    }
}

export { showCrafting };

export default craftingSystem;

// Call renderCraftingCards on page load to ensure cards are available for tests
document.addEventListener('DOMContentLoaded', function() {
    // We'll only render the cards if we're on the crafting tab
    // Replace jQuery check with vanilla JS
    if (select("#crafting") && select("#crafting").style.display !== 'none') {
        craftingSystem.renderCraftingCards();
    }
});
