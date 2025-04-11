//---Define Class
/**
 * Represents a game currency with trading functionality
 */
class Currency {
    /**
     * Create a new currency
     * @param {string} name - The currency name
     * @param {number|string} rate - Drop rate of the currency (decimal, typically very small)
     * @param {number|string} total - Initial amount of the currency
     * @param {number|string} sellRate - Exchange rate when selling
     * @param {number|string} sellPercent - Whether selling is active (0 or 1)
     * @param {number|string} buyRate - Exchange rate when buying
     * @param {number|string} buyPercent - Whether buying is active (0 or 1)
     * @param {string} tradingCurrency - The currency to trade with
     * @param {number} [sellGain] - Override for amount of trading currency gained when selling
     * @param {number} [sellLost] - Override for amount of this currency lost when selling
     * @param {number} [buyGain] - Override for amount of this currency gained when buying
     * @param {number} [buyLost] - Override for amount of trading currency lost when buying
     * @param {string} displayName - Display name of currency
     */
    constructor(name, rate, total, sellRate, sellPercent, buyRate, buyPercent, tradingCurrency, sellGain, sellLost, buyGain, buyLost, displayName) {
        this.name = name;
        this.rate = rate; // Keep as-is for floating point precision with very small values
        this.total = Number(total); // Convert to number for math operations
        this.sellRate = Number(sellRate);
        this.sellPercent = Number(sellPercent);
        this.buyRate = Number(buyRate);
        this.buyPercent = Number(buyPercent);
        this.tradingCurrency = tradingCurrency;

        // Selling trade amounts
        this.sellGain = sellGain ?? (this.sellRate <= 1 ? this.sellRate : 1); // how much trading currency you get
        this.sellLost = sellLost ?? (this.sellRate <= 1 ? 1 : this.sellRate); // how much of current currency you spend

        // Buying trade amounts
        this.buyGain = buyGain ?? (this.buyRate <= 1 ? 1 : this.buyRate); // how much of current currency you get
        this.buyLost = buyLost ?? (this.buyRate <= 1 ? this.buyRate : 1); // how much trading currency you spend

        this.displayName = displayName;
    }

    // -------------------------
    // CURRENCY DROP METHODS
    // -------------------------

    /**
     * Generates a random number for currency drop calculation
     * @returns {string} Random number between 0.0000001 and 1 with 7 decimal places
     */
    rollCurrencyRNG() {
        let min = 0.0000001;
        let max = 1;
        let c = (Math.random() * (max - min) + min).toFixed(7);
        return c;
    }

    /**
     * Attempts to drop this currency based on RNG and drop rates
     * @param {Object} exileName - The exile character providing drop rate bonus
     */
    rollCurrency(exileName) {
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
    }

    // -------------------------
    // TRADING TOGGLE METHODS
    // -------------------------

    /**
     * Activates or deactivates selling for this currency
     * @param {number} value - 1 to activate selling, 0 to deactivate
     */
    sellSetCurrency(value) {
        if (this.buyPercent > 0) {
            this.buyPercent = 0;
            $('#' + this.name + 'BuySlider').trigger('click');
        }
        this.sellPercent = value;
    }

    /**
     * Activates or deactivates buying for this currency
     * @param {number} value - 1 to activate buying, 0 to deactivate
     */
    buySetCurrency(value) {
        if (this.sellPercent > 0) {
            this.sellPercent = 0;
            $('#' + this.name + 'SellSlider').trigger('click');
        }
        this.buyPercent = value;
    }

    // -------------------------
    // TRADING EXECUTION METHODS
    // -------------------------

    /**
     * Executes a sell operation if selling is active
     * Converts this currency to the trading currency at the sell rate
     * Called periodically by the game loop
     */
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

    /**
     * Executes a buy operation if buying is active
     * Converts trading currency to this currency at the buy rate
     * Called periodically by the game loop
     */
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
    }

//---Define Currency
// Initialize data structures
var currencyData = [];
var currencyMap = {};

// Create currency instances from configuration
CURRENCY_CONFIG.forEach(config => {
    const currency = new Currency(
        config.name, 
        config.rate, 
        0, // Starting total
        config.sellRate,
        0, // Starting sellPercent 
        config.buyRate,
        0, // Starting buyPercent
        config.tradingCurrency,
        config.sellGain,
        config.sellLost,
        config.buyGain,
        config.buyLost,
        config.displayName
    );
    
    // Add to data array for iteration
    currencyData.push(currency);
    
    // Add to map for direct access
    currencyMap[config.name] = currency;
    
    // Keep global reference for backward compatibility
    window[config.name] = currency;
});

//---Main

/**
 * Generic currency operation processor that applies a method to all currencies
 * 
 * This function serves as a central dispatcher for applying operations across all currencies.
 * It dynamically invokes the specified method on each currency object, passing optional
 * parameters when provided.
 * 
 * @param {string} operation - The Currency method name to call on each currency
 *                             (e.g., 'rollCurrency', 'sellCurrency', 'buyCurrency')
 * @param {Object} [param] - Optional parameter to pass to the method
 *                           For 'rollCurrency', this is the exile character object
 * 
 * @example
 * // Process buy operations for all currencies
 * processCurrencyOperation('buyCurrency');
 * 
 * // Process currency drops with a specific exile
 * processCurrencyOperation('rollCurrency', exileData[0]);
 */
function processCurrencyOperation(operation, param) {
    for (let i = 0; i < currencyData.length; i++) {
        if (param !== undefined) {
            currencyData[i][operation](param);
        } else {
            currencyData[i][operation]();
        }
    }
}

/**
 * Updates displayed currency values in the UI
 * Called periodically by game loop
 */
function updateCurrencyClass() {
    for (let i = 0; i < currencyData.length; i++) {
        document.getElementsByClassName(currencyData[i].name)[0].innerHTML = numeral(currencyData[i].total).format('0,0', Math.floor);
    }
}

setInterval(function gameTick() {
    for (let i = 0; i < exileData.length; i++) {
        if (exileData[i].dropRate > 0) {
            processCurrencyOperation('rollCurrency', exileData[i]);
        }
    }
    processCurrencyOperation('sellCurrency');
    processCurrencyOperation('buyCurrency');

    updateCurrencyClass();
}, 100);

//---Sliders

/**
 * Handles currency slider toggle for buy or sell operations
 * @param {Currency} currency - The currency being toggled
 * @param {string} operation - Either 'sell' or 'buy'
 */
function toggleCurrencyOperation(currency, operation) {
    const method = operation === 'sell' ? 'sellSetCurrency' : 'buySetCurrency';
    const sliderId = `${currency.name}${operation.charAt(0).toUpperCase() + operation.slice(1)}Slider`;
    const isChecked = document.getElementById(sliderId).checked;
    
    currency[method](isChecked ? 1 : 0);
}

// Create switches when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const sellCurrencyContainer = document.getElementById('sellCurrencyContainer');
    const buyCurrencyContainer = document.getElementById('buyCurrencyContainer');
    const currencyDisplayContainer = document.getElementById('currencyDisplayContainer');

    currencyData.forEach(currency => {
        if (currency.name === 'Sulphite') return;

        // Create sell switch
        const sellSwitch = createSwitch(currency, 'sell');
        sellCurrencyContainer.appendChild(sellSwitch);

        // Create buy switch
        const buySwitch = createSwitch(currency, 'buy');
        buyCurrencyContainer.appendChild(buySwitch);

        // Create currency display
        const currencyDisplay = createDisplay(currency);
        currencyDisplayContainer.appendChild(currencyDisplay);
    });

    function createSwitch(currency, type) {
        const kebabCase = currency.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const containerId = `${kebabCase}-currency-${type}-switch-container`;
        const container = document.createElement('div');
        container.id = containerId;
        container.classList.add(`${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`);

        const ratio = type === 'sell' ? currency.sellRate : currency.buyRate;
        const baseType = `${currency.tradingCurrency} Orb`;

        // Format ratio based on currency type and trading direction
        const formattedRatio = currency.tradingCurrency === 'Exalted' ||
            ['Annulment', 'Divine', 'Exalted'].includes(currency.name)
            ? `1:${ratio}`
            : `${ratio}:1`;

        const switchInstance = UISwitch.create({
            id: `${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`,
            text: `${currency.displayName} ${formattedRatio} ${baseType}`,
            onChange: (e) => toggleCurrencyOperation(window[currency.name], type),
            extraClasses: [`${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`]
        });

        container.appendChild(switchInstance);

        return container;
    }

    function createDisplay(currency) {
        const container = document.createElement('div');
        container.classList.add('currency-display');

        const label = document.createElement('span');
        label.textContent = `${currency.displayName}: `;

        const value = document.createElement('span');
        value.classList.add(currency.name);
        value.textContent = '0';

        container.appendChild(label);
        container.appendChild(value);
        container.appendChild(document.createElement('br'));

        return container;
    }
    
    // Add hover effect using event delegation
    $('#sellCurrencyContainer').on('mouseenter', '[class*="Slider"]', function () {
        const sliderClass = $(this).attr('class');
        const currencyName = sliderClass.split(' ')[0].replace('SellSlider', '').replace('BuySlider', '');
        const currency = currencyMap[currencyName];

        if (currency) {
            const tradingCurrency = currency.tradingCurrency;
            $(`.${currencyName}`).addClass('hover-buy-sell');
            $(`.${tradingCurrency}`).addClass('hover-trade');
        }
    }).on('mouseleave', '[class*="Slider"]', function () {
        const sliderClass = $(this).attr('class');
        const currencyName = sliderClass.split(' ')[0].replace('SellSlider', '').replace('BuySlider', '');
        const currency = currencyMap[currencyName];
        if (currency) {
            const tradingCurrency = currency.tradingCurrency;
            $(`.${currencyName}`).removeClass('hover-buy-sell');
            $(`.${tradingCurrency}`).removeClass('hover-trade');
        }
    });

    $('#buyCurrencyContainer').on('mouseenter', '[class*="Slider"]', function () {
        const sliderClass = $(this).attr('class');
        const currencyName = sliderClass.split(' ')[0].replace('SellSlider', '').replace('BuySlider', '');
        const currency = currencyMap[currencyName];
        if (currency) {
            const tradingCurrency = currency.tradingCurrency;
            $(`.${currencyName}`).addClass('hover-buy-sell');
            $(`.${tradingCurrency}`).addClass('hover-trade');
        }
    }).on('mouseleave', '[class*="Slider"]', function () {
        const sliderClass = $(this).attr('class');
        const currencyName = sliderClass.split(' ')[0].replace('SellSlider', '').replace('BuySlider', '');
        const currency = currencyMap[currencyName];
        if (currency) {
            const tradingCurrency = currency.tradingCurrency;
            $(`.${currencyName}`).removeClass('hover-buy-sell');
            $(`.${tradingCurrency}`).removeClass('hover-trade');
        }
    });
});

/**
 * Initializes test mode with predefined currency amounts
 * Used for development and debugging
 */
function initTestMode() {
    // Set initial currency values for testing
    currencyMap['StackedDeck'].total = 5;
    currencyMap['Chaos'].total = 100;
    currencyMap['Exalted'].total = 2;
    
    console.log('Test mode initialized with starting currencies');
}

// Make it available globally
window.initTestMode = initTestMode;

// Automatically run test mode if URL has ?test=true parameter
if (window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', initTestMode);
}