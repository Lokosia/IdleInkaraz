// Exile UI utilities for rendering and updating Exile-related UI
import { UICard } from '../ui/Cards.js';
import UIManager from '../ui/UIManager.js';
import { UI_CLASSES } from '../ui/UIClasses.js';

/**
 * Generates cards for all standard exiles to populate the Guild section.
 * Each card displays the exile's stats and provides recruit/reroll actions.
 *
 * @param {HTMLElement} container - The container element to append cards to.
 * @param {Array<Object>} exileData - Array of exile objects to display.
 * @param {Function} recruitExile - Function to call when recruiting an exile.
 */
function generateExileCards(container, exileData, recruitExile) {
    container.innerHTML = '';
    const standardExiles = exileData.filter(exile => 
        !['Melvin', 'Singularity', 'Artificer'].includes(exile.name)
    );
    standardExiles.forEach(exile => {
        const content = `
            Level: <span class="${exile.name}Level">${exile.level}</span> <span class="${exile.name}Reroll${exile.rerollLevel > 0 ? '' : ' hidden'}">${exile.rerollLevel > 0 ? '(+' + exile.rerollLevel + ')' : ''}</span><br>
            EXP: <span class="${exile.name}EXP">${exile.level < 100 ? (exile.exp + '/' + exile.expToLevel) : 'Max'}</span><br>
            Efficiency: <span class="${exile.name}Efficiency">x${exile.dropRate.toFixed(1)}</span><br>
            Links: <span class="${exile.name}Links">${exile.links + 3}L</span>
        `;
        const actionSections = [];
        if (exile.level < 1) {
            actionSections.push({
                content: `
                    <button id="${exile.name}ActionButton" class="${[UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ')} ${exile.name}ActionButton">
                        Recruit ${exile.name}</button>
                `,
                className: `mdl-card__actions mdl-card--border ${exile.name}ActionSection`
            });
        } else if (exile.level < 100) {
            actionSections.push({
                content: '',
                className: `mdl-card__actions mdl-card--border ${exile.name}ActionSection hidden`
            });
        } else {
            // At max level, include reroll button markup (no inline onclick)
            actionSections.push({
                content: `
                    <button id="${exile.name}ActionButton" class="${[UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ')} ${exile.name}ActionButton">
                        Reroll ${exile.name}</button>
                `,
                className: `mdl-card__actions mdl-card--border ${exile.name}ActionSection`
            });
        }
        actionSections.push({
            content: exile.levelRequirement > 0 
                ? `${exile.levelRequirement} Total Levels Required` 
                : 'A Scion washes up on the beach...',
            className: `mdl-card__actions mdl-card--border ${exile.name}Hide`
        });
        const card = UICard.create({
            id: `${exile.name.toLowerCase()}-card`,
            title: exile.name,
            content: content,
            actionSections: actionSections,
            size: 'third',
            extraClasses: ['cardBG', exile.name.toLowerCase()]
        });
        container.appendChild(card);
        // Add event listeners for action buttons
        const actionBtn = card.querySelector(`#${exile.name}ActionButton`);
        if (actionBtn) {
            if (exile.level < 1) {
                actionBtn.addEventListener('click', () => {
                    if (typeof recruitExile === 'function') recruitExile(exile.name);
                });
            } else if (exile.level >= 100) {
                actionBtn.addEventListener('click', () => {
                    if (typeof exile.rerollExile === 'function') exile.rerollExile();
                });
            }
        }
    });
}

/**
 * Handles the logic for showing the guild section.
 * Dynamically generates exile cards and updates their UI.
 *
 * @param {Array<Object>} exileData - Array of exile objects to display.
 * @param {Function} recruitExile - Function to call when recruiting an exile.
 */
function showGuild(exileData, recruitExile) {
    // UIManager.show('guild'); // Removed: This is now called by the event listener/welcome function before calling showGuild
    const guildGrid = document.querySelector('#guild .mdl-grid');
    if (!guildGrid) {
        console.error("Guild grid container not found!");
        return;
    }
    generateExileCards(guildGrid, exileData, recruitExile);
    exileData.forEach(exile => exile.updateExileClass());
}

export { generateExileCards, showGuild };