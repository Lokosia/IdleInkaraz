import { currencyMap } from '../../currency/CurrencyData.js';
import { hoverUpgrades } from '../../../UIInitializer.js';
import { formatEfficiency } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

/**
 * Generic handler for Flip Speed upgrade purchase.
 * @param {Object} Upgrades - The upgrades state object.
 */
function handleFlipSpeedUpgrade(Upgrades) {
  const row = document.getElementById('flipSpeedUpgrade');
  if (!row) return false;
  const currentCost = Upgrades.flippingSpeedCost;
  const currentLevel = Upgrades.flippingSpeed;
  return handlePurchase({
    requirements: [{ currency: currencyMap['Eternal'], amount: currentCost }],
    onSuccess: () => {
      Upgrades.flippingSpeedCost = Math.floor(currentCost * 2);
      Upgrades.flippingSpeed++;
      Upgrades.upgradeDropRate += 0.5;
    },
    uiUpdateConfig: {
      rowElement: row,
      costElement: row.querySelector('.flipSpeedUpgradeCostDisplay'),
      benefitElement: row.querySelector('.flipSpeedMulti'),
      getNextLevelData: () => {
        const nextCost = Math.floor(currentCost * 2);
        const nextBenefit = `+${formatEfficiency(currentLevel + 1)}`;
        return { cost: `${numeral(nextCost).format('0,0')} Eternal`, benefit: nextBenefit };
      }
    },
    updateUI: () => {
      const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
      if (globalUpgradeRateElem) {
        globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
      }
      document.querySelectorAll('.Eternal').forEach(el => el.classList.add('hover'));
    },
    successMessage: 'Flipping speed upgraded!'
  });
}

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
    costText: () => `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`, // Use numeral directly
    requirements: () => [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
    hover: () => hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
    buy: () => handleFlipSpeedUpgrade(Upgrades)
  };
}
