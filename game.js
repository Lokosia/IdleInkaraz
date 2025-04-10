function gameStart() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	$("#CrusaderUpgrade").hide();
	$("#HunterUpgrade").hide();
	$("#RedeemerUpgrade").hide();
	$("#WarlordUpgrade").hide();
	$(".craft").hide();

	$("#loader").hide();
	
}

function welcome() {

	$("#welcomePre").hide();
	$("#main").removeClass("hidden");
	$("#guild").removeClass("hidden");
	$("#crafting").removeClass("hidden");
	$("#delving").removeClass("hidden");
	$("#info").removeClass("hidden");
	showGuild();
}

//----------------------------------Menu
function showMain() {

	$("#main").show();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	$("#divBuyCurrency").hide();
	$("#divSellCurrency").hide();
	$("#divTheorycrafting").show();
	$("#divSingularity").hide();
	$("#divFlipping").hide();
	$("#MainCurrency").removeClass("mdl-cell--4-col");
	$("#MainCurrency").removeClass("mdl-cell--4-col-tablet");
	$("#MainCurrency").addClass("mdl-cell--3-col");
	$("#MainCurrency").addClass("mdl-cell--3-col-tablet");
}

function showGuild() {

	$("#main").hide();
	$("#guild").show();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	
}

function showFlipping() {

	$("#main").show();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").hide();
	$("#divBuyCurrency").show();
	$("#divSellCurrency").show();
	$("#divTheorycrafting").hide();
	$("#divSingularity").show();
	$("#divFlipping").show();
	$("#MainCurrency").removeClass("mdl-cell--3-col");
	$("#MainCurrency").removeClass("mdl-cell--3-col-tablet");
	$("#MainCurrency").addClass("mdl-cell--4-col");
	$("#MainCurrency").addClass("mdl-cell--4-col-tablet");
	
}

function showCrafting() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").show();
	$("#delving").hide();
	$("#info").hide();
	
}

function showDelving() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").show();
	$("#info").hide();
	
}

function showInfo() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").show();
	
}

//---Show upgrades
function showAllUpgrades() {
	$("#UpgradeTable").show();
	$("#UpgradeGearTable").show();
	$("#UpgradeLinksTable").show();
}
function showGeneralUpgrades() {
	$("#UpgradeTable").show();
	$("#UpgradeGearTable").hide();
	$("#UpgradeLinksTable").hide();
}
function showGearUpgrades() {
	$("#UpgradeTable").hide();
	$("#UpgradeGearTable").show();
	$("#UpgradeLinksTable").hide();
}
function showLinksUpgrades() {
	$("#UpgradeTable").hide();
	$("#UpgradeGearTable").hide();
	$("#UpgradeLinksTable").show();
}

//---Misc.

//---Snackbar
function SnackBar(input) {
	if (snackBarTimer <= 0) {
		'use strict';
		var snackbarContainer = document.querySelector('#snackBar');
		var data = {message: input, timeout: 1500};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
		snackBarTimer = 1500;
	}
}

//---Hover Menu Contrast Fix
function hoverMenu() {
    $('.menuHover').hover(
        function () {
        $(".material-icons").addClass('mdl-color-text--blue-grey-600');
        }, function () {
        $(".material-icons").removeClass('mdl-color-text--blue-grey-600');
        }
    );
}

document.addEventListener('DOMContentLoaded', function() {
    const welcomeCard = UICard.create({
        id: 'welcome-card',
        title: 'Welcome, Exile',
        content: `
            <p>It's the start of a new league in Path of Exile, you decide to create a guild with the
                sole intention of sharing resources and growing as a team.</p>
            <p>Recruit Exiles, Delvers, Currency Flippers, and Crafters. Dominate the economy and
                upgrade your guild members.</p>
            <div id="create-guild-button"></div>
        `,
        size: 'full',
        extraClasses: ['cardBG', 'imgBG']
    });

    document.querySelector('#welcomePre .mdl-grid').appendChild(welcomeCard);
    
    // Initialize the button inside the card
    const createGuildButton = UIButton.create('Create Guild', welcome);
    document.getElementById('create-guild-button').appendChild(createGuildButton);

	// Helper function for hover effects
    function addCurrencyHoverEffect(switchElement, currencyName) {
        $(switchElement).hover(
            function() {
                $(`.${currencyName}Text`).addClass('mdl-color-text--blue-grey-600');
            },
            function() {
                $(`.${currencyName}Text`).removeClass('mdl-color-text--blue-grey-600');
            }
        );
    }

	const armourerSellSwitch = UISwitch.create({
        id: 'ArmourerSellSlider',
        text: "Armourer's Scrap 15:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Armourer),
        extraClasses: ['ArmourerSellSlider']
    });
    
    const armourerSellSwitchContainer = document.getElementById('armourer-currency-sell-switch-container');
    armourerSellSwitchContainer.appendChild(armourerSellSwitch);
    addCurrencyHoverEffect('.ArmourerSellSlider', 'Armourer');

	const blacksmithSellSwitch = UISwitch.create({
        id: 'BlacksmithSellSlider',
        text: "Blacksmith's Whetstone 10:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Blacksmith),
        extraClasses: ['BlacksmithSellSlider']
    });
    
    const blacksmithSellSwitchContainer = document.getElementById('blacksmith-currency-sell-switch-container');
    blacksmithSellSwitchContainer.appendChild(blacksmithSellSwitch);
    addCurrencyHoverEffect('.BlacksmithSellSlider', 'Blacksmith');

	const glassblowerSellSwitch = UISwitch.create({
        id: 'GlassblowerSellSlider',
        text: "Glassblower's Bauble 8:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Glassblower),
        extraClasses: ['GlassblowerSellSlider']
    });
    
    const glassblowerSellSwitchContainer = document.getElementById('glassblower-currency-sell-switch-container');
    glassblowerSellSwitchContainer.appendChild(glassblowerSellSwitch);
    addCurrencyHoverEffect('.GlassblowerSellSlider', 'Glassblower');

	const transmutationSellSwitch = UISwitch.create({
        id: 'TransmutationSellSlider',
        text: "Orb of Transmutation 16:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Transmutation),
        extraClasses: ['TransmutationSellSlider']
    });
    
    const transmutationSellSwitchContainer = document.getElementById('transmutation-currency-sell-switch-container');
    transmutationSellSwitchContainer.appendChild(transmutationSellSwitch);
    addCurrencyHoverEffect('.TransmutationSellSlider', 'Transmutation');

	const augmentationSellSwitch = UISwitch.create({
        id: 'AugmentationSellSlider',
        text: "Orb of Augmentation 5:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Augmentation),
        extraClasses: ['AugmentationSellSlider']
    });
    
    const augmentationSellSwitchContainer = document.getElementById('augmentation-sell-switch-container');
    augmentationSellSwitchContainer.appendChild(augmentationSellSwitch);
    addCurrencyHoverEffect('.AugmentationSellSlider', 'Augmentation');

    const alterationSellSwitch = UISwitch.create({
        id: 'AlterationSellSlider',
        text: "Orb of Alteration 5:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Alteration),
        extraClasses: ['AlterationSellSlider']
    });
    
    const alterationSellSwitchContainer = document.getElementById('alteration-sell-switch-container');
    alterationSellSwitchContainer.appendChild(alterationSellSwitch);
    addCurrencyHoverEffect('.AlterationSellSlider', 'Alteration');

    const chanceSellSwitch = UISwitch.create({
        id: 'ChanceSellSlider',
        text: "Orb of Chance 9:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Chance),
        extraClasses: ['ChanceSellSlider']
    });
    
    const chanceSellSwitchContainer = document.getElementById('chance-sell-switch-container');
    chanceSellSwitchContainer.appendChild(chanceSellSwitch);
    addCurrencyHoverEffect('.ChanceSellSlider', 'Chance');

	const jewellerSellSwitch = UISwitch.create({
        id: 'JewellerSellSlider',
        text: "Jeweller's Orb 22:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Jeweller),
        extraClasses: ['JewellerSellSlider']
    });
    
    const jewellerSellSwitchContainer = document.getElementById('jeweller-currency-sell-switch-container');
    jewellerSellSwitchContainer.appendChild(jewellerSellSwitch);
    addCurrencyHoverEffect('.JewellerSellSlider', 'Jeweller');

    const chromaticSellSwitch = UISwitch.create({
        id: 'ChromaticSellSlider',
        text: "Chromatic Orb 9:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Chromatic),
        extraClasses: ['ChromaticSellSlider']
    });
    
    const chromaticSellSwitchContainer = document.getElementById('chromatic-currency-sell-switch-container');
    chromaticSellSwitchContainer.appendChild(chromaticSellSwitch);
    addCurrencyHoverEffect('.ChromaticSellSlider', 'Chromatic');

    const regretSellSwitch = UISwitch.create({
        id: 'RegretSellSlider',
        text: "Orb of Regret 4:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Regret),
        extraClasses: ['RegretSellSlider']
    });
    
    const regretSellSwitchContainer = document.getElementById('regret-currency-sell-switch-container');
    regretSellSwitchContainer.appendChild(regretSellSwitch);
    addCurrencyHoverEffect('.RegretSellSlider', 'Regret');

	const gcpSellSwitch = UISwitch.create({
        id: 'GCPSellSlider',
        text: "Gemcutter's Prism 2:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, GCP),
        extraClasses: ['GCPSellSlider']
    });
    
    const gcpSellSwitchContainer = document.getElementById('gcp-currency-sell-switch-container');
    gcpSellSwitchContainer.appendChild(gcpSellSwitch);
    addCurrencyHoverEffect('.GCPSellSlider', 'GCP');

    const blessedSellSwitch = UISwitch.create({
        id: 'BlessedSellSlider',
        text: "Blessed Orb 15:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Blessed),
        extraClasses: ['BlessedSellSlider']
    });
    
    const blessedSellSwitchContainer = document.getElementById('blessed-currency-sell-switch-container');
    blessedSellSwitchContainer.appendChild(blessedSellSwitch);
    addCurrencyHoverEffect('.BlessedSellSlider', 'Blessed');

    const regalSellSwitch = UISwitch.create({
        id: 'RegalSellSlider',
        text: "Regal Orb 5:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Regal),
        extraClasses: ['RegalSellSlider']
    });
    
    const regalSellSwitchContainer = document.getElementById('regal-currency-sell-switch-container');
    regalSellSwitchContainer.appendChild(regalSellSwitch);
    addCurrencyHoverEffect('.RegalSellSlider', 'Regal');

	const stackedDeckSellSwitch = UISwitch.create({
        id: 'StackedDeckSellSlider',
        text: "Stacked Deck 2:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, StackedDeck),
        extraClasses: ['StackedDeckSellSlider']
    });
    
    const stackedDeckSellSwitchContainer = document.getElementById('stacked-deck-sell-switch-container');
    stackedDeckSellSwitchContainer.appendChild(stackedDeckSellSwitch);
    addCurrencyHoverEffect('.StackedDeckSellSlider', 'StackedDeck');

    const silverCoinSellSwitch = UISwitch.create({
        id: 'SilverCoinSellSlider',
        text: "Silver Coin 10:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, SilverCoin),
        extraClasses: ['SilverCoinSellSlider']
    });
    
    const silverCoinSellSwitchContainer = document.getElementById('silver-coin-sell-switch-container');
    silverCoinSellSwitchContainer.appendChild(silverCoinSellSwitch);
    addCurrencyHoverEffect('.SilverCoinSellSlider', 'SilverCoin');

    const chiselSellSwitch = UISwitch.create({
        id: 'ChiselSellSlider',
        text: "Cartographer's Chisel 5:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Chisel),
        extraClasses: ['ChiselSellSlider']
    });
    
    const chiselSellSwitchContainer = document.getElementById('chisel-sell-switch-container');
    chiselSellSwitchContainer.appendChild(chiselSellSwitch);
    addCurrencyHoverEffect('.ChiselSellSlider', 'Chisel');

	const alchemySellSwitch = UISwitch.create({
        id: 'AlchemySellSlider', 
        text: "Orb of Alchemy 8:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Alchemy),
        extraClasses: ['AlchemySellSlider']
    });
    
    const alchemySellSwitchContainer = document.getElementById('alchemy-sell-switch-container');
    alchemySellSwitchContainer.appendChild(alchemySellSwitch);
    addCurrencyHoverEffect('.AlchemySellSlider', 'Alchemy');

    const scouringSellSwitch = UISwitch.create({
        id: 'ScouringSellSlider',
        text: "Orb of Scouring 3:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Scouring),
        extraClasses: ['ScouringSellSlider']
    });
    
    const scouringSellSwitchContainer = document.getElementById('scouring-sell-switch-container');
    scouringSellSwitchContainer.appendChild(scouringSellSwitch);
    addCurrencyHoverEffect('.ScouringSellSlider', 'Scouring');

    const simpleSextantSellSwitch = UISwitch.create({
        id: 'SimpleSextantSellSlider',
        text: "Simple Sextant 3:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, SimpleSextant),
        extraClasses: ['SimpleSextantSellSlider']
    });
    
    const simpleSextantSellSwitchContainer = document.getElementById('simple-sextant-sell-switch-container');
    simpleSextantSellSwitchContainer.appendChild(simpleSextantSellSwitch);
    addCurrencyHoverEffect('.SimpleSextantSellSlider', 'SimpleSextant');

	const primeSextantSellSwitch = UISwitch.create({
        id: 'PrimeSextantSellSlider',
        text: "Prime Sextant 2:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, PrimeSextant),
        extraClasses: ['PrimeSextantSellSlider']
    });
    
    const primeSextantSellSwitchContainer = document.getElementById('prime-sextant-sell-switch-container');
    primeSextantSellSwitchContainer.appendChild(primeSextantSellSwitch);
    addCurrencyHoverEffect('.PrimeSextantSellSlider', 'PrimeSextant');

    const awakenedSextantSellSwitch = UISwitch.create({
        id: 'AwakenedSextantSellSlider',
        text: "Awakened Sextant 1:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, AwakenedSextant),
        extraClasses: ['AwakenedSextantSellSlider']
    });
    
    const awakenedSextantSellSwitchContainer = document.getElementById('awakened-sextant-sell-switch-container');
    awakenedSextantSellSwitchContainer.appendChild(awakenedSextantSellSwitch);
    addCurrencyHoverEffect('.AwakenedSextantSellSlider', 'AwakenedSextant');

    const fusingSellSwitch = UISwitch.create({
        id: 'FusingSellSlider',
        text: "Orb of Fusing 6:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Fusing),
        extraClasses: ['FusingSellSlider']
    });
    
    const fusingSellSwitchContainer = document.getElementById('fusing-sell-switch-container');
    fusingSellSwitchContainer.appendChild(fusingSellSwitch);
    addCurrencyHoverEffect('.FusingSellSlider', 'Fusing');

	const vaalSellSwitch = UISwitch.create({
        id: 'VaalSellSlider',
        text: "Vaal Orb 2:1 Chaos Orb",
        onChange: (e) => slideSell(e.target, Vaal),
        extraClasses: ['VaalSellSlider']
    });
    
    const vaalSellSwitchContainer = document.getElementById('vaal-currency-sell-switch-container');
    vaalSellSwitchContainer.appendChild(vaalSellSwitch);
    addCurrencyHoverEffect('.VaalSellSlider', 'Vaal');

    const annulmentSellSwitch = UISwitch.create({
        id: 'AnnulmentSellSlider',
        text: "Orb of Annulment 1:4 Chaos Orb",
        onChange: (e) => slideSell(e.target, Annulment),
        extraClasses: ['AnnulmentSellSlider']
    });
    
    const annulmentSellSwitchContainer = document.getElementById('annulment-currency-sell-switch-container');
    annulmentSellSwitchContainer.appendChild(annulmentSellSwitch);
    addCurrencyHoverEffect('.AnnulmentSellSlider', 'Annulment');

    const divineSellSwitch = UISwitch.create({
        id: 'DivineSellSlider',
        text: "Divine Orb 1:10 Chaos Orb",
        onChange: (e) => slideSell(e.target, Divine),
        extraClasses: ['DivineSellSlider']
    });
    
    const divineSellSwitchContainer = document.getElementById('divine-currency-sell-switch-container');
    divineSellSwitchContainer.appendChild(divineSellSwitch);
    addCurrencyHoverEffect('.DivineSellSlider', 'Divine');

	const exaltedSellSwitch = UISwitch.create({
        id: 'ExaltedSellSlider',
        text: "Exalted Orb 1:125 Chaos Orb",
        onChange: (e) => slideSell(e.target, Exalted),
        extraClasses: ['ExaltedSellSlider']
    });
    
    const exaltedSellSwitchContainer = document.getElementById('exalted-currency-sell-switch-container');
    exaltedSellSwitchContainer.appendChild(exaltedSellSwitch);
    addCurrencyHoverEffect('.ExaltedSellSlider', 'Exalted');

    const awakenerSellSwitch = UISwitch.create({
        id: 'AwakenerSellSlider',
        text: "Awakener's Orb 1:10 Exalted Orb",
        onChange: (e) => slideSell(e.target, Awakener),
        extraClasses: ['AwakenerSellSlider']
    });
    
    const awakenerSellSwitchContainer = document.getElementById('awakener-currency-sell-switch-container');
    awakenerSellSwitchContainer.appendChild(awakenerSellSwitch);
    addCurrencyHoverEffect('.AwakenerSellSlider', 'Awakener');

    const crusaderSellSwitch = UISwitch.create({
        id: 'CrusaderSellSlider',
        text: "Crusader's Exalted Orb 1:10 Exalted Orb",
        onChange: (e) => slideSell(e.target, Crusader),
        extraClasses: ['CrusaderSellSlider']
    });
    
    const crusaderSellSwitchContainer = document.getElementById('crusader-currency-sell-switch-container');
    crusaderSellSwitchContainer.appendChild(crusaderSellSwitch);
    addCurrencyHoverEffect('.CrusaderSellSlider', 'Crusader');

	const hunterSellSwitch = UISwitch.create({
        id: 'HunterSellSlider',
        text: "Hunter's Exalted Orb 1:10 Exalted Orb",
        onChange: (e) => slideSell(e.target, Hunter),
        extraClasses: ['HunterSellSlider']
    });
    
    const hunterSellSwitchContainer = document.getElementById('hunter-currency-sell-switch-container');
    hunterSellSwitchContainer.appendChild(hunterSellSwitch);
    addCurrencyHoverEffect('.HunterSellSlider', 'Hunter');

    const redeemerSellSwitch = UISwitch.create({
        id: 'RedeemerSellSlider',
        text: "Redeemer's Exalted Orb 1:10 Exalted Orb",
        onChange: (e) => slideSell(e.target, Redeemer),
        extraClasses: ['RedeemerSellSlider']
    });
    
    const redeemerSellSwitchContainer = document.getElementById('redeemer-currency-sell-switch-container');
    redeemerSellSwitchContainer.appendChild(redeemerSellSwitch);
    addCurrencyHoverEffect('.RedeemerSellSlider', 'Redeemer');

    const warlordSellSwitch = UISwitch.create({
        id: 'WarlordSellSlider',
        text: "Warlord's Exalted Orb 1:10 Exalted Orb",
        onChange: (e) => slideSell(e.target, Warlord),
        extraClasses: ['WarlordSellSlider']
    });
    
    const warlordSellSwitchContainer = document.getElementById('warlord-currency-sell-switch-container');
    warlordSellSwitchContainer.appendChild(warlordSellSwitch);
    addCurrencyHoverEffect('.WarlordSellSlider', 'Warlord');

	const eternalSellSwitch = UISwitch.create({
        id: 'EternalSellSlider',
        text: "Eternal Orb 1:25 Exalted Orb",
        onChange: (e) => slideSell(e.target, Eternal),
        extraClasses: ['EternalSellSlider']
    });
    
    const eternalSellSwitchContainer = document.getElementById('eternal-currency-sell-switch-container');
    eternalSellSwitchContainer.appendChild(eternalSellSwitch);
    addCurrencyHoverEffect('.EternalSellSlider', 'Eternal');

    const mirrorSellSwitch = UISwitch.create({
        id: 'MirrorSellSlider',
        text: "Mirror of Kalandra 1:200 Exalted Orb",
        onChange: (e) => slideSell(e.target, Mirror),
        extraClasses: ['MirrorSellSlider']
    });
    
    const mirrorSellSwitchContainer = document.getElementById('mirror-currency-sell-switch-container');
    mirrorSellSwitchContainer.appendChild(mirrorSellSwitch);
    addCurrencyHoverEffect('.MirrorSellSlider', 'Mirror');

	//---Currency Buy Switches

	const armourerBuySwitch = UISwitch.create({
        id: 'ArmourerBuySlider',
        text: "Armourer's Scrap 13:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Armourer),
        extraClasses: ['ArmourerBuySlider']
    });
    
    const armourerBuySwitchContainer = document.getElementById('armourer-currency-buy-switch-container');
    armourerBuySwitchContainer.appendChild(armourerBuySwitch);
    addCurrencyHoverEffect('.ArmourerBuySlider', 'Armourer');

    const blacksmithBuySwitch = UISwitch.create({
        id: 'BlacksmithBuySlider',
        text: "Blacksmith's Whetstone 9:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Blacksmith),
        extraClasses: ['BlacksmithBuySlider']
    });
    
    const blacksmithBuySwitchContainer = document.getElementById('blacksmith-currency-buy-switch-container');
    blacksmithBuySwitchContainer.appendChild(blacksmithBuySwitch);
    addCurrencyHoverEffect('.BlacksmithBuySlider', 'Blacksmith');

    const glassblowerBuySwitch = UISwitch.create({
        id: 'GlassblowerBuySlider',
        text: "Glassblower's Bauble 7:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Glassblower),
        extraClasses: ['GlassblowerBuySlider']
    });
    
    const glassblowerBuySwitchContainer = document.getElementById('glassblower-currency-buy-switch-container');
    glassblowerBuySwitchContainer.appendChild(glassblowerBuySwitch);
    addCurrencyHoverEffect('.GlassblowerBuySlider', 'Glassblower');

	const transmutationBuySwitch = UISwitch.create({
        id: 'TransmutationBuySlider',
        text: "Orb of Transmutation 15:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Transmutation),
        extraClasses: ['TransmutationBuySlider']
    });
    
    const transmutationBuySwitchContainer = document.getElementById('transmutation-currency-buy-switch-container');
    transmutationBuySwitchContainer.appendChild(transmutationBuySwitch);
    addCurrencyHoverEffect('.TransmutationBuySlider', 'Transmutation');

    const augmentationBuySwitch = UISwitch.create({
        id: 'AugmentationBuySlider',
        text: "Orb of Augmentation 4:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Augmentation),
        extraClasses: ['AugmentationBuySlider']
    });
    
    const augmentationBuySwitchContainer = document.getElementById('augmentation-currency-buy-switch-container');
    augmentationBuySwitchContainer.appendChild(augmentationBuySwitch);
    addCurrencyHoverEffect('.AugmentationBuySlider', 'Augmentation');

    const alterationBuySwitch = UISwitch.create({
        id: 'AlterationBuySlider',
        text: "Orb of Alteration 4:1 Chaos Orb", 
        onChange: (e) => slideBuy(e.target, Alteration),
        extraClasses: ['AlterationBuySlider']
    });
    
    const alterationBuySwitchContainer = document.getElementById('alteration-currency-buy-switch-container');
    alterationBuySwitchContainer.appendChild(alterationBuySwitch);
    addCurrencyHoverEffect('.AlterationBuySlider', 'Alteration');

	const chanceBuySwitch = UISwitch.create({
        id: 'ChanceBuySlider',
        text: "Orb of Chance 8:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Chance),
        extraClasses: ['ChanceBuySlider']
    });
    
    const chanceBuySwitchContainer = document.getElementById('chance-buy-switch-container');
    chanceBuySwitchContainer.appendChild(chanceBuySwitch);
    addCurrencyHoverEffect('.ChanceBuySlider', 'Chance');

    const jewellerBuySwitch = UISwitch.create({
        id: 'JewellerBuySlider',
        text: "Jeweller's Orb 21:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Jeweller),
        extraClasses: ['JewellerBuySlider']
    });
    
    const jewellerBuySwitchContainer = document.getElementById('jeweller-buy-switch-container');
    jewellerBuySwitchContainer.appendChild(jewellerBuySwitch);
    addCurrencyHoverEffect('.JewellerBuySlider', 'Jeweller');

    const chromaticBuySwitch = UISwitch.create({
        id: 'ChromaticBuySlider',
        text: "Chromatic Orb 8:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Chromatic),
        extraClasses: ['ChromaticBuySlider']
    });
    
    const chromaticBuySwitchContainer = document.getElementById('chromatic-buy-switch-container');
    chromaticBuySwitchContainer.appendChild(chromaticBuySwitch);
    addCurrencyHoverEffect('.ChromaticBuySlider', 'Chromatic');

	const regretBuySwitch = UISwitch.create({
        id: 'RegretBuySlider',
        text: "Orb of Regret 3:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Regret),
        extraClasses: ['RegretBuySlider']
    });
    
    const regretBuySwitchContainer = document.getElementById('regret-buy-switch-container');
    regretBuySwitchContainer.appendChild(regretBuySwitch);
    addCurrencyHoverEffect('.RegretBuySlider', 'Regret');

    const gcpBuySwitch = UISwitch.create({
        id: 'GCPBuySlider',
        text: "Gemcutter's Prism 1:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, GCP),
        extraClasses: ['GCPBuySlider']
    });
    
    const gcpBuySwitchContainer = document.getElementById('gcp-buy-switch-container');
    gcpBuySwitchContainer.appendChild(gcpBuySwitch);
    addCurrencyHoverEffect('.GCPBuySlider', 'GCP');

    const blessedBuySwitch = UISwitch.create({
        id: 'BlessedBuySlider',
        text: "Blessed Orb 14:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Blessed),
        extraClasses: ['BlessedBuySlider']
    });
    
    const blessedBuySwitchContainer = document.getElementById('blessed-buy-switch-container');
    blessedBuySwitchContainer.appendChild(blessedBuySwitch);
    addCurrencyHoverEffect('.BlessedBuySlider', 'Blessed');

	const regalBuySwitch = UISwitch.create({
        id: 'RegalBuySlider',
        text: "Regal Orb 4:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Regal),
        extraClasses: ['RegalBuySlider']
    });
    
    const regalBuySwitchContainer = document.getElementById('regal-buy-switch-container');
    regalBuySwitchContainer.appendChild(regalBuySwitch);
    addCurrencyHoverEffect('.RegalBuySlider', 'Regal');

    const stackedDeckBuySwitch = UISwitch.create({
        id: 'StackedDeckBuySlider',
        text: "Stacked Deck 1:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, StackedDeck),
        extraClasses: ['StackedDeckBuySlider']
    });
    
    const stackedDeckBuySwitchContainer = document.getElementById('stacked-deck-buy-switch-container');
    stackedDeckBuySwitchContainer.appendChild(stackedDeckBuySwitch);
    addCurrencyHoverEffect('.StackedDeckBuySlider', 'StackedDeck');

    const silverCoinBuySwitch = UISwitch.create({
        id: 'SilverCoinBuySlider',
        text: "Silver Coin 10:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, SilverCoin),
        extraClasses: ['SilverCoinBuySlider']
    });
    
    const silverCoinBuySwitchContainer = document.getElementById('silver-coin-buy-switch-container');
    silverCoinBuySwitchContainer.appendChild(silverCoinBuySwitch);
    addCurrencyHoverEffect('.SilverCoinBuySlider', 'SilverCoin');

	const chiselBuySwitch = UISwitch.create({
        id: 'ChiselBuySlider',
        text: "Cartographer's Chisel 4:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Chisel),
        extraClasses: ['ChiselBuySlider']
    });
    
    const chiselBuySwitchContainer = document.getElementById('chisel-buy-switch-container');
    chiselBuySwitchContainer.appendChild(chiselBuySwitch);
    addCurrencyHoverEffect('.ChiselBuySlider', 'Chisel');

    const alchemyBuySwitch = UISwitch.create({
        id: 'AlchemyBuySlider',
        text: "Orb of Alchemy 7:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Alchemy),
        extraClasses: ['AlchemyBuySlider']
    });
    
    const alchemyBuySwitchContainer = document.getElementById('alchemy-buy-switch-container');
    alchemyBuySwitchContainer.appendChild(alchemyBuySwitch);
    addCurrencyHoverEffect('.AlchemyBuySlider', 'Alchemy');

    const scouringBuySwitch = UISwitch.create({
        id: 'ScouringBuySlider',
        text: "Orb of Scouring 2:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Scouring),
        extraClasses: ['ScouringBuySlider']
    });
    
    const scouringBuySwitchContainer = document.getElementById('scouring-buy-switch-container');
    scouringBuySwitchContainer.appendChild(scouringBuySwitch);
    addCurrencyHoverEffect('.ScouringBuySlider', 'Scouring');

	const simpleSextantBuySwitch = UISwitch.create({
        id: 'SimpleSextantBuySlider',
        text: "Simple Sextant 3:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, SimpleSextant),
        extraClasses: ['SimpleSextantBuySlider'] 
    });
    
    const simpleSextantBuySwitchContainer = document.getElementById('simple-sextant-buy-switch-container');
    simpleSextantBuySwitchContainer.appendChild(simpleSextantBuySwitch);
    addCurrencyHoverEffect('.SimpleSextantBuySlider', 'SimpleSextant');

    const primeSextantBuySwitch = UISwitch.create({
        id: 'PrimeSextantBuySlider',
        text: "Prime Sextant 2:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, PrimeSextant),
        extraClasses: ['PrimeSextantBuySlider']
    });
    
    const primeSextantBuySwitchContainer = document.getElementById('prime-sextant-buy-switch-container');
    primeSextantBuySwitchContainer.appendChild(primeSextantBuySwitch);
    addCurrencyHoverEffect('.PrimeSextantBuySlider', 'PrimeSextant');

    const awakenedSextantBuySwitch = UISwitch.create({
        id: 'AwakenedSextantBuySlider',
        text: "Awakened Sextant 1:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, AwakenedSextant),
        extraClasses: ['AwakenedSextantBuySlider']
    });
    
    const awakenedSextantBuySwitchContainer = document.getElementById('awakened-sextant-buy-switch-container');
    awakenedSextantBuySwitchContainer.appendChild(awakenedSextantBuySwitch);
    addCurrencyHoverEffect('.AwakenedSextantBuySlider', 'AwakenedSextant');

	const fusingBuySwitch = UISwitch.create({
        id: 'FusingBuySlider',
        text: "Orb of Fusing 5:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Fusing),
        extraClasses: ['FusingBuySlider']
    });
    
    const fusingBuySwitchContainer = document.getElementById('fusing-buy-switch-container');
    fusingBuySwitchContainer.appendChild(fusingBuySwitch);
    addCurrencyHoverEffect('.FusingBuySlider', 'Fusing');

    const vaalBuySwitch = UISwitch.create({
        id: 'VaalBuySlider',
        text: "Vaal Orb 2:1 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Vaal),
        extraClasses: ['VaalBuySlider']
    });
    
    const vaalBuySwitchContainer = document.getElementById('vaal-buy-switch-container');
    vaalBuySwitchContainer.appendChild(vaalBuySwitch);
    addCurrencyHoverEffect('.VaalBuySlider', 'Vaal');

    const annulmentBuySwitch = UISwitch.create({
        id: 'AnnulmentBuySlider', 
        text: "Orb of Annulment 1:3 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Annulment),
        extraClasses: ['AnnulmentBuySlider']
    });
    
    const annulmentBuySwitchContainer = document.getElementById('annulment-buy-switch-container');
    annulmentBuySwitchContainer.appendChild(annulmentBuySwitch);
    addCurrencyHoverEffect('.AnnulmentBuySlider', 'Annulment');

	const divineBuySwitch = UISwitch.create({
        id: 'DivineBuySlider',
        text: "Divine Orb 1:10 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Divine),
        extraClasses: ['DivineBuySlider']
    });
    
    const divineBuySwitchContainer = document.getElementById('divine-buy-switch-container');
    divineBuySwitchContainer.appendChild(divineBuySwitch);
    addCurrencyHoverEffect('.DivineBuySlider', 'Divine');

    const exaltedBuySwitch = UISwitch.create({
        id: 'ExaltedBuySlider',
        text: "Exalted Orb 1:150 Chaos Orb",
        onChange: (e) => slideBuy(e.target, Exalted),
        extraClasses: ['ExaltedBuySlider']
    });
    
    const exaltedBuySwitchContainer = document.getElementById('exalted-buy-switch-container');
    exaltedBuySwitchContainer.appendChild(exaltedBuySwitch);
    addCurrencyHoverEffect('.ExaltedBuySlider', 'Exalted');

    const awakenerBuySwitch = UISwitch.create({
        id: 'AwakenerBuySlider',
        text: "Awakener's Orb 1:20 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Awakener),
        extraClasses: ['AwakenerBuySlider']
    });
    
    const awakenerBuySwitchContainer = document.getElementById('awakener-buy-switch-container');
    awakenerBuySwitchContainer.appendChild(awakenerBuySwitch);
    addCurrencyHoverEffect('.AwakenerBuySlider', 'Awakener');

	const crusaderBuySwitch = UISwitch.create({
        id: 'CrusaderBuySlider',
        text: "Crusader's Exalted Orb 1:20 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Crusader),
        extraClasses: ['CrusaderBuySlider']
    });

    const crusaderBuySwitchContainer = document.getElementById('crusader-buy-switch-container');
    crusaderBuySwitchContainer.appendChild(crusaderBuySwitch);
    addCurrencyHoverEffect('.CrusaderBuySlider', 'Crusader');

    const hunterBuySwitch = UISwitch.create({
        id: 'HunterBuySlider',
        text: "Hunter's Exalted Orb 1:20 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Hunter),
        extraClasses: ['HunterBuySlider']
    });

    const hunterBuySwitchContainer = document.getElementById('hunter-buy-switch-container');
    hunterBuySwitchContainer.appendChild(hunterBuySwitch);
    addCurrencyHoverEffect('.HunterBuySlider', 'Hunter');

    const redeemerBuySwitch = UISwitch.create({
        id: 'RedeemerBuySlider',
        text: "Redeemer's Exalted Orb 1:20 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Redeemer),
        extraClasses: ['RedeemerBuySlider']
    });

    const redeemerBuySwitchContainer = document.getElementById('redeemer-buy-switch-container');
    redeemerBuySwitchContainer.appendChild(redeemerBuySwitch);
    addCurrencyHoverEffect('.RedeemerBuySlider', 'Redeemer');

	const warlordBuySwitch = UISwitch.create({
        id: 'WarlordBuySlider',
        text: "Warlord's Exalted Orb 1:20 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Warlord),
        extraClasses: ['WarlordBuySlider']
    });

    const warlordBuySwitchContainer = document.getElementById('warlord-buy-switch-container');
    warlordBuySwitchContainer.appendChild(warlordBuySwitch);
    addCurrencyHoverEffect('.WarlordBuySlider', 'Warlord');

    const eternalBuySwitch = UISwitch.create({
        id: 'EternalBuySlider',
        text: "Eternal Orb 1:50 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Eternal),
        extraClasses: ['EternalBuySlider']
    });

    const eternalBuySwitchContainer = document.getElementById('eternal-buy-switch-container');
    eternalBuySwitchContainer.appendChild(eternalBuySwitch);
    addCurrencyHoverEffect('.EternalBuySlider', 'Eternal');

    const mirrorBuySwitch = UISwitch.create({
        id: 'MirrorBuySlider',
        text: "Mirror of Kalandra 1:250 Exalted Orb",
        onChange: (e) => slideBuy(e.target, Mirror),
        extraClasses: ['MirrorBuySlider']
    });

    const mirrorBuySwitchContainer = document.getElementById('mirror-buy-switch-container');
    mirrorBuySwitchContainer.appendChild(mirrorBuySwitch);
    addCurrencyHoverEffect('.MirrorBuySlider', 'Mirror');
});

//----------------------------------Start Functions
gameStart();
hoverMenu();

//---File Handling
// window.setInterval(function saveGame() {
//    localStorage['goeSaveCurrency'] = btoa(JSON.stringify(Currency));
//    localStorage['goeSaveExile'] = btoa(JSON.stringify(Exile));
// }, 30000);
// function saveGameManual() {
//    localStorage['goeSaveCurrency'] = btoa(JSON.stringify(Currency));
//    localStorage['goeSaveExile'] = btoa(JSON.stringify(Exile));
// }

// function load_game() {
//     if (!localStorage['goeSave']) return;
//     var goeSaveCurrency = JSON.parse(atob(localStorage['goeSaveCurrency']));
//     var goeSaveExiles = JSON.parse(atob(localStorage['goeSaveExiles']));
//     Currency = goeSaveCurrency;
//     Exiles = goeSaveExiles;
// //update all info on screen
 
// }

// function delete_game() {
//     localStorage.clear();
//     window.location.reload();
// }
