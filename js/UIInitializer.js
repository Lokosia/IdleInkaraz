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