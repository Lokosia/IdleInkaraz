// DelveUI.js - Contains UI creation and initialization for Delving
import { fossilData } from './Fossil.js';
import { UICard } from '../Cards.js';

function createMelvinSection() {
    const content = `
        Level: <span class="MelvinLevel">0</span> <span class="MelvinReroll hidden"></span><br>
        EXP: <span class="MelvinEXP">0/525</span><br>
        Efficiency: <span class="MelvinEfficiency">x0</span><br>
        Links: <span class="MelvinLinks">3L</span>
    `;
    const actionSections = [
        { content: `<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\" onclick=\"recruitExile('Melvin');\">Recruit Melvin</button>`, className: 'mdl-card__actions mdl-card--border MelvinBuy' },
        { content: '500 Total Levels Required<br>Delve Stash Tab Required', className: 'mdl-card__actions mdl-card--border MelvinHide' },
        { content: `<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\" onclick=\"Melvin.rerollExile();\">Reroll Melvin</button>`, className: 'mdl-card__actions mdl-card--border MelvinRerollButton hidden' }
    ];
    const card = UICard.create({
        id: 'melvin-card',
        title: "Delvin' Melvin",
        content: content,
        actionSections: actionSections,
        size: 'third',
        extraClasses: ['cardBG', 'melvin']
    });
    return card;
}

function createDeepDelvingSection() {
    const content = `
        <p>Spend Sulphite to traverse the mines.</p>
        <p>Collect currency and fossils.</p>
        <div id=\"delveLoader\" class=\"mdl-progress mdl-js-progress hidden\"></div>
        <br>
        Total Sulphite: <span class=\"Sulphite\">0</span><br>
        Delve Depth: <span class=\"SulphiteDepth\">1</span><br>
        Sulphite Cost: <span class=\"SulphiteCost\">110</span>
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

function createFossilsSection() {
    let fossilsHTML = `<b>Resonators:</b><br>`;
    const resonators = fossilData.filter(fossil => 
        ['Primitive', 'Potent', 'Powerful', 'Prime'].includes(fossil.name)
    );
    const fossils = fossilData.filter(fossil => 
        !['Primitive', 'Potent', 'Powerful', 'Prime'].includes(fossil.name)
    );
    resonators.forEach(fossil => {
        fossilsHTML += `${fossil.name}: <span class=\"${fossil.name}Total\">0</span><br>`;
    });
    fossilsHTML += '<br><b>Fossils:</b><br>';
    fossils.forEach(fossil => {
        fossilsHTML += `${fossil.name}: <span class=\"${fossil.name}Total\">0</span><br>`;
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

function initDelvingUI() {
    const container = document.getElementById('delving-container');
    if (!container) return;
    container.appendChild(createMelvinSection());
    container.appendChild(createDeepDelvingSection());
    container.appendChild(createFossilsSection());
}

export { createMelvinSection, createDeepDelvingSection, createFossilsSection, initDelvingUI };