// DelveUI.js - Contains UI creation and initialization for Delving
import { fossilData } from './Fossil.js';
import { UICard } from '../ui/Cards.js';
import { recruitExile } from '../../../Main.js';
import UIManager from '../ui/UIManager.js';
import State from '../../State.js';

/**
 * Creates the Melvin exile card section for the delving UI.
 * Includes recruit and reroll buttons, and stats display.
 *
 * @param {Function} recruitExileFn - Function to call to recruit Melvin.
 * @param {Object} melvinObj - The Melvin exile object (for reroll and ownership check).
 * @returns {HTMLElement} The Melvin card element.
 */
function createMelvinSection(recruitExileFn, melvinObj) {
    const content = `
        Level: <span class="MelvinLevel">0</span> <span class="MelvinReroll hidden"></span><br>
        EXP: <span class="MelvinEXP">0/525</span><br>
        Efficiency: <span class="MelvinEfficiency">x0</span><br>
        Links: <span class="MelvinLinks">3L</span>
    `;
    const actionSections = [];
    // Only show recruit button if Melvin is not owned
    if (!melvinObj?.owned) {
        actionSections.push({ content: `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="MelvinRecruitBtn">Recruit Melvin</button>`, className: 'mdl-card__actions mdl-card--border MelvinBuy' });
        actionSections.push({ content: '500 Total Levels Required<br>Delve Stash Tab Required', className: 'mdl-card__actions mdl-card--border MelvinHide' });
    }
    // Always show reroll button (but keep hidden if not available)
    actionSections.push({ content: `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="MelvinRerollBtn">Reroll Melvin</button>`, className: 'mdl-card__actions mdl-card--border MelvinRerollButton hidden' });
    const card = UICard.create({
        id: 'melvin-card',
        title: "Delvin' Melvin",
        content: content,
        actionSections: actionSections,
        size: 'third',
        extraClasses: ['cardBG', 'melvin']
    });
    // Add event listeners
    const recruitBtn = card.querySelector('#MelvinRecruitBtn');
    if (recruitBtn && typeof recruitExileFn === 'function') {
        recruitBtn.addEventListener('click', () => recruitExileFn('Melvin'));
    }
    const rerollBtn = card.querySelector('#MelvinRerollBtn');
    if (rerollBtn && melvinObj && typeof melvinObj.rerollExile === 'function') {
        rerollBtn.addEventListener('click', () => melvinObj.rerollExile());
    }
    return card;
}

/**
 * Creates the Deep Delving section card for the delving UI.
 * Displays sulphite, depth, and cost, and includes the progress bar.
 *
 * @returns {HTMLElement} The Deep Delving card element.
 */
function createDeepDelvingSection() {
    const content = `
        <p>Spend Sulphite to traverse the mines.</p>
        <p>Collect currency and fossils.</p>
        <div id="delveLoader" class="mdl-progress mdl-js-progress hidden"></div>
        <br>
        Total Sulphite: <span class="Sulphite">0</span><br>
        Delve Depth: <span class="SulphiteDepth">1</span><br>
        Sulphite Cost: <span class="SulphiteCost">110</span>
    `;
    const card = UICard.create({
        id: 'deep-delving-card',
        title: 'Deep Delving',
        content: content,
        size: 'third',
        extraClasses: ['cardBG', 'imgBG']
    });
    return card;
}

/**
 * Creates the Fossils section card for the delving UI.
 * Lists all resonators and fossils with their current totals.
 *
 * @returns {HTMLElement} The Fossils card element.
 */
function createFossilsSection() {
    let fossilsHTML = `<b>Resonators:</b><br>`;
    const resonators = fossilData.filter(fossil => 
        ['Primitive', 'Potent', 'Powerful', 'Prime'].includes(fossil.name)
    );
    const fossils = fossilData.filter(fossil => 
        !['Primitive', 'Potent', 'Powerful', 'Prime'].includes(fossil.name)
    );
    resonators.forEach(fossil => {
        fossilsHTML += `${fossil.name}: <span class="${fossil.name}Total">0</span><br>`;
    });
    fossilsHTML += '<br><b>Fossils:</b><br>';
    fossils.forEach(fossil => {
        fossilsHTML += `${fossil.name}: <span class="${fossil.name}Total">0</span><br>`;
    });
    const card = UICard.create({
        id: 'fossils-card',
        title: 'Resonators & Fossils',
        content: fossilsHTML,
        size: 'third',
        extraClasses: ['cardBG', 'imgBG']
    });
    return card;
}

/**
 * Initializes the delving UI by rendering all delving-related cards and updating fossil counts.
 *
 * @returns {void}
 */
function initDelvingUI() {
    const container = document.getElementById('delving-container');
    if (!container) return;

    // Clear existing content to prevent duplicates
    container.innerHTML = '';

    // Add Delving sections
    container.appendChild(createMelvinSection(recruitExile, State.exileMap['Melvin']));
    container.appendChild(createDeepDelvingSection());
    container.appendChild(createFossilsSection());

    // Update fossil counts in the UI to reflect the current state
    fossilData.forEach(fossil => {
        const element = document.querySelector(`.${fossil.name}Total`);
        if (element) {
            element.innerHTML = numeral(fossil.total).format('0,0');
        }
    });
}

/**
 * Updates the delve progress bar in the UI to the given progress value.
 *
 * @param {number} progress - The progress value to set (0-100).
 * @returns {void}
 */
function updateDelveProgressBar(progress) {
    const delveLoader = document.getElementById('delveLoader');
    if (delveLoader) {
        delveLoader.classList.remove('hidden'); // Ensure the progress bar is visible
        delveLoader.style.display = 'block'; // Explicitly set display to block
        if (typeof componentHandler !== 'undefined') {
            try {
                componentHandler.upgradeElement(delveLoader);
            } catch (e) {
                console.error('Error upgrading MDL component:', e);
            }
        }
        if (delveLoader.MaterialProgress) {
            delveLoader.MaterialProgress.setProgress(progress);
        } else {
            console.warn('MaterialProgress is not initialized on delveLoader.');
        }
    } else {
        console.error('delveLoader element not found.');
    }
}

/**
 * Handles the logic for showing the delving section.
 * Initializes and displays delve-related UI components.
 *
 * @returns {void}
 */
function showDelving() {
    UIManager.show('delving');
    initDelvingUI();
}

export { createMelvinSection, createDeepDelvingSection, createFossilsSection, initDelvingUI, showDelving, updateDelveProgressBar };