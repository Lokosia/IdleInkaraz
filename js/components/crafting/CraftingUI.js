import { CraftingSystem } from './CraftingSystem.js';

// Initialize crafting system
const craftingSystem = new CraftingSystem();
export default craftingSystem;

// Call renderCraftingCards on page load to ensure cards are available for tests
document.addEventListener('DOMContentLoaded', function() {
    // We'll only render the cards if we're on the crafting tab
    if (typeof $ !== 'undefined' && $("#crafting").is(":visible")) {
        craftingSystem.renderCraftingCards();
    }
});
