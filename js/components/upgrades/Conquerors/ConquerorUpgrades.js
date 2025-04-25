// ConquerorUpgrades.js
// Handles conqueror upgrades system logic and UI
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { generateUpgradeCellsHTML } from '../../ui/UpgradeUI.js'

/**
 * Handles the purchase of a conqueror upgrade.
 * Consumes a conqueror currency, increases upgrade drop rate, updates UI, and shows a success message.
 *
 * @param {Object} upgradesObj - The upgrades state object to modify (should have upgradeDropRate).
 * @param {Object} conqueror - The conqueror currency object (should have name and total).
 * @returns {void}
 */
export function buyConqueror(upgradesObj, conqueror) {
	handlePurchase({
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

/**
 * Renders conqueror upgrade rows in the upgrade table and attaches event listeners.
 * Shows/hides rows based on currency availability and applies hover effects.
 *
 * @param {Object} upgradesObj - The upgrades state object to modify.
 * @param {Function} hoverUpgrades - Function to apply hover effects to upgrade rows.
 * @returns {void}
 */
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

            const cellsHTML = generateUpgradeCellsHTML(
                name,           // upgradeKey
                'Conqueror',    // upgradeType
                description,
                benefit,
                cost,           // requirements text
                buttonText,
                buttonId
            );

			row.html(cellsHTML);
			const table = $('#UpgradeTable');
			table.prepend(row);
            
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
