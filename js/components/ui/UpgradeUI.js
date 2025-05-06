// Import our DOM utilities
import { show, hide } from '../../../js/libs/DOMUtils.js';

/**
 * Generates HTML for upgrade button and description cells (TDs).
 *
 * @param {string} upgradeKey - The upgrade key or name.
 * @param {string} upgradeType - The type of upgrade (e.g., 'Gear', 'Links', or custom).
 * @param {string} description - Description of the upgrade.
 * @param {string} benefit - The benefit gained from the upgrade.
 * @param {string} requirements - The requirements text.
 * @param {string} [buttonText] - Optional custom button text.
 * @param {string} [buttonId] - Optional specific ID for the button element.
 * @returns {string} HTML string containing the four <td> elements for the upgrade row.
 */
function generateUpgradeCellsHTML(upgradeKey, upgradeType, description, benefit, requirements, buttonText, buttonId) {
    const btnLabel = buttonText ? buttonText : (upgradeKey + ' ' + upgradeType);
    // Use provided buttonId or generate one
    const finalButtonId = buttonId || `${upgradeKey}${upgradeType}Btn`;
    const html = `
        <td class="mdl-data-table__cell--non-numeric">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${upgradeKey}${upgradeType}Button" id="${finalButtonId}">
                ${btnLabel}
            </button>
        </td>
        <td class="mdl-data-table__cell--non-numeric">${description}</td>
        <td class="mdl-data-table__cell--non-numeric">${benefit}</td>
        <td class="mdl-data-table__cell--non-numeric">${requirements}</td>
    `;
    // Removed DOM manipulation and event listener attachment
    return html;
}

/**
 * Shows all upgrade tables (general, gear, and links).
 * @returns {void}
 */
function showAllUpgrades() {
    // Replace jQuery with vanilla JS
    show("#UpgradeTable");
    show("#UpgradeGearTable");
    show("#UpgradeLinksTable");
}

/**
 * Shows only the general upgrades table.
 * Hides gear and links tables.
 * @returns {void}
 */
function showGeneralUpgrades() {
    // Replace jQuery with vanilla JS
    show("#UpgradeTable");
    hide("#UpgradeGearTable");
    hide("#UpgradeLinksTable");
}

/**
 * Shows only the gear upgrades table.
 * Hides general and links tables.
 * @returns {void}
 */
function showGearUpgrades() {
    // Replace jQuery with vanilla JS
    hide("#UpgradeTable");
    show("#UpgradeGearTable");
    hide("#UpgradeLinksTable");
}

/**
 * Shows only the links upgrades table.
 * Hides general and gear tables.
 * @returns {void}
 */
function showLinksUpgrades() {
    // Replace jQuery with vanilla JS
    hide("#UpgradeTable");
    hide("#UpgradeGearTable");
    show("#UpgradeLinksTable");
}

export { generateUpgradeCellsHTML, showAllUpgrades, showGeneralUpgrades, showGearUpgrades, showLinksUpgrades };