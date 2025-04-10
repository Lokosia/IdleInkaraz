class UIButton {
    static create(text, onClick, options = { raised: true, colored: true }) {
        const button = document.createElement('button');
        
        // Add base classes
        button.className = UI_CLASSES.button.base;
        
        if (options.raised) {
            button.classList.add(UI_CLASSES.button.raised);
        }
        
        if (options.colored) {
            button.classList.add(UI_CLASSES.button.colored);
        }
        
        button.textContent = text;
        button.onclick = onClick;
        
        return button;
    }
}