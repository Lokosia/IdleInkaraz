// Modularized Delve integration
import { initDelvingUI } from './js/components/DelveUI.js';
import { delve, getDelveState, setDelveLoadingProgress, incrementDelveLoadingProgress } from './js/components/DelveSystem.js';

var sulphiteDepth = 1;
var sulphiteCost = 110;

var delveLoadingProgress = 0;

// Initialize the Delving UI when the document is loaded
// (This should eventually be moved to game.js)
document.addEventListener('DOMContentLoaded', function() {
    initDelvingUI();
});

// Delve tick and loading bar animation logic (should be moved to game.js)
// These require access to Melvin, Sulphite, and upgradeDropRate from the main game state
setInterval(function delveTick() {
	if (Melvin.level >= 1) {
		delve();
	}
}, 100); //every 2.5 seconds

setInterval(function delveLoadingBarAnimate() {
	if (delveLoadingProgress >= 1) {
		delveLoadingProgress += 5;
		let e = document.querySelector('#delveLoader');
		componentHandler.upgradeElement(e);
		e.MaterialProgress.setProgress(delveLoadingProgress);
		if (delveLoadingProgress >= 100) {
			delveLoadingProgress = 0;
			e.MaterialProgress.setProgress(delveLoadingProgress);
		}
	}
}, 100); //every 0.1 seconds
