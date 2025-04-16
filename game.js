/**
 * Initializes the game by hiding all UI sections except the welcome screen
 * Called when the page first loads
 */
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
	
	// Don't hide craft cards here - let the crafting tab logic control this
	// $(".craft").hide();

	$("#loader").hide();
	
}

/**
 * Initiates the game after the player creates a guild
 * Reveals all main UI sections and navigates to the guild screen
 */
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
/**
 * Shows the main game screen and hides all other sections
 * Configures layout for the main currency display
 */
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

/**
 * Shows the guild management screen where players recruit and manage Exiles
 * Dynamically generates exile cards in the guild grid
 */
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

/**
 * Shows the currency flipping interface where players can trade currencies
 * Configures the layout and visibility of trading components
 */
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

/**
 * Shows the crafting interface where players can craft items
 * Renders the crafting UI components and applies visibility rules based on player progress
 */
function showCrafting() {
    // Hide all other sections
    $("#main").hide();
    $("#guild").hide();
    $("#delving").hide();
    $("#info").hide();
    
    // Show crafting section
    $("#crafting").show();
    
    // Avoid running the code if the welcome screen is visible
    // (this handles the test for crafting requiring guild creation)
    if ($("#welcomePre").is(":visible")) {
        return;
    }
    
    // Generate the header cards (Artificer and description)
    craftingSystem.renderCraftingHeader();
    
    // Generate the crafting cards dynamically
    craftingSystem.renderCraftingCards();
    
    // Get the current Artificer owned state
    const artificerOwned = typeof exileData !== 'undefined' && 
                          exileData.some(e => e.name === 'Artificer' && e.owned === true);
    
    // Debug: Check how many craft elements exist
    console.log("Craft elements count:", $(".craft").length);
    
    // Always apply visibility rules based on current state
    if (artificerOwned) {
        // When the Artificer is owned, hide all recruitment elements
        $(".ArtificerBuy, .ArtificerHide").hide();
        
        // Force display:block on all craft cards to ensure they're visible
        $(".craft").css("display", "block");
        $(".craft").show();
        
        // Double-check visibility
        console.log("After showing craft cards:", $(".craft").is(":visible"));
    } else {
        // When the Artificer is not owned, hide crafting cards
        $(".craft").hide();
    }
    
    // Check for Quad Stash Tab requirement
    if (window.quadStashTab !== 1) {
        $("#heavierCrafting, .advancedCrafting").hide();
    }
}

/**
 * Shows the delving interface where players can manage delve-related activities
 */
function showDelving() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").show();
	$("#info").hide();
	
}

/**
 * Shows the information screen with game details and help
 */
function showInfo() {

	$("#main").hide();
	$("#guild").hide();
	$("#crafting").hide();
	$("#delving").hide();
	$("#info").show();
	
}

//---Show upgrades
/**
 * Shows all upgrade tables in the upgrade interface
 * Displays general, gear, and links upgrade options
 */
function showAllUpgrades() {
	$("#UpgradeTable").show();
	$("#UpgradeGearTable").show();
	$("#UpgradeLinksTable").show();
}

/**
 * Shows only the general upgrades table
 * Hides gear and links upgrade options
 */
function showGeneralUpgrades() {
	$("#UpgradeTable").show();
	$("#UpgradeGearTable").hide();
	$("#UpgradeLinksTable").hide();
}

/**
 * Shows only the gear upgrades table
 * Hides general and links upgrade options
 */
function showGearUpgrades() {
	$("#UpgradeTable").hide();
	$("#UpgradeGearTable").show();
	$("#UpgradeLinksTable").hide();
}

/**
 * Shows only the links upgrades table
 * Hides general and gear upgrade options
 */
function showLinksUpgrades() {
	$("#UpgradeTable").hide();
	$("#UpgradeGearTable").hide();
	$("#UpgradeLinksTable").show();
}

//---Misc.

//---Snackbar
/**
 * Displays a temporary notification message to the user
 * Implements a cooldown to prevent message spam
 * 
 * @param {string} input - The message to display in the snackbar
 */
function SnackBar(input) {
	if (snackBarTimer <= 0) {
		'use strict';
		var snackbarContainer = document.querySelector('#snackBar');
		var data = {message: input, timeout: 1500};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
		snackBarTimer = 1500;
	}
}

/**
 * Initializes the welcome screen UI when the DOM is loaded
 * Creates the welcome card and sets up event handlers
 */
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

	/**
     * Adds hover effects to currency text elements
     * 
     * @param {HTMLElement} switchElement - The switch element to attach hover events to
     * @param {string} currencyName - The name of the currency to highlight on hover
     */
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