// Exile UI utilities for rendering and updating Exile-related UI

/**
 * Generates and updates HTML for upgrade buttons and descriptions
 * @param {string} exile - The exile name
 * @param {string} upgradeType - The type of upgrade (e.g., 'Gear', 'Links')
 * @param {string} description - Description of the upgrade
 * @param {string} benefit - The benefit gained from the upgrade
 * @param {string} requirements - The requirements text
 */
function generateUpgradeHTML(exile, upgradeType, description, benefit, requirements) {
    // Generate button text from exile name and upgradeType
    const buttonText = exile + ' ' + upgradeType;
    const html = `
        <td class="mdl-data-table__cell--non-numeric">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${exile}${upgradeType}Button" 
                    onclick="${exile}.lvl${upgradeType}();">
                ${buttonText}
            </button>
        </td>
        <td class="mdl-data-table__cell--non-numeric">${description}</td>
        <td class="mdl-data-table__cell--non-numeric">${benefit}</td>
        <td class="mdl-data-table__cell--non-numeric">${requirements}</td>
    `;
    $(`#${exile}${upgradeType}Upgrade`).html(html);
}

/**
 * Generates cards for all standard exiles to populate the Guild section
 * @param {HTMLElement} container - The container element to append cards to
 */
function generateExileCards(container, exileData) {
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
                    <button id="${exile.name}ActionButton" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${exile.name}ActionButton"
                        onclick="recruitExile('${exile.name}');">Recruit ${exile.name}</button>
                `,
                className: `mdl-card__actions mdl-card--border ${exile.name}ActionSection`
            });
        } else if (exile.level < 100) {
            actionSections.push({
                content: '',
                className: `mdl-card__actions mdl-card--border ${exile.name}ActionSection hidden`
            });
        } else {
            // At max level, include reroll button markup
            actionSections.push({
                content: `
                    <button id="${exile.name}ActionButton" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${exile.name}ActionButton"
                        onclick="window.exileData.find(e=>e.name==='${exile.name}').rerollExile();">Reroll ${exile.name}</button>
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
    });
}

export { generateUpgradeHTML, generateExileCards };