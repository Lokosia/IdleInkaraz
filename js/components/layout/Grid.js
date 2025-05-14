import { UI_CLASSES } from '../ui/UIClasses.js';

/**
 * Renders a grid of card components into the given container based on the provided configuration.
 * Handles Material Design Lite (MDL) upgrades and dynamic button event wiring.
 *
 * @param {HTMLElement} container - The DOM element to render the grid into.
 * @param {Array<Object>} cardConfigs - Array of card configuration objects (id, title, contentTemplate, actions, etc).
 * @returns {void}
 */
export function createGrid(container, cardConfigs) {
    const fragment = document.createDocumentFragment();

    cardConfigs.forEach(config => {
        const card = document.createElement('div');
        card.id = config.id;
        card.className = [
            UI_CLASSES.card.container,
            UI_CLASSES.card.cell[config.size || 'third'] || '',
            config.gridCols || '',
            config.cssClasses || ''
        ].join(' ').trim();

        // Title
        const titleDiv = document.createElement('div');
        titleDiv.className = UI_CLASSES.card.title;
        const titleText = document.createElement('h2');
        titleText.className = UI_CLASSES.card.titleText;
        titleText.innerHTML = config.title; // Use innerHTML for potential spans
        titleDiv.appendChild(titleText);
        card.appendChild(titleDiv);

        // Supporting Text (Content)
        if (config.contentTemplate) {
            const contentDiv = document.createElement('div');
            contentDiv.className = UI_CLASSES.card.supporting;
            contentDiv.innerHTML = config.contentTemplate;
            card.appendChild(contentDiv);
        }

        // Actions
        if (config.actions && config.actions.length > 0) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = UI_CLASSES.card.actions;

            config.actions.forEach(action => {
                if (action.type === 'button') {
                    const button = document.createElement('button');
                    button.id = action.id;
                    button.className = action.classes || [UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ');
                    button.textContent = action.text;
                    actionsDiv.appendChild(button);
                } else if (action.type === 'text') {
                    const textDiv = document.createElement('div');
                    // Assign classes if provided, otherwise default or none
                    if (action.classes) {
                         textDiv.className = action.classes;
                    }
                    textDiv.innerHTML = action.content;
                    actionsDiv.appendChild(textDiv);
                }
                // Add more action types if needed (e.g., links, inputs)
            });
            card.appendChild(actionsDiv);
        }

        fragment.appendChild(card);
    });

    container.appendChild(fragment);

    // Ensure MDL components within the newly added cards are upgraded
    if (typeof componentHandler !== 'undefined') {
        // Upgrade elements within the container specifically
        componentHandler.upgradeElements(container.querySelectorAll('.mdl-js-button, .mdl-js-data-table'));
    } else {
        console.error('Material Design Lite (componentHandler) not found during grid creation.');
    }

    // --- Ensure dynamic buttons get their click handlers ---
    // Attach recruit-singularity click handler if button exists
    const recruitBtn = container.querySelector('#recruit-singularity');
    if (recruitBtn) {
        recruitBtn.addEventListener('click', () => {
            if (typeof window.recruitExile === 'function') {
                window.recruitExile('Singularity');
            } else if (typeof recruitExile === 'function') {
                recruitExile('Singularity');
            }
        });
    }
}
