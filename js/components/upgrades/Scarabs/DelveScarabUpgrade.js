// DelveScarabUpgrade.js
import { currencyMap } from '../../currency/CurrencyData.js';
import { handleGenericUpgrade } from '../../exile/ExileUtils.js';
import { SnackBar, hoverUpgrades } from '../../../UIInitializer.js';
import { formatEfficiency } from '../Augments.js';

let UpgradesRef = null;
export function setUpgradesRef(ref) {
    UpgradesRef = ref;
}

const DelveScarabUpgradeConfig = {
    key: 'delveScarab',
    shownFlag: 'delveScarabShown',
    unlock: () => UpgradesRef.delveStashTab === 1 && !UpgradesRef.delveScarabShown,
    rowId: 'delveScarab',
    buttonId: 'btn-niko-scarab',
    buttonClass: 'nikoScarab',
    buttonText: 'Sulphite Scarab',
    description: () => {
        const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
        return `Use ${scarabTypes[UpgradesRef.nikoScarab] || 'Sulphite Scarab'} to increase Sulphite quantity`;
    },
    benefitClass: '',
    benefit: () => `+${formatEfficiency(1)}`,
    costClass: 'delveScarabCost',
    costText: () => {
        const costs = ['1 Exalted', '5 Exalted', '10 Exalted'];
        return costs[UpgradesRef.nikoScarab] || 'Maxed';
    },
    requirements: () => {
        const costs = [1, 5, 10];
        return UpgradesRef.nikoScarab < costs.length
            ? [{ currency: currencyMap['Exalted'], amount: costs[UpgradesRef.nikoScarab] }]
            : [];
    },
    hover: () => hoverUpgrades('delveScarab', 'Exalted'),
    buy: () => {
        const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
        const costs = [1, 5, 10];
        const currentCost = costs[UpgradesRef.nikoScarab];

        handleGenericUpgrade({
            requirements: currentCost !== undefined ? [{ currency: currencyMap['Exalted'], amount: currentCost }] : [],
            check: () => UpgradesRef.nikoScarab < scarabTypes.length, // Ensure not maxed
            onSuccess: () => {
                UpgradesRef.nikoScarab++;
                UpgradesRef.sulphiteDropRate += 100;
                UpgradesRef.upgradeDropRate += 1;
            },
            updateUI: () => {
                const row = document.getElementById('delveScarab');
                if (!row) return;
                const scarabTypes = ['Rusted Sulphite Scarab', 'Polished Sulphite Scarab', 'Gilded Sulphite Scarab'];
                const costs = [1, 5, 10];

                if (UpgradesRef.nikoScarab >= scarabTypes.length) {
                    $(".Exalted").removeClass("hover");
                    $(row).remove();
                    UpgradesRef.delveScarabShown = true; // Mark as shown only when maxed and removed
                } else {
                    const costCell = row.querySelector('.delveScarabCost');
                    if (costCell) costCell.innerHTML = `${costs[UpgradesRef.nikoScarab]} Exalted`;
                    const button = row.querySelector('.nikoScarab');
                    if (button) button.textContent = scarabTypes[UpgradesRef.nikoScarab];
                    // Update description cell (assume it's the second cell)
                    const descCell = row.children[1];
                    if (descCell) descCell.innerHTML = `Use ${scarabTypes[UpgradesRef.nikoScarab] || 'Sulphite Scarab'} to increase Sulphite quantity`;
                }
                const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
                if (globalUpgradeRateElem) globalUpgradeRateElem.innerHTML = formatEfficiency(UpgradesRef.upgradeDropRate);
            },
            onFailure: () => {
                if (UpgradesRef.nikoScarab >= scarabTypes.length) {
                    SnackBar("Scarab upgrades already maxed!");
                } else {
                    SnackBar("Requirements not met.");
                }
            }
        });
    }
};

export default DelveScarabUpgradeConfig;
export { DelveScarabUpgradeConfig };
