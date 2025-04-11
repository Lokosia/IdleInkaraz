//---Define Class
class Currency {
    constructor(name, rate, total, sellRate, sellPercent, buyRate, buyPercent, tradingCurrency, sellGain, sellLost, buyGain, buyLost) {
        this.name = name;
        this.rate = rate; //drop rate
        this.total = Number(total); //current total
        this.sellRate = Number(sellRate);
        this.sellPercent = Number(sellPercent);
        this.buyRate = Number(buyRate);
        this.buyPercent = Number(buyPercent);
        this.tradingCurrency = tradingCurrency;

        // Selling trade amounts
        this.sellGain = sellGain ?? (this.sellRate <= 1 ? this.sellRate : 1); // how much trading currency you get
        this.sellLost = sellLost ?? (this.sellRate <= 1 ? 1 : this.sellRate); // how much of current currency you spend

        // Buying trade amounts - CORRECTED
        this.buyGain = buyGain ?? (this.buyRate <= 1 ? 1 : this.buyRate); // how much of current currency you get
        this.buyLost = buyLost ?? (this.buyRate <= 1 ? this.buyRate : 1); // how much trading currency you spend
    }

    rollCurrencyRNG() { //determines the roll for a drop
        let min = 0.0000001;
        let max = 1;
        let c = (Math.random() * (max - min) + min).toFixed(7);
        return c;
    };

    rollCurrency(exileName) { //rolls each currency to drop it
        let c = this.rollCurrencyRNG();
        if (this.name != "Sulphite") {
            if (c <= this.rate * (exileName.dropRate + upgradeDropRate)) {
                this.total += 1 + (this.rate * (exileName.dropRate + upgradeDropRate)); //adds multiple if dropRate high enough
                if (this.name == 'Mirror') {
                    SnackBar("Mirror of Kalandra dropped!");
                }
            }
        } else if (this.name == "Sulphite") {
            if (c <= this.rate * (exileName.dropRate + upgradeDropRate)) {
                this.total += Math.floor((Math.random() * (sulphiteDropRate - (sulphiteDropRate / 2)) + (sulphiteDropRate / 2)));
            }
        }
    };

    sellSetCurrency(value) {
        if (this.buyPercent > 0) {
            this.buyPercent = 0;
            $('#' + this.name + 'BuySlider').trigger('click');
        }
        this.sellPercent = value;
    };

    buySetCurrency(value) {
        if (this.sellPercent > 0) {
            this.sellPercent = 0;
            $('#' + this.name + 'SellSlider').trigger('click');
        }
        this.buyPercent = value;
    };

    sellCurrency() {
        if (Singularity.level >= 1 && this.sellPercent == 1) {
            for (let i = 0; i < flippingSpeed; i++) {
                const targetCurrency = window[this.tradingCurrency];
                if (this.total >= this.sellLost) {
                    this.total -= this.sellLost;
                    targetCurrency.total += this.sellGain;
                }
            }
        }
    }

    buyCurrency() {
        if (Singularity.level >= 1 && this.buyPercent == 1) {
            for (let i = 0; i < flippingSpeed; i++) {
                const targetCurrency = window[this.tradingCurrency];
                if (targetCurrency.total >= this.buyLost) {
                    this.total += this.buyGain;
                    targetCurrency.total -= this.buyLost;
                }
            }
        }
    }

    testTradePhantom(isSelling) {
        console.log(`Testing ${this.name} ${isSelling ? 'sell' : 'buy'} trade:`);
        
        // Temporarily set flippingSpeed if it doesn't exist
        const originalFlippingSpeed = window.flippingSpeed;
        window.flippingSpeed = window.flippingSpeed || 1;
        
        // Create phantom currencies - clones that won't affect the game state
        const phantomSource = new Currency(
            this.name, 
            this.rate, 
            1000, // Start with plenty of currency
            this.sellRate,
            isSelling ? 1 : 0, // Enable selling or buying based on test
            this.buyRate,
            isSelling ? 0 : 1,
            this.tradingCurrency,
            this.sellGain,
            this.sellLost,
            this.buyGain,
            this.buyLost
        );
        
        // Find the target currency and create a phantom version
        const realTarget = window[this.tradingCurrency];
        if (!realTarget) {
            console.error(`Target currency '${this.tradingCurrency}' not found!`);
            return false;
        }
        
        const phantomTarget = new Currency(
            realTarget.name,
            realTarget.rate,
            1000, // Start with plenty of currency
            realTarget.sellRate,
            0,
            realTarget.buyRate,
            0,
            realTarget.tradingCurrency,
            realTarget.sellGain,
            realTarget.sellLost,
            realTarget.buyGain,
            realTarget.buyLost
        );
        
        // Store the real target in the window so the phantom currency can find it
        const originalTarget = window[this.tradingCurrency];
        window[this.tradingCurrency] = phantomTarget;
        
        // Record initial values
        const initialSourceAmount = phantomSource.total;
        const initialTargetAmount = phantomTarget.total;
        
        // Perform one trade operation
        if (isSelling) {
            phantomSource.sellCurrency();
        } else {
            phantomSource.buyCurrency();
        }
        
        // Restore the original target
        window[this.tradingCurrency] = originalTarget;
        
        // Log current trading values
        console.log('Current trading values:');
        console.log(`- sellRate: ${this.sellRate}, sellGain: ${this.sellGain}, sellLost: ${this.sellLost}`);
        console.log(`- buyRate: ${this.buyRate}, buyGain: ${this.buyGain}, buyLost: ${this.buyLost}`);
        
        // Additional sanity checks for trading rates
        const errors = [];
        
        // Skip validation for base currencies or currencies that don't trade
        const isBaseCurrency = this.name === 'Chaos' || (this.tradingCurrency === 'None');

        if (!isBaseCurrency) {
            // Check 1: Basic validation of trading rates
            if (this.tradingCurrency === 'Chaos' || this.tradingCurrency === 'Exalted') {
                // Simple check: when trading with Chaos/Exalted, ensure rates make sense
                if (this.sellLost <= 0 || this.sellGain <= 0 || this.buyLost <= 0 || this.buyGain <= 0) {
                    errors.push(`${this.name} has invalid trading rates (must be > 0)`);
                }
            }
            
            // Check 2: Universal trade loop protection
            // For high-value currencies (like Exalted):
            // - When selling 1 Exalted → get 125 Chaos
            // - When buying 1 Exalted → spend 150 Chaos
            // - Result: Lost 25 Chaos in the trade loop
            if (this.tradingCurrency === 'Chaos' || this.tradingCurrency === 'Exalted') {
                // Check if there's a proper spread between sell and buy rates
                const highValueCurrencyCheck = ['Divine', 'Exalted', 'Eternal', 'Mirror', 'Annulment'].includes(this.name);
                
                if (highValueCurrencyCheck) {
                    // High-value currency check:
                    // When selling 1 unit, you should get LESS trading currency than what's required to buy 1 unit back
                    if (this.sellGain >= this.buyLost) {
                        errors.push(`${this.name} has exploitable trade loop: Sell 1 ${this.name} for ${this.sellGain} ${this.tradingCurrency}, but buy 1 ${this.name} for only ${this.buyLost} ${this.tradingCurrency}`);
                    } else {
                        console.log(`Trade loop protected: Selling 1 ${this.name} gives ${this.sellGain} ${this.tradingCurrency}, buying 1 ${this.name} costs ${this.buyLost} ${this.tradingCurrency} (loss of ${this.buyLost - this.sellGain} ${this.tradingCurrency})`);
                    }
                } else {
                    // Regular currency check:
                    // When selling X units to get 1 trading currency, you should get LESS than X units when buying
                    if (this.sellLost <= this.buyGain) {
                        errors.push(`${this.name} has exploitable trade loop: Sell ${this.sellLost} to get 1 ${this.tradingCurrency}, but 1 ${this.tradingCurrency} buys ${this.buyGain} ${this.name}`);
                    } else {
                        console.log(`Trade loop protected: Selling ${this.sellLost} ${this.name} gives 1 ${this.tradingCurrency}, buying with 1 ${this.tradingCurrency} gives ${this.buyGain} ${this.name} (loss of ${this.sellLost - this.buyGain} ${this.name})`);
                    }
                }
            }
        }
        
        // Calculate expected results for a single trade
        let expectedSource, expectedTarget;
        
        if (isSelling) {
            expectedSource = initialSourceAmount - phantomSource.sellLost;
            expectedTarget = initialTargetAmount + phantomSource.sellGain;
            
            console.log(`${this.name} sell test:`);
            console.log(`- When selling: ${phantomSource.sellLost} ${this.name} → ${phantomSource.sellGain} ${this.tradingCurrency}`);
        } else {
            expectedSource = initialSourceAmount + phantomSource.buyGain;
            expectedTarget = initialTargetAmount - phantomSource.buyLost;
            
            console.log(`${this.name} buy test:`);
            console.log(`- When spending ${phantomSource.buyLost} ${this.tradingCurrency} to buy ${phantomSource.buyGain} ${this.name}`);
        }
        
        // Verify results
        const sourceSuccess = phantomSource.total === expectedSource;
        const targetSuccess = phantomTarget.total === expectedTarget;
        const success = sourceSuccess && targetSuccess && errors.length === 0;
        
        console.log(`${this.name} amount: ${initialSourceAmount} → ${phantomSource.total} (Expected: ${expectedSource})`);
        console.log(`${this.tradingCurrency} amount: ${initialTargetAmount} → ${phantomTarget.total} (Expected: ${expectedTarget})`);
        
        if (errors.length > 0) {
            console.error(`Trading rate problems detected:`);
            errors.forEach(error => console.error(`- ${error}`));
            console.log(`Test FAILED (rate issues)`);
        } else {
            console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
        }
        
        if (!sourceSuccess) {
            console.error(`Source currency amount incorrect after trade!`);
        }
        if (!targetSuccess) {
            console.error(`Target currency amount incorrect after trade!`);
        }
        
        // At the end, restore the original flippingSpeed
        window.flippingSpeed = originalFlippingSpeed;
        
        return success;
    }
}



//---Define Currency
var currencyData = [
    Transmutation = new Currency('Transmutation', '0.0020831', '0', '16', '0', '15', '0', 'Chaos'),
    Armourer = new Currency('Armourer', '0.0020827', '0', '15', '0', '14', '0', 'Chaos'),
    Blacksmith = new Currency('Blacksmith', '0.0011095', '0', '10', '0', '9', '0', 'Chaos'),
    Augmentation = new Currency('Augmentation', '0.0010328', '0', '5', '0', '4', '0', 'Chaos'),
    Alteration = new Currency('Alteration', '0.0005508', '0', '5', '0', '4', '0', 'Chaos'),
    Chance = new Currency('Chance', '0.0005508', '0', '9', '0', '8', '0', 'Chaos'),
    Jeweller = new Currency('Jeweller', '0.0005508', '0', '22', '0', '21', '0', 'Chaos'),
    Chromatic = new Currency('Chromatic', '0.0005508', '0', '9', '0', '8', '0', 'Chaos'),
    Fusing = new Currency('Fusing', '0.0003443', '0', '6', '0', '5', '0', 'Chaos'),
    Alchemy = new Currency('Alchemy', '0.0002754', '0', '8', '0', '7', '0', 'Chaos'),
    Chisel = new Currency('Chisel', '0.0002754', '0', '5', '0', '4', '0', 'Chaos'),
    Chaos = new Currency('Chaos', '0.0001652', '0', '1', '0', '1', '0', 'Chaos'),
    Scouring = new Currency('Scouring', '0.0001377', '0', '3', '0', '2', '0', 'Chaos'),
    Vaal = new Currency('Vaal', '0.0000689', '0', '2', '0', '2', '0', 'Chaos'),
    Regret = new Currency('Regret', '0.0000689', '0', '4', '0', '3', '0', 'Chaos'),
    Glassblower = new Currency('Glassblower', '0.0000682', '0', '8', '0', '7', '0', 'Chaos'),
    GCP = new Currency('GCP', '0.0000275', '0', '2', '0', '1', '0', 'Chaos'),
    Blessed = new Currency('Blessed', '0.0000275', '0', '15', '0', '14', '0', 'Chaos'),
    Regal = new Currency('Regal', '0.0000207', '0', '5', '0', '4', '0', 'Chaos'),
    Exalted = new Currency('Exalted', '0.0000055', '0', '125', '0', '150', '0', 'Chaos', 125, 1, 1, 150),
    Divine = new Currency('Divine', '0.0000034', '0', '10', '0', '10', '0', 'Chaos', 10, 1, 1, 10),
    Eternal = new Currency('Eternal', '0.0000003', '0', '25', '0', '50', '0', 'Exalted', 25, 1, 1, 50),
    Mirror = new Currency('Mirror', '0.0000001', '0', '200', '0', '250', '0', 'Exalted', 200, 1, 1, 250),
    StackedDeck = new Currency('StackedDeck', '0.0002000', '0', '2', '0', '1', '0', 'Chaos'),
    SilverCoin = new Currency('SilverCoin', '0.0002000', '0', '11', '0', '10', '0', 'Chaos'),
    Annulment = new Currency('Annulment', '0.0000075', '0', '4', '0', '5', '0', 'Chaos', 4, 1, 1, 5),
    SimpleSextant = new Currency('SimpleSextant', '0.0001650', '0', '3', '0', '3', '0', 'Chaos'),
    PrimeSextant = new Currency('PrimeSextant', '0.0000650', '0', '2', '0', '2', '0', 'Chaos'),
    AwakenedSextant = new Currency('AwakenedSextant', '0.0000350', '0', '1', '0', '1', '0', 'Chaos'),
    Awakener = new Currency('Awakener', '0.0000002', '0', '10', '0', '20', '0', 'Exalted', 10, 1, 1, 20),
    Crusader = new Currency('Crusader', '0.0000002', '0', '10', '0', '20', '0', 'Exalted', 10, 1, 1, 20),
    Hunter = new Currency('Hunter', '0.0000002', '0', '10', '0', '20', '0', 'Exalted', 10, 1, 1, 20),
    Redeemer = new Currency('Redeemer', '0.0000002', '0', '10', '0', '20', '0', 'Exalted', 10, 1, 1, 20),
    Warlord = new Currency('Warlord', '0.0000002', '0', '10', '0', '20', '0', 'Exalted', 10, 1, 1, 20),
    Sulphite = new Currency('Sulphite', '0.0000650', '0', '0', '0', '0', '0', 'None'),
];

//---Main
function rollCurrencyTick(exileName) {
    for (let i = 0; i < currencyData.length; i++) {
        currencyData[i].rollCurrency(exileName);
    }
};

function sellCurrencyTick() {
    for (let i = 0; i < currencyData.length; i++) {
        currencyData[i].sellCurrency();
    }
};

function buyCurrencyTick() {
    for (let i = 0; i < currencyData.length; i++) {
        currencyData[i].buyCurrency();
    }
};

function updateCurrencyClass() {
    for (let i = 0; i < currencyData.length; i++) {
        document.getElementsByClassName(currencyData[i].name)[0].innerHTML = numeral(currencyData[i].total).format('0,0', Math.floor);
    }
}

setInterval(function gameTick() {
    for (let i = 0; i < exileData.length; i++) {
        if (exileData[i].dropRate > 0) {
            rollCurrencyTick(exileData[i]);
        }
    }
    sellCurrencyTick();
    buyCurrencyTick();

    updateCurrencyClass();
}, 100);

//---Sliders
function slideSell(currency) {
    if (document.getElementById(currency.name + "SellSlider").checked == true) {
        currency.sellSetCurrency(1);
    } else {
        currency.sellSetCurrency(0);
    }
}

function slideBuy(currency) {
    if (document.getElementById(currency.name + "BuySlider").checked == true) {
        currency.buySetCurrency(1);
    } else {
        currency.buySetCurrency(0);
    }
}

function handleSliderChange(currency, type) {
    const isChecked = document.getElementById(`${currency.name}${type}Slider`).checked;
    type === 'Sell' ? currency.sellSetCurrency(isChecked ? 1 : 0)
        : currency.buySetCurrency(isChecked ? 1 : 0);
}

// Create switches when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Helper function to get proper display name
    function getDisplayName(name) {
        const displayNames = {
            'Armourer': "Armourer's Scrap",
            'Blacksmith': "Blacksmith's Whetstone",
            'Glassblower': "Glassblower's Bauble",
            'Jeweller': "Jeweller's Orb",
            'GCP': "Gemcutter's Prism",
            'Chisel': "Cartographer's Chisel",
            'Awakener': "Awakener's Orb",
            'Crusader': "Crusader's Exalted Orb",
            'Hunter': "Hunter's Exalted Orb",
            'Redeemer': "Redeemer's Exalted Orb",
            'Warlord': "Warlord's Exalted Orb",
            'Mirror': "Mirror of Kalandra",
            'Alchemy': "Orb of Alchemy",
            'Transmutation': "Orb of Transmutation",
            'Augmentation': "Orb of Augmentation",
            'Alteration': "Orb of Alteration",
            'Chance': "Orb of Chance",
            'Regret': "Orb of Regret",
            'StackedDeck': "Stacked Deck",
            'SimpleSextant': "Simple Sextant",
            'PrimeSextant': "Prime Sextant",
            'AwakenedSextant': "Awakened Sextant",
            'SilverCoin': "Silver Coin",
            'Scouring': "Orb of Scouring",
            'Fusing': "Orb of Fusing",
            'Annulment': "Orb of Annulment",
        };
        return displayNames[name] || `${name} Orb`;
    }

    // Create currency switch
    function createCurrencySwitch(currency, type) {
        const kebabCase = currency.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const containerId = `${kebabCase}-currency-${type}-switch-container`;
        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`Missing container for ${currency.name}`);
            return;
        }

        const ratio = type === 'sell' ? currency.sellRate : currency.buyRate;
        const baseType = `${currency.tradingCurrency} Orb`;

        // Format ratio based on currency type and trading direction
        const formattedRatio = currency.tradingCurrency === 'Exalted' ||
            ['Annulment', 'Divine', 'Exalted'].includes(currency.name)
            ? `1:${ratio}`
            : `${ratio}:1`;

        const switchInstance = UISwitch.create({
            id: `${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`,
            text: `${getDisplayName(currency.name)} ${formattedRatio} ${baseType}`,
            onChange: (e) => type === 'sell'
                ? slideSell(window[currency.name])
                : slideBuy(window[currency.name]),
            extraClasses: [`${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`]
        });

        container.appendChild(switchInstance);

        // Add hover effect directly here
        $(`.${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`).hover(
            function () {
                $(`.${currency.name}`).addClass('hover-buy-sell');
                $(`.${currency.tradingCurrency}`).addClass('hover-trade');
            },
            function () {
                $(`.${currency.name}`).removeClass('hover-buy-sell');
                $(`.${currency.tradingCurrency}`).removeClass('hover-trade');
            }
        );
    }

    // Create all switches
    currencyData.forEach(currency => {
        if (currency.name === 'Sulphite') return;
        createCurrencySwitch(currency, 'sell');
        createCurrencySwitch(currency, 'buy');
    });
});

// Test runner function
function testAllCurrenciesPhantom() {
    console.log("=== PHANTOM CURRENCY TRADING TEST ===");
    
    // Temporarily set required variables
    const oldSingularityLevel = window.Singularity ? Singularity.level : 0;
    const oldFlippingSpeed = window.flippingSpeed;
    
    window.Singularity = window.Singularity || {};
    window.Singularity.level = 1;
    window.flippingSpeed = window.flippingSpeed || 1;
    
    let passedSell = 0;
    let passedBuy = 0;
    let totalTests = 0;
    
    for (let i = 0; i < currencyData.length; i++) {
        const currency = currencyData[i];
        if (currency.tradingCurrency === 'None') continue;
        
        totalTests += 2;
        if (currency.testTradePhantom(true)) passedSell++;
        if (currency.testTradePhantom(false)) passedBuy++;
    }
    
    // Restore original values
    window.Singularity.level = oldSingularityLevel;
    window.flippingSpeed = oldFlippingSpeed;
    
    console.log(`=== TEST SUMMARY ===`);
    console.log(`Sell tests: ${passedSell}/${totalTests/2} passed`);
    console.log(`Buy tests: ${passedBuy}/${totalTests/2} passed`);
    console.log(`Overall: ${passedSell + passedBuy}/${totalTests} passed`);
}

testAllCurrenciesPhantom()