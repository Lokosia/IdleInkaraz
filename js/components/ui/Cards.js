import { UI_CLASSES } from './UIClasses.js';
import UIManager from './UIManager.js';
import { showGuild } from '../exile/ExileUI.js';
import { recruitExile } from '../../../Main.js';
import State from '../../State.js';
import { select, hide } from '../../../js/libs/DOMUtils.js';

/**
 * UICard provides static methods to create flexible card UI components.
 * Supports title, content, actions, and multiple action sections.
 *
 * @class
 */
class UICard {
    /**
     * Creates a card DOM element with the given configuration.
     * @param {Object} options - Card configuration options.
     * @param {string} [options.id] - Card DOM id.
     * @param {string} [options.title] - Card title.
     * @param {string|Node} [options.content] - Card content (HTML string or DOM node).
     * @param {string|Node} [options.actions] - Legacy single actions (HTML string or DOM node).
     * @param {Array<{content: string|Node, className: string}>} [options.actionSections] - Multiple action sections.
     * @param {string} [options.size] - Card size ('full', 'half', 'third').
     * @param {Array<string>} [options.extraClasses] - Extra CSS classes.
     * @returns {HTMLElement} The card DOM element.
     */
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
            const actionsSection = this.createActionSection(actions, UI_CLASSES.card.actions);
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

    /**
     * Creates the title section for a card.
     * @param {string} text - Title text.
     * @returns {HTMLElement} The title section DOM element.
     */
    static createTitle(text) {
        const titleDiv = document.createElement('div');
        titleDiv.className = UI_CLASSES.card.title;
        
        const titleText = document.createElement('h2');
        titleText.className = UI_CLASSES.card.titleText;
        titleText.textContent = text;
        
        titleDiv.appendChild(titleText);
        return titleDiv;
    }

    /**
     * Creates the content section for a card.
     * @param {string|Node} content - Content HTML or DOM node.
     * @returns {HTMLElement} The content section DOM element.
     */
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

    /**
     * Creates an action section for a card.
     * @param {string|Node} content - Action section content.
     * @param {string} [className] - CSS class for the section.
     * @returns {HTMLElement} The action section DOM element.
     */
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

/**
 * Creates and appends the welcome card to the given container.
 * Includes a button to start the guild and show the guild UI.
 *
 * @param {HTMLElement} container - The DOM element to append the welcome card to.
 * @returns {HTMLElement} The welcome card DOM element.
 */
function createWelcomeCard(container) {
    const welcomeCard = UICard.create({
        id: 'welcome-card',
        title: 'Welcome, Exile',
        content: `
            <p>It's the start of a new league in Path of Exile, you decide to create a guild with the
                sole intention of sharing resources and growing as a team.</p>
            <p>Recruit Exiles, Delvers, Currency Flippers, and Crafters. Dominate the economy and
                upgrade your guild members.</p>
            <div id="create-guild-button"></div>
        `,
        size: 'full',
        extraClasses: ['cardBG', 'imgBG']
    });

    // Initialize the button inside the card
    const createGuildButton = document.createElement('button');
    createGuildButton.className = 'mdl-button mdl-js-button mdl-button--raised mdl-button--colored';
    createGuildButton.textContent = 'Create Guild';
    createGuildButton.onclick = function() {
        // Replace jQuery with vanilla JS
        const welcomePre = select("#welcomePre");
        if (welcomePre) hide(welcomePre);
        
        UIManager.show('guild');
        showGuild(State.exileData, recruitExile);
    };
    welcomeCard.querySelector('#create-guild-button').appendChild(createGuildButton);

    if (container && container.appendChild) {
        container.appendChild(welcomeCard);
    }
    return welcomeCard;
}

export { UICard, createWelcomeCard };