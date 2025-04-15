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
	
	// Get the guild grid container
	const guildGrid = document.querySelector('#guild .mdl-grid');
	
	// Generate exile cards dynamically
	generateExileCards(guildGrid);
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
});

//----------------------------------Start Functions
gameStart();