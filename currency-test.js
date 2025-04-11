// Currency trading test functions

/**
 * Tests a single currency's trading behavior with phantom currencies to avoid affecting game state
 * @param {Currency} currency - The currency to test
 * @param {boolean} isSelling - Whether to test selling (true) or buying (false)
 * @returns {boolean} Whether the test passed
 */
function testTradePhantom(currency, isSelling) {
    console.log(`Testing ${currency.name} ${isSelling ? 'sell' : 'buy'} trade:`);

    // Temporarily set flippingSpeed if it doesn't exist
    const originalFlippingSpeed = window.flippingSpeed;
    window.flippingSpeed = window.flippingSpeed || 1;

    // Create phantom currencies - clones that won't affect the game state
    const phantomSource = new Currency(
        currency.name,
        currency.rate,
        1000, // Start with plenty of currency
        currency.sellRate,
        isSelling ? 1 : 0, // Enable selling or buying based on test
        currency.buyRate,
        isSelling ? 0 : 1,
        currency.tradingCurrency,
        currency.sellGain,
        currency.sellLost,
        currency.buyGain,
        currency.buyLost
    );

    // Find the target currency and create a phantom version
    const realTarget = window[currency.tradingCurrency];
    if (!realTarget) {
        console.error(`Target currency '${currency.tradingCurrency}' not found!`);
        return false;
    }

    const phantomTarget = new Currency(
        realTarget.name,
        realTarget.rate,
        1000, // Start with plenty of currency
        realTarget.sellRate,
        0,
        realTarget.buyRate,
        0,
        realTarget.tradingCurrency,
        realTarget.sellGain,
        realTarget.sellLost,
        realTarget.buyGain,
        realTarget.buyLost
    );

    // Store the real target in the window so the phantom currency can find it
    const originalTarget = window[currency.tradingCurrency];
    window[currency.tradingCurrency] = phantomTarget;

    // Record initial values
    const initialSourceAmount = phantomSource.total;
    const initialTargetAmount = phantomTarget.total;

    // Perform one trade operation
    if (isSelling) {
        phantomSource.sellCurrency();
    } else {
        phantomSource.buyCurrency();
    }

    // Restore the original target
    window[currency.tradingCurrency] = originalTarget;

    // Log current trading values
    console.log('Current trading values:');
    console.log(`- sellRate: ${currency.sellRate}, sellGain: ${currency.sellGain}, sellLost: ${currency.sellLost}`);
    console.log(`- buyRate: ${currency.buyRate}, buyGain: ${currency.buyGain}, buyLost: ${currency.buyLost}`);

    // Additional sanity checks for trading rates
    const errors = [];

    // Skip validation for base currencies or currencies that don't trade
    const isBaseCurrency = currency.name === 'Chaos' || (currency.tradingCurrency === 'None');

    if (!isBaseCurrency) {
        // Check 1: Basic validation of trading rates
        if (currency.tradingCurrency === 'Chaos' || currency.tradingCurrency === 'Exalted') {
            // Simple check: when trading with Chaos/Exalted, ensure rates make sense
            if (currency.sellLost <= 0 || currency.sellGain <= 0 || currency.buyLost <= 0 || currency.buyGain <= 0) {
                errors.push(`${currency.name} has invalid trading rates (must be > 0)`);
            }
        }

        // Check 2: Universal trade loop protection
        if (currency.tradingCurrency === 'Chaos' || currency.tradingCurrency === 'Exalted') {
            // Check if there's a proper spread between sell and buy rates
            const highValueCurrencyCheck = ['Divine', 'Exalted', 'Eternal', 'Mirror', 'Annulment'].includes(currency.name);

            if (highValueCurrencyCheck) {
                // High-value currency check:
                // When selling 1 unit, you should get LESS trading currency than what's required to buy 1 unit back
                if (currency.sellGain >= currency.buyLost) {
                    errors.push(`${currency.name} has exploitable trade loop: Sell 1 ${currency.name} for ${currency.sellGain} ${currency.tradingCurrency}, but buy 1 ${currency.name} for only ${currency.buyLost} ${currency.tradingCurrency}`);
                } else {
                    console.log(`Trade loop protected: Selling 1 ${currency.name} gives ${currency.sellGain} ${currency.tradingCurrency}, buying 1 ${currency.name} costs ${currency.buyLost} ${currency.tradingCurrency} (loss of ${currency.buyLost - currency.sellGain} ${currency.tradingCurrency})`);
                }
            } else {
                // Regular currency check:
                // When selling X units to get 1 trading currency, you should get LESS than X units when buying
                if (currency.sellLost <= currency.buyGain) {
                    errors.push(`${currency.name} has exploitable trade loop: Sell ${currency.sellLost} to get 1 ${currency.tradingCurrency}, but 1 ${currency.tradingCurrency} buys ${currency.buyGain} ${currency.name}`);
                } else {
                    console.log(`Trade loop protected: Selling ${currency.sellLost} ${currency.name} gives 1 ${currency.tradingCurrency}, buying with 1 ${currency.tradingCurrency} gives ${currency.buyGain} ${currency.name} (loss of ${currency.sellLost - currency.buyGain} ${currency.name})`);
                }
            }
        }
    }

    // Calculate expected results for a single trade
    let expectedSource, expectedTarget;

    if (isSelling) {
        expectedSource = initialSourceAmount - phantomSource.sellLost;
        expectedTarget = initialTargetAmount + phantomSource.sellGain;

        console.log(`${currency.name} sell test:`);
        console.log(`- When selling: ${phantomSource.sellLost} ${currency.name} → ${phantomSource.sellGain} ${currency.tradingCurrency}`);
    } else {
        expectedSource = initialSourceAmount + phantomSource.buyGain;
        expectedTarget = initialTargetAmount - phantomSource.buyLost;

        console.log(`${currency.name} buy test:`);
        console.log(`- When spending ${phantomSource.buyLost} ${currency.tradingCurrency} to buy ${phantomSource.buyGain} ${currency.name}`);
    }

    // Verify results
    const sourceSuccess = phantomSource.total === expectedSource;
    const targetSuccess = phantomTarget.total === expectedTarget;
    const success = sourceSuccess && targetSuccess && errors.length === 0;

    console.log(`${currency.name} amount: ${initialSourceAmount} → ${phantomSource.total} (Expected: ${expectedSource})`);
    console.log(`${currency.tradingCurrency} amount: ${initialTargetAmount} → ${phantomTarget.total} (Expected: ${expectedTarget})`);

    if (errors.length > 0) {
        console.error(`Trading rate problems detected:`);
        errors.forEach(error => console.error(`- ${error}`));
        console.log(`Test FAILED (rate issues)`);
    }

    if (!sourceSuccess) {
        console.error(`- Source currency amount incorrect after trade: got ${phantomSource.total}, expected ${expectedSource}`);
    }
    if (!targetSuccess) {
        console.error(`- Target currency amount incorrect after trade: got ${phantomTarget.total}, expected ${expectedTarget}`);
    }

    // At the end, restore the original flippingSpeed
    window.flippingSpeed = originalFlippingSpeed;

    return success;
}

/**
 * Test all currencies' trading behavior using phantom currencies
 */
function testAllCurrenciesPhantom() {
    console.log("=== PHANTOM CURRENCY TRADING TEST ===");

    // Temporarily set required variables
    const oldSingularityLevel = window.Singularity ? Singularity.level : 0;
    const oldFlippingSpeed = window.flippingSpeed;

    window.Singularity = window.Singularity || {};
    window.Singularity.level = 1;
    window.flippingSpeed = window.flippingSpeed || 1;

    let passedSell = 0;
    let passedBuy = 0;
    let totalTests = 0;
    
    // Collect all errors for the summary
    let errorLog = [];

    // Store original console.error to capture errors during tests
    const originalConsoleError = console.error;
    console.error = function() {
        // Call the original console.error
        originalConsoleError.apply(console, arguments);
        
        // Capture error message if it's from our test
        if (arguments[0] === 'Trading rate problems detected:' || 
            arguments[0].includes('incorrect after trade')) {
            // Don't capture these messages, they'll be collected separately
        } else if (typeof arguments[0] === 'string' && arguments[0].startsWith('- ')) {
            // This is an error detail message, capture it
            errorLog.push(arguments[0]);
        }
    };

    // Test each currency
    for (let i = 0; i < currencyData.length; i++) {
        const currency = currencyData[i];
        if (currency.tradingCurrency === 'None') continue;

        totalTests += 2;
        
        // Track errors for this specific currency
        const currencyName = currency.name;
        const preErrorCount = errorLog.length;
        
        // Run the tests
        const sellResult = testTradePhantom(currency, true);
        if (sellResult) passedSell++;
        
        const buyResult = testTradePhantom(currency, false);
        if (buyResult) passedBuy++;
        
        // If we have new errors, tag them with the currency name for the summary
        const newErrorCount = errorLog.length - preErrorCount;
        if (newErrorCount > 0) {
            for (let j = preErrorCount; j < errorLog.length; j++) {
                // Mark this error with the currency name if not already included
                if (!errorLog[j].includes(currencyName)) {
                    errorLog[j] = `${currencyName}: ${errorLog[j]}`;
                }
            }
        }
    }

    // Restore console.error
    console.error = originalConsoleError;
    
    // Restore Singularity level and flippingSpeed
    window.Singularity.level = oldSingularityLevel;
    window.flippingSpeed = oldFlippingSpeed;

    // Print the test summary
    console.log("\n=== TEST SUMMARY ===");
    console.log(`Sell tests: ${passedSell}/${totalTests / 2} passed`);
    console.log(`Buy tests: ${passedBuy}/${totalTests / 2} passed`);
    console.log(`Overall: ${passedSell + passedBuy}/${totalTests} passed`);
    
    // If there are errors, display them in a consolidated list
    if (errorLog.length > 0) {
        console.log("\n=== ERROR SUMMARY ===");
        console.log("The following issues were detected:");
        
        // Group errors by currency
        const errorsByCurrency = {};
        
        errorLog.forEach(error => {
            // Extract currency name from error message
            const match = error.match(/^([^:]+):/);
            if (match) {
                const currency = match[1];
                if (!errorsByCurrency[currency]) {
                    errorsByCurrency[currency] = [];
                }
                // Store error without currency prefix
                errorsByCurrency[currency].push(error.substring(match[0].length).trim());
            } else {
                // For errors without currency prefix
                if (!errorsByCurrency['Other']) {
                    errorsByCurrency['Other'] = [];
                }
                errorsByCurrency['Other'].push(error);
            }
        });
        
        // Print grouped errors
        for (const currency in errorsByCurrency) {
            console.log(`\n${currency}:`);
            errorsByCurrency[currency].forEach(error => {
                console.log(`  - ${error}`);
            });
        }
    } else {
        console.log("\n✅ All tests passed successfully! No errors detected.");
    }
    
    return passedSell + passedBuy === totalTests;
}

// Add a function to test a specific currency by name
function testCurrencyByName(currencyName, testBoth = true) {
    const currency = window[currencyName];

    if (!currency) {
        console.error(`Currency ${currencyName} not found!`);
        return false;
    }

    console.log(`=== Testing ${currencyName} currency ===`);

    const oldSingularityLevel = window.Singularity ? Singularity.level : 0;
    window.Singularity = window.Singularity || {};
    window.Singularity.level = 1;

    let results = [];

    results.push(testTradePhantom(currency, true)); // Test selling

    if (testBoth) {
        results.push(testTradePhantom(currency, false)); // Test buying
    }

    window.Singularity.level = oldSingularityLevel;

    return results.every(result => result === true);
}

// Add UI for testing if the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we should create a test UI
    const createTestUI = true; // Set to false to disable test UI

    if (createTestUI) {
        // Create a simple test interface
        const testContainer = document.createElement('div');
        testContainer.id = 'currency-test-container';
        testContainer.style.position = 'fixed';
        testContainer.style.bottom = '10px';
        testContainer.style.right = '10px';
        testContainer.style.zIndex = '9999';

        // Create test button
        const testButton = document.createElement('button');
        testButton.textContent = 'Run Currency Tests';
        testButton.style.padding = '8px 12px';
        testButton.style.backgroundColor = '#4CAF50';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.cursor = 'pointer';
        testButton.onclick = testAllCurrenciesPhantom;

        testContainer.appendChild(testButton);
        document.body.appendChild(testContainer);
    }
});

// Make test functions globally available
window.testAllCurrenciesPhantom = testAllCurrenciesPhantom;
window.testCurrencyByName = testCurrencyByName;
window.testTradePhantom = testTradePhantom;

console.log('Currency trading tests loaded. Run tests with testAllCurrenciesPhantom() or test a specific currency with testCurrencyByName("Exalted")');