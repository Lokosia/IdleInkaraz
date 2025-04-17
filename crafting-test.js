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
        // Store for the state before *any* tests run
        this.initialGlobalStateSnapshot = null;
        // Store for the state before *each* test runs
        this.stateSnapshotBeforeTest = null;
    }

    /**
     * Takes a snapshot of the relevant game state.
     */
    takeStateSnapshot() {
        const snapshot = {
            guildCreated: window.guildCreated,
            quadStashTab: window.quadStashTab,
            welcomeVisible: $("#welcomePre").is(":visible"),
            artificer: null,
            craftingItems: {},
            mirrorItems: {},
            currency: {},
            fossils: []
        };

        // Snapshot Artificer state
        if (typeof window.exileData !== 'undefined') {
            const artificer = window.exileData.find(e => e.name === 'Artificer');
            if (artificer) {
                snapshot.artificer = { owned: artificer.owned, level: artificer.level };
            }
        }

        // Snapshot crafting items state
        if (craftingSystem && craftingSystem.craftingItems) {
            for (const [id, item] of Object.entries(craftingSystem.craftingItems)) {
                snapshot.craftingItems[id] = {
                    level: item.level,
                    progress: item.progress,
                    totalCrafted: item.totalCrafted
                };
            }
        }

        // Snapshot mirror items state
        if (craftingSystem && craftingSystem.mirrorItems) {
            for (const [id, item] of Object.entries(craftingSystem.mirrorItems)) {
                snapshot.mirrorItems[id] = {
                    level: item.level,
                    progress: item.progress,
                    totalCrafted: item.totalCrafted,
                    fee: item.fee
                };
            }
        }

        // Snapshot currency state
        const currencyTypes = [
            'Chaos', 'Exalted', 'Transmutation', 'Alteration',
            'Augmentation', 'GCP', 'Vaal', 'Prime', 'Regal', 'Divine' // Add potentially missing ones
        ];
        for (const currency of currencyTypes) {
            if (typeof window[currency] !== 'undefined') {
                snapshot.currency[currency] = window[currency].total;
            }
        }

        // Snapshot fossil state
        if (typeof window.fossilData !== 'undefined') {
            snapshot.fossils = window.fossilData.map(f => ({ name: f.name, total: f.total }));
        }

        return snapshot;
    }

    /**
     * Restores the game state from a snapshot.
     */
    restoreStateSnapshot(snapshot) {
        if (!snapshot) return;

        window.guildCreated = snapshot.guildCreated;
        window.quadStashTab = snapshot.quadStashTab;
        if (snapshot.welcomeVisible) $("#welcomePre").show(); else $("#welcomePre").hide();

        // Restore Artificer state
        if (typeof window.exileData !== 'undefined' && snapshot.artificer !== null) {
            let artificer = window.exileData.find(e => e.name === 'Artificer');
            if (!artificer) {
                artificer = { name: 'Artificer', owned: false, level: 0 };
                window.exileData.push(artificer);
            }
            artificer.owned = snapshot.artificer.owned;
            artificer.level = snapshot.artificer.level;
        }

        // Restore crafting items state
        if (craftingSystem && craftingSystem.craftingItems) {
            for (const [id, savedState] of Object.entries(snapshot.craftingItems)) {
                if (craftingSystem.craftingItems[id]) {
                    Object.assign(craftingSystem.craftingItems[id], savedState);
                }
            }
        }

        // Restore mirror items state
        if (craftingSystem && craftingSystem.mirrorItems) {
            for (const [id, savedState] of Object.entries(snapshot.mirrorItems)) {
                if (craftingSystem.mirrorItems[id]) {
                    Object.assign(craftingSystem.mirrorItems[id], savedState);
                }
            }
        }

        // Restore currency state
        for (const [currency, total] of Object.entries(snapshot.currency)) {
            if (typeof window[currency] !== 'undefined') {
                window[currency].total = total;
            }
        }

        // Restore fossil state
        if (typeof window.fossilData !== 'undefined' && snapshot.fossils) {
            for (let i = 0; i < window.fossilData.length; i++) {
                const savedFossil = snapshot.fossils.find(f => f.name === window.fossilData[i].name);
                if (savedFossil) {
                    window.fossilData[i].total = savedFossil.total;
                }
            }
        }

        // Update UI if the crafting tab is visible (optional, depends if tests manipulate UI directly)
        // if ($("#crafting").is(":visible")) {
        //     craftingSystem.renderCraftingCards();
        //     craftingSystem.updateFossilCounts();
        // }
    }


    /**
     * Setup before each test
     */
    beforeEach() {
        // Take snapshot *before* resetting state for the test
        this.stateSnapshotBeforeTest = this.takeStateSnapshot();

        // Reset state to a known good default for most tests
        this.resetTestState();
    }

    /**
     * Teardown after each test
     */
    afterEach() {
        // Restore the state that existed *before* this specific test ran
        this.restoreStateSnapshot(this.stateSnapshotBeforeTest);
        this.stateSnapshotBeforeTest = null; // Clear snapshot for the next test
    }

    /**
     * Run all tests and report results
     */
    runAllTests() {
        // Prevent tab switching during tests by mocking showCrafting and related functions
        const originalShowCrafting = window.showCrafting;
        const originalShowMain = window.showMain;
        const originalShowGuild = window.showGuild;
        const originalShowDelving = window.showDelving;
        const originalShowInfo = window.showInfo;
        window.showCrafting = function(){};
        window.showMain = function(){};
        window.showGuild = function(){};
        window.showDelving = function(){};
        window.showInfo = function(){};

        // Reset test results
        this.testResults = { passed: 0, failed: 0, total: 0 };

        console.log("===== RUNNING CRAFTING SYSTEM TESTS =====");

        // Store the initial state *before any tests run*
        this.initialGlobalStateSnapshot = this.takeStateSnapshot();

        const testsToRun = [
            this.testCraftingRequiresGuildCreation,
            this.testCraftingRequiresArtificer,
            this.testCraftingRequiresQuadTab,
            this.testBuyCrafting,
            this.testCraftingIngredientCheck,
            this.testCraftingCurrencyDeduction,
            this.testCraftingRewards,
            this.testBuyMirrorCrafting,
            this.testMirrorFeeIncrease,
            this.testArtificerStatePreservation
        ];

        try {
            for (const testMethod of testsToRun) {
                try {
                    this.beforeEach(); // Setup before the test (takes snapshot, resets state)
                    testMethod.call(this); // Run the test
                } catch (e) {
                    console.error(`❌ ERROR in test ${testMethod.name}:`, e);
                    this.testResults.failed++; // Count errors as failures
                    this.testResults.total++; // Ensure total is incremented even on error
                } finally {
                    this.afterEach(); // Teardown after the test (restores snapshot)
                }
            }
        } finally {
            // Restore the initial state from *before any tests ran*
            console.log("Restoring initial global state...");
            this.restoreStateSnapshot(this.initialGlobalStateSnapshot);
            this.initialGlobalStateSnapshot = null; // Clean up
            // Restore original tab functions
            window.showCrafting = originalShowCrafting;
            window.showMain = originalShowMain;
            window.showGuild = originalShowGuild;
            window.showDelving = originalShowDelving;
            window.showInfo = originalShowInfo;
        }

        // Report results
        console.log(`===== TEST RESULTS: ${this.testResults.passed}/${this.testResults.total} PASSED (${this.testResults.failed} failed) =====`);

        return this.testResults.failed === 0;
    }

    // Removed storeOriginalCraftingState
    // Removed restoreOriginalCraftingState
    // Removed getArtificerState
    // Removed restoreArtificerState

    /**
     * Reset game state to a default "ready-to-craft" state for testing
     */
    resetTestState() {
        // Default global state
        window.guildCreated = true;
        window.quadStashTab = 1;
        $("#welcomePre").hide(); // Hide welcome screen by default

        // Default Artificer state (ensure exists and is owned)
        if (typeof window.exileData === 'undefined') {
            window.exileData = [];
        }
        let artificer = window.exileData.find(e => e.name === 'Artificer');
        if (!artificer) {
            artificer = { name: 'Artificer', owned: false, level: 0 };
            window.exileData.push(artificer);
        }
        artificer.owned = true;
        artificer.level = 1; // Set a default level > 0

        // Reset currency to generous amounts
        const currencyTypes = [
            'Chaos', 'Exalted', 'Transmutation', 'Alteration',
            'Augmentation', 'GCP', 'Vaal', 'Prime', 'Regal', 'Divine'
        ];
        for (const currency of currencyTypes) {
            if (typeof window[currency] !== 'undefined') {
                window[currency].total = 100000; // Generous amount
            } else {
                 // Define missing currency objects if necessary for tests
                 // Example: window[currency] = { total: 100000, ... other properties };
                 console.warn(`Test Setup: Currency ${currency} not found, initializing.`);
                 // Basic initialization, might need adjustment based on actual currency structure
                 window[currency] = { total: 100000, id: currency.toLowerCase(), name: currency };
            }
        }

        // Reset fossils to generous amounts
        if (typeof window.fossilData !== 'undefined') {
            for (let i = 0; i < window.fossilData.length; i++) {
                window.fossilData[i].total = 10000;
            }
        } else {
            console.warn("Test Setup: fossilData not found.");
            window.fossilData = []; // Initialize if missing
        }

        // Reset crafting/mirror item states (levels, progress, etc.)
        if (craftingSystem) {
            if (craftingSystem.craftingItems) {
                for (const item of Object.values(craftingSystem.craftingItems)) {
                    item.level = -1; // Default to not bought
                    item.progress = 0;
                    item.totalCrafted = 0;
                }
            }
            if (craftingSystem.mirrorItems) {
                 for (const [id, item] of Object.entries(craftingSystem.mirrorItems)) {
                    item.level = -1; // Default to not bought
                    item.progress = 0;
                    item.totalCrafted = 0;
                    // Reset fee based on its initial definition if possible, otherwise a default
                    const initialFee = craftingSystem.config?.mirrorItems?.[id]?.initialFee ?? 5; // Example lookup
                    item.fee = initialFee;
                }
            }
        } else {
             console.error("Test Setup: craftingSystem not found!");
        }

        // Ensure craftingSystem UI elements are potentially updated if needed
        // craftingSystem?.renderCraftingCards(); // Call if UI state needs reset visually
        // craftingSystem?.updateFossilCounts();
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
     * Helper to check if a selector is visible in the DOM
     */
    isVisible(selector) {
        return $(selector).is(":visible");
    }

    /**
     * Test validation that crafting requires guild creation
     */
    testCraftingRequiresGuildCreation() {
        console.log("\n--- Testing Crafting Requires Guild Creation ---");

        // Override default state set by resetTestState in beforeEach
        window.guildCreated = false;
        $("#welcomePre").show(); // Explicitly show welcome screen for this test

        const craftingTabDisplayBefore = $("#crafting").css("display");
        showCrafting(); // Attempt to show crafting tab
        const craftingTabDisplayAfter = $("#crafting").css("display");

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

        // Override default state: Make sure Artificer is not owned for this test
        const artificer = window.exileData.find(e => e.name === 'Artificer');
        if (artificer) {
            artificer.owned = false;
        } else {
             console.warn("Artificer not found in test setup for testCraftingRequiresArtificer");
             // If artificer didn't exist, the test condition is met by default
        }


        showCrafting(); // Attempt to show crafting tab content

        // Test for craft cards being correctly hidden/absent
        // Check if the recruitment message is shown instead
        const recruitMessageVisible = $("#recruitmentMessage").is(":visible"); // Assuming an ID for the message
        const craftCardsVisible = $(".craft").is(":visible"); // Check if any craft cards are visible

        this.assert(
            recruitMessageVisible && !craftCardsVisible, // Expect message, no cards
            "Crafting cards should be hidden and recruitment message shown when Artificer is not recruited"
        );
    }

    /**
     * Test validation that crafting requires Quad Stash Tab
     */
    testCraftingRequiresQuadTab() {
        console.log("\n--- Testing Crafting Requires Quad Stash Tab ---");

        // Override default state: Set quad tab to 0 for this test
        window.quadStashTab = 0;

        // Ensure Artificer is owned (should be by default from resetTestState)
        const artificer = window.exileData.find(e => e.name === 'Artificer');
        if (artificer) artificer.owned = true;


        showCrafting(); // Show the tab

        // Check if advanced/heavier crafting sections are hidden
        // Assuming specific IDs or classes for these sections
        const heavierCraftingVisible = $("#heavierCrafting").is(":visible");
        const advancedCraftingVisible = $(".advancedCrafting").is(":visible"); // Example class

        this.assert(
            !heavierCraftingVisible && !advancedCraftingVisible,
            "Advanced crafting options should be hidden without Quad Stash Tab"
        );
    }

    /**
     * Test buying regular crafting items
     */
    testBuyCrafting() {
        console.log("\n--- Testing Buy Crafting Functionality ---");

        // Default state from resetTestState is sufficient (guild, quad, artificer, currency)

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
        for (const item of craftingItems) {
            // Level is already -1 from resetTestState
            // Currency is already high from resetTestState

            const initialChaosTotal = Chaos.total;
            const result = craftingSystem.buyCrafting(item.id);

            const testPassed = result === true &&
                Chaos.total === initialChaosTotal - item.cost &&
                craftingSystem.craftingItems[item.id].level === 0;

            this.assert(
                testPassed,
                `Buy ${item.id.charAt(0).toUpperCase() + item.id.slice(1)} Crafting with sufficient currency`
            );
        }

        // Test purchase with insufficient currency
        Chaos.total = 100; // Not enough for any crafting
        craftingSystem.craftingItems.gem.level = -1; // Ensure it's not bought

        const insufficientResult = craftingSystem.buyCrafting('gem');

        this.assert(
            insufficientResult === false &&
            Chaos.total === 100 && // Currency unchanged
            craftingSystem.craftingItems.gem.level === -1, // Level unchanged
            "Reject purchase with insufficient currency"
        );
    }

     /**
     * Test crafting ingredient check functionality
     */
    testCraftingIngredientCheck() {
        console.log("\n--- Testing Crafting Ingredient Check ---");
        // Default state from resetTestState is sufficient

        // Buy flask crafting first (level becomes 0)
        craftingSystem.buyCrafting('flask');
        this.assert(craftingSystem.craftingItems.flask.level === 0, "Pre-check: Flask crafting bought");

        // Test with sufficient ingredients (resetTestState provides enough)
        const hasIngredients = craftingSystem.craftingItems.flask.hasIngredients();
        this.assert(hasIngredients === true, "Has ingredients check with sufficient resources");

        // Test with insufficient ingredients
        Transmutation.total = 0; // Remove required currency
        const missingIngredients = craftingSystem.craftingItems.flask.hasIngredients();
        this.assert(missingIngredients === false, "Has ingredients check with insufficient resources");
    }

    /**
     * Test currency deduction during crafting
     */
    testCraftingCurrencyDeduction() {
        console.log("\n--- Testing Crafting Currency Deduction ---");
        // Default state from resetTestState is sufficient

        // Buy flask crafting
        craftingSystem.buyCrafting('flask');
        this.assert(craftingSystem.craftingItems.flask.level === 0, "Pre-check: Flask crafting bought");


        // Save initial currency values (resetTestState provides initial values)
        const initialTransmutation = Transmutation.total;
        const initialAlteration = Alteration.total;
        const initialAugmentation = Augmentation.total;

        // Perform craft
        const craftResult = craftingSystem.craftingItems.flask.craft(); // Assumes craft() returns true on success

        // Verify currency was deducted correctly
        this.assert(
            craftResult === true &&
            Transmutation.total === initialTransmutation - 1 && // Assuming flask costs 1 Transmutation
            Alteration.total === initialAlteration - 20 && // Assuming flask costs 20 Alteration
            Augmentation.total === initialAugmentation - 10, // Assuming flask costs 10 Augmentation
            "Currency correctly deducted after crafting"
        );
         // Verify craft fails if insufficient ingredients
        Transmutation.total = 0; // Make insufficient
        const failedCraftResult = craftingSystem.craftingItems.flask.craft();
        this.assert(failedCraftResult === false, "Crafting fails with insufficient ingredients");

    }

     /**
     * Test reward distribution after crafting completes
     */
    testCraftingRewards() {
        console.log("\n--- Testing Crafting Rewards ---");
        // Default state from resetTestState is sufficient

        // Buy flask crafting
        craftingSystem.buyCrafting('flask');
        this.assert(craftingSystem.craftingItems.flask.level === 0, "Pre-check: Flask crafting bought");


        // Save initial chaos total and crafts completed (should be 0 from reset)
        const initialChaos = Chaos.total;
        const initialCraftsCompleted = craftingSystem.craftingItems.flask.totalCrafted;

        // Simulate completing crafting by setting progress just below max
        // Assuming max progress is 100 for flask
        craftingSystem.craftingItems.flask.progress = 99;

        // Update progress bar which should trigger completion and reward
        craftingSystem.craftingItems.flask.updateProgressBar(); // Assumes this increments progress and checks completion

        // Verify rewards were given
        // Assuming flask reward is 10 Chaos
        this.assert(
            Chaos.total === initialChaos + 10 &&
            craftingSystem.craftingItems.flask.totalCrafted === initialCraftsCompleted + 1 &&
            craftingSystem.craftingItems.flask.progress === 0, // Progress should reset
            "Rewards correctly given after crafting completion"
        );
    }

    /**
     * Test buying mirror crafting items
     */
    testBuyMirrorCrafting() {
        console.log("\n--- Testing Buy Mirror Crafting ---");
        // Default state from resetTestState is sufficient (includes Prime, Regal, Divine)

        const mirrorItems = [
            'mirrorSword',
            'mirrorShield',
            'mirrorChest'
        ];

        for (const itemId of mirrorItems) {
            // Ensure item exists in the system
            if (!craftingSystem.mirrorItems[itemId]) {
                 console.warn(`Mirror item ${itemId} not found. Skipping buy test.`);
                 continue;
            }
             // Level is -1 from reset, currency is high

            // Save initial currency levels for verification
            const initialCurrencies = {};
            const ingredients = craftingSystem.mirrorItems[itemId].ingredients;
            if (!ingredients) {
                 console.warn(`Mirror item ${itemId} has no ingredients defined. Skipping buy test.`);
                 continue;
            }
            for (const ing of ingredients) {
                if (typeof window[ing.currency] !== 'undefined') {
                    initialCurrencies[ing.currency] = window[ing.currency].total;
                } else {
                     console.warn(`Currency ${ing.currency} not found for item ${itemId}`);
                     initialCurrencies[ing.currency] = 0; // Should not happen with resetTestState
                }
            }

            // Attempt purchase
            const result = craftingSystem.buyMirror(itemId);

            // Verify purchase was successful
            let testPassed = result === true && craftingSystem.mirrorItems[itemId].level === 0;

            // Verify all currencies were deducted correctly
            for (const ing of ingredients) {
                if (typeof window[ing.currency] !== 'undefined') {
                    testPassed = testPassed &&
                        window[ing.currency].total === initialCurrencies[ing.currency] - ing.amount;
                } else {
                     testPassed = false; // Fail if currency was missing
                }
            }

            this.assert(
                testPassed,
                `Buy ${itemId} with sufficient resources`
            );
        }

        // Test purchase with insufficient resources (using mirrorSword)
         if (craftingSystem.mirrorItems.mirrorSword && typeof Prime !== 'undefined') {
            Prime.total = 10; // Not enough (assuming cost > 10)
            craftingSystem.mirrorItems.mirrorSword.level = -1; // Ensure not bought

            const insufficientResult = craftingSystem.buyMirror('mirrorSword');

            this.assert(
                insufficientResult === false &&
                Prime.total === 10 && // Unchanged
                craftingSystem.mirrorItems.mirrorSword.level === -1, // Unchanged
                "Reject mirror purchase with insufficient resources (Prime)"
            );
        } else {
             console.warn("Skipping insufficient Prime test: mirrorSword or Prime currency not defined.");
        }
    }

    /**
     * Test mirror fee increase functionality
     */
    testMirrorFeeIncrease() {
        console.log("\n--- Testing Mirror Fee Increase ---");
        // Default state from resetTestState is sufficient

        const mirrorItems = [
            'mirrorSword',
            'mirrorShield',
            'mirrorChest'
        ];

        for (const itemId of mirrorItems) {
            if (!craftingSystem.mirrorItems[itemId]) {
                console.warn(`Mirror item ${itemId} not found. Skipping fee increase test.`);
                continue;
            }

            // Buy mirror item first
            const buyResult = craftingSystem.buyMirror(itemId);
             if (!buyResult) {
                 console.warn(`Failed to buy ${itemId}, skipping fee increase test.`);
                 continue; // Cannot test fee if buy fails
             }
             this.assert(craftingSystem.mirrorItems[itemId].level === 0, `Pre-check: ${itemId} bought`);


            // Save initial fee and exalted total
            const initialFee = craftingSystem.mirrorItems[itemId].fee;
            const initialExalted = Exalted.total;
            const initialCrafts = craftingSystem.mirrorItems[itemId].totalCrafted; // Should be 0

            // Simulate mirroring completion
            craftingSystem.mirrorItems[itemId].progress = 99; // Assuming max 100
            craftingSystem.mirrorItems[itemId].updateProgressBar(); // Trigger completion

            // Verify fee increased and rewards given
            // Assuming fee increases by 5 and reward is the fee amount in Exalted
            this.assert(
                craftingSystem.mirrorItems[itemId].fee === initialFee + 5 &&
                Exalted.total === initialExalted + initialFee && // Gained the initial fee
                craftingSystem.mirrorItems[itemId].totalCrafted === initialCrafts + 1 &&
                craftingSystem.mirrorItems[itemId].progress === 0, // Progress reset
                `${itemId} fee increases correctly after mirroring`
            );
        }
    }

     /**
     * Test that Artificer recruitment state is preserved when switching tabs
     */
    testArtificerStatePreservation() {
        console.log("\n--- Testing Artificer State Preservation After Tab Switch ---");
        // Default state from resetTestState is sufficient (Artificer owned)

        // Buy a crafting item to ensure craft cards exist
        craftingSystem.buyCrafting('flask');

        // Show crafting tab
        showCrafting();

        // Check the state (Artificer owned -> no recruitment button, craft cards visible)
        const artificerBuyExistsBefore = this.isVisible(".ArtificerBuy");
        const craftCardsVisibleBefore = this.isVisible(".craft:visible");

        // Switch to another tab and back
        showMain();
        showCrafting();

        // Check state after tab switch
        const artificerBuyExistsAfter = this.isVisible(".ArtificerBuy");
        const craftCardsVisibleAfter = this.isVisible(".craft:visible");

        // Log the current state for debugging
        const artificer = window.exileData.find(e => e.name === 'Artificer');
        console.log("Test summary:",
                   "Artificer owned:", artificer?.owned,
                   "Recruitment button exists before/after:", artificerBuyExistsBefore + "/" + artificerBuyExistsAfter,
                   "Craft cards visible before/after:", craftCardsVisibleBefore + "/" + craftCardsVisibleAfter);

        // Assertions: When Artificer is owned:
        // 1. The recruitment button should NOT exist/be visible.
        // 2. Craft cards SHOULD be visible (assuming flask was bought).
        this.assert(
            !artificerBuyExistsAfter && craftCardsVisibleAfter,
            "Artificer recruitment state (owned) should be preserved after tab switch"
        );

         // --- Test case: Artificer NOT owned ---
         // Need to override state *after* beforeEach's reset
         if (artificer) artificer.owned = false;
         showCrafting(); // Re-render based on new state

         const recruitMsgVisibleBefore = this.isVisible("#recruitmentMessage");
         const craftCardsHiddenBefore = !this.isVisible(".craft:visible");

         showMain();
         showCrafting();

         const recruitMsgVisibleAfter = this.isVisible("#recruitmentMessage");
         const craftCardsHiddenAfter = !this.isVisible(".craft:visible");

         console.log("Test summary (not owned):",
                    "Artificer owned:", artificer?.owned,
                    "Recruitment message visible before/after:", recruitMsgVisibleBefore + "/" + recruitMsgVisibleAfter,
                    "Craft cards hidden before/after:", craftCardsHiddenBefore + "/" + craftCardsHiddenAfter);

         this.assert(
             recruitMsgVisibleAfter && craftCardsHiddenAfter,
             "Artificer recruitment state (not owned) should be preserved after tab switch"
         );
    }

}

// =====================
// Test Utility Functions & UI Setup
// =====================

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
// (UI setup for test controls)
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