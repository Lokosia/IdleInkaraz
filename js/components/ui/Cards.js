class UICard {
    static create({ 
        id = '', 
        title = '', 
        content = '', 
        actions = '', 
        actionSections = [],
        size = 'third',
        extraClasses = [] 
    }) {
        const card = document.createElement('div');
        card.id = id;
        card.className = `${UI_CLASSES.card.container} ${UI_CLASSES.card.cell[size]} ${extraClasses.join(' ')}`;
        
        const titleSection = this.createTitle(title);
        const contentSection = this.createContent(content);
        
        card.appendChild(titleSection);
        card.appendChild(contentSection);
        
        // Handle both legacy single actions and new multiple action sections
        if (actions) {
            const actionsSection = this.createActions(actions);
            card.appendChild(actionsSection);
        }
        
        // Add multiple action sections if provided
        if (actionSections && actionSections.length > 0) {
            actionSections.forEach(section => {
                const actionSection = this.createActionSection(section.content, section.className);
                card.appendChild(actionSection);
            });
        }
        
        return card;
    }

    static createTitle(text) {
        const titleDiv = document.createElement('div');
        titleDiv.className = UI_CLASSES.card.title;
        
        const titleText = document.createElement('h2');
        titleText.className = UI_CLASSES.card.titleText;
        titleText.textContent = text;
        
        titleDiv.appendChild(titleText);
        return titleDiv;
    }

    static createContent(content) {
        const contentDiv = document.createElement('div');
        contentDiv.className = UI_CLASSES.card.supporting;
        
        if (typeof content === 'string') {
            contentDiv.innerHTML = content;
        } else if (content instanceof Node) {
            contentDiv.appendChild(content);
        }
        
        return contentDiv;
    }

    static createActions(actions) {
        return this.createActionSection(actions, UI_CLASSES.card.actions);
    }
    
    static createActionSection(content, className = UI_CLASSES.card.actions) {
        const actionDiv = document.createElement('div');
        actionDiv.className = className;
        
        if (typeof content === 'string') {
            actionDiv.innerHTML = content;
        } else if (content instanceof Node) {
            actionDiv.appendChild(content);
        }
        
        return actionDiv;
    }
}

export { UICard };