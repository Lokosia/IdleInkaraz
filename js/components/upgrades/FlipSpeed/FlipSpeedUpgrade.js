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
    costText: () => `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`, // Use numeral directly
    requirements: () => [{ currency: currencyMap['Eternal'], amount: Upgrades.flippingSpeedCost }],
    hover: () => hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
    buy: () => {
      const row = document.getElementById('flipSpeedUpgrade');
      if (!row) return false; // Ensure row exists before proceeding

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
          },
          // This upgrade doesn't have a max level, so removeRowOnMaxLevel is not needed
        },
        updateUI: () => {
          // Keep the global drop rate update here for now
          const globalUpgradeRateElem = document.getElementsByClassName('UpgradeDropRate')[0];
          if (globalUpgradeRateElem) {
            globalUpgradeRateElem.innerHTML = Upgrades.upgradeDropRate.toFixed(1);
          }
          
          // Cost afnod benefit updates are now handled by uiUpdateConfig
          // Re-apply hover effect
          // Manually add hover class back
          document.querySelectorAll('.Eternal').forEach(el => el.classList.add('hover'));
        },
        successMessage: 'Flipping speed upgraded!'
      });
    }
  };
}
