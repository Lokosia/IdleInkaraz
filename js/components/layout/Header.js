'use strict';

import { UI_CLASSES } from '../ui/UIClasses.js';

/**
 * Generates the HTML string for the application header.
 * @returns {string} The HTML string for the header.
 */
export function createHeaderHTML() {
    return `
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">Total <span class="TotalLevel">Levels: 0</span> | Total <span
                    class="TotalDR">Efficiency: x0.0</span></span>
            <div class="${UI_CLASSES.navigation.spacer}"></div>

            &nbsp;&nbsp;<div id="loader" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
        </div>
    `;
}
