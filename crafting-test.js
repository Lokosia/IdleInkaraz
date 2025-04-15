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
    }

    /**
     * Run all tests and report results
     */
    runAllTests() {
        // Reset test results
        this.testResults = { passed: 0, failed: 0, total: 0 };
        
        console.log("===== RUNNING CRAFTING SYSTEM TESTS =====");
        
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
        } finally {
            // Always restore original state at end of tests
            window.guildCreated = originalGuildCreated;
            window.quadStashTab = originalQuadStashTab;
            this.restoreArtificerState(artificerOriginalState);
            
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
        const newSystem = new CraftingSystem();
        
        // Reset crafting items
        for (const item of Object.values(newSystem.craftingItems)) {
            item.level = -1;
            item.progress = 0;
            item.totalCrafted = 0;
        }
        
        // Reset mirror items
        for (const item of Object.values(newSystem.mirrorItems)) {
            item.level = -1;
            item.progress = 0;
            item.totalCrafted = 0;
            item.fee = 20; // Reset to default fee
        }
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
        
        // Test flask crafting purchase
        const initialChaosTotal = Chaos.total;
        const result = craftingSystem.buyCrafting('flask');
        
        this.assert(
            result === true && 
            Chaos.total === initialChaosTotal - 400 &&
            craftingSystem.craftingItems.flask.level === 0,
            "Buy Flask Crafting with sufficient currency"
        );
        
        // Test purchase with insufficient currency
        Chaos.total = 100; // Not enough for any crafting
        const insufficientResult = craftingSystem.buyCrafting('gem');
        
        this.assert(
            insufficientResult === false && 
            Chaos.total === 100 &&
            craftingSystem.craftingItems.gem.level === -1,
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
        craftingSystem.buyCrafting('flask');
        
        // Test with sufficient ingredients
        const hasIngredients = craftingSystem.craftingItems.flask.hasIngredients();
        this.assert(hasIngredients === true, "Has ingredients check with sufficient resources");
        
        // Test with insufficient ingredients
        Transmutation.total = 0; // Remove required currency
        const missingIngredients = craftingSystem.craftingItems.flask.hasIngredients();
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
        craftingSystem.buyCrafting('flask');
        
        // Save initial currency values
        const initialTransmutation = Transmutation.total;
        const initialAlteration = Alteration.total;
        const initialAugmentation = Augmentation.total;
        
        // Perform craft
        const craftResult = craftingSystem.craftingItems.flask.craft();
        
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
        craftingSystem.buyCrafting('flask');
        
        // Save initial chaos total and crafts completed
        const initialChaos = Chaos.total;
        const initialCraftsCompleted = craftingSystem.craftingItems.flask.totalCrafted;
        
        // Simulate completing crafting by setting progress to 99
        craftingSystem.craftingItems.flask.progress = 99;
        
        // Update progress bar which should trigger completion
        craftingSystem.craftingItems.flask.updateProgressBar();
        
        // Verify rewards were given
        this.assert(
            Chaos.total === initialChaos + 10 &&
            craftingSystem.craftingItems.flask.totalCrafted === initialCraftsCompleted + 1 &&
            craftingSystem.craftingItems.flask.progress === 0, // Progress should reset
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
        
        // Test mirror sword purchase (requires many resources)
        const initialPrime = Prime.total;
        const initialJagged = Jagged.total;
        const initialExalted = Exalted.total;
        
        const result = craftingSystem.buyMirror('mirrorSword');
        
        this.assert(
            result === true && 
            Prime.total === initialPrime - 50 &&
            Jagged.total === initialJagged - 50 &&
            Exalted.total === initialExalted - 500 &&
            craftingSystem.mirrorItems.mirrorSword.level === 0,
            "Buy Mirror Sword with sufficient resources"
        );
        
        // Test purchase with insufficient resources
        this.resetTestState();
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        Prime.total = 10; // Not enough for mirror sword
        
        const insufficientResult = craftingSystem.buyMirror('mirrorSword');
        
        this.assert(
            insufficientResult === false && 
            Prime.total === 10 &&
            craftingSystem.mirrorItems.mirrorSword.level === -1,
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
        
        // Set necessary state for crafting to work
        window.guildCreated = true;
        window.quadStashTab = 1;
        if (typeof exileData !== 'undefined' && exileData.some(e => e.name === 'Artificer')) {
            exileData.find(e => e.name === 'Artificer').owned = true;
        }
        
        // Buy mirror sword
        craftingSystem.buyMirror('mirrorSword');
        
        // Save initial fee and exalted total
        const initialFee = craftingSystem.mirrorItems.mirrorSword.fee;
        const initialExalted = Exalted.total;
        
        // Simulate mirroring by setting progress to 99
        craftingSystem.mirrorItems.mirrorSword.progress = 99;
        
        // Update progress bar which should trigger completion
        craftingSystem.mirrorItems.mirrorSword.updateProgressBar();
        
        // Verify fee increased and rewards given
        this.assert(
            craftingSystem.mirrorItems.mirrorSword.fee === initialFee + 5 &&
            Exalted.total === initialExalted + initialFee &&
            craftingSystem.mirrorItems.mirrorSword.totalCrafted === 1,
            "Mirror fee increases correctly after mirroring"
        );
        
        // Reset for further tests
        this.resetTestState();
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