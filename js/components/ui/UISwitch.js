import { UI_CLASSES } from './UIClasses.js';

/**
 * UISwitch provides a static method to create a Material Design Lite switch (toggle) UI component.
 *
 * @class
 */
export class UISwitch {
    /**
     * Creates a switch (toggle) DOM element with the given configuration.
     * @param {Object} options - Switch configuration options.
     * @param {string} options.id - The DOM id for the input element.
     * @param {string} options.text - The label text to display next to the switch.
     * @param {Function} options.onChange - Callback for the input's oninput event.
     * @param {Array<string>} [options.extraClasses] - Extra CSS classes for the label.
     * @param {boolean} [options.checked=false] - Whether the switch is initially checked.
     * @returns {HTMLElement} The switch label DOM element.
     */
    static create({ 
        id, 
        text, 
        onChange, 
        extraClasses = [], 
        checked = false 
    }) {
        const label = document.createElement('label');
        label.className = `${UI_CLASSES.switch.container} ${extraClasses.join(' ')}`;
        label.htmlFor = id;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.className = UI_CLASSES.switch.input;
        input.checked = checked;
        input.oninput = onChange;

        const span = document.createElement('span');
        span.className = UI_CLASSES.switch.label;

        // Add text after the span
        const textNode = document.createTextNode(`\u00A0\u00A0\u00A0${text}`); // Add non-breaking spaces

        label.appendChild(input);
        label.appendChild(span);
        label.appendChild(textNode);

        // Initialize MDL component
        if (typeof componentHandler !== 'undefined') {
            componentHandler.upgradeElement(label);
        }

        return label;
    }
}