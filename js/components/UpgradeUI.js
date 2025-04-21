/**
 * Generates and updates HTML for upgrade buttons and descriptions
 * @param {string} upgradeKey - The upgrade key or name
 * @param {string} upgradeType - The type of upgrade (e.g., 'Gear', 'Links', or custom)
 * @param {string} description - Description of the upgrade
 * @param {string} benefit - The benefit gained from the upgrade
 * @param {string} requirements - The requirements text
 * @param {object} handlerObj - The object containing the upgrade method (should have lvl{upgradeType} or a custom handler)
 */
function generateUpgradeHTML(upgradeKey, upgradeType, description, benefit, requirements, handlerObj) {
    const buttonText = upgradeKey + ' ' + upgradeType;
    const html = `
        <td class="mdl-data-table__cell--non-numeric">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${upgradeKey}${upgradeType}Button" id="${upgradeKey}${upgradeType}Btn">
                ${buttonText}
            </button>
        </td>
        <td class="mdl-data-table__cell--non-numeric">${description}</td>
        <td class="mdl-data-table__cell--non-numeric">${benefit}</td>
        <td class="mdl-data-table__cell--non-numeric">${requirements}</td>
    `;
    $(`#${upgradeKey}${upgradeType}Upgrade`).html(html);
    const btn = document.getElementById(`${upgradeKey}${upgradeType}Btn`);
    if (btn && handlerObj && typeof handlerObj[`lvl${upgradeType}`] === 'function') {
        btn.addEventListener('click', () => handlerObj[`lvl${upgradeType}`]());
    } else if (btn && handlerObj && typeof handlerObj.onUpgradeClick === 'function') {
        btn.addEventListener('click', handlerObj.onUpgradeClick);
    }
}

export { generateUpgradeHTML };