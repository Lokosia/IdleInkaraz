import { UI_CLASSES } from '../ui/UIClasses.js';

/**
 * mainGridConfig defines the configuration for the main UI grid layout.
 * Each object in the array represents a card with its own layout, content, and actions.
 *
 * @type {Array<Object>}
 * @property {string} id - Unique DOM id for the card.
 * @property {string} gridCols - CSS classes for grid column sizing.
 * @property {string} cssClasses - Additional CSS classes for styling.
 * @property {string} title - Card title (can include HTML).
 * @property {string} contentTemplate - HTML content for the card body.
 * @property {Array<Object>} actions - List of action/button/text configs for the card.
 */
export const mainGridConfig = [
    {
        id: 'divSingularity',
        gridCols: 'mdl-cell--4-col',
        cssClasses: 'cardBG singularity',
        title: 'The Singularity',
        contentTemplate: `Beep beep boop.`,
        actions: [
            { type: 'button', id: 'recruit-singularity', text: 'Recruit The Singularity', classes: [UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored, 'SingularityBuy'].join(' ') },
            { type: 'text', content: '250 Total Levels Required<br>Currency Stash Tab Required', classes: 'SingularityHide' }
        ]
    },
    {
        id: 'divFlipping',
        gridCols: 'mdl-cell--8-col',
        cssClasses: 'cardBG imgBG',
        title: 'Currency Flipping',
        contentTemplate: `
            <p>Automate buying and selling currency on the trade market.</p>
            <p>Toggle the slider to sell your currency.</p>
            <p>Flipping Speed Multiplier: x<span class="flipSpeedMulti">1</span></p>
        `,
        actions: []
    },
    {
        id: 'divSellCurrency',
        gridCols: 'mdl-cell--4-col',
        cssClasses: 'cardBG imgBG',
        title: 'Sell Currency',
        contentTemplate: `<div class="flip hidden" id="sellCurrencyContainer"></div>`,
        actions: []
    },
    {
        id: 'MainCurrency',
        gridCols: 'mdl-cell--3-col',
        cssClasses: 'cardBG imgBG',
        title: 'Currency',
        contentTemplate: `<div id="currencyDisplayContainer"></div>`,
        actions: []
    },
    {
        id: 'divBuyCurrency',
        gridCols: 'mdl-cell--4-col',
        cssClasses: 'cardBG imgBG',
        title: 'Buy Currency',
        contentTemplate: `<div class="flip hidden" id="buyCurrencyContainer"></div>`,
        actions: []
    },
    {
        id: 'divTheorycrafting',
        gridCols: 'mdl-cell--9-col',
        cssClasses: 'cardBG imgBG',
        title: 'Theorycrafting (Upgrade Efficiency:&nbsp;x<span class="UpgradeDropRate">0.0</span>)',
        contentTemplate: `
            <table class="mdl-data-table mdl-js-data-table cardBG">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Upgrade</th>
                        <th class="mdl-data-table__cell--non-numeric">Description</th>
                        <th class="mdl-data-table__cell--non-numeric">Efficiency</th>
                        <th class="mdl-data-table__cell--non-numeric">Cost</th>
                    </tr>
                </thead>
                <tbody id="UpgradeTable">
                    <!-- Upgrade rows will be generated dynamically by JS -->
                </tbody>
                <tbody id="UpgradeGearTable">
                </tbody>
                <tbody id="UpgradeLinksTable">
                </tbody>
            </table>
        `,
        actions: [
            { type: 'button', id: 'btn-all-upgrades', text: 'All', classes: [UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ') },
            { type: 'button', id: 'btn-general-upgrades', text: 'General', classes: [UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ') },
            { type: 'button', id: 'btn-gear-upgrades', text: 'Gear', classes: [UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ') },
            { type: 'button', id: 'btn-links-upgrades', text: 'Links', classes: [UI_CLASSES.button.base, UI_CLASSES.button.raised, UI_CLASSES.button.colored].join(' ') }
        ]
    }
];
