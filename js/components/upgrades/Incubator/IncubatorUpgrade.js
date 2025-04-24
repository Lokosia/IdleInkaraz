// IncubatorUpgrade.js - extracted incubator system from Augments.js
import { exileMap } from '../../../../Main.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { handleGenericUpgrade } from '../../exile/ExileUtils.js';
import { hoverUpgrades } from '../../../../Main.js';

// These should be provided by the main Upgrades state
let UpgradesRef = null;
export function setUpgradesRef(ref) {
    UpgradesRef = ref;
}

const IncubatorUpgradeConfig = {
    key: 'incubator',
    shownFlag: 'incubatorUpgradeShown',
    unlock: () => exileMap['Ascendant'].level >= 75,
    rowId: 'incubatorUpgrade',
    buttonId: 'btn-incubator-upgrade',
    buttonClass: 'incubatorUpgradeButton',
    buttonText: 'Equip Incubators',
    description: 'Equip Incubators to exile gear',
    benefitClass: 'incDropRate',
    benefit: () => `+${(UpgradesRef.incDropRate === 0 ? 1 : UpgradesRef.incDropRate.toFixed(1))}`,
    costClass: 'incubatorUpgradeCostDisplay',
    costText: () => `+${numeral(UpgradesRef.incubatorCost).format('0,0')} Chaos`,
    requirements: () => [{ currency: currencyMap['Chaos'], amount: UpgradesRef.incubatorCost }],
    hover: () => hoverUpgrades('incubatorUpgrade', 'Chaos'),
    buy: () => handleGenericUpgrade({
        requirements: [{ currency: currencyMap['Chaos'], amount: UpgradesRef.incubatorCost }],
        onSuccess: () => {
            UpgradesRef.incubatorCost = Math.floor(UpgradesRef.incubatorCost * 1.2);
            if (UpgradesRef.incDropRate === 0) {
                UpgradesRef.incDropRate = 1;
            } else {
                UpgradesRef.incDropRate += 0.1;
            }
        },
        updateUI: () => {
            const row = document.getElementById('incubatorUpgrade');
            if (!row) return;
            const costCell = row.querySelector('.incubatorUpgradeCostDisplay');
            if (costCell) {
                costCell.innerHTML = `+${numeral(UpgradesRef.incubatorCost).format('0,0')} Chaos`;
            }
            const benefitCell = row.querySelector('.incDropRate');
            if (benefitCell) {
                benefitCell.innerHTML = `+${UpgradesRef.incDropRate.toFixed(1)}`;
            }
        }
    })
};

export default IncubatorUpgradeConfig;
