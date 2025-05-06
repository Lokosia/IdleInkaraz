import { UISwitch } from '../ui/UISwitch.js';
import { currencyData, currencyMap } from './CurrencyData.js';
import { hoverUpgrades, clearAllHoverCurrencies } from './HoverState.js';
import { select, selectAll, show, hide, on, off, onHover } from '../../../js/libs/DOMUtils.js';
// Don't import numeral as it's a global variable
// import '../../libs/Numerals.js'; 

// CurrencyUI.js - Handles all currency-related UI rendering and events
/**
 * Toggles the buy/sell state for a currency based on the slider UI.
 * @param {Currency} currency - The currency object to toggle.
 * @param {string} operation - 'sell' or 'buy'.
 */
function toggleCurrencyOperation(currency, operation) {
    const method = operation === 'sell' ? 'sellSetCurrency' : 'buySetCurrency';
    const sliderId = `${currency.name}${operation.charAt(0).toUpperCase() + operation.slice(1)}Slider`;
    const isChecked = document.getElementById(sliderId).checked;
    currency[method](isChecked ? 1 : 0);
}

/**
 * Creates a UI switch (slider) for buying or selling a currency.
 * @param {Currency} currency - The currency object.
 * @param {string} type - 'sell' or 'buy'.
 * @returns {HTMLElement} The switch container element.
 */
function createSwitch(currency, type) {
    const kebabCase = currency.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const containerId = `${kebabCase}-currency-${type}-switch-container`;
    const container = document.createElement('div');
    container.id = containerId;
    container.classList.add(`${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`);

    const ratio = type === 'sell' ? currency.sellRate : currency.buyRate;
    const baseType = `${currency.tradingCurrency} Orb`;
    const formattedRatio = currency.tradingCurrency === 'Exalted' ||
        ['Annulment', 'Divine', 'Exalted'].includes(currency.name)
        ? `1:${ratio}`
        : `${ratio}:1`;

    const switchInstance = UISwitch.create({
        id: `${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`,
        text: `${currency.displayName} ${formattedRatio} ${baseType}`,
        onChange: (e) => toggleCurrencyOperation(currency, type),
        extraClasses: [`${currency.name}${type.charAt(0).toUpperCase() + type.slice(1)}Slider`]
    });

    container.appendChild(switchInstance);
    return container;
}

/**
 * Creates a display element for a currency's value.
 * @param {Currency} currency - The currency object.
 * @returns {HTMLElement} The display container element.
 */
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

/**
 * Sets up the currency UI: switches and value displays for all currencies.
 * @returns {void}
 */
function setupCurrencyUI() {
    const sellCurrencyContainer = document.getElementById('sellCurrencyContainer');
    const buyCurrencyContainer = document.getElementById('buyCurrencyContainer');
    const currencyDisplayContainer = document.getElementById('currencyDisplayContainer');
    currencyData.forEach(currency => {
        if (currency.name === 'Sulphite') return;
        const sellSwitch = createSwitch(currency, 'sell');
        sellCurrencyContainer.appendChild(sellSwitch);
        const buySwitch = createSwitch(currency, 'buy');
        buyCurrencyContainer.appendChild(buySwitch);
        const currencyDisplay = createDisplay(currency);
        currencyDisplayContainer.appendChild(currencyDisplay);
        // Attach robust hover logic to each slider using hoverUpgrades
        // Sell slider
        const sellSliderId = `${currency.name}SellSlider`;
        if (document.getElementById(sellSliderId)) {
            hoverUpgrades(sellSliderId, currency.name, currency.tradingCurrency);
        }
        // Buy slider
        const buySliderId = `${currency.name}BuySlider`;
        if (document.getElementById(buySliderId)) {
            hoverUpgrades(buySliderId, currency.name, currency.tradingCurrency);
        }
    });
}

/**
 * Updates the displayed value for each currency in the UI.
 * @returns {void}
 */
function updateCurrencyClass() {
    for (let i = 0; i < currencyData.length; i++) {
        const el = document.getElementsByClassName(currencyData[i].name)[0];
        if (el) {
            el.innerHTML = numeral(currencyData[i].total).format('0,0', Math.floor);
        } else {
            // Optionally log a warning for missing element
            // console.warn(`Currency UI element not found for: ${currencyData[i].name}`);
        }
    }
}

/**
 * Shows the default currency view (main screen).
 * Hides buy/sell panels and shows the main theorycrafting view.
 * @returns {void}
 */
function showDefaultCurrencyView() {
    hide("#divBuyCurrency");
    hide("#divSellCurrency");
    show("#divTheorycrafting");
    hide("#divSingularity");
    hide("#divFlipping");
    
    const mainCurrency = select("#MainCurrency");
    if (mainCurrency) {
        mainCurrency.classList.remove("mdl-cell--4-col", "mdl-cell--4-col-tablet");
        mainCurrency.classList.add("mdl-cell--3-col", "mdl-cell--3-col-tablet");
    }
    
    // Clear any currency hover effects from flipping view
    clearAllHoverCurrencies();
}

/**
 * Shows the flipping (currency trading) view.
 * Displays buy/sell panels and the flipping UI.
 * @returns {void}
 */
function showFlippingView() {
    // Show the required UI panels
    show("#divBuyCurrency");
    show("#divSellCurrency");
    hide("#divTheorycrafting");
    show("#divSingularity");
    show("#divFlipping");
    
    const mainCurrency = select("#MainCurrency");
    if (mainCurrency) {
        mainCurrency.classList.remove("mdl-cell--3-col", "mdl-cell--3-col-tablet");
        mainCurrency.classList.add("mdl-cell--4-col", "mdl-cell--4-col-tablet");
    }
    
    // Clear any existing hover effects
    clearAllHoverCurrencies();
    
    // Wait until the DOM is fully updated
    setTimeout(() => {
        // Apply direct hover effects using vanilla JS event delegation
        currencyData.forEach(currency => {
            if (currency.name === 'Sulphite') return;
            
            // Process SELL slider - when selling:
            // - The currency you're selling (main) is outflow (red)
            // - The currency you're receiving (trading) is inflow (green)
            const sellSliderId = `${currency.name}SellSlider`;
            const sellSliderLabel = select(`label[for="${sellSliderId}"]`);
            
            if (sellSliderLabel) {
                // Remove any existing handlers (equivalent to jQuery's .off())
                const oldEnterHandler = sellSliderLabel._enterHandler;
                const oldLeaveHandler = sellSliderLabel._leaveHandler;
                if (oldEnterHandler) off(sellSliderLabel, 'mouseenter', oldEnterHandler);
                if (oldLeaveHandler) off(sellSliderLabel, 'mouseleave', oldLeaveHandler);
                
                // Create new handlers
                const enterHandler = function() {
                    // Main currency (being sold) = outflow (red)
                    selectAll(`.${currency.name}`).forEach(el => {
                        el.classList.remove('hover', 'hover-inflow', 'hover-trade', 'hover-buy-sell');
                        el.classList.add('hover-outflow');
                    });
                    
                    // Trading currency (being received) = inflow (green)
                    selectAll(`.${currency.tradingCurrency}`).forEach(el => {
                        el.classList.remove('hover', 'hover-outflow', 'hover-trade', 'hover-buy-sell');
                        el.classList.add('hover-inflow');
                    });
                };
                
                const leaveHandler = function() {
                    // Remove all highlight classes
                    selectAll(`.${currency.name}`).forEach(el => {
                        el.classList.remove('hover', 'hover-outflow', 'hover-inflow', 'hover-trade', 'hover-buy-sell');
                    });
                    selectAll(`.${currency.tradingCurrency}`).forEach(el => {
                        el.classList.remove('hover', 'hover-outflow', 'hover-inflow', 'hover-trade', 'hover-buy-sell');
                    });
                };
                
                // Store handlers for future removal
                sellSliderLabel._enterHandler = enterHandler;
                sellSliderLabel._leaveHandler = leaveHandler;
                
                // Attach new handlers
                on(sellSliderLabel, 'mouseenter', enterHandler);
                on(sellSliderLabel, 'mouseleave', leaveHandler);
            }
            
            // Process BUY slider - when buying:
            // - The currency you're receiving (main) is inflow (green)
            // - The currency you're spending (trading) is outflow (red)
            const buySliderId = `${currency.name}BuySlider`;
            const buySliderLabel = select(`label[for="${buySliderId}"]`);
            
            if (buySliderLabel) {
                // Remove any existing handlers
                const oldEnterHandler = buySliderLabel._enterHandler;
                const oldLeaveHandler = buySliderLabel._leaveHandler;
                if (oldEnterHandler) off(buySliderLabel, 'mouseenter', oldEnterHandler);
                if (oldLeaveHandler) off(buySliderLabel, 'mouseleave', oldLeaveHandler);
                
                // Create new handlers
                const enterHandler = function() {
                    // Main currency (being bought/received) = inflow (green)
                    selectAll(`.${currency.name}`).forEach(el => {
                        el.classList.remove('hover', 'hover-outflow', 'hover-trade', 'hover-buy-sell');
                        el.classList.add('hover-inflow');
                    });
                    
                    // Trading currency (being spent) = outflow (red)
                    selectAll(`.${currency.tradingCurrency}`).forEach(el => {
                        el.classList.remove('hover', 'hover-inflow', 'hover-trade', 'hover-buy-sell');
                        el.classList.add('hover-outflow');
                    });
                };
                
                const leaveHandler = function() {
                    // Remove all highlight classes
                    selectAll(`.${currency.name}`).forEach(el => {
                        el.classList.remove('hover', 'hover-outflow', 'hover-inflow', 'hover-trade', 'hover-buy-sell');
                    });
                    selectAll(`.${currency.tradingCurrency}`).forEach(el => {
                        el.classList.remove('hover', 'hover-outflow', 'hover-inflow', 'hover-trade', 'hover-buy-sell');
                    });
                };
                
                // Store handlers for future removal
                buySliderLabel._enterHandler = enterHandler;
                buySliderLabel._leaveHandler = leaveHandler;
                
                // Attach new handlers
                on(buySliderLabel, 'mouseenter', enterHandler);
                on(buySliderLabel, 'mouseleave', leaveHandler);
            }
        });
        
        console.log("Intuitive color-coded hover effects applied to currency flipping view");
    }, 150); // Slightly longer delay to ensure DOM is fully ready
}

export { setupCurrencyUI, updateCurrencyClass, showDefaultCurrencyView, showFlippingView };