// IIQUpgrade.js - Handles the IIQ (Increased Item Quantity) upgrade config and logic
import { exileMap, hoverUpgrades } from '../../../../Main.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { handleGenericUpgrade } from '../../exile/ExileUtils.js';

// State for IIQ upgrade (can be moved to a shared state if needed)
const IIQState = {
    iiqDropRate: 1,
    iiqCost: 10
};

const IIQUpgradeConfig = {
    key: 'iiq',
    shownFlag: 'iiqUpgradeShown',
    unlock: () => exileMap['Ascendant'].level >= 50,
    rowId: 'iiqUpgrade',
    buttonId: 'btn-iiq-upgrade',
    buttonClass: 'iiqUpgradeButton',
    buttonText: 'IIQ Gear',
    description: 'Buy Increased Item Quantity gear for exiles',
    benefitClass: 'iiqDropRate',
    benefit: () => `+${IIQState.iiqDropRate.toFixed(1)}`,
    costClass: 'iiqUpgradeCostDisplay',
    costText: () => `+${numeral(IIQState.iiqCost).format('0,0')} Chaos`,
    requirements: () => [{ currency: currencyMap['Chaos'], amount: IIQState.iiqCost }],
    hover: () => hoverUpgrades('iiqUpgrade', 'Chaos'),
    buy: () => handleGenericUpgrade({
        requirements: [{ currency: currencyMap['Chaos'], amount: IIQState.iiqCost }],
        onSuccess: () => {
            // Add efficiency as in original logic, then increment
            if (IIQState.iiqDropRate === 1) {
                import('../Augments.js').then(({ default: Upgrades }) => {
                    Upgrades.upgradeDropRate += 1;
                });
            } else {
                import('../Augments.js').then(({ default: Upgrades }) => {
                    Upgrades.upgradeDropRate += 0.1;
                });
            }
            IIQState.iiqCost = Math.floor(IIQState.iiqCost * 1.4);
            IIQState.iiqDropRate += 0.1;
        },
        updateUI: () => {
            const row = document.getElementById('iiqUpgrade');
            if (!row) return;
            const costCell = row.querySelector('.iiqUpgradeCostDisplay');
            if (costCell) {
                costCell.innerHTML = numeral(IIQState.iiqCost).format('0,0') + ' Chaos';
            }
            const benefitCell = row.querySelector('.iiqDropRate');
            if (benefitCell) {
                benefitCell.innerHTML = `+${IIQState.iiqDropRate.toFixed(1)}`;
            }
            // Update global display
            const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
            if (globalUpgradeRateElem) {
                import('../Augments.js').then(({ default: Upgrades }) => {
                    globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
                });
            }
        }
    })
};

export { IIQUpgradeConfig, IIQState };