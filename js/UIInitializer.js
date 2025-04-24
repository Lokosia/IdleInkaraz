import State from './State.js';

export function SnackBar(input) {
	if (State.snackBarTimer <= 0) {
		'use strict';
		var snackbarContainer = document.querySelector('#snackBar');
		var data = { message: input, timeout: 1500 };
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
		State.snackBarTimer = 1500;
	}
}

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