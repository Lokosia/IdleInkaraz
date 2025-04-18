import { CraftingSystem } from './js/components/CraftingSystem.js';

// Initialize crafting system
const craftingSystem = new CraftingSystem();
window.craftingSystem = craftingSystem;
// Call renderCraftingCards on page load to ensure cards are available for tests
document.addEventListener('DOMContentLoaded', function() {
    // We'll only render the cards if we're on the crafting tab
    if ($("#crafting").is(":visible")) {
        craftingSystem.renderCraftingCards();
    }
});