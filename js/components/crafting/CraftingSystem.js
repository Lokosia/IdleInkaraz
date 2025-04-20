import { CraftingItem, MirrorItem } from './CraftingItem.js';
import { fossilData } from '../delve/Fossil.js';
import { UICard } from '../Cards.js';
import Upgrades from '../Augments.js';
import { recruitExile } from '../../../Main.js';

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

    startIntervals() {
        setInterval(() => this.craftingTick(), 30000);
        setInterval(() => this.mirrorTick(), 60000);
        setInterval(() => this.updateCraftingProgressBars(), 300);
        setInterval(() => this.updateMirrorProgressBars(), 600);
        setInterval(() => this.updateFossilCounts(), 30000);
    }

    craftingTick() {
        Object.values(this.craftingItems).forEach(item => item.craft());
    }

    mirrorTick() {
        Object.values(this.mirrorItems).forEach(item => {
            if (item.isActive()) {
                item.progress += 1;
            }
        });
    }

    updateCraftingProgressBars() {
        Object.values(this.craftingItems).forEach(item => {
            if (item.isActive() && item.hasProgressChanged()) {
                item.updateProgressBar();
            }
        });
    }

    updateMirrorProgressBars() {
        Object.values(this.mirrorItems).forEach(item => {
            if (item.isActive() && item.hasProgressChanged()) {
                item.updateProgressBar();
            }
        });
    }

    updateFossilCounts() {
        for (let i = 0; i < fossilData.length; i++) {
            document.getElementsByClassName(fossilData[i].name + 'Total')[0].innerHTML = numeral(fossilData[i].total).format('0,0', Math.floor);
        }
    }

    buyCrafting(id) {
        if (this.craftingItems[id]) {
            return this.craftingItems[id].buy();
        }
        return false;
    }

    buyMirror(id) {
        if (this.mirrorItems[id]) {
            return this.mirrorItems[id].buy();
        }
        return false;
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
        // Refactored to use UICard for card structure
        const content = `
            <div id="${this.id}Loader" class="mdl-progress mdl-js-progress hidden"></div><br>
            Crafting Cost:<br>
            ${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}<br><br>
            Sale Price: ${this.reward.amount} ${this.reward.currency}<br>
            Total Crafted: <span class="craft${this.capitalizeFirst()}Total">0</span>
        `;
        // Remove inline onclick, add a unique id for the button
        const actionSection = `<button class="mdl-button mdl-button--raised mdl-button--colored craft-research-btn" id="craft-research-btn-${this.id}">Research ${this.displayName}</button><br><br>
            Research Cost:<br>${numeral(this.researchCost).format('0,0')} Chaos<br>`;
        const card = UICard.create({
            id: `${this.id}-card`,
            title: this.displayName,
            content: content,
            actionSections: [{ content: actionSection, className: 'mdl-card__supporting-text mdl-card--expand craft' + this.capitalizeFirst() + 'Cost' }],
            size: 'third',
            extraClasses: ['cardBG', 'craft']
        });
        return card.outerHTML;
    }

    renderCraftingCards() {
        const container = document.getElementById('crafting-cards-container');
        if (!container) return;
        container.innerHTML = '';
        Object.values(this.craftingItems).forEach(item => {
            container.innerHTML += item.generateHTML();
        });
        Object.values(this.mirrorItems).forEach(item => {
            container.innerHTML += item.generateHTML();
        });
        container.innerHTML += `<div id="heavierCrafting" class="hidden"></div>
                               <div class="advancedCrafting hidden"></div>`;
        componentHandler.upgradeElements(container);
        Object.values(this.craftingItems).forEach(item => {
            if (item.isActive()) {
                $(`.craft${item.capitalizeFirst()}Cost`).hide();
                $(`#${item.id}Loader`).removeClass("hidden");
            }
            // Add event listener for research button
            const btn = document.getElementById(`craft-research-btn-${item.id}`);
            if (btn) {
                btn.addEventListener('click', () => this.buyCrafting(item.id));
            }
        });
        Object.values(this.mirrorItems).forEach(item => {
            if (item.isActive()) {
                $(`.${item.id}Cost`).hide();
                $(`#${item.id}Loader`).removeClass("hidden");
                $(`.${item.id}Stats`).removeClass("hidden");
            }
            // Add event listener for mirror craft button
            const btn = document.getElementById(`craft-research-btn-${item.id}`);
            if (btn) {
                btn.addEventListener('click', () => this.buyMirror(item.id));
            }
        });
        if (Upgrades.quadStashTab !== 1) {
            $("#heavierCrafting, .advancedCrafting").hide();
        }
    }

    renderCraftingHeader() {
        const container = document.getElementById('crafting-main-container');
        if (!container) return;
        container.innerHTML = '';
        const artificerOwned = typeof exileData !== 'undefined' && 
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
                <p>Crafts are completed (then sold) every 30 seconds.<br>Items are mirrored every 60 seconds, the mirror fee increases by 5 Exalted every time.</p>`,
            size: 'half',
            extraClasses: ['cardBG', 'imgBG']
        });
        container.innerHTML = '';
        container.appendChild(artificerCard);
        container.appendChild(descriptionCard);
        componentHandler.upgradeElements(container);
        // Add event listener for Artificer recruit button
        const recruitBtn = document.getElementById('ArtificerRecruitBtn');
        if (recruitBtn) {
            recruitBtn.addEventListener('click', () => {
                if (typeof recruitExile === 'function') recruitExile('Artificer');
            });
        }
    }
}

export { CraftingSystem };