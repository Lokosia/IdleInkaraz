import { select, selectAll, show, hide } from '../../../js/libs/DOMUtils.js';

const UIManager = {
    sections: {
        main: "#main",
        guild: "#guild",
        crafting: "#crafting",
        delving: "#delving",
        info: "#info",
    },

    /**
     * Shows the specified section and hides all others.
     * @param {string} section - The key of the section to show (e.g., 'main', 'guild').
     */
    show(section) {
        const targetSelector = this.sections[section];
        if (!targetSelector) {
            console.error(`UIManager: Section key '${section}' not found.`);
            return;
        }

        // Hide all other sections first
        Object.values(this.sections).forEach(selector => {
            if (selector !== targetSelector) {
                hide(selector);
            }
        });

        // Show the target section
        show(targetSelector);
    }
};

export default UIManager;