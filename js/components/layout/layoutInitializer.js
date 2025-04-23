'use strict';

import { createHeaderHTML } from './Header.js';
import { createSidePanelHTML } from './SidePanel.js';
import { createGrid } from './Grid.js'; // Import the new Grid function
import { mainGridConfig } from './GridConfig.js'; // Import the grid config

export function initializeLayout() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidePanelPlaceholder = document.getElementById('side-panel-placeholder');
    const mainGridContainer = document.getElementById('mainGrid'); // Get the main grid container

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = createHeaderHTML();
    }

    if (sidePanelPlaceholder) {
        sidePanelPlaceholder.innerHTML = createSidePanelHTML();
    }

    // IMPORTANT: Upgrade the DOM elements after injecting the HTML
    // This ensures MDL components (like buttons, layout, progress) are initialized.
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeDom(); // Initial upgrade for header/side panel

        // Now create the main grid content
        if (mainGridContainer) {
            createGrid(mainGridContainer, mainGridConfig);
            // Note: createGrid handles upgrading its own elements now
        } else {
             console.error('Main grid container (#mainGrid) not found.');
        }

        // Hide the loader now that MDL has processed it
        const loaderElement = document.getElementById('loader');
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }

    } else {
        console.error('Material Design Lite (componentHandler) not found. Ensure MDL script is loaded before this initializer.');
    }
}
