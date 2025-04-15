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
}

// Mirror item class extends CraftingItem for mirror-specific behavior
class MirrorItem extends CraftingItem {
    constructor(id, ingredients, initialFee = 20, feeIncrease = 5) {
        super(id, 0, ingredients, { currency: 'Exalted', amount: initialFee }, 600);
        this.fee = initialFee;
        this.feeIncrease = feeIncrease;
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