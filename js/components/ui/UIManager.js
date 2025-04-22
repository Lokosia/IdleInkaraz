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
        Object.values(this.sections).forEach(id => $(id).hide());
        $(this.sections[section]).show();
    }
};

export default UIManager;