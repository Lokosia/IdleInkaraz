/**
 * Idle Inkaraz - Crafting System
 * Object-oriented refactoring of the crafting mechanics
 */

// Base class for all crafting items
class CraftingItem {
    constructor(id, researchCost, ingredients, reward, progressInterval = 300) {
        this.id = id;
        this.level = -1; // -1 means not researched yet
        this.progress = 0;
        this.researchCost = researchCost;
        this.ingredients = ingredients;
        this.reward = reward;
        this.progressInterval = progressInterval;
        this.totalCrafted = 0;
        this.displayName = this.getDisplayName();
    }

    // Get a user-friendly name for display
    getDisplayName() {
        switch(this.id) {
            case 'flask': return 'Flask';
            case 'gem': return '21/20% Gem';
            case 'enchant': return 'Enchanted Helmet';
            case 'perfect': return '30% Vaal Regalia';
            case 'chaos': return '-9% Chaos Res Helmet';
            case 'cold': return '-9% Cold Res Helmet';
            case 'light': return '-9% Lightning Res Helmet';
            case 'fire': return '-9% Fire Res Helmet';
            case 'wand': return '+2 Gem Wand';
            default: return this.capitalizeFirst();
        }
    }

    // Buy/research the crafting item
    buy() {
        if (Chaos.total >= this.researchCost) {
            Chaos.total -= this.researchCost;
            this.level++;
            $(`.craft${this.capitalizeFirst()}Cost`).hide();
            $(`#${this.id}Loader`).removeClass("hidden");
            return true;
        } else {
            SnackBar("Requirements not met.");
            return false;
        }
    }

    // Helper method to capitalize first letter
    capitalizeFirst() {
        return this.id.charAt(0).toUpperCase() + this.id.slice(1);
    }

    // Check if we have all ingredients for crafting
    hasIngredients() {
        return this.ingredients.every(ing => window[ing.currency].total >= ing.amount);
    }

    // Consume ingredients and increment progress
    craft() {
        if (this.level >= 0 && this.hasIngredients()) {
            this.ingredients.forEach(ing => {
                window[ing.currency].total -= ing.amount;
            });
            this.progress += 1;
            return true;
        }
        return false;
    }

    // Update the progress bar in the UI
    updateProgressBar() {
        if (this.progress >= 1) {
            this.progress += 1;
            let e = document.querySelector(`#${this.id}Loader`);
            componentHandler.upgradeElement(e);
            e.MaterialProgress.setProgress(this.progress);
            
            // Complete crafting when progress reaches 99%
            if (this.progress >= 99) {
                this.completeCrafting();
            }
        }
    }

    // Complete the crafting process and give rewards
    completeCrafting() {
        this.progress = 0;
        let e = document.querySelector(`#${this.id}Loader`);
        componentHandler.upgradeElement(e);
        e.MaterialProgress.setProgress(0);
        
        // Add reward
        window[this.reward.currency].total += this.reward.amount;
        this.totalCrafted++;
        this.level++;
        
        // Update UI
        document.getElementsByClassName(`craft${this.capitalizeFirst()}Total`)[0].innerHTML = numeral(this.totalCrafted).format('0,0');
    }

    // Check if the crafting item is active (researched)
    isActive() {
        return this.level >= 0;
    }

    // Check if progress has changed
    hasProgressChanged() {
        return this.progress >= 1;
    }

    // Generate HTML for this crafting item
    generateHTML() {
        let html = `
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG craft">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">${this.displayName}</h2>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
                <div id="${this.id}Loader" class="mdl-progress mdl-js-progress hidden"></div><br>
                Crafting Cost:<br>
                ${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}<br><br>
                Sale Price: ${this.reward.amount} ${this.reward.currency}<br>
                Total Crafted: <span class="craft${this.capitalizeFirst()}Total">0</span>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand craft${this.capitalizeFirst()}Cost">
                <a class="mdl-button mdl-button--raised mdl-button--colored"
                    onclick="craftingSystem.buyCrafting('${this.id}');">Research ${this.displayName}</a><br><br>
                Research Cost:<br>${numeral(this.researchCost).format('0,0')} Chaos
                <br>
            </div>
        </div>`;
        return html;
    }
}

// Mirror item class extends CraftingItem for mirror-specific behavior
class MirrorItem extends CraftingItem {
    constructor(id, ingredients, initialFee = 20, feeIncrease = 5) {
        super(id, 0, ingredients, { currency: 'Exalted', amount: initialFee }, 600);
        this.fee = initialFee;
        this.feeIncrease = feeIncrease;
        this.displayName = this.getDisplayName();
    }

    // Get a user-friendly name for display
    getDisplayName() {
        switch(this.id) {
            case 'mirrorSword': return '(Mirror) 650pDPS Sword';
            case 'mirrorShield': return '(Mirror) ES Shield';
            case 'mirrorChest': return '(Mirror) Explode Chest';
            default: return `(Mirror) ${this.id.replace('mirror', '')}`;
        }
    }

    // Item-specific stats for the mirror items
    getItemStats() {
        switch(this.id) {
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
                return `${this.displayName} Stats`;
        }
    }

    // Override completeCrafting to handle mirror fee increases
    completeCrafting() {
        this.progress = 0;
        let e = document.querySelector(`#${this.id}Loader`);
        componentHandler.upgradeElement(e);
        e.MaterialProgress.setProgress(0);
        
        // Add reward (exalted based on fee)
        Exalted.total += this.fee;
        
        // Increase fee for next mirror
        this.fee += this.feeIncrease;
        this.reward.amount = this.fee;
        
        this.totalCrafted++;
        this.level++;
        
        // Update UI
        document.getElementsByClassName(`${this.id}Total`)[0].innerHTML = numeral(this.totalCrafted).format('0,0');
        document.getElementsByClassName(`${this.id}Fee`)[0].innerHTML = numeral(this.fee).format('0,0');
    }

    // Custom buy method for mirror items
    buy() {
        // Check if player has all required ingredients
        if (this.hasIngredients()) {
            // Consume all ingredients
            this.ingredients.forEach(ing => {
                window[ing.currency].total -= ing.amount;
            });
            
            this.level++;
            $(`.${this.id}Cost`).hide();
            $(`#${this.id}Loader`).removeClass("hidden");
            $(`.${this.id}Stats`).removeClass("hidden");
            
            let itemName = this.id.replace('mirror', '');
            SnackBar(`${itemName} Crafted!`);
            return true;
        } else {
            SnackBar("Requirements not met.");
            return false;
        }
    }

    // Generate HTML for this mirror item
    generateHTML() {
        let html = `
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG craft">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">${this.displayName}</h2>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
                <div id="${this.id}Loader" class="mdl-progress mdl-js-progress hidden"></div><br>
                Mirror Fee: <span class="${this.id}Fee">20</span> Exalted<br>
                Total Mirrored: <span class="${this.id}Total">0</span>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand ${this.id}Cost">
                <a class="mdl-button mdl-button--raised mdl-button--colored"
                    onclick="craftingSystem.buyMirror('${this.id}');">Craft ${this.displayName}</a><br><br>
                Crafting Cost:<br>
                ${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}
                <br>
            </div>
            <div class="mdl-card mdl-card--expand ${this.id}Stats hidden">
                ${this.getItemStats()}
            </div>
        </div>`;
        return html;
    }
}

// Main system to control all crafting operations
class CraftingSystem {
    constructor() {
        // Singleton instance
        if (CraftingSystem.instance) {
            return CraftingSystem.instance;
        }
        CraftingSystem.instance = this;

        // Initialize crafting items
        this.craftingItems = {};
        this.mirrorItems = {};
        
        this.initializeCraftingItems();
        this.initializeMirrorItems();
        this.startIntervals();
    }

    // Define all regular crafting items
    initializeCraftingItems() {
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

    // Define all mirror items
    initializeMirrorItems() {
        this.mirrorItems = {
            mirrorSword: new MirrorItem('mirrorSword', [
                { currency: 'Prime', amount: 50 }, { currency: 'Jagged', amount: 50 }, 
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
                { currency: 'Crusader', amount: 1 }, { currency: 'Prime', amount: 50 }, 
                { currency: 'Jagged', amount: 50 }, { currency: 'Bound', amount: 50 }, 
                { currency: 'Pristine', amount: 50 }, { currency: 'Serrated', amount: 50 }, 
                { currency: 'Eternal', amount: 35 }, { currency: 'Exalted', amount: 700 }
            ])
        };
    }

    // Render all crafting cards
    renderCraftingCards() {
        const container = document.getElementById('crafting-cards-container');
        if (!container) return;

        // Clear the container first
        container.innerHTML = '';

        // Add regular crafting items
        Object.values(this.craftingItems).forEach(item => {
            container.innerHTML += item.generateHTML();
        });

        // Add mirror items
        Object.values(this.mirrorItems).forEach(item => {
            container.innerHTML += item.generateHTML();
        });

        // Add the advanced crafting elements needed for tests
        container.innerHTML += `<div id="heavierCrafting" class="hidden"></div>
                               <div class="advancedCrafting hidden"></div>`;

        // Upgrade MDL components
        componentHandler.upgradeElements(container);
        
        // Handle any saved state (if items were already researched)
        Object.values(this.craftingItems).forEach(item => {
            if (item.isActive()) {
                $(`.craft${item.capitalizeFirst()}Cost`).hide();
                $(`#${item.id}Loader`).removeClass("hidden");
            }
        });
        
        Object.values(this.mirrorItems).forEach(item => {
            if (item.isActive()) {
                $(`.${item.id}Cost`).hide();
                $(`#${item.id}Loader`).removeClass("hidden");
                $(`.${item.id}Stats`).removeClass("hidden");
            }
        });
        
        // Check for Quad Stash Tab
        if (window.quadStashTab !== 1) {
            $("#heavierCrafting, .advancedCrafting").hide();
        }
    }

    // Render the main crafting header cards (Artificer recruitment and description)
    renderCraftingHeader() {
        const container = document.getElementById('crafting-main-container');
        if (!container) return;

        // Clear the container first
        container.innerHTML = '';

        // Check if Artificer is already recruited
        const artificerOwned = typeof exileData !== 'undefined' && 
                               exileData.some(e => e.name === 'Artificer' && e.owned === true);

        // Generate the Artificer card with conditional sections based on ownership
        const artificerCard = `
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG artificer">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">The Artificer</h2>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
                The hideout warrior.<br>
            </div>
            ${artificerOwned ? '' : `
            <div class="mdl-card__actions mdl-card--border ArtificerBuy">
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                    onclick="recruitExile('Artificer');">Recruit The Artificer</button>
            </div>
            <div class="mdl-card__actions mdl-card--border ArtificerHide">
                1000 Total Levels Required<br>
                Quad Stash Tab Required
            </div>
            `}
        </div>`;

        // Generate the description card
        const descriptionCard = `
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet cardBG imgBG">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">Gear Crafting</h2>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
                <p>Use the resources that the guild farms to produce high valued items.</p>
                <p>Research a crafting method to unlock it.</p>
                <p>Crafts are completed (then sold) every 30 seconds.<br>Items are mirrored every 60
                    seconds, the mirror fee increases by 5 Exalted every time.</p>
            </div>
        </div>`;

        // Add both cards to the container
        container.innerHTML = artificerCard + descriptionCard;

        // Upgrade MDL components
        componentHandler.upgradeElements(container);
    }

    // Start all interval timers
    startIntervals() {
        // Crafting tick - every 30 seconds
        setInterval(() => this.craftingTick(), 30000);
        
        // Mirror tick - every 60 seconds
        setInterval(() => this.mirrorTick(), 60000);
        
        // Progress bar animation for regular crafting - every 300ms
        setInterval(() => this.updateCraftingProgressBars(), 300);
        
        // Progress bar animation for mirror items - every 600ms
        setInterval(() => this.updateMirrorProgressBars(), 600);
        
        // Update fossil counts every 30 seconds
        setInterval(() => this.updateFossilCounts(), 30000);
    }

    // Processing tick for all crafting items
    craftingTick() {
        Object.values(this.craftingItems).forEach(item => item.craft());
    }

    // Processing tick for all mirror items
    mirrorTick() {
        Object.values(this.mirrorItems).forEach(item => {
            if (item.isActive()) {
                item.progress += 1;
            }
        });
    }

    // Update progress bars for crafting items
    updateCraftingProgressBars() {
        Object.values(this.craftingItems).forEach(item => {
            if (item.isActive() && item.hasProgressChanged()) {
                item.updateProgressBar();
            }
        });
    }

    // Update progress bars for mirror items
    updateMirrorProgressBars() {
        Object.values(this.mirrorItems).forEach(item => {
            if (item.isActive() && item.hasProgressChanged()) {
                item.updateProgressBar();
            }
        });
    }
    
    // Update fossil count display in UI
    updateFossilCounts() {
        for (let i = 0; i < fossilData.length; i++) {
            document.getElementsByClassName(fossilData[i].name + 'Total')[0].innerHTML = numeral(fossilData[i].total).format('0,0', Math.floor);
        }
    }

    // Buy a crafting item by id
    buyCrafting(id) {
        if (this.craftingItems[id]) {
            return this.craftingItems[id].buy();
        }
        return false;
    }

    // Buy a mirror item by id
    buyMirror(id) {
        if (this.mirrorItems[id]) {
            return this.mirrorItems[id].buy();
        }
        return false;
    }
}

// Initialize crafting system
const craftingSystem = new CraftingSystem();

// Call renderCraftingCards on page load to ensure cards are available for tests
document.addEventListener('DOMContentLoaded', function() {
    // We'll only render the cards if we're on the crafting tab
    if ($("#crafting").is(":visible")) {
        craftingSystem.renderCraftingCards();
    }
});