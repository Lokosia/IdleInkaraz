// DelveScarabUpgrade.js
import State from '../../../State.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { SnackBar } from '../../../UIInitializer.js';
import { hoverUpgrades } from '../../currency/HoverState.js';
import { formatEfficiency } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';
import { select, findByClass } from '../../../../js/libs/DOMUtils.js';

/**
 * Configuration object for the Sulphite Scarab (Delve Scarab) upgrade.
 * Defines unlock logic, UI row IDs, button text, requirements, and buy logic.
 *
 * @type {Object}
 * @property {string} key - Unique key for the upgrade.
 * @property {string} shownFlag - UI flag for whether the upgrade is shown.
 * @property {Function} unlock - Function to determine if the upgrade is unlocked.
 * @property {string} rowId - DOM row ID for the upgrade.
 * @property {string} buttonId - DOM button ID for the upgrade.
 * @property {string} buttonClass - CSS class for the upgrade button.
 * @property {string} buttonText - Button label text.
 * @property {Function} description - Function returning the description string.
 * @property {string} benefitClass - CSS class for the benefit cell.
 * @property {Function} benefit - Function returning the benefit string.
 * @property {string} costClass - CSS class for the cost cell.
 * @property {Function} costText - Function returning the cost string.
 * @property {Function} requirements - Function returning the requirements array.
 * @property {Function} hover - Function to apply hover effects.
 * @property {Function} buy - Function to handle the upgrade purchase.
 */
const DelveScarabUpgradeConfig = {
    key: 'delveScarab',
    shownFlag: 'delveScarabShown',
    unlock: () => State.delveStashTab === 1 && !State.delveScarabShown,
    rowId: 'delveScarab',
    buttonId: 'btn-niko-scarab',
    buttonClass: 'nikoScarab',
    buttonText: 'Sulphite Scarab',
    description: () => {
        const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
        return `Use ${scarabTypes[State.nikoScarab] || 'Sulphite Scarab'} to increase Sulphite quantity`;
    },
    benefitClass: '', // No specific class for benefit, handled by description/button text
    benefit: () => `+${formatEfficiency(1)}`, // Benefit is fixed per level
    costClass: 'delveScarabCost',
    costText: () => {
        const costs = [1, 5, 10];
        const cost = costs[State.nikoScarab];
        return cost !== undefined ? `${numeral(cost).format('0,0')} Exalted` : 'Maxed'; // Use numeral directly
    },
    requirements: () => {
        const costs = [1, 5, 10];
        return State.nikoScarab < costs.length
            ? [{ currency: currencyMap['Exalted'], amount: costs[State.nikoScarab] }]
            : [];
    },
    hover: () => hoverUpgrades('delveScarab', 'Exalted'),
    buy: handleDelveScarabUpgrade
};

/**
 * Generic handler for Delve Scarab upgrade purchase.
 */
function handleDelveScarabUpgrade() {
    const row = select(`#${DelveScarabUpgradeConfig.rowId}`);
    if (!row) return false;
    const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
    const costs = [1, 5, 10];
    const currentLevel = State.nikoScarab;
    if (currentLevel >= costs.length) {
        SnackBar("Scarab upgrades already maxed!");
        return false;
    }
    const currentCost = costs[currentLevel];
    return handlePurchase({
        requirements: [{ currency: currencyMap['Exalted'], amount: currentCost }],
        onSuccess: () => {
            State.nikoScarab++;
            State.sulphiteDropRate += 100;
            State.upgradeDropRate += 1;
            if (State.nikoScarab >= scarabTypes.length) {
                State.delveScarabShown = true;
            }
        },
        uiUpdateConfig: {
            rowElement: row,
            costElement: row.querySelector('.delveScarabCost'),
            getNextLevelData: () => {
                const nextLevel = currentLevel + 1;
                if (nextLevel >= costs.length) {
                    return null;
                }
                const nextCost = costs[nextLevel];
                return { cost: `${numeral(nextCost).format('0,0')} Exalted` };
            },
            removeRowOnMaxLevel: true,
            hoverClassesToRemoveOnMaxLevel: ['Exalted']
        },
        updateUI: () => {
            const nextLevel = State.nikoScarab;
            if (nextLevel < scarabTypes.length) {
                const button = row.querySelector('.nikoScarab');
                if (button) button.textContent = scarabTypes[nextLevel];
                const descCell = row.children[1];
                if (descCell) descCell.innerHTML = `Use ${scarabTypes[nextLevel]} to increase Sulphite quantity`;
            }
            const globalUpgradeRateElem = findByClass('UpgradeDropRate')[0];
            if (globalUpgradeRateElem) {
                globalUpgradeRateElem.innerHTML = formatEfficiency(State.upgradeDropRate);
            }
            // Don't call hover here - it's handled by hoverClassesToRemoveOnMaxLevel when maxed
            // or preserved by the purchase system when not maxed
        },
        successMessage: 'Scarab upgraded!'
    });
}

export default DelveScarabUpgradeConfig;
export { DelveScarabUpgradeConfig };
