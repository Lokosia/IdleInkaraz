import State from './State.js';

/**
 * Displays a Material Design snackbar notification with the given message.
 * Prevents overlapping snackbars using a timer in State.
 *
 * @param {string} input - The message to display in the snackbar.
 * @returns {void}
 */
export function SnackBar(input) {
	if (State.snackBarTimer <= 0) {
		'use strict';
		var snackbarContainer = document.querySelector('#snackBar');
		var data = { message: input, timeout: 1500 };
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
		State.snackBarTimer = 1500;
	}
}

/**
 * Adds hover effects to an upgrade row, highlighting the relevant currency classes.
 * Removes previous listeners to prevent duplicates.
 *
 * @param {string} elementId - The DOM element ID for the upgrade row.
 * @param {string} currencyClass1 - The first currency class to highlight.
 * @param {string} [currencyClass2] - The second currency class to highlight (optional).
 * @returns {void}
 */
export function hoverUpgrades(elementId, currencyClass1, currencyClass2) {
	const element = $(`#${elementId}`);
	if (!element.length) {
		console.warn(`Element with ID #${elementId} not found for hover effect.`);
		return;
	}
	// Remove existing hover listeners to prevent duplicates
	element.off('mouseenter mouseleave');
	element.hover(
		function () {
			$(`.${currencyClass1}`).addClass('hover');
			if (currencyClass2) {
				$(`.${currencyClass2}`).addClass('hover');
			}
		}, function () {
			$(`.${currencyClass1}`).removeClass('hover');
			if (currencyClass2) {
				$(`.${currencyClass2}`).removeClass('hover');
			}
		}
	);
}