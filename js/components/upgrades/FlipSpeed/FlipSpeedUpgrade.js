import State from '../../../State.js';
import { currencyMap } from '../../currency/CurrencyData.js';
import { hoverUpgrades } from '../../currency/HoverState.js';
import { formatEfficiency } from '../Augments.js';
import { handlePurchase } from '../../shared/PurchaseUtils.js';

/**
 * Generic handler for Flip Speed upgrade purchase.
 */
function handleFlipSpeedUpgrade() {
  const row = document.getElementById('flipSpeedUpgrade');
  if (!row) return false;
  const currentCost = State.flippingSpeedCost;
  const currentLevel = State.flippingSpeed;
  return handlePurchase({
    requirements: [{ currency: currencyMap['Eternal'], amount: currentCost }],
    onSuccess: () => {
      State.flippingSpeedCost = Math.floor(currentCost * 2);
      State.flippingSpeed++;
      State.upgradeDropRate += 0.5;
    },
    uiUpdateConfig: {
      rowElement: row,
      costElement: row.querySelector('.flipSpeedUpgradeCostDisplay'),
      benefitElement: row.querySelector('.flipSpeedMulti'),
      getNextLevelData: () => {
        const nextCost = Math.floor(currentCost * 2);
        const nextBenefit = `+${formatEfficiency(currentLevel + 1)}`;
        return { cost: `${numeral(nextCost).format('0,0')} Eternal`, benefit: nextBenefit };
      },
      // This flag tells handlePurchase to keep hover effects active
      preserveHover: true,
      // Define hover classes to be used with preserveHover
      hoverClassesToRemoveOnMaxLevel: ['Eternal']
    },
    updateUI: () => {
      const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
      if (globalUpgradeRateElem) {
        globalUpgradeRateElem.innerHTML = State.upgradeDropRate.toFixed(1);
      }
    },
    successMessage: 'Flipping speed upgraded!'
  });
}

/**
 * Creates a flip speed upgrade configuration object.
 * @returns {Object} The upgrade configuration.
 */
export default function createFlipSpeedUpgrade() {
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
    benefit: () => `+${formatEfficiency(State.flippingSpeed)}`,
    costClass: 'flipSpeedUpgradeCostDisplay',
    costText: () => `${numeral(State.flippingSpeedCost).format('0,0')} Eternal`,
    requirements: () => [{ currency: currencyMap['Eternal'], amount: State.flippingSpeedCost }],
    hover: () => hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
    buy: handleFlipSpeedUpgrade
  };
}
