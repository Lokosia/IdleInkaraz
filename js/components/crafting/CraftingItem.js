import { UICard } from '../Cards.js';
import { currencyMap } from '../currency/CurrencyData.js';
import { SnackBar } from '../../../Main.js';
import { fossilData } from '../delve/Fossil.js';

class CraftingItem {
    constructor(id, researchCost, ingredients, reward, progressInterval = 300) {
        this.id = id;
        this.level = -1;
        this.progress = 0;
        this.researchCost = researchCost;
        this.ingredients = ingredients;
        this.reward = reward;
        this.progressInterval = progressInterval;
        this.totalCrafted = 0;
        this.displayName = this.getDisplayName();
    }
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
    buy() {
        if (currencyMap['Chaos'].total >= this.researchCost) {
            currencyMap['Chaos'].total -= this.researchCost;
            this.level++;
            $(`.craft${this.capitalizeFirst()}Cost`).hide();
            $(`#${this.id}Loader`).removeClass("hidden");
            return true;
        } else {
            SnackBar("Requirements not met.");
            return false;
        }
    }
    capitalizeFirst() {
        return this.id.charAt(0).toUpperCase() + this.id.slice(1);
    }
    hasIngredients() {
        return this.ingredients.every(ing => {
            let item = currencyMap[ing.currency];
            if (!item && fossilData) {
                item = fossilData.find(f => f.name === ing.currency);
            }
            if (!item) {
                SnackBar(`Ingredient not found: ${ing.currency}`);
                return false;
            }
            return item.total >= ing.amount;
        });
    }
    craft() {
        if (this.level >= 0 && this.hasIngredients()) {
            this.ingredients.forEach(ing => {
                let item = currencyMap[ing.currency];
                if (!item && fossilData) {
                    item = fossilData.find(f => f.name === ing.currency);
                }
                if (item) item.total -= ing.amount;
            });
            this.progress += 1;
            return true;
        }
        return false;
    }
    updateProgressBar() {
        if (this.progress >= 1) {
            this.progress += 1;
            let e = document.querySelector(`#${this.id}Loader`);
            componentHandler.upgradeElement(e);
            e.MaterialProgress.setProgress(this.progress);
            if (this.progress >= 99) {
                this.completeCrafting();
            }
        }
    }
    completeCrafting() {
        this.progress = 0;
        let e = document.querySelector(`#${this.id}Loader`);
        componentHandler.upgradeElement(e);
        e.MaterialProgress.setProgress(0);
        let rewardItem = currencyMap[this.reward.currency];
        if (!rewardItem && fossilData) {
            rewardItem = fossilData.find(f => f.name === this.reward.currency);
        }
        if (rewardItem) {
            rewardItem.total += this.reward.amount;
        } else {
            SnackBar(`Reward not found: ${this.reward.currency}`);
        }
        this.totalCrafted++;
        this.level++;
        document.getElementsByClassName(`craft${this.capitalizeFirst()}Total`)[0].innerHTML = numeral(this.totalCrafted).format('0,0');
    }
    isActive() {
        return this.level >= 0;
    }
    hasProgressChanged() {
        return this.progress >= 1;
    }
    generateHTML() {
        const content = `
            <div id="${this.id}Loader" class="mdl-progress mdl-js-progress hidden"></div><br>
            Crafting Cost:<br>
            ${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}<br><br>
            Sale Price: ${this.reward.amount} ${this.reward.currency}<br>
            Total Crafted: <span class="craft${this.capitalizeFirst()}Total">${numeral(this.totalCrafted).format('0,0')}</span>
        `;
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
}

class MirrorItem extends CraftingItem {
    constructor(id, ingredients, initialFee = 20, feeIncrease = 5) {
        super(id, 0, ingredients, { currency: 'Exalted', amount: initialFee }, 600);
        this.fee = initialFee;
        this.feeIncrease = feeIncrease;
        this.displayName = this.getDisplayName();
    }
    getDisplayName() {
        switch(this.id) {
            case 'mirrorSword': return '(Mirror) 650pDPS Sword';
            case 'mirrorShield': return '(Mirror) ES Shield';
            case 'mirrorChest': return '(Mirror) Explode Chest';
            default: return `(Mirror) ${this.id.replace('mirror', '')}`;
        }
    }
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
    completeCrafting() {
        this.progress = 0;
        let e = document.querySelector(`#${this.id}Loader`);
        componentHandler.upgradeElement(e);
        e.MaterialProgress.setProgress(0);
        let rewardItem = currencyMap[this.reward.currency];
        if (!rewardItem && fossilData) {
            rewardItem = fossilData.find(f => f.name === this.reward.currency);
        }
        if (rewardItem) {
            rewardItem.total += this.fee;
        } else {
            SnackBar(`Reward not found: ${this.reward.currency}`);
        }
        this.fee += this.feeIncrease;
        this.reward.amount = this.fee;
        this.totalCrafted++;
        this.level++;
        document.getElementsByClassName(`${this.id}Total`)[0].innerHTML = numeral(this.totalCrafted).format('0,0');
        document.getElementsByClassName(`${this.id}Fee`)[0].innerHTML = numeral(this.fee).format('0,0');
    }
    buy() {
        if (this.hasIngredients()) {
            this.ingredients.forEach(ing => {
                let item = currencyMap[ing.currency];
                if (!item && fossilData) {
                    item = fossilData.find(f => f.name === ing.currency);
                }
                if (item) item.total -= ing.amount;
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
    generateHTML() {
        const content = `
            <div id="${this.id}Loader" class="mdl-progress mdl-js-progress hidden"></div><br>
            Mirror Fee: <span class="${this.id}Fee">${this.fee}</span> Exalted<br>
            Total Mirrored: <span class="${this.id}Total">${numeral(this.totalCrafted).format('0,0')}</span>
        `;
        const actionSection = `<button class="mdl-button mdl-button--raised mdl-button--colored craft-research-btn" id="craft-research-btn-${this.id}">Craft ${this.displayName}</button><br><br>
            Crafting Cost:<br>
            ${this.ingredients.map(ing => `${ing.amount} ${ing.currency}`).join('<br>')}<br>`;
        const statsSection = `<div class="mdl-card mdl-card--expand ${this.id}Stats hidden">
            ${this.getItemStats()}
        </div>`;
        const card = UICard.create({
            id: `${this.id}-card`,
            title: this.displayName,
            content: content + statsSection,
            actionSections: [{ content: actionSection, className: 'mdl-card__supporting-text mdl-card--expand ' + this.id + 'Cost' }],
            size: 'third',
            extraClasses: ['cardBG', 'craft']
        });
        return card.outerHTML;
    }
}

export { CraftingItem, MirrorItem };