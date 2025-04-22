import { CraftingSystem } from './CraftingSystem.js';
import UIManager from '../ui/UIManager.js';
import craftingSystem from './CraftingSystem.js';

/**
 * Handles the logic for showing the crafting section.
 * Renders the crafting header and cards, and applies visibility rules.
 */
function showCrafting(exileData, Upgrades) {
    UIManager.show('crafting');

    // Render the crafting header and cards
    craftingSystem.renderCraftingHeader();
    craftingSystem.renderCraftingCards();

    // Check if the Artificer is owned
    const artificerOwned = exileData.some(e => e.name === 'Artificer' && e.owned);
    if (artificerOwned) {
        $(".ArtificerBuy, .ArtificerHide").hide();
        $(".craft").css("display", "block").show();
    } else {
        $(".craft").hide();
    }

    // Check for Quad Stash Tab requirement
    if (Upgrades.quadStashTab !== 1) {
        $("#heavierCrafting, .advancedCrafting").hide();
    }
}

export { showCrafting };

export default craftingSystem;

// Call renderCraftingCards on page load to ensure cards are available for tests
document.addEventListener('DOMContentLoaded', function() {
    // We'll only render the cards if we're on the crafting tab
    if (typeof $ !== 'undefined' && $("#crafting").is(":visible")) {
        craftingSystem.renderCraftingCards();
    }
});
