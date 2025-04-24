import { UISwitch } from '../ui/UISwitch.js';
import { currencyData, currencyMap } from './CurrencyData.js';

// CurrencyUI.js - Handles all currency-related UI rendering and events
function toggleCurrencyOperation(currency, operation) {
    const method = operation === 'sell' ? 'sellSetCurrency' : 'buySetCurrency';
    const sliderId = `${currency.name}${operation.charAt(0).toUpperCase() + operation.slice(1)}Slider`;
    const isChecked = document.getElementById(sliderId).checked;
    currency[method](isChecked ? 1 : 0);
}

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
    });
    // Add hover effect using event delegation
    $('#sellCurrencyContainer, #buyCurrencyContainer').on('mouseenter', '[class*="Slider"]', function () {
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
}

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

// Show the default currency view (main screen)
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

// Show the flipping view (currency trading)
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