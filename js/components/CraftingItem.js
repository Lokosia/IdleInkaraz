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
    capitalizeFirst() {
        return this.id.charAt(0).toUpperCase() + this.id.slice(1);
    }
    hasIngredients() {
        return this.ingredients.every(ing => window[ing.currency].total >= ing.amount);
    }
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
        window[this.reward.currency].total += this.reward.amount;
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
        Exalted.total += this.fee;
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

export { CraftingItem, MirrorItem };