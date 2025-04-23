// ConquerorUpgrades.js
// Handles conqueror upgrades system logic and UI
import { handleGenericUpgrade } from '../../exile/ExileUtils.js';
import { currencyMap } from '../../currency/CurrencyData.js';

// This function handles the purchase of a conqueror upgrade
export function buyConqueror(upgradesObj, conqueror) {
	handleGenericUpgrade({
		requirements: [{ currency: conqueror, amount: 1 }],
		onSuccess: () => {
			upgradesObj.upgradeDropRate += 1;
		},
		updateUI: () => {
			document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = upgradesObj.upgradeDropRate.toFixed(1);
			if (conqueror.total < 1) {
				$(`#${conqueror.name}Upgrade`).hide();
				$(`.${conqueror.name}`).removeClass('hover');
			}
		},
		successMessage: 'Conqueror influence consumed!'
	});
}

// Renders conqueror upgrade rows and attaches event listeners
export function renderConquerorUpgrades(upgradesObj, hoverUpgrades) {
	const conquerors = [
		currencyMap['Crusader'],
		currencyMap['Hunter'],
		currencyMap['Redeemer'],
		currencyMap['Warlord']
	];

	for (const currency of conquerors) {
		const name = currency.name;
		const rowId = `${name}Upgrade`;
		if (!$(`#${rowId}`).length) {
			const row = $(`<tr id="${rowId}"></tr>`);
			const buttonId = `btn-${name.toLowerCase()}-upgrade`;
			const buttonText = `${name}'s Exalted Orb`;
			const description = `Use ${name}'s Exalted Orb`;
			const benefit = '+1';
			const cost = `1 ${name}'s Exalted Orb`;
			const cellsHTML = `
				<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="${buttonId}">${buttonText}</button></td>
				<td class="mdl-data-table__cell--non-numeric">${description}</td>
				<td class="mdl-data-table__cell--non-numeric">${benefit}</td>
				<td class="mdl-data-table__cell--non-numeric">${cost}</td>
			`;
			row.html(cellsHTML);
			const table = $('#UpgradeTable');
			if (table.children().length > 0) {
				table.prepend(row);
			} else {
				table.append(row);
			}
			document.getElementById(buttonId)?.addEventListener('click', () => buyConqueror(upgradesObj, currency));
		}
		if (currency && currency.total >= 1) {
			$(`#${rowId}`).show();
			hoverUpgrades(rowId, name);
		} else {
			$(`#${rowId}`).hide();
		}
	}
}
