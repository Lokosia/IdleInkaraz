// DelveUI.js - Contains UI creation and initialization for Delving
import { fossilData } from './Fossil.js';

function createMelvinSection() {
    const section = document.createElement('div');
    section.className = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG melvin';
    section.innerHTML = `
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Delvin' Melvin</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-card--expand">
            Level: <span class="MelvinLevel">0</span> <span class="MelvinReroll hidden"></span><br>
            EXP: <span class="MelvinEXP">0/525</span><br>
            Efficiency: <span class="MelvinEfficiency">x0</span><br>
            Links: <span class="MelvinLinks">3L</span>
        </div>
        <div class="mdl-card__actions mdl-card--border MelvinBuy">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onclick="recruitExile('Melvin');">Recruit Melvin</button>
        </div>
        <div class="mdl-card__actions mdl-card--border MelvinHide">
            500 Total Levels Required<br>Delve Stash Tab Required
        </div>
        <div class="mdl-card__actions mdl-card--border MelvinRerollButton hidden">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onclick="Melvin.rerollExile();">Reroll Melvin</button>
        </div>
    `;
    return section;
}

function createDeepDelvingSection() {
    const section = document.createElement('div');
    section.className = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG imgBG';
    section.innerHTML = `
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Deep Delving</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-card--expand">
            <p>Spend Sulphite to traverse the mines.</p>
            <p>Collect currency and fossils.</p>
            <div id="delveLoader" class="mdl-progress mdl-js-progress hidden"></div>
            <br>
            Total Sulphite: <span class="Sulphite">0</span><br>
            Delve Depth: <span class="SulphiteDepth">1</span><br>
            Sulphite Cost: <span class="SulphiteCost">110</span>
        </div>
    `;
    return section;
}

function createFossilsSection() {
    const section = document.createElement('div');
    section.className = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG imgBG';
    let fossilsHTML = `
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Resonators & Fossils</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-card--expand">
            <b>Resonators:</b><br>
    `;
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
    fossilsHTML += '</div>';
    section.innerHTML = fossilsHTML;
    return section;
}

function initDelvingUI() {
    const container = document.getElementById('delving-container');
    if (!container) return;
    container.appendChild(createMelvinSection());
    container.appendChild(createDeepDelvingSection());
    container.appendChild(createFossilsSection());
}

export { createMelvinSection, createDeepDelvingSection, createFossilsSection, initDelvingUI };