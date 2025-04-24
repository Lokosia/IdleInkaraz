import { currencyData } from './components/currency/CurrencyData.js';

export function addClickListener(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
}

export function processCurrencyOperation(operation, param) {
    for (let i = 0; i < currencyData.length; i++) {
        if (param !== undefined) {
            currencyData[i][operation](param);
        } else {
            currencyData[i][operation]();
        }
    }
}