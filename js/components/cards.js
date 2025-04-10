class UICard {
    static create({ 
        id = '', 
        title = '', 
        content = '', 
        actions = '', 
        size = 'third',
        extraClasses = [] 
    }) {
        const card = document.createElement('div');
        card.id = id;
        card.className = `${UI_CLASSES.card.container} ${UI_CLASSES.card.cell[size]} ${extraClasses.join(' ')}`;
        
        const titleSection = this.createTitle(title);
        const contentSection = this.createContent(content);
        const actionsSection = this.createActions(actions);
        
        card.appendChild(titleSection);
        card.appendChild(contentSection);
        if (actions) card.appendChild(actionsSection);
        
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
        const actionsDiv = document.createElement('div');
        actionsDiv.className = UI_CLASSES.card.actions;
        
        if (typeof actions === 'string') {
            actionsDiv.innerHTML = actions;
        } else if (actions instanceof Node) {
            actionsDiv.appendChild(actions);
        }
        
        return actionsDiv;
    }
}