import { UICard } from '../ui/Cards.js';
import { currencyMap } from '../currency/CurrencyData.js';
import { SnackBar } from '../../UIInitializer.js';
import { fossilData } from '../delve/Fossil.js';
import { handlePurchase } from '../shared/PurchaseUtils.js';


/**
 * Represents a crafting item in the game.
 * Handles research, crafting progress, ingredient checks, and UI updates.
 *
 * @class
 * @property {string} id - Unique identifier for the crafting item.
 * @property {number} level - Research state (-1 = not researched, 0+ = active).
 * @property {number} progress - Current crafting progress (0-100).
 * @property {number} researchCost - Chaos cost to research/unlock this item.
 * @property {Array<Object>} ingredients - List of required ingredients for crafting.
 * @property {Object} reward - Reward for completing a craft ({currency, amount}).
 * @property {number} progressInterval - Interval for progress ticks (ms).
 * @property {number} totalCrafted - Total number of times this item has been crafted.
 * @property {string} displayName - User-friendly display name.
 * @property {number} lastProgressUpdate - Last progress value sent to UI.
 * @property {boolean} isCrafting - Whether this item is currently being crafted.
 */
class CraftingItem {
    // Removed type annotations
    id;
    level;
    progress;
    researchCost;
    ingredients;
    reward;
    progressInterval;
    totalCrafted;
    displayName;
    lastProgressUpdate;
    isCrafting; // New flag

    /**
     * Create a new CraftingItem.
     * @param {string} id - Unique identifier.
     * @param {number} researchCost - Chaos cost to research.
     * @param {Array<Object>} ingredients - Required ingredients for crafting.
     * @param {Object} reward - Reward for crafting ({currency, amount}).
     * @param {number} [progressInterval=300] - Progress tick interval (ms).
     */
    constructor(id, researchCost, ingredients, reward, progressInterval = 300) {
        this.id = id;
        this.level = -1; // -1 means not researched yet
        this.progress = 0;
        this.researchCost = researchCost;
        this.ingredients = ingredients;
        this.reward = reward;
        this.progressInterval = progressInterval; // Interval time, not used for direct calculation here
        this.totalCrafted = 0;
        this.displayName = this.getDisplayName();
        this.lastProgressUpdate = 0;
        this.isCrafting = false; // Initialize flag
    }

    /**
     * Get a user-friendly name for display.
     * @returns {string} Display name.
     */
    getDisplayName() {
        switch (this.id) {
            case 'flask': return 'Flask';
            case 'gem': return '21/20% Gem';
            case 'enchant': return 'Enchanted Helmet';
            case 'perfect': return '30% Vaal Regalia';
            case 'chaos': return '-9% Chaos Res Helmet';
            case 'cold': return '-9% Cold Res Helmet';
            case 'light': return '-9% Lightning Res Helmet';
            case 'fire': return '-9% Fire Res Helmet';
            case 'wand': return '+2 Gem Wand';
            default:
                // Inline capitalizeFirst logic
                return this.id.charAt(0).toUpperCase() + this.id.slice(1);
        }
    }
    /**
     * Attempt to research/unlock this crafting item.
     * Deducts chaos cost and updates UI.
     * @returns {boolean} True if researched, false otherwise.
     */
    buy() {
        if (this.isActive()) {
            SnackBar("Already researched.");
            return false;
        }
        const costElement = document.querySelector(`.craft${this.id.charAt(0).toUpperCase() + this.id.slice(1)}Cost`);
        const loaderElement = document.getElementById(`${this.id}Loader`);

        return handlePurchase({
            requirements: [{ currency: currencyMap['Chaos'], amount: this.researchCost }], // Use currencyMap
            onSuccess: () => { this.level = 0; },
            uiUpdateConfig: {
                // No standard cost/benefit/row elements apply directly
                getNextLevelData: () => null, // Signal one-time action
                removeRowOnMaxLevel: false, // Not applicable
                removeHoverSelectors: ['.Chaos'] // Remove hover from Chaos if needed
            },
            updateUI: () => {
                // Keep specific UI changes here
                if (costElement) costElement.classList.add('hidden');
                if (loaderElement) loaderElement.classList.remove('hidden');
            },
            successMessage: `${this.displayName} researched!`
        });
    }

    // ... rest of CraftingItem class ...

    /**
     * Check if all required ingredients are available.
     * @returns {boolean} True if all ingredients are available, false otherwise.
     */
    hasIngredients() {
        return this.ingredients.every(ing => {
            let item = currencyMap[ing.currency];
            // Check fossils if not found in regular currency
            if (!item && fossilData) {
                item = fossilData.find(f => f.name === ing.currency);
            }
            // Check if item exists and has enough amount
            if (!item) {
                console.error(`Ingredient definition not found: ${ing.currency}`); // Log error instead of SnackBar spam
                return false;
            }
            return item.total >= ing.amount;
        });
    }

    /**
     * Attempt to start crafting (consume ingredients, set crafting flag).
     * @returns {boolean} True if crafting started, false otherwise.
     */
    startCraft() {
        // Can only start if active, not already crafting, and has ingredients
        if (this.isActive() && !this.isCrafting && this.hasIngredients()) {
            // Consume ingredients
            this.ingredients.forEach(ing => {
                let item = currencyMap[ing.currency];
                if (!item && fossilData) {
                    item = fossilData.find(f => f.name === ing.currency);
                }
                if (item) {
                    item.total -= ing.amount;
                } else {
                    console.error(`Failed to consume ingredient: ${ing.currency}`);
                }
            });
            this.isCrafting = true;
            return true; // Craft started
        }
        return false; // Could not start craft
    }

    /**
     * Increment crafting progress if active and crafting.
     * @returns {boolean} True if progress incremented, false otherwise.
     */
    craft() {
        // Only increment progress if currently crafting
        if (this.isActive() && this.isCrafting) {
            // Increment progress (assuming 1 progress unit per craft tick)
            this.progress += 1;
            // Check for completion immediately after incrementing progress
            if (this.progress >= 100) { // Assuming 100 is the target progress
                this.completeCrafting();
            }
            return true; // Progress tick occurred
        }
        return false; // Not crafting or not active
    }

    /**
     * Update the progress bar in the UI for this item.
     * @returns {void}
     */
    updateProgressBar() {
        // Always try to update if the item is active
        if (this.isActive()) {
            // Use getElementById for potentially more reliable lookup
            const progressBarElement = document.getElementById(`${this.id}Loader`);
            if (progressBarElement && typeof componentHandler !== 'undefined') {
                // Ensure the element is upgraded before setting progress
                try {
                    componentHandler.upgradeElement(progressBarElement);
                } catch (e) {
                    console.error(`Error upgrading progress bar element ${this.id}Loader:`, e);
                    // Optionally return or handle the error if upgrade fails
                }

                // Check if MaterialProgress is available after upgrading
                if (progressBarElement.MaterialProgress) {
                    // Clamp progress between 0 and 100 for the progress bar display
                    const displayProgress = Math.min(Math.max(this.progress, 0), 100);
                    progressBarElement.MaterialProgress.setProgress(displayProgress);
                    this.lastProgressUpdate = this.progress; // Update last known progress
                } else {
                    // Log a warning if MaterialProgress is still not found after upgrade attempt
                    console.warn(`MaterialProgress not found on element #${this.id}Loader after upgrade attempt.`);
                }
            } else {
                // Only log warning if the element wasn't found, not if componentHandler is missing
                if (!progressBarElement) {
                    // console.warn(`Progress bar element #${this.id}Loader not found by getElementById.`);
                }
            }
        } else {
            // If item becomes inactive, ensure progress bar is hidden or reset if needed
            // (Current logic seems okay, but could be added here if required)
        }
    }


    /**
     * Complete the crafting process, give rewards, and update UI.
     * @returns {void}
     */
    completeCrafting() {
        // Reset progress
        this.progress = 0;
        this.isCrafting = false; // Reset the crafting flag
        this.lastProgressUpdate = -1; // Force progress bar update to 0 on next tick

        // Add reward
        const rewardItem = currencyMap[this.reward.currency];
        // Check fossils if not found in regular currency
        // Note: Rewards are typically standard currency, but check just in case
        // if (!rewardItem && fossilData) {
        //     rewardItem = fossilData.find(f => f.name === this.reward.currency);
        // }

        if (rewardItem) {
            rewardItem.total += this.reward.amount;
        } else {
            SnackBar(`Reward currency definition not found: ${this.reward.currency}`);
            console.error(`Reward currency definition not found: ${this.reward.currency}`);
        }

        // Increment total crafted count and potentially level (if leveling mechanic exists beyond research)
        this.totalCrafted++;
        // this.level++; // Incrementing level per craft might not be intended, depends on game logic. Removed for now.

        // Update UI for total crafted count
        const totalElement = document.querySelector(`.craft${this.id.charAt(0).toUpperCase() + this.id.slice(1)}Total`);
        if (totalElement && typeof numeral !== 'undefined') {
            totalElement.innerHTML = numeral(this.totalCrafted).format('0,0');
        }
    }

    /**
     * Check if the crafting item is active (researched).
     * @returns {boolean} True if active, false otherwise.
     */
    isActive() {
        return this.level >= 0;
    }

    /**
     * Check if progress has changed since the last UI update.
     * @returns {boolean} True if progress changed, false otherwise.
     */
    hasProgressChanged() {
        // Check if current progress is different from the last time the bar was updated
        // Also consider the case where progress becomes 0 after being non-zero (completion)
        return this.progress !== this.lastProgressUpdate;
    }


    /**
     * Generate HTML for this crafting item's card.
     * @returns {string} HTML string for the card.
     */
    generateHTML() {
        const researchButtonHTML = this.isActive() ? '' : `<button class="mdl-button mdl-button--raised mdl-button--colored craft-research-btn" id="craft-research-btn-${this.id}">Research ${this.displayName}</button><br><br>`;

        const researchCostText = this.isActive() ? '' : `Research Cost:<br>${numeral(this.researchCost).format('0,0')} Chaos<br>`;

        const content = `
            <div id="${this.id}Loader" class="mdl-progress mdl-js-progress ${this.isActive() ? '' : 'hidden'}"></div><br>
            Crafting Cost:<br>
            ${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}<br><br>
            Sale Price: ${this.reward.amount} ${this.reward.currency}<br>
            Total Crafted: <span class="craft${this.id.charAt(0).toUpperCase() + this.id.slice(1)}Total">${numeral(this.totalCrafted).format('0,0')}</span>
        `;

        const actionSection = {
            content: researchButtonHTML + researchCostText,
            className: `mdl-card__supporting-text mdl-card--expand craft${this.id.charAt(0).toUpperCase() + this.id.slice(1)}Cost ${this.isActive() ? 'hidden' : ''}`
        };

        const card = UICard.create({
            id: `${this.id}-card`,
            title: this.displayName,
            content: content,
            // Only add action section if the item is not yet active (i.e., needs research)
            actionSections: !this.isActive() ? [actionSection] : [],
            size: 'third',
            extraClasses: ['cardBG', 'craft']
        });
        return card.outerHTML;
    }
}

/**
 * Represents a special mirror crafting item (e.g., mirrored gear).
 * Handles unique fee logic and stats display.
 * Extends CraftingItem.
 *
 * @class
 * @augments CraftingItem
 * @property {number} fee - Current mirror fee (Exalted).
 * @property {number} feeIncrease - Fee increment per craft.
 */
class MirrorItem extends CraftingItem {
    // Removed type annotations
    fee;
    feeIncrease;

    /**
     * Create a new MirrorItem.
     * @param {string} id - Unique identifier.
     * @param {Array<Object>} ingredients - Required ingredients for initial craft.
     * @param {number} [initialFee=20] - Starting mirror fee (Exalted).
     * @param {number} [feeIncrease=5] - Fee increment per craft.
     */
    constructor(id, ingredients, initialFee = 20, feeIncrease = 5) {
        // Mirror items don't have a research cost (level starts at 0 if craftable)
        // Reward currency is Exalted, amount is the current fee
        super(id, 0, ingredients, { currency: 'Exalted', amount: initialFee }, 600); // Pass 0 research cost
        this.fee = initialFee;
        this.feeIncrease = feeIncrease;
        this.level = 0;
        this.level = -1;
        this.displayName = this.getDisplayName(); // Update display name after super call
    }

    /**
     * Get a user-friendly display name for the mirror item.
     * @returns {string} Display name.
     */
    getDisplayName() {
        switch (this.id) {
            case 'mirrorSword': return '(Mirror) 650pDPS Sword';
            case 'mirrorShield': return '(Mirror) ES Shield';
            case 'mirrorChest': return '(Mirror) Explode Chest';
            default:
                const baseName = this.id.startsWith('mirror') ? this.id.substring(6) : this.id;
                const spacedName = baseName.replace(/([A-Z])/g, ' $1').trim();
                // Inline capitalizeFirstLetter logic
                return `(Mirror) ${spacedName.charAt(0).toUpperCase() + spacedName.slice(1)}`;
        }
    }

    /**
     * Get stats string for this mirror item.
     * @returns {string} HTML-formatted stats.
     */
    getItemStats() {
        switch (this.id) {
            case 'mirrorSword':
                return `Cataclysm Edge<br>
                        Jewelled Foil<br>
                        Quality: 30%<br>
                        [+25% to Global Critical Strike Multiplier]<br>
                        258% increased Physical Damage<br>
                        Adds 27 to 49 Physical Damage<br>
                        27% increased Attack Speed<br>
                        38% increased Critical Strike Chance<br>
                        +38% to Global Critical Strike Multiplier<br>
                        +185 to Accuracy Rating<br>`;
            case 'mirrorShield':
                return `Rune Charm<br>
                        Titanium Spirit Shield<br>
                        Quality: 30%<br>
                        Energy Shield: 420<br>
                        Socketed Gems have 15% reduced Mana Reservation<br>
                        109% increased Critical Strike Chance for Spells<br>
                        +111 to maximum Energy Shield<br>
                        110% increased Energy Shield<br>
                        +20 to maximum Mana<br>
                        Recover 5% of Energy Shield when you Block<br>`;
            case 'mirrorChest':
                return `Morbid Suit<br>
                        Astral Plate<br>
                        [12% to all Elemental Resistances]<br>
                        Socketed Attacks have -15 to Total Mana Cost<br>
                        +129 to maximum Life<br>
                        25% increased Effect of Auras on you<br>
                        You can apply an additional Curse<br>
                        Attacks have +2% to Critical Strike Chance<br>
                        Enemies you Kill Explode, dealing 3% of their Life as Physical Damage<br>`;
            default:
                return `${this.displayName} Stats Not Available`; // Default message
        }
    }

    /**
     * Complete the mirror crafting process, increase fee, and update UI.
     * @returns {void}
     */
    completeCrafting() {
        this.progress = 0; // Reset progress
        this.lastProgressUpdate = -1; // Force progress bar update to 0

        // Add reward (current fee amount)
        const rewardItem = currencyMap[this.reward.currency]; // Should be Exalted
        if (rewardItem) {
            rewardItem.total += this.fee;
        } else {
            SnackBar(`Reward currency definition not found: ${this.reward.currency}`);
            console.error(`Reward currency definition not found: ${this.reward.currency}`);
        }

        // Increase the fee for the next mirror
        this.fee += this.feeIncrease;
        this.reward.amount = this.fee; // Update reward amount for future display/logic if needed

        this.totalCrafted++;
        // No level increase per craft for mirror items typically

        // Update UI elements specific to mirror items
        const totalElement = document.querySelector(`.${this.id}Total`);
        if (totalElement && typeof numeral !== 'undefined') {
            totalElement.innerHTML = numeral(this.totalCrafted).format('0,0');
        }
        const feeElement = document.querySelector(`.${this.id}Fee`);
        if (feeElement && typeof numeral !== 'undefined') {
            feeElement.innerHTML = numeral(this.fee).format('0,0');
        }
    }
    /**
     * Initial craft action for mirror items (unlocks mirroring).
     * Uses handlePurchase for consistency.
     * @returns {boolean} True if crafted, false otherwise.
     */
    buy() {
        // Check if already crafted/active
        if (this.isActive()) {
            SnackBar("Item already available for mirroring.");
            return false;
        }

        // Get UI elements needed for updateUI
        const costElement = document.querySelector(`.${this.id}Cost`);
        const loaderElement = document.getElementById(`${this.id}Loader`);
        const statsElement = document.querySelector(`.${this.id}Stats`);
        const itemName = this.displayName.replace('(Mirror) ', '');

        // Define requirements using currencyMap and fossilData lookup if necessary
        const requirements = this.ingredients.map(ing => {
            let currencyObj = currencyMap[ing.currency];
            if (!currencyObj && fossilData) {
                currencyObj = fossilData.find(f => f.name === ing.currency);
            }
            return { currency: currencyObj, amount: ing.amount };
        }).filter(req => req.currency); // Filter out any potentially missing currencies

        // Define hover selectors based on ingredients
        const hoverSelectors = requirements.map(req => `.${req.currency.name}`);

        return handlePurchase({
            requirements: requirements,
            onSuccess: () => {
                this.level = 0; // Mark as active/available for mirroring ticks
                this.progress = 0; // Ensure progress is 0
                this.lastProgressUpdate = -1; // Ensure the first interval update triggers
            },
            uiUpdateConfig: {
                // No standard cost/benefit/row elements apply directly
                getNextLevelData: () => null, // Signal one-time action
                removeRowOnMaxLevel: false, // Not applicable
                removeHoverSelectors: hoverSelectors
            },
            updateUI: () => {
                // Keep specific UI changes here
                if (costElement) costElement.classList.add('hidden');
                if (loaderElement) loaderElement.classList.remove('hidden');
                if (statsElement) statsElement.classList.remove('hidden');
            },
            successMessage: `${itemName} crafted! Now available for mirroring.`
            // Default failure message from handlePurchase is sufficient
        });
    }

    /**
     * Progress the mirror crafting process (tick-based).
     * @returns {boolean} True if progress incremented, false otherwise.
     */
    craft() {
        // Mirror items only progress if they are active (initial craft done)
        // They don't consume ingredients per tick, only progress time
        if (this.isActive()) {
            this.progress += 1; // Increment progress (assuming 1 unit per mirror tick)
            // Check for completion (reaching 100% progress for the mirror fee)
            if (this.progress >= 100) { // Assuming 100 is the target progress for mirror fee
                this.completeCrafting(); // Collect fee, increase fee, reset progress
            }
            return true; // Progress tick occurred
        }
        return false; // Not active, no progress
    }


    /**
     * Generate HTML for this mirror item's card.
     * @returns {string} HTML string for the card.
     */
    generateHTML() {
        const craftButtonHTML = this.isActive() ? '' : `<button class="mdl-button mdl-button--raised mdl-button--colored craft-research-btn" id="craft-research-btn-${this.id}">Craft ${this.displayName}</button><br><br>`;
        const craftingCostText = this.isActive() ? '' : `Crafting Cost:<br>${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}<br>`;

        // Content shown when active (after initial craft)
        // This section *always* needs to be in the HTML structure
        const activeContent = `
            <div id="${this.id}Loader" class="mdl-progress mdl-js-progress ${this.isActive() ? '' : 'hidden'}"></div><br>
            Mirror Fee: <span class="${this.id}Fee">${numeral(this.fee).format('0,0')}</span> Exalted<br>
            Total Mirrored: <span class="${this.id}Total">${numeral(this.totalCrafted).format('0,0')}</span>
        `;

        // Stats section, always included but hidden initially if not active
        const statsSection = `
            <div class="mdl-card__supporting-text ${this.id}Stats ${this.isActive() ? '' : 'hidden'}">
                ${this.getItemStats()}
            </div>
        `;

        // Action section for the initial craft button and cost, hidden when active
        const actionSection = {
            content: craftButtonHTML + craftingCostText,
            className: `mdl-card__supporting-text mdl-card--expand ${this.id}Cost ${this.isActive() ? 'hidden' : ''}`
        };

        // *** CORRECTION: Combine activeContent and statsSection into the main content ***
        const mainContent = activeContent + statsSection;

        const card = UICard.create({
            id: `${this.id}-card`,
            title: this.displayName,
            // Use the combined mainContent here
            content: mainContent,
            // Only add action section if not yet active
            actionSections: !this.isActive() ? [actionSection] : [],
            size: 'third',
            extraClasses: ['cardBG', 'craft']
        });
        return card.outerHTML;
    }
}

export { CraftingItem, MirrorItem };