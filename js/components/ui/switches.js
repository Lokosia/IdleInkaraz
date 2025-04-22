class UISwitch {
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