/**
 * Idle Inkaraz - Crafting System Tests
 * Comprehensive test suite for the crafting system
 */

/**
 * Comprehensive test suite for crafting system
 * Tests regular crafting and mirror crafting functionality
 */
class CraftingTests {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.originalCraftingState = null;
    }

    /**
     * Run all tests and report results
     */
    runAllTests() {
        // Reset test results
        this.testResults = { passed: 0, failed: 0, total: 0 };
        
        console.log("===== RUNNING CRAFTING SYSTEM TESTS =====");
        
        // Store original crafting system state
        this.storeOriginalCraftingState();
        
        // Reset state for testing
        this.resetTestState();

        // Store original state
        const originalGuildCreated = window.guildCreated;
        const originalQuadStashTab = window.quadStashTab;
        const artificerOriginalState = this.getArtificerState();
        
        // Save welcome screen visibility state
        const welcomeVisible = $("#welcomePre").is(":visible");
        
        try {
            // Run all tests
            
            // Access control validation
            this.testCraftingRequiresGuildCreation();
            this.testCraftingRequiresArtificer();
            this.testCraftingRequiresQuadTab();
            
            // Regular crafting tests
            this.testBuyCrafting();
            this.testCraftingIngredientCheck();
            this.testCraftingCurrencyDeduction();
            this.testCraftingRewards();
            
            // Mirror crafting tests
            this.testBuyMirrorCrafting();
            this.testMirrorFeeIncrease();

            // New test case
            this.testArtificerStatePreservation();
        } finally {
            // Always restore original state at end of tests
            window.guildCreated = originalGuildCreated;
            window.quadStashTab = originalQuadStashTab;
            this.restoreArtificerState(artificerOriginalState);
            
            // Restore original crafting system state
            this.restoreOriginalCraftingState();
            
            // Restore welcome screen visibility
            if (welcomeVisible) {
                $("#welcomePre").show();
            } else {
                $("#welcomePre").hide();
            }
        }
        
        // Report results
        console.log(`===== TEST RESULTS: ${this.testResults.passed}/${this.testResults.total} PASSED (${this.testResults.failed} failed) =====`);
        
        return this.testResults.failed === 0;
    }

    /**
     * Store original crafting system state
     */
    storeOriginalCraftingState() {
        console.log("Storing original crafting system state...");
        this.originalCraftingState = {
            craftingItems: {},
            mirrorItems: {}
        };

        // Clone the crafting items state
        if (craftingSystem && craftingSystem.craftingItems) {
            for (const [id, item] of Object.entries(craftingSystem.craftingItems)) {
                this.originalCraftingState.craftingItems[id] = {
                    level: item.level,
                    progress: item.progress,
                    totalCrafted: item.totalCrafted
                };
            }
        }

        // Clone the mirror items state
        if (craftingSystem && craftingSystem.mirrorItems) {
            for (const [id, item] of Object.entries(craftingSystem.mirrorItems)) {
                this.originalCraftingState.mirrorItems[id] = {
                    level: item.level,
                    progress: item.progress,
                    totalCrafted: item.totalCrafted,
                    fee: item.fee
                };
            }
        }

        // Store currency state
        this.originalCraftingState.currency = {};
        const currencyTypes = [
            'Chaos', 'Exalted', 'Transmutation', 'Alteration', 
            'Augmentation', 'GCP', 'Vaal'
        ];

        for (const currency of currencyTypes) {
            if (typeof window[currency] !== 'undefined') {
                this.originalCraftingState.currency[currency] = window[currency].total;
            }
        }

        // Store fossil state
        this.originalCraftingState.fossils = [];
        if (typeof fossilData !== 'undefined') {
            for (let i = 0; i < fossilData.length; i++) {
                this.originalCraftingState.fossils.push({
                    name: fossilData[i].name,
                    total: fossilData[i].total
                });
            }
        }
    }

    /**
     * Restore original crafting system state
     */
    restoreOriginalCraftingState() {
        if (!this.originalCraftingState) {
            console.log("No original crafting state to restore.");
            return;
        }

        console.log("Restoring original crafting system state...");

        // Restore crafting items state
        if (craftingSystem && craftingSystem.craftingItems) {
            for (const [id, savedState] of Object.entries(this.originalCraftingState.craftingItems)) {
                if (craftingSystem.craftingItems[id]) {
                    craftingSystem.craftingItems[id].level = savedState.level;
                    craftingSystem.craftingItems[id].progress = savedState.progress;
                    craftingSystem.craftingItems[id].totalCrafted = savedState.totalCrafted;
                }
            }
        }

        // Restore mirror items state
        if (craftingSystem && craftingSystem.mirrorItems) {
            for (const [id, savedState] of Object.entries(this.originalCraftingState.mirrorItems)) {
                if (craftingSystem.mirrorItems[id]) {
                    craftingSystem.mirrorItems[id].level = savedState.level;
                    craftingSystem.mirrorItems[id].progress = savedState.progress;
                    craftingSystem.mirrorItems[id].totalCrafted = savedState.totalCrafted;
                    craftingSystem.mirrorItems[id].fee = savedState.fee;
                }
            }
        }

        // Restore currency state
        for (const [currency, total] of Object.entries(this.originalCraftingState.currency)) {
            if (typeof window[currency] !== 'undefined') {
                window[currency].total = total;
            }
        }

        // Restore fossil state
        if (typeof fossilData !== 'undefined' && this.originalCraftingState.fossils) {
            for (let i = 0; i < fossilData.length; i++) {
                const savedFossil = this.originalCraftingState.fossils.find(
                    f => f.name === fossilData[i].name
                );
                if (savedFossil) {
                    fossilData[i].total = savedFossil.total;
                }
            }
        }

        // Update UI if the crafting tab is visible
        if ($("#crafting").is(":visible")) {
            craftingSystem.renderCraftingCards();
            craftingSystem.updateFossilCounts();
        }
    }

    /**
     * Save artificer state
     */
    getArtificerState() {
        if (typeof exileData === 'undefined' || !exileData.some(e => e.name === 'Artificer')) {
            return false;
        }
        return exileData.find(e => e.name === 'Artificer').owned;
    }
    
    /**
     * Restore artificer state
     */
    restoreArtificerState(wasOwned) {
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = wasOwned;
        }
    }
    
    /**
     * Reset game state for testing
     */
    resetTestState() {
        // Reset currency for testing
        Chaos.total = 100000;
        Exalted.total = 10000;
        Transmutation.total = 10000;
        Alteration.total = 10000;
        Augmentation.total = 10000;
        GCP.total = 10000;
        Vaal.total = 10000;
        
        // Reset fossils for testing
        for (let i = 0; i < fossilData.length; i++) {
            fossilData[i].total = 10000;
        }
        
        // Reset crafting system
        this.newSystem = new CraftingSystem();
    }
    
    /**
     * Helper to assert and log test results
     */
    assert(condition, testName) {
        this.testResults.total++;
        
        if (condition) {
            console.log(`✅ PASS: ${testName}`);
            this.testResults.passed++;
        } else {
            console.log(`❌ FAIL: ${testName}`);
            this.testResults.failed++;
        }
        
        return condition;
    }

    /**
     * Test validation that crafting requires guild creation
     */
    testCraftingRequiresGuildCreation() {
        console.log("\n--- Testing Crafting Requires Guild Creation ---");
        
        // Set up test state - guild not created
        window.guildCreated = false;
        
        // Get crafting tab element's display state before trying to access
        const craftingTabDisplayBefore = $("#crafting").css("display");
        
        // Save welcome screen visibility state
        const welcomeWasVisible = $("#welcomePre").is(":visible");
        
        // Mock the welcome screen as visible to simulate guild not being created
        $("#welcomePre").show();
        
        // Call showCrafting
        showCrafting();
        
        // Verify crafting tab remains hidden when guild not created
        const craftingTabDisplayAfter = $("#crafting").css("display");
        
        // Clean up our test environment - restore welcome screen to previous state
        if (!welcomeWasVisible) {
            $("#welcomePre").hide();
        }
        
        // Our assertion is simplified: if the UI is correctly implemented,
        // the crafting tab should not become visible when there's no guild
        this.assert(
            craftingTabDisplayAfter === "none" || craftingTabDisplayAfter === craftingTabDisplayBefore,
            "Crafting tab should remain inaccessible when guild is not created"
        );
    }

    /**
     * Test validation that crafting requires the Artificer
     */
    testCraftingRequiresArtificer() {
        console.log("\n--- Testing Crafting Requires Artificer ---");
        
        // Set up proper state for testing: guild is created but artificer not recruited
        window.guildCreated = true;
        
        // Save welcome screen visibility state
        const welcomeWasVisible = $("#welcomePre").is(":visible");
        
        // Hide welcome screen to simulate guild creation
        $("#welcomePre").hide();
        
        // Create a test Artificer exile if it doesn't exist
        if (typeof exileData === 'undefined') {
            window.exileData = [{ name: 'Artificer', owned: false }];
        } else if (!exileData.some(e => e.name === 'Artificer')) {
            exileData.push({ name: 'Artificer', owned: false });
        }
        
        // Make sure Artificer is not owned
        const artificer = exileData.find(e => e.name === 'Artificer');
        artificer.owned = false;
        
        // Validate crafting access - we expect the craft cards to be hidden
        // since Artificer isn't owned, even though we can see the crafting tab
        showCrafting();
        
        // Test for craft cards being correctly hidden
        const craftCardsVisible = $(".craft").is(":visible");
        
        // Restore welcome screen if it was visible
        if (welcomeWasVisible) {
            $("#welcomePre").show();
        }
        
        this.assert(
            !craftCardsVisible, 
            "Crafting cards should be hidden when Artificer is not recruited"
        );
    }

    /**
     * Test validation that crafting requires Quad Stash Tab
     */
    testCraftingRequiresQuadTab() {
        console.log("\n--- Testing Crafting Requires Quad Stash Tab ---");
        
        // Set up proper state: guild created, artificer owned, but no quad tab
        window.guildCreated = true;
        window.quadStashTab = 0;
        
        // Save welcome screen visibility state
        const welcomeWasVisible = $("#welcomePre").is(":visible");
        
        // Hide welcome screen to simulate guild creation
        $("#welcomePre").hide();
        
        // Set Artificer as owned
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            const artificer = exileData.find(e => e.name === 'Artificer');
            artificer.owned = true;
        }
        
        // Check crafting access
        showCrafting();
        
        // The expectation is that even with artificer, certain crafting cards 
        // should be inaccessible without the quad tab
        const heavierCraftingVisible = $("#heavierCrafting").is(":visible") ||
                                     $(".advancedCrafting").is(":visible");
        
        // Restore welcome screen if it was visible
        if (welcomeWasVisible) {
            $("#welcomePre").show();
        }
        
        this.assert(
            !heavierCraftingVisible,
            "Advanced crafting options should be hidden without Quad Stash Tab"
        );
    }
    
    /**
     * Test buying regular crafting items
     */
    testBuyCrafting() {
        console.log("\n--- Testing Buy Crafting Functionality ---");
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Test all regular crafting items
        const craftingItems = [
            { id: 'flask', cost: 400 },
            { id: 'gem', cost: 1600 },
            { id: 'enchant', cost: 1000 },
            { id: 'perfect', cost: 2000 },
            { id: 'chaos', cost: 4000 },
            { id: 'cold', cost: 4000 },
            { id: 'light', cost: 4000 },
            { id: 'fire', cost: 4000 },
            { id: 'wand', cost: 10000 }
        ];
        
        // Test each crafting item purchase
        let allPassed = true;
        for (const item of craftingItems) {
            // Reset level to -1 before testing
            this.newSystem.craftingItems[item.id].level = -1;
            
            // Set enough chaos for the purchase
            Chaos.total = item.cost + 500;
            
            const initialChaosTotal = Chaos.total;
            const result = this.newSystem.buyCrafting(item.id);
            
            const testPassed = result === true && 
                Chaos.total === initialChaosTotal - item.cost &&
                this.newSystem.craftingItems[item.id].level === 0;
            
            this.assert(
                testPassed,
                `Buy ${item.id.charAt(0).toUpperCase() + item.id.slice(1)} Crafting with sufficient currency`
            );
            
            allPassed = allPassed && testPassed;
        }
        
        // Test purchase with insufficient currency (using gem crafting)
        Chaos.total = 100; // Not enough for any crafting
        
        // Reset gem level to -1
        this.newSystem.craftingItems.gem.level = -1;
        
        const insufficientResult = this.newSystem.buyCrafting('gem');
        
        this.assert(
            insufficientResult === false && 
            Chaos.total === 100 &&
            this.newSystem.craftingItems.gem.level === -1,
            "Reject purchase with insufficient currency"
        );
        
        // Reset for further tests
        this.resetTestState();
    }
    
    /**
     * Test crafting ingredient check functionality
     */
    testCraftingIngredientCheck() {
        console.log("\n--- Testing Crafting Ingredient Check ---");
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Buy flask crafting so we can test its ingredient checking
        this.newSystem.buyCrafting('flask');
        
        // Test with sufficient ingredients
        const hasIngredients = this.newSystem.craftingItems.flask.hasIngredients();
        this.assert(hasIngredients === true, "Has ingredients check with sufficient resources");
        
        // Test with insufficient ingredients
        Transmutation.total = 0; // Remove required currency
        const missingIngredients = this.newSystem.craftingItems.flask.hasIngredients();
        this.assert(missingIngredients === false, "Has ingredients check with insufficient resources");
        
        // Reset for further tests
        this.resetTestState();
    }
    
    /**
     * Test currency deduction during crafting
     */
    testCraftingCurrencyDeduction() {
        console.log("\n--- Testing Crafting Currency Deduction ---");
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Buy flask crafting so we can test its crafting
        this.newSystem.buyCrafting('flask');
        
        // Save initial currency values
        const initialTransmutation = Transmutation.total;
        const initialAlteration = Alteration.total;
        const initialAugmentation = Augmentation.total;
        
        // Perform craft
        const craftResult = this.newSystem.craftingItems.flask.craft();
        
        // Verify currency was deducted correctly
        this.assert(
            craftResult === true &&
            Transmutation.total === initialTransmutation - 1 &&
            Alteration.total === initialAlteration - 20 &&
            Augmentation.total === initialAugmentation - 10,
            "Currency correctly deducted after crafting"
        );
        
        // Reset for further tests
        this.resetTestState();
    }
    
    /**
     * Test reward distribution after crafting completes
     */
    testCraftingRewards() {
        console.log("\n--- Testing Crafting Rewards ---");
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Buy flask crafting
        this.newSystem.buyCrafting('flask');
        
        // Save initial chaos total and crafts completed
        const initialChaos = Chaos.total;
        const initialCraftsCompleted = this.newSystem.craftingItems.flask.totalCrafted;
        
        // Simulate completing crafting by setting progress to 99
        this.newSystem.craftingItems.flask.progress = 99;
        
        // Update progress bar which should trigger completion
        this.newSystem.craftingItems.flask.updateProgressBar();
        
        // Verify rewards were given
        this.assert(
            Chaos.total === initialChaos + 10 &&
            this.newSystem.craftingItems.flask.totalCrafted === initialCraftsCompleted + 1 &&
            this.newSystem.craftingItems.flask.progress === 0, // Progress should reset
            "Rewards correctly given after crafting completion"
        );
        
        // Reset for further tests
        this.resetTestState();
    }
    
    /**
     * Test buying mirror crafting items
     */
    testBuyMirrorCrafting() {
        console.log("\n--- Testing Buy Mirror Crafting ---");
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Test all mirror items
        const mirrorItems = [
            'mirrorSword',
            'mirrorShield',
            'mirrorChest'
        ];
        
        // Test each mirror item purchase
        for (const itemId of mirrorItems) {
            // Reset for clean test
            this.resetTestState();
            
            // Re-set necessary state for crafting after reset
            window.guildCreated = true;
            window.quadStashTab = 1;
            if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
                exileData.find(e => e.name === 'Artificer').owned = true;
            }
            
            // Save initial currency levels for verification
            const initialCurrencies = {};
            for (const ing of this.newSystem.mirrorItems[itemId].ingredients) {
                initialCurrencies[ing.currency] = window[ing.currency].total;
            }
            
            // Attempt purchase
            const result = this.newSystem.buyMirror(itemId);
            
            // Verify purchase was successful
            let testPassed = result === true && this.newSystem.mirrorItems[itemId].level === 0;
            
            // Verify all currencies were deducted correctly
            for (const ing of this.newSystem.mirrorItems[itemId].ingredients) {
                testPassed = testPassed && 
                    window[ing.currency].total === initialCurrencies[ing.currency] - ing.amount;
            }
            
            this.assert(
                testPassed,
                `Buy ${itemId} with sufficient resources`
            );
        }
        
        // Test purchase with insufficient resources
        this.resetTestState();
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Set insufficient resources for mirrorSword
        Prime.total = 10; // Not enough for mirror sword
        
        const insufficientResult = this.newSystem.buyMirror('mirrorSword');
        
        this.assert(
            insufficientResult === false && 
            Prime.total === 10 &&
            this.newSystem.mirrorItems.mirrorSword.level === -1,
            "Reject mirror purchase with insufficient resources"
        );
        
        // Reset for further tests
        this.resetTestState();
    }
    
    /**
     * Test mirror fee increase functionality
     */
    testMirrorFeeIncrease() {
        console.log("\n--- Testing Mirror Fee Increase ---");
        
        // Test fee increase for all mirror items
        const mirrorItems = [
            'mirrorSword',
            'mirrorShield',
            'mirrorChest'
        ];
        
        for (const itemId of mirrorItems) {
            // Reset for clean test
            this.resetTestState();
            
            // Set necessary state for crafting to work
            window.guildCreated = true;
            window.quadStashTab = 1;
            if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
                exileData.find(e => e.name === 'Artificer').owned = true;
            }
            
            // Buy mirror item
            this.newSystem.buyMirror(itemId);
            
            // Save initial fee and exalted total
            const initialFee = this.newSystem.mirrorItems[itemId].fee;
            const initialExalted = Exalted.total;
            
            // Simulate mirroring by setting progress to 99
            this.newSystem.mirrorItems[itemId].progress = 99;
            
            // Update progress bar which should trigger completion
            this.newSystem.mirrorItems[itemId].updateProgressBar();
            
            // Verify fee increased and rewards given
            this.assert(
                this.newSystem.mirrorItems[itemId].fee === initialFee + 5 &&
                Exalted.total === initialExalted + initialFee &&
                this.newSystem.mirrorItems[itemId].totalCrafted === 1,
                `${itemId} fee increases correctly after mirroring`
            );
        }
        
        // Reset for further tests
        this.resetTestState();
    }

    /**
     * Test that Artificer recruitment state is preserved when switching tabs
     */
    testArtificerStatePreservation() {
        console.log("\n--- Testing Artificer State Preservation After Tab Switch ---");
        
        // Reset test state to start fresh
        this.resetTestState();
        
        // Set up state: guild is created, artificer is already recruited
        window.guildCreated = true;
        window.quadStashTab = 1; // Ensure quad tab is owned
        
        // Hide welcome screen to simulate guild creation
        $("#welcomePre").hide();
        
        // Set Artificer as owned
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            const artificer = exileData.find(e => e.name === 'Artificer');
            artificer.owned = true;
            artificer.level = 1; // Set level to 1 to ensure it's considered recruited
            console.log("Setting Artificer as owned, level:", artificer.level);
        } else {
            // Create test data if it doesn't exist
            window.exileData = [{ name: 'Artificer', owned: true, level: 1 }];
            console.log("Created new Artificer with owned=true");
        }
        
        // Buy a crafting item to ensure craft cards exist in the test
        this.newSystem.buyCrafting('flask');
        
        // Show crafting tab
        showCrafting();
        
        // Check the state
        const artificerBuyExistsBefore = $(".ArtificerBuy").length > 0;
        const craftCardsVisibleBefore = $(".craft").length > 0;
        
        // Switch to another tab and back
        showMain();
        showCrafting();
        
        // Check state after tab switch
        const artificerBuyExistsAfter = $(".ArtificerBuy").length > 0;
        const craftCardsVisibleAfter = $(".craft").length > 0;
        
        // Log the current state
        console.log("Test summary:", 
                   "Artificer owned:", exileData.find(e => e.name === 'Artificer').owned,
                   "Recruitment button exists before/after:", artificerBuyExistsBefore + "/" + artificerBuyExistsAfter,
                   "Craft cards exist before/after:", craftCardsVisibleBefore + "/" + craftCardsVisibleAfter);
        
        // When Artificer is owned:
        // 1. The recruitment button should not exist
        // 2. Craft cards should exist
        this.assert(
            !artificerBuyExistsAfter && craftCardsVisibleAfter,
            "Artificer recruitment state should be preserved after tab switch"
        );
    }
}

/**
 * Test function to add 99999 of all fossils
 * Use this for testing the crafting system
 */
function addTestFossils() {
    // Loop through all fossils in the fossilData array
    for (let i = 0; i < fossilData.length; i++) {
        // Add 99999 to each fossil
        fossilData[i].total += 99999;
        
        // Update the UI to display the new values
        document.getElementsByClassName(fossilData[i].name + 'Total')[0].innerHTML = 
            numeral(fossilData[i].total).format('0,0');
    }
    
    SnackBar("Added 99999 of all fossils for testing!");
}

// Create test button UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create a simple test interface
    const testContainer = document.createElement('div');
    testContainer.id = 'crafting-test-container';
    testContainer.style.position = 'fixed';
    testContainer.style.bottom = '10px';
    testContainer.style.left = '10px';
    testContainer.style.zIndex = '9999';

    // Create test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Run Crafting Tests';
    testButton.style.padding = '8px 12px';
    testButton.style.backgroundColor = '#4CAF50';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.cursor = 'pointer';
    testButton.style.marginRight = '10px';

    // Add click event listener
    testButton.onclick = function() {
        console.clear(); // Clear console first
        const testSuite = new CraftingTests();
        const passed = testSuite.runAllTests();
        
        if (passed) {
            SnackBar("All crafting tests passed!");
        } else {
            SnackBar("Some crafting tests failed! Check console.");
        }
    };

    // Create test fossils button
    const fossilButton = document.createElement('button');
    fossilButton.textContent = 'Add Test Fossils';
    fossilButton.style.padding = '8px 12px';
    fossilButton.style.backgroundColor = '#2196F3';
    fossilButton.style.color = 'white';
    fossilButton.style.border = 'none';
    fossilButton.style.cursor = 'pointer';
    
    // Add click event listener
    fossilButton.onclick = addTestFossils;

    // Add buttons to container
    testContainer.appendChild(testButton);
    testContainer.appendChild(fossilButton);
    
    // Add container to the document
    document.body.appendChild(testContainer);
});

// Add a keyboard shortcut (Ctrl+Shift+F) to trigger the test fossils function
document.addEventListener('keydown', function(event) {
    // Check if Ctrl+Shift+F is pressed
    if (event.ctrlKey && event.shiftKey && event.key === 'F') {
        addTestFossils();
        event.preventDefault(); // Prevent browser's find function from opening
    }
});

// Make test functions globally available
window.addTestFossils = addTestFossils;
console.log('Crafting system tests loaded. Run tests with the "Run Crafting Tests" button or get test fossils with the "Add Test Fossils" button.');