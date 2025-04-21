'use strict';

/**
 * Generates the HTML string for the application side panel (drawer).
 * @returns {string} The HTML string for the side panel.
 */
export function createSidePanelHTML() {
    return `
        <header class="demo-drawer-header">
            <img src="images/exalted.png" class="demo-avatar">
            <div class="demo-avatar-dropdown">
                <span>Idle Exile</span>
                <div class="mdl-layout-spacer"></div>
            </div>
        </header>
        <nav class="demo-navigation mdl-navigation mdl-color--blue-grey-800">
            <a class="mdl-navigation__link menuHover" href="#" id="nav-main"><i
                    class="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Main</a>

            <a class="mdl-navigation__link menuHover" href="#" id="nav-guild"><i
                    class="mdl-color-text--blue-grey-400 material-icons" role="presentation">face</i>Guild</a>

            <a class="mdl-navigation__link menuHover" href="#" id="nav-flipping"><i
                    class="mdl-color-text--blue-grey-400 material-icons"
                    role="presentation">trending_up</i>Flipping</a>

            <a class="mdl-navigation__link menuHover" href="#" id="nav-delving"><i
                    class="mdl-color-text--blue-grey-400 material-icons" role="presentation">timeline</i>Delving</a>

            <a class="mdl-navigation__link menuHover" href="#" id="nav-crafting"><i
                    class="mdl-color-text--blue-grey-400 material-icons" role="presentation">gesture</i>Crafting</a>

            <div class="mdl-layout-spacer"></div>
            <a class="mdl-navigation__link menuHover" href="#" id="nav-info"><i
                    class="mdl-color-text--blue-grey-400 material-icons"
                    role="presentation">help_outline</i>Info</a>
        </nav>
    `;
}
