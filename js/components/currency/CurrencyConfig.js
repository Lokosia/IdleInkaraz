// Currency configuration data

/**
 * Array of configuration objects for all base game currencies.
 * Each object defines the currency's name, drop rate, trading parameters, and display name.
 * Used throughout the game for currency logic, trading, and UI.
 *
 * @type {Array<{name: string, rate: number, sellRate: number, buyRate: number, tradingCurrency: string, displayName: string, sellGain?: number, sellLost?: number, buyGain?: number, buyLost?: number}>}
 */
const CURRENCY_CONFIG = [
    { name: 'Transmutation', rate: 0.0020831, sellRate: 16, buyRate: 15, tradingCurrency: 'Chaos', displayName: "Orb of Transmutation" },
    { name: 'Armourer', rate: 0.0020827, sellRate: 15, buyRate: 14, tradingCurrency: 'Chaos', displayName: "Armourer's Scrap" },
    { name: 'Blacksmith', rate: 0.0011095, sellRate: 10, buyRate: 9, tradingCurrency: 'Chaos', displayName: "Blacksmith's Whetstone" },
    { name: 'Augmentation', rate: 0.0010328, sellRate: 5, buyRate: 4, tradingCurrency: 'Chaos', displayName: "Orb of Augmentation" },
    { name: 'Alteration', rate: 0.0005508, sellRate: 5, buyRate: 4, tradingCurrency: 'Chaos', displayName: "Orb of Alteration" },
    { name: 'Chance', rate: 0.0005508, sellRate: 9, buyRate: 8, tradingCurrency: 'Chaos', displayName: "Orb of Chance" },
    { name: 'Jeweller', rate: 0.0005508, sellRate: 22, buyRate: 21, tradingCurrency: 'Chaos', displayName: "Jeweller's Orb" },
    { name: 'Chromatic', rate: 0.0005508, sellRate: 9, buyRate: 8, tradingCurrency: 'Chaos', displayName: "Chromatic Orb" },
    { name: 'Fusing', rate: 0.0003443, sellRate: 6, buyRate: 5, tradingCurrency: 'Chaos', displayName: "Orb of Fusing" },
    { name: 'Alchemy', rate: 0.0002754, sellRate: 8, buyRate: 7, tradingCurrency: 'Chaos', displayName: "Orb of Alchemy" },
    { name: 'Chisel', rate: 0.0002754, sellRate: 5, buyRate: 4, tradingCurrency: 'Chaos', displayName: "Cartographer's Chisel" },
    { name: 'Chaos', rate: 0.0001652, sellRate: 1, buyRate: 1, tradingCurrency: 'Chaos', displayName: "Chaos Orb" },
    { name: 'Scouring', rate: 0.0001377, sellRate: 3, buyRate: 2, tradingCurrency: 'Chaos', displayName: "Orb of Scouring" },
    { name: 'Vaal', rate: 0.0000689, sellRate: 2, buyRate: 2, tradingCurrency: 'Chaos', displayName: "Vaal Orb" },
    { name: 'Regret', rate: 0.0000689, sellRate: 4, buyRate: 3, tradingCurrency: 'Chaos', displayName: "Orb of Regret" },
    { name: 'Glassblower', rate: 0.0000682, sellRate: 8, buyRate: 7, tradingCurrency: 'Chaos', displayName: "Glassblower's Bauble" },
    { name: 'GCP', rate: 0.0000275, sellRate: 2, buyRate: 1, tradingCurrency: 'Chaos', displayName: "Gemcutter's Prism" },
    { name: 'Blessed', rate: 0.0000275, sellRate: 15, buyRate: 14, tradingCurrency: 'Chaos', displayName: "Blessed Orb" },
    { name: 'Regal', rate: 0.0000207, sellRate: 5, buyRate: 4, tradingCurrency: 'Chaos', displayName: "Regal Orb" },
    { 
        name: 'Exalted', 
        rate: 0.0000055, 
        sellRate: 125, 
        buyRate: 150, 
        tradingCurrency: 'Chaos',
        sellGain: 125,
        sellLost: 1,
        buyGain: 1,
        buyLost: 150,
        displayName: "Exalted Orb"
    },
    { 
        name: 'Divine', 
        rate: 0.0000034, 
        sellRate: 10, 
        buyRate: 10, 
        tradingCurrency: 'Chaos',
        sellGain: 10,
        sellLost: 1,
        buyGain: 1,
        buyLost: 10,
        displayName: "Divine Orb"
    },
    { 
        name: 'Eternal', 
        rate: 0.0000003, 
        sellRate: 25, 
        buyRate: 50, 
        tradingCurrency: 'Exalted',
        sellGain: 25,
        sellLost: 1,
        buyGain: 1,
        buyLost: 50,
        displayName: "Eternal Orb"
    },
    { 
        name: 'Mirror', 
        rate: 0.0000001, 
        sellRate: 200, 
        buyRate: 250, 
        tradingCurrency: 'Exalted',
        sellGain: 200,
        sellLost: 1,
        buyGain: 1,
        buyLost: 250,
        displayName: "Mirror of Kalandra"
    },
    { name: 'StackedDeck', rate: 0.0002000, sellRate: 2, buyRate: 1, tradingCurrency: 'Chaos', displayName: "Stacked Deck" },
    { name: 'SilverCoin', rate: 0.0002000, sellRate: 11, buyRate: 10, tradingCurrency: 'Chaos', displayName: "Silver Coin" },
    { 
        name: 'Annulment', 
        rate: 0.0000075, 
        sellRate: 4, 
        buyRate: 5, 
        tradingCurrency: 'Chaos',
        sellGain: 4,
        sellLost: 1,
        buyGain: 1,
        buyLost: 5,
        displayName: "Orb of Annulment"
    },
    { name: 'SimpleSextant', rate: 0.0001650, sellRate: 3, buyRate: 3, tradingCurrency: 'Chaos', displayName: "Simple Sextant" },
    { name: 'PrimeSextant', rate: 0.0000650, sellRate: 2, buyRate: 2, tradingCurrency: 'Chaos', displayName: "Prime Sextant" },
    { name: 'AwakenedSextant', rate: 0.0000350, sellRate: 1, buyRate: 1, tradingCurrency: 'Chaos', displayName: "Awakened Sextant" },
    { 
        name: 'Awakener', 
        rate: 0.0000002, 
        sellRate: 10, 
        buyRate: 20, 
        tradingCurrency: 'Exalted',
        sellGain: 10,
        sellLost: 1,
        buyGain: 1,
        buyLost: 20,
        displayName: "Awakener's Orb"
    },
    { 
        name: 'Crusader', 
        rate: 0.0000002, 
        sellRate: 10, 
        buyRate: 20, 
        tradingCurrency: 'Exalted',
        sellGain: 10,
        sellLost: 1,
        buyGain: 1,
        buyLost: 20,
        displayName: "Crusader's Exalted Orb"
    },
    { 
        name: 'Hunter', 
        rate: 0.0000002, 
        sellRate: 10, 
        buyRate: 20, 
        tradingCurrency: 'Exalted',
        sellGain: 10,
        sellLost: 1,
        buyGain: 1,
        buyLost: 20,
        displayName: "Hunter's Exalted Orb"
    },
    { 
        name: 'Redeemer', 
        rate: 0.0000002, 
        sellRate: 10, 
        buyRate: 20, 
        tradingCurrency: 'Exalted',
        sellGain: 10,
        sellLost: 1,
        buyGain: 1,
        buyLost: 20,
        displayName: "Redeemer's Exalted Orb"
    },
    { 
        name: 'Warlord', 
        rate: 0.0000002, 
        sellRate: 10, 
        buyRate: 20, 
        tradingCurrency: 'Exalted',
        sellGain: 10,
        sellLost: 1,
        buyGain: 1,
        buyLost: 20,
        displayName: "Warlord's Exalted Orb"
    },
    { name: 'Sulphite', rate: 0.0000650, sellRate: 0, buyRate: 0, tradingCurrency: 'None', displayName: "Sulphite" },
];

export { CURRENCY_CONFIG };