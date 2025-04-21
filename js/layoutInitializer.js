'use strict';

import { createHeaderHTML } from './components/layout/Header.js';
import { createSidePanelHTML } from './components/layout/SidePanel.js';

document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidePanelPlaceholder = document.getElementById('side-panel-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = createHeaderHTML();
    }

    if (sidePanelPlaceholder) {
        sidePanelPlaceholder.innerHTML = createSidePanelHTML();
    }

    // IMPORTANT: Upgrade the DOM elements after injecting the HTML
    // This ensures MDL components (like buttons, layout, progress) are initialized.
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeDom();

        // Hide the loader now that MDL has processed it
        const loaderElement = document.getElementById('loader');
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }

    } else {
        console.error('Material Design Lite (componentHandler) not found. Ensure MDL script is loaded before this initializer.');
    }
});
