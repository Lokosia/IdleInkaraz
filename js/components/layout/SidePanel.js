'use strict';

import { UI_CLASSES } from '../ui/UIClasses.js';

/**
 * Defines navigation items for the side panel
 * @type {Array<{id: string, icon: string, label: string}>}
 */
const navigationItems = [
    { id: 'nav-main', icon: 'home', label: 'Main' },
    { id: 'nav-guild', icon: 'face', label: 'Guild' },
    { id: 'nav-flipping', icon: 'trending_up', label: 'Flipping' },
    { id: 'nav-delving', icon: 'timeline', label: 'Delving' },
    { id: 'nav-crafting', icon: 'gesture', label: 'Crafting' },
];

/**
 * Creates a navigation link element
 * @param {string} id - The navigation item ID
 * @param {string} icon - Material icon name
 * @param {string} label - Display text
 * @returns {string} HTML string for the navigation link
 */
function createNavigationLink(id, icon, label) {
    return `
        <a class="${UI_CLASSES.navigation.link}" href="#" id="${id}">
            <i class="${UI_CLASSES.navigation.icon}" role="presentation">${icon}</i>${label}
        </a>
    `;
}

/**
 * Generates the HTML string for the application side panel (drawer).
 * @param {string} avatarPath - Path to the avatar image (defaults to "images/exalted.png")
 * @param {string} title - The title to display (defaults to "Idle Exile")
 * @returns {string} The HTML string for the side panel.
 */
export function createSidePanelHTML(avatarPath = 'images/exalted.png', title = 'Idle Exile') {
    // Generate all navigation links
    const navLinks = navigationItems
        .map(item => createNavigationLink(item.id, item.icon, item.label))
        .join('');
    
    // Add the Info link with spacer
    const infoLink = `
        <div class="mdl-layout-spacer"></div>
        ${createNavigationLink('nav-info', 'help_outline', 'Info')}
    `;

    return `
        <header class="demo-drawer-header" data-ui-class="drawer-header">
            <img src="${avatarPath}" class="${UI_CLASSES.util.avatar}" data-ui-class="avatar">
            <div class="demo-avatar-dropdown" data-ui-class="avatar-dropdown">
                <span>${title}</span>
                <div class="mdl-layout-spacer" data-ui-class="spacer"></div>
            </div>
        </header>
        <nav class="${UI_CLASSES.navigation.container}" data-ui-class="navigation-container">
            ${navLinks}
            ${infoLink}
        </nav>
    `;
}