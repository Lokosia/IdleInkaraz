import { currencyMap } from '../../currency/CurrencyData.js';
import { hoverUpgrades } from '../../../UIInitializer.js';
import { formatEfficiency } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

/**
 * Creates the configuration object for the Flipping Speed upgrade.
 * This upgrade increases the rate at which The Singularity flips currency.
 *
 * @param {Object} Upgrades - The upgrades state object to bind to this upgrade.
 * @returns {Object} The flipping speed upgrade configuration object.
 */
export default function createFlipSpeedUpgrade(Upgrades) {
  return {
    key: 'flipSpeed',
    shownFlag: 'flipSpeedUpgradeShown',
    unlock: (totalLevel) => totalLevel >= 1000,
    rowId: 'flipSpeedUpgrade',
    buttonId: 'btn-flip-speed',
    buttonClass: 'flipSpeedUpgradeButton',
    buttonText: 'Flipping Speed',
    description: 'Increase the rate The Singularity flips currency',
    benefitClass: 'flipSpeedMulti',
    benefit: () => `+${formatEfficiency(Upgrades.flippingSpeed)}`,
    costClass: 'flipSpeedUpgradeCostDisplay',
    costText: () => `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`,
    requirements: () => [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
    hover: () => hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
    buy: () => handlePurchase({
      requirements: [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
      onSuccess: () => {
        Upgrades.flippingSpeedCost = Math.floor(Upgrades.flippingSpeedCost * 2);
        Upgrades.flippingSpeed++;
        Upgrades.upgradeDropRate += 0.5;
      },
      updateUI: () => {
        const row = document.getElementById('flipSpeedUpgrade');
        if (!row) return;
        const costCell = row.querySelector('.flipSpeedUpgradeCostDisplay');
        if (costCell) {
          costCell.innerHTML = `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`;
        }
        const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
        if (globalUpgradeRateElem) {
          globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
        }
        const benefitCell = row.querySelector('.flipSpeedMulti');
        if (benefitCell) {
          benefitCell.innerHTML = `+${formatEfficiency(0.5)}`;
        }
      },
      successMessage: 'Flipping speed upgraded!'
    })
  };
}
