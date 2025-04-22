import { CraftingItem, MirrorItem } from './CraftingItem.js';
import { fossilData } from '../delve/Fossil.js';
import { UICard } from '../Cards.js';
import Upgrades from '../Augments.js';
import { recruitExile } from '../../../Main.js';
import { currencyMap } from '../currency/CurrencyData.js'; // Import currencyMap if needed for checks

// Assuming componentHandler, $, numeral, and exileData are globally available
// declare var componentHandler: any;
// declare var $: any;
// declare var numeral: any;
// declare var exileData: any[];

class CraftingSystem {
    // Singleton instance property
    // Removed private modifier and type annotation
    static instance;

    // Removed type annotations
    craftingItems;
    mirrorItems;

    constructor() {
        // Singleton pattern
        if (CraftingSystem.instance) {
            return CraftingSystem.instance;
        }
        CraftingSystem.instance = this;

        // Initialize collections
        this.craftingItems = {};
        this.mirrorItems = {};

        this.initializeCraftingItems();
        this.initializeMirrorItems();
        this.startIntervals();

        // Initial UI render - Render structure first
        this.renderCraftingHeader();
        this.renderCraftingCards();
        // Defer conditional UI updates until after constructor completes
        // this.updateUIConditionally(); // Call this externally after instantiation
    }

    initializeCraftingItems() {
        // Definitions remain the same, using the CraftingItem constructor
        this.craftingItems = {
            flask: new CraftingItem('flask', 400,
                [{ currency: 'Transmutation', amount: 1 }, { currency: 'Alteration', amount: 20 }, { currency: 'Augmentation', amount: 10 }],
                { currency: 'Chaos', amount: 10 }
            ),
            gem: new CraftingItem('gem', 1600,
                [{ currency: 'GCP', amount: 20 }, { currency: 'Vaal', amount: 1 }],
                { currency: 'Chaos', amount: 40 }
            ),
            enchant: new CraftingItem('enchant', 1000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Enchanted', amount: 1 }],
                { currency: 'Chaos', amount: 25 }
            ),
            perfect: new CraftingItem('perfect', 2000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Perfect', amount: 1 }],
                { currency: 'Chaos', amount: 50 }
            ),
            chaos: new CraftingItem('chaos', 4000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Aberrant', amount: 1 }],
                { currency: 'Chaos', amount: 100 }
            ),
            cold: new CraftingItem('cold', 4000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Frigid', amount: 1 }],
                { currency: 'Chaos', amount: 100 }
            ),
            light: new CraftingItem('light', 4000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Metallic', amount: 1 }],
                { currency: 'Chaos', amount: 100 }
            ),
            fire: new CraftingItem('fire', 4000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Scorched', amount: 1 }],
                { currency: 'Chaos', amount: 100 }
            ),
            wand: new CraftingItem('wand', 10000,
                [{ currency: 'Primitive', amount: 1 }, { currency: 'Aetheric', amount: 1 }, { currency: 'Prismatic', amount: 1 }, { currency: 'Faceted', amount: 1 }],
                { currency: 'Chaos', amount: 250 }
            )
        };
    }

    initializeMirrorItems() {
        // Definitions remain the same, using the MirrorItem constructor
        this.mirrorItems = {
            mirrorSword: new MirrorItem('mirrorSword', [
                { currency: 'Primitive', amount: 50 }, { currency: 'Jagged', amount: 50 }, // Corrected Prime to Primitive based on other recipes
                { currency: 'Serrated', amount: 50 }, { currency: 'Shuddering', amount: 50 },
                { currency: 'Corroded', amount: 50 }, { currency: 'Eternal', amount: 25 },
                { currency: 'Exalted', amount: 500 }
            ]),
            mirrorShield: new MirrorItem('mirrorShield', [
                { currency: 'Awakener', amount: 1 }, { currency: 'Hunter', amount: 1 },
                { currency: 'Crusader', amount: 1 }, { currency: 'Potent', amount: 50 },
                { currency: 'Dense', amount: 50 }, { currency: 'Lucent', amount: 50 },
                { currency: 'Eternal', amount: 30 }, { currency: 'Exalted', amount: 600 }
            ]),
            mirrorChest: new MirrorItem('mirrorChest', [
                { currency: 'Awakener', amount: 1 }, { currency: 'Hunter', amount: 1 },
                { currency: 'Crusader', amount: 1 }, { currency: 'Primitive', amount: 50 }, // Corrected Prime to Primitive
                { currency: 'Jagged', amount: 50 }, { currency: 'Bound', amount: 50 },
                { currency: 'Pristine', amount: 50 }, { currency: 'Serrated', amount: 50 },
                { currency: 'Eternal', amount: 35 }, { currency: 'Exalted', amount: 700 }
            ])
        };
    }

    startIntervals() {
        // Intervals call the tick methods which delegate to items
        setInterval(() => this.craftingTick(), 300); // Standard crafts (30s total)
        setInterval(() => this.mirrorTick(), 600); // Mirror progress (60s total)

        // Use a single interval and method for updating all progress bars
        setInterval(() => this.updateAllProgressBars(), 300); // Check frequently

        // Fossil counts update remains a system-level task
        setInterval(() => this.updateFossilCounts(), 300);
    }

    // Tick for standard crafting items
    craftingTick() {
        Object.values(this.craftingItems).forEach(item => {
            // If not currently crafting, try to start a new craft (consumes ingredients)
            if (!item.isCrafting) {
                item.startCraft();
            }
            // Always call craft - it will only increment progress if isCrafting is true
            item.craft();
        });
    }

    // Tick for mirror items
    mirrorTick() {
        Object.values(this.mirrorItems).forEach(item => {
            item.craft();
        });
    }

    updateAllProgressBars() {
        const updateItemProgressBar = (item) => {
            // Only update the DOM if the item is active and its progress has changed
            if (item.isActive() && item.hasProgressChanged()) {
                item.updateProgressBar();
            }
        };

        Object.values(this.craftingItems).forEach(updateItemProgressBar);
        Object.values(this.mirrorItems).forEach(updateItemProgressBar);
    }

    // Update fossil counts in the UI (remains a system responsibility)
    updateFossilCounts() {
        // Ensure fossilData is loaded and elements exist
        if (!fossilData || fossilData.length === 0) return;

        fossilData.forEach(fossil => {
            const element = document.querySelector(`.${fossil.name}Total`); // Use querySelector for consistency
            if (element && typeof numeral !== 'undefined') {
                element.innerHTML = numeral(fossil.total).format('0,0');
            } else if (!element) {
                // console.warn(`Element for fossil count .${fossil.name}Total not found.`);
            }
        });
    }

    // Delegate buying to the specific crafting item
    buyCrafting(id) { // Removed type annotation
        if (this.craftingItems[id]) {
            const success = this.craftingItems[id].buy();
            // Optionally trigger a re-render or specific UI update if buy changes card structure
            // if (success) this.renderCraftingCards(); // Re-render might be too heavy, item.buy() handles basic UI changes
            return success;
        }
        console.error(`Crafting item with id ${id} not found for buying.`);
        return false;
    }

    // Delegate buying (initial craft) to the specific mirror item
    buyMirror(id) { // Removed type annotation
        if (this.mirrorItems[id]) {
            const success = this.mirrorItems[id].buy();
            // Optionally trigger a re-render or specific UI update
            // if (success) this.renderCraftingCards(); // Re-render might be too heavy, item.buy() handles basic UI changes
            return success;
        }
        console.error(`Mirror item with id ${id} not found for buying.`);
        return false;
    }

    // Render the cards for all crafting and mirror items
    renderCraftingCards() {
        const container = document.getElementById('crafting-cards-container');
        if (!container) {
            console.error('Crafting cards container not found!');
            return;
        }

        let cardsHTML = '';
        // Generate HTML for each crafting item
        Object.values(this.craftingItems).forEach(item => {
            cardsHTML += item.generateHTML();
        });
        // Generate HTML for each mirror item
        Object.values(this.mirrorItems).forEach(item => {
            cardsHTML += item.generateHTML();
        });

        // Add placeholder divs (if still needed by other logic)
        cardsHTML += `<div id="heavierCrafting" class="hidden"></div>
                      <div class="advancedCrafting hidden"></div>`;

        container.innerHTML = cardsHTML;

        // Upgrade MDL components on the newly added elements
        if (typeof componentHandler !== 'undefined') {
            try {
                 componentHandler.upgradeElements(container);
            } catch (e) {
                console.error("Error during componentHandler.upgradeElements:", e);
            }
        } else {
            console.warn("componentHandler not defined, skipping MDL upgrade.");
        }

        // Add event listeners for the research/craft buttons
        Object.values(this.craftingItems).forEach(item => {
            // Only add listener if the button exists (i.e., item is not yet active)
            if (!item.isActive()) {
                const btn = document.getElementById(`craft-research-btn-${item.id}`);
                if (btn) {
                    // Remove existing listener before adding a new one to prevent duplicates if re-rendered
                    btn.replaceWith(btn.cloneNode(true)); // Simple way to remove listeners
                    const newBtn = document.getElementById(`craft-research-btn-${item.id}`);
                    if (newBtn) newBtn.addEventListener('click', () => this.buyCrafting(item.id));
                }
            }
        });
        Object.values(this.mirrorItems).forEach(item => {
            // Only add listener if the button exists (i.e., item is not yet active)
            if (!item.isActive()) {
                const btn = document.getElementById(`craft-research-btn-${item.id}`);
                if (btn) {
                     // Remove existing listener before adding a new one
                    btn.replaceWith(btn.cloneNode(true));
                    const newBtn = document.getElementById(`craft-research-btn-${item.id}`);
                   if (newBtn) newBtn.addEventListener('click', () => this.buyMirror(item.id));
                }
            }
        });
    }

    // New method to handle UI updates based on Upgrades
    updateUIConditionally() {
        // Hide sections based on upgrades
        // Check if Upgrades is defined and accessible now
        if (typeof Upgrades !== 'undefined' && Upgrades.quadStashTab !== 1) {
            const heavierCrafting = document.getElementById('heavierCrafting');
            const advancedCrafting = document.querySelector('.advancedCrafting');
            if (heavierCrafting) heavierCrafting.style.display = 'none';
            if (advancedCrafting) advancedCrafting.style.display = 'none';
        } else {
            const heavierCrafting = document.getElementById('heavierCrafting');
            const advancedCrafting = document.querySelector('.advancedCrafting');
            // Ensure they are shown if the upgrade *is* present
            if (heavierCrafting) heavierCrafting.style.display = ''; // Reset display
            if (advancedCrafting) advancedCrafting.style.display = '';
        }
    }

    // Render the header/description section (remains system logic)
    renderCraftingHeader() {
        const container = document.getElementById('crafting-main-container');
        if (!container) {
             console.error('Crafting main container not found!');
            return;
        }

        // Check Artificer ownership
        const artificerOwned = typeof exileData !== 'undefined' &&
                               Array.isArray(exileData) &&
                               exileData.some(e => e.name === 'Artificer' && e.owned === true);

        // Use UICard for Artificer and description cards
        const artificerCard = UICard.create({
            id: 'artificer-card',
            title: 'The Artificer',
            content: 'The hideout warrior.<br>',
            actionSections: !artificerOwned ? [
                { content: `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="ArtificerRecruitBtn">Recruit The Artificer</button>`, className: 'mdl-card__actions mdl-card--border ArtificerBuy' },
                { content: '1000 Total Levels Required<br>Quad Stash Tab Required', className: 'mdl-card__actions mdl-card--border ArtificerHide' }
            ] : [],
            size: 'third',
            extraClasses: ['cardBG', 'artificer']
        });

        const descriptionCard = UICard.create({
            id: 'crafting-description-card',
            title: 'Gear Crafting',
            content: `<p>Use the resources that the guild farms to produce high valued items.</p>
                <p>Research a crafting method to unlock it.</p>
                <p>Crafts are completed (then sold) every 30 seconds (assuming 100 progress).<br>Items are mirrored every 60 seconds (assuming 100 progress), the mirror fee increases by 5 Exalted every time.</p>`, // Updated description slightly
            size: 'half',
            extraClasses: ['cardBG', 'imgBG']
        });

        // Clear container and append new cards
        container.innerHTML = '';
        container.appendChild(artificerCard); // Appending DOM elements directly is better than innerHTML += for complex objects
        container.appendChild(descriptionCard);

        // Upgrade MDL components
        if (typeof componentHandler !== 'undefined') {
            componentHandler.upgradeElements(container);
        }

        // Add event listener for Artificer recruit button if it exists
        if (!artificerOwned) {
            const recruitBtn = document.getElementById('ArtificerRecruitBtn');
            if (recruitBtn) {
                // Ensure recruitExile function exists before adding listener
                if (typeof recruitExile === 'function') {
                     // Remove potential existing listener before adding
                    recruitBtn.replaceWith(recruitBtn.cloneNode(true));
                    const newRecruitBtn = document.getElementById('ArtificerRecruitBtn');
                    if (newRecruitBtn) newRecruitBtn.addEventListener('click', () => recruitExile('Artificer'));
                } else {
                    console.warn('recruitExile function not found.');
                }
            }
        }
    }
}

// Export the class for use elsewhere (e.g., in Main.js to instantiate)
export { CraftingSystem };

const craftingSystem = new CraftingSystem();
export default craftingSystem;