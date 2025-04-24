import { currencyData } from './components/currency/CurrencyData.js';
import { fossilData } from './components/delve/Fossil.js';

function initTestMode() {
	// Set 99999 of every currency
	currencyData.forEach(currency => {
		currency.total = 99999;
	});

	// Set 99999 of every fossil
	fossilData.forEach(fossil => {
		fossil.total = 99999;
		// Update the UI if the element exists
		const el = document.getElementsByClassName(fossil.name + 'Total')[0];
		if (el) {
			el.innerHTML = numeral(fossil.total).format('0,0', Math.floor);
		}
	});
	console.log('Test mode initialized with 99999 of each currency and fossil');
}

// Automatically run test mode if URL has ?test=true parameter
if (window.location.search.includes('test=true')) {
	document.addEventListener('DOMContentLoaded', initTestMode);
}

export { initTestMode };