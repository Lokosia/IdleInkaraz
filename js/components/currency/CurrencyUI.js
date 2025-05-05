import { UISwitch } from '../ui/UISwitch.js';
import { currencyData, currencyMap } from './CurrencyData.js';
import { hoverUpgrades } from './HoverState.js';

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
    $("#divBuyCurrency").hide();
    $("#divSellCurrency").hide();
    $("#divTheorycrafting").show();
    $("#divSingularity").hide();
    $("#divFlipping").hide();
    $("#MainCurrency")
        .removeClass("mdl-cell--4-col mdl-cell--4-col-tablet")
        .addClass("mdl-cell--3-col mdl-cell--3-col-tablet");
}

/**
 * Shows the flipping (currency trading) view.
 * Displays buy/sell panels and the flipping UI.
 * @returns {void}
 */
function showFlippingView() {
    $("#divBuyCurrency").show();
    $("#divSellCurrency").show();
    $("#divTheorycrafting").hide();
    $("#divSingularity").show();
    $("#divFlipping").show();
    $("#MainCurrency")
        .removeClass("mdl-cell--3-col mdl-cell--3-col-tablet")
        .addClass("mdl-cell--4-col mdl-cell--4-col-tablet");
}

export { setupCurrencyUI, updateCurrencyClass, showDefaultCurrencyView, showFlippingView };