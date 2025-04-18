// Upgrades module encapsulating all state and logic
const Upgrades = {
  // State
  upgradeDropRate: 0,
  sulphiteDropRate: 350,
  currencyStashTab: 0,
  delveStashTab: 0,
  quadStashTab: 0,
  divStashTab: 0,
  nikoScarab: 0,
  iiqDropRate: 1,
  iiqCost: 10,
  incDropRate: 0,
  incubatorCost: 10,
  mappingCurrencyLevel: 0,
  flippingSpeed: 1,
  flippingSpeedCost: 1,
  currencyTabShown: false,
  delveTabShown: false,
  quadTabShown: false,
  divTabShown: false,

  // Methods
  noOp() {},
  hoverUpgrades(name, a, b) {
    $('#' + name).hover(
      function () {
        $("." + a).addClass('hover');
        $("." + b).addClass('hover');
      }, function () {
        $("." + a).removeClass('hover');
        $("." + b).removeClass('hover');
      }
    );
  },
  // Generic handler for upgrades to reduce code duplication
  handleUpgrade({
    requirements = [],
    onSuccess = () => {},
    onFail = () => SnackBar("Requirements not met."),
    onComplete = () => {},
    costDeduct = () => {},
    updateUI = () => {},
    check = () => true
  }) {
    if (check() && requirements.every(req => req.currency.total >= req.amount)) {
      requirements.forEach(req => req.currency.total -= req.amount);
      costDeduct();
      onSuccess();
      updateUI();
      onComplete();
      SnackBar("Upgrade purchased!");
      return true;
    } else {
      onFail();
      return false;
    }
  },
  buyCurrencyTab() {
    this.handleUpgrade({
      requirements: [{ currency: StackedDeck, amount: 5 }],
      onSuccess: () => {
        this.currencyStashTab = 1;
        window.currencyStashTab = this.currencyStashTab;
        this.upgradeDropRate += 1;
      },
      updateUI: () => {
        $(".StackedDeck").removeClass("hover");
        $('#currencyTab').remove();
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      }
    });
  },
  buyDelveTab() {
    this.handleUpgrade({
      requirements: [
        { currency: StackedDeck, amount: 50 },
        { currency: Annulment, amount: 10 }
      ],
      onSuccess: () => {
        this.delveStashTab = 1;
        window.delveStashTab = this.delveStashTab;
        this.upgradeDropRate += 1;
      },
      updateUI: () => {
        $(".StackedDeck").removeClass("hover");
        $(".Annulment").removeClass("hover");
        $('#delveTab').remove();
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
        this.delveScarab();
      }
    });
  },
  buyQuadTab() {
    this.handleUpgrade({
      requirements: [{ currency: Eternal, amount: 1 }],
      onSuccess: () => {
        this.quadStashTab = 1;
        window.quadStashTab = this.quadStashTab;
        this.upgradeDropRate += 1;
      },
      updateUI: () => {
        $(".Eternal").removeClass("hover");
        $('#quadTab').remove();
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      }
    });
  },
  buyDivTab() {
    this.handleUpgrade({
      requirements: [
        { currency: Annulment, amount: 50 },
        { currency: Exalted, amount: 1 }
      ],
      onSuccess: () => {
        this.divStashTab = 1;
        this.upgradeDropRate += 1;
      },
      updateUI: () => {
        $(".Exalted").removeClass("hover");
        $(".Annulment").removeClass("hover");
        $('#divTab').remove();
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      }
    });
  },
  delveScarab() {
    if (this.delveStashTab == 1) {
      $("#UpgradeTable").append(
        '<tr id="delveScarab">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored nikoScarab" id="btn-niko-scarab">Rusted Sulphite Scarab</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Use Sulphite Scarab to increase Sulphite quantity</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric delveScarabCost">1 Exalted</td>' +
        '</tr>'
      );
      this.hoverUpgrades("delveScarab", "Exalted");
      document.getElementById('btn-niko-scarab')?.addEventListener('click', () => this.buyNikoScarab());
      this.delveScarab = this.noOp;
    }
  },
  buyNikoScarab() {
    if (this.nikoScarab == 0) {
      if (Exalted.total >= 1) {
        Exalted.total -= 1;
        this.nikoScarab++;
        this.sulphiteDropRate += 100;
        this.upgradeDropRate += 1;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('delveScarabCost')[0].innerHTML = "5 Exalted";
        document.getElementsByClassName('nikoScarab')[0].innerHTML = "Polished Sulphite Scarab";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.nikoScarab == 1) {
      if (Exalted.total >= 5) {
        Exalted.total -= 5;
        this.nikoScarab++;
        this.sulphiteDropRate += 100;
        this.upgradeDropRate += 1;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('delveScarabCost')[0].innerHTML = "10 Exalted";
        document.getElementsByClassName('nikoScarab')[0].innerHTML = "Gilded Sulphite Scarab";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.nikoScarab == 2) {
      if (Exalted.total >= 10) {
        Exalted.total -= 10;
        this.nikoScarab++;
        this.sulphiteDropRate += 100;
        this.upgradeDropRate += 1;
        SnackBar("Upgrade purchased!");
        $(".Exalted").removeClass("hover");
        $('#delveScarab').remove();
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    }
  },
  buyiiqUpgrade() {
    this.handleUpgrade({
      requirements: [{ currency: Chaos, amount: this.iiqCost }],
      onSuccess: () => {
        this.iiqCost = Math.floor(this.iiqCost * 1.4);
        if (this.iiqDropRate === 1) { // First upgrade gives a big bonus
          this.upgradeDropRate += this.iiqDropRate;
        } else { // Subsequent upgrades give smaller bonuses
          this.upgradeDropRate += 0.1;
        }
        this.iiqDropRate += 0.1; // Increment the drop rate for display purposes
      },
      updateUI: () => {
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('iiqUpgradeCostDisplay')[0].innerHTML = numeral(this.iiqCost).format('0,0') + ' Chaos';
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
        document.getElementsByClassName('iiqDropRate')[0].innerHTML = this.iiqDropRate.toFixed(1);
      }
    });
  },
  buyIncubatorUpgrade() {
    this.handleUpgrade({
      requirements: [{ currency: Chaos, amount: this.incubatorCost }],
      onSuccess: () => {
        this.incubatorCost = Math.floor(this.incubatorCost * 1.2);
        if (this.incDropRate === 0) {
          this.incDropRate = 1; // First upgrade gives +1
        } else {
          this.incDropRate += 0.1; // Subsequent upgrades give +0.1
        }
      },
      updateUI: () => {
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('incubatorUpgradeCostDisplay')[0].innerHTML = numeral(this.incubatorCost).format('0,0') + ' Chaos';
        document.getElementsByClassName('incDropRate')[0].innerHTML = this.incDropRate.toFixed(1);
      }
    });
  },
  buyflipSpeed() {
    this.handleUpgrade({
      requirements: [{ currency: Eternal, amount: this.flippingSpeedCost }],
      onSuccess: () => {
        this.flippingSpeedCost = Math.floor(this.flippingSpeedCost * 2);
        this.flippingSpeed++;
        this.upgradeDropRate += 0.5;
      },
      updateUI: () => {
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('flipSpeedUpgradeCostDisplay')[0].innerHTML = numeral(this.flippingSpeedCost).format('0,0') + ' Eternal';
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
        document.getElementsByClassName('flipSpeedMulti')[0].innerHTML = this.flippingSpeed;
      }
    });
  },
  mapCurrency() {
    for (let i = 0; i < currencyData.length; i++) {
      let c = currencyData[i].rollCurrencyRNG();
      if (c <= currencyData[i].rate * (500 + this.upgradeDropRate)) {
        currencyData[i].total += 1 + (currencyData[i].rate * (500 + this.upgradeDropRate)); //adds multiple if dropRate high enough
        if (currencyData[i].name == 'Mirror') {
          SnackBar("Mirror of Kalandra dropped!");
        }
      }
    }
  },
  rollMapCurrency() {
    if (this.divStashTab >= 1) { //Stacked Decks
      if (StackedDeck.total >= 1) {
        StackedDeck.total -= 1;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 1) { //alch/scours
      if (Alchemy.total >= 2 && Scouring.total >= 1) {
        Alchemy.total -= 2;
        Scouring.total -= 1;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 2) { //chisel
      if (Chisel.total >= 4) {
        Chisel.total -= 4;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 3) { //simple sextant
      if (SimpleSextant.total >= 1) {
        SimpleSextant.total -= 1;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 4) { //prime sextant
      if (PrimeSextant.total >= 1) {
        PrimeSextant.total -= 1;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 5) { //awakened sextant
      if (AwakenedSextant.total >= 1) {
        AwakenedSextant.total -= 1;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 6) { //vaal
      if (Vaal.total >= 1) {
        Vaal.total -= 1;
        this.mapCurrency();
      }
    }
    if (this.mappingCurrencyLevel >= 7) { //silver coin
      if (SilverCoin.total >= 4) {
        SilverCoin.total -= 4;
        this.mapCurrency();
      }
    }
  },
  consumeMapCurrencyUpgrade() {
    if (Ascendant.level >= 68) {
      $("#UpgradeTable").append(
        '<tr id="consumeMapCurrency">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored consumeMapCurrencyButton" id="btn-consume-map-currency">Alch/Scour Maps</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric consumeMapCurrenydiv">Consume (2) Alchemy, (1) Scour to increase drop rate from maps<br>(per tick)</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+1.5</td>' +
        '<td class="mdl-data-table__cell--non-numeric mapCurrencyCost">1 Exalted</td>' +
        '</tr>'
      );
      this.hoverUpgrades("consumeMapCurrency", "Exalted");
      document.getElementById('btn-consume-map-currency')?.addEventListener('click', () => this.buyMapCurrency());
      this.consumeMapCurrencyUpgrade = this.noOp;
    }
  },
  buyMapCurrency() {
    if (this.mappingCurrencyLevel == 0) {
      if (Exalted.total >= 1) {
        Exalted.total -= 1;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = "1 Exalted";
        document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = "Chisel Maps";
        document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = "Consume (4) Cartographer's Chisel to increase drop rate from maps<br>(per tick)";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.mappingCurrencyLevel == 1) {
      if (Exalted.total >= 1) {
        Exalted.total -= 1;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = "2 Exalted";
        document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = "Simple Sextant Maps";
        document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = "Consume (1) Simple Sextant to increase drop rate from maps<br>(per tick)";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.mappingCurrencyLevel == 2) {
      if (Exalted.total >= 2) {
        Exalted.total -= 2;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = "2 Exalted";
        document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = "Prime Sextant Maps";
        document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = "Consume (1) Prime Sextant to increase drop rate from maps<br>(per tick)";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.mappingCurrencyLevel == 3) {
      if (Exalted.total >= 2) {
        Exalted.total -= 2;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = "2 Exalted";
        document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = "Awakened Sextant Maps";
        document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = "Consume (1) Awakened Sextant to increase drop rate from maps<br>(per tick)";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.mappingCurrencyLevel == 4) {
      if (Exalted.total >= 2) {
        Exalted.total -= 2;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = "2 Exalted";
        document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = "Vaal Maps";
        document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = "Consume (1) Vaal Orb to increase drop rate from maps<br>(per tick)";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.mappingCurrencyLevel == 5) {
      if (Exalted.total >= 2) {
        Exalted.total -= 2;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('mapCurrencyCost')[0].innerHTML = "2 Exalted";
        document.getElementsByClassName('consumeMapCurrencyButton')[0].innerHTML = "Use Prophecies";
        document.getElementsByClassName('consumeMapCurrenydiv')[0].innerHTML = "Consume (4) Silver Coins to increase drop rate from maps<br>(per tick)";
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      } else {
        SnackBar("Requirements not met.");
      }
    } else if (this.mappingCurrencyLevel == 6) {
      if (Exalted.total >= 3) {
        Exalted.total -= 3;
        this.mappingCurrencyLevel++;
        this.upgradeDropRate += 1.5;
        SnackBar("Upgrade purchased!");
        document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
        $(".Exalted").removeClass("hover");
        $('#consumeMapCurrency').remove();
      } else {
        SnackBar("Requirements not met.");
      }
    }
  },
  buyCrusader() {
    if (Crusader.total >= 1) {
      Crusader.total -= 1;
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      if (Crusader.total < 1) {
        $("#CrusaderUpgrade").hide();
        $(".Crusader").removeClass("hover");
      }
    }
  },
  buyHunter() {
    if (Hunter.total >= 1) {
      Hunter.total -= 1;
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      if (Hunter.total < 1) {
        $("#HunterUpgrade").hide();
        $(".Hunter").removeClass("hover");
      }
    }
  },
  buyRedeemer() {
    if (Redeemer.total >= 1) {
      Redeemer.total -= 1;
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      if (Redeemer.total < 1) {
        $("#RedeemerUpgrade").hide();
        $(".Redeemer").removeClass("hover");
      }
    }
  },
  buyWarlord() {
    if (Warlord.total >= 1) {
      Warlord.total -= 1;
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      if (Warlord.total < 1) {
        $("#WarlordUpgrade").hide();
        $(".Warlord").removeClass("hover");
      }
    }
  }
};

// --- Upgrade Configurations ---
const upgradeConfigs = [
  {
    key: 'iiq',
    shownFlag: 'iiqUpgradeShown',
    unlock: () => Ascendant.level >= 50,
    rowId: 'iiqUpgrade',
    buttonId: 'btn-iiq-upgrade',
    buttonClass: 'iiqUpgradeButton',
    buttonText: 'IIQ Gear',
    description: 'Buy Increased Item Quantity gear for exiles',
    benefitClass: 'iiqDropRate',
    benefit: () => `+${Upgrades.iiqDropRate.toFixed(1)}`,
    costClass: 'iiqUpgradeCostDisplay',
    costText: () => `+${numeral(Upgrades.iiqCost).format('0,0')} Chaos`,
    requirements: () => [ { currency: Chaos, amount: Upgrades.iiqCost } ],
    hover: () => Upgrades.hoverUpgrades('iiqUpgrade', 'Chaos'),
    buy: () => Upgrades.buyiiqUpgrade()
  },
  {
    key: 'incubator',
    shownFlag: 'incubatorUpgradeShown',
    unlock: () => Ascendant.level >= 75,
    rowId: 'incubatorUpgrade',
    buttonId: 'btn-incubator-upgrade',
    buttonClass: 'incubatorUpgradeButton',
    buttonText: 'Equip Incubators',
    description: 'Equip Incubators to exile gear',
    benefitClass: 'incDropRate',
    benefit: () => `+${Upgrades.incDropRate.toFixed(1)}`,
    costClass: 'incubatorUpgradeCostDisplay',
    costText: () => `+${numeral(Upgrades.incubatorCost).format('0,0')} Chaos`,
    requirements: () => [ { currency: Chaos, amount: Upgrades.incubatorCost } ],
    hover: () => Upgrades.hoverUpgrades('incubatorUpgrade', 'Chaos'),
    buy: () => Upgrades.buyIncubatorUpgrade()
  },
  {
    key: 'flipSpeed',
    shownFlag: 'flipSpeedUpgradeShown',
    unlock: () => window.totalLevel >= 1000,
    rowId: 'flipSpeedUpgrade',
    buttonId: 'btn-flip-speed',
    buttonClass: 'flipSpeedUpgradeButton',
    buttonText: 'Flipping Speed',
    description: 'Increase the rate The Singularity flips currency',
    benefitClass: '',
    benefit: () => '+0.5',
    costClass: 'flipSpeedUpgradeCostDisplay',
    costText: () => `${numeral(Upgrades.flippingSpeedCost).format('0,0')} Eternal`,
    requirements: () => [ { currency: Eternal, amount: Upgrades.flippingSpeedCost } ],
    hover: () => Upgrades.hoverUpgrades('flipSpeedUpgrade', 'Eternal'),
    buy: () => Upgrades.buyflipSpeed()
  },
  {
    key: 'currencyTab',
    shownFlag: 'currencyTabShown',
    unlock: () => window.totalLevel >= 250,
    rowId: 'currencyTab',
    buttonId: 'btn-currency-tab',
    buttonClass: 'currencyTabButton',
    buttonText: 'Currency Stash Tab',
    description: 'Purchase the Currency Stash Tab',
    benefitClass: '',
    benefit: () => '+1.0',
    costClass: '',
    costText: () => '5 Stacked Deck',
    requirements: () => [ { currency: StackedDeck, amount: 5 } ],
    hover: () => Upgrades.hoverUpgrades('currencyTab', 'StackedDeck'),
    buy: () => Upgrades.buyCurrencyTab()
  },
  {
    key: 'delveTab',
    shownFlag: 'delveTabShown',
    unlock: () => window.totalLevel >= 500,
    rowId: 'delveTab',
    buttonId: 'btn-delve-tab',
    buttonClass: 'delveTabButton',
    buttonText: 'Delve Stash Tab',
    description: 'Purchase the Delve Stash Tab',
    benefitClass: '',
    benefit: () => '+1.0',
    costClass: '',
    costText: () => '50 Stacked Deck<br>10 Orb of Annulment',
    requirements: () => [ { currency: StackedDeck, amount: 50 }, { currency: Annulment, amount: 10 } ],
    hover: () => Upgrades.hoverUpgrades('delveTab', 'StackedDeck', 'Annulment'),
    buy: () => Upgrades.buyDelveTab()
  },
  {
    key: 'quadTab',
    shownFlag: 'quadTabShown',
    unlock: () => window.totalLevel >= 1000,
    rowId: 'quadTab',
    buttonId: 'btn-quad-tab',
    buttonClass: 'quadTabButton',
    buttonText: 'Quad Stash Tab',
    description: 'Purchase the Quad Stash Tab',
    benefitClass: '',
    benefit: () => '+1.0',
    costClass: '',
    costText: () => '1 Eternal Orb',
    requirements: () => [ { currency: Eternal, amount: 1 } ],
    hover: () => Upgrades.hoverUpgrades('quadTab', 'Eternal'),
    buy: () => Upgrades.buyQuadTab()
  },
  {
    key: 'divTab',
    shownFlag: 'divTabShown',
    unlock: () => window.totalLevel >= 750,
    rowId: 'divTab',
    buttonId: 'btn-div-tab',
    buttonClass: 'divTabButton',
    buttonText: 'Divination Stash Tab',
    description: 'Consume (1) Stacked Deck<br>(per tick)',
    benefitClass: '',
    benefit: () => '+1.0',
    costClass: '',
    costText: () => '50 Orb of Annulment<br>1 Exalted',
    requirements: () => [ { currency: Annulment, amount: 50 }, { currency: Exalted, amount: 1 } ],
    hover: () => Upgrades.hoverUpgrades('divTab', 'Exalted', 'Annulment'),
    buy: () => Upgrades.buyDivTab()
  },
  {
    key: 'delveScarab',
    shownFlag: 'delveScarabShown',
    unlock: () => Upgrades.delveStashTab === 1 && !Upgrades.delveScarabShown,
    rowId: 'delveScarab',
    buttonId: 'btn-niko-scarab',
    buttonClass: 'nikoScarab',
    buttonText: () => {
      if (Upgrades.nikoScarab === 0) return 'Rusted Sulphite Scarab';
      if (Upgrades.nikoScarab === 1) return 'Polished Sulphite Scarab';
      if (Upgrades.nikoScarab === 2) return 'Gilded Sulphite Scarab';
      return 'Maxed';
    },
    description: 'Use Sulphite Scarab to increase Sulphite quantity',
    benefitClass: '',
    benefit: () => '+1.0',
    costClass: 'delveScarabCost',
    costText: () => {
      if (Upgrades.nikoScarab === 0) return '1 Exalted';
      if (Upgrades.nikoScarab === 1) return '5 Exalted';
      if (Upgrades.nikoScarab === 2) return '10 Exalted';
      return 'Maxed';
    },
    requirements: () => {
      if (Upgrades.nikoScarab === 0) return [ { currency: Exalted, amount: 1 } ];
      if (Upgrades.nikoScarab === 1) return [ { currency: Exalted, amount: 5 } ];
      if (Upgrades.nikoScarab === 2) return [ { currency: Exalted, amount: 10 } ];
      return [];
    },
    hover: () => Upgrades.hoverUpgrades('delveScarab', 'Exalted'),
    buy: () => {
      Upgrades.handleUpgrade({
        requirements: upgradeConfigs.find(cfg => cfg.key === 'delveScarab').requirements(),
        onSuccess: () => {
          Upgrades.nikoScarab++;
          Upgrades.sulphiteDropRate += 100;
          Upgrades.upgradeDropRate += 1;
        },
        updateUI: () => {
          if (Upgrades.nikoScarab === 1) {
            document.getElementsByClassName('delveScarabCost')[0].innerHTML = '5 Exalted';
            document.getElementsByClassName('nikoScarab')[0].innerHTML = 'Polished Sulphite Scarab';
          } else if (Upgrades.nikoScarab === 2) {
            document.getElementsByClassName('delveScarabCost')[0].innerHTML = '10 Exalted';
            document.getElementsByClassName('nikoScarab')[0].innerHTML = 'Gilded Sulphite Scarab';
          } else if (Upgrades.nikoScarab > 2) {
            $(".Exalted").removeClass("hover");
            $('#delveScarab').remove();
            Upgrades.delveScarabShown = true;
          }
          document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = Upgrades.upgradeDropRate.toFixed(1);
        }
      });
    }
  }
];

// --- Generic Upgrade Renderer ---
function renderUpgradeRow(cfg) {
  if (Upgrades[cfg.shownFlag]) return;
  if (!cfg.unlock()) return;
  $("#UpgradeTable").append(
    `<tr id="${cfg.rowId}">
      <td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${cfg.buttonClass}" id="${cfg.buttonId}">${cfg.buttonText}</button></td>
      <td class="mdl-data-table__cell--non-numeric">${cfg.description}</td>
      <td class="mdl-data-table__cell--non-numeric ${cfg.benefitClass}">${cfg.benefit()}</td>
      <td class="mdl-data-table__cell--non-numeric ${cfg.costClass}">${cfg.costText()}</td>
    </tr>`
  );
  cfg.hover();
  document.getElementById(cfg.buttonId)?.addEventListener('click', cfg.buy);
  Upgrades[cfg.shownFlag] = true;
}

// --- Generic Upgrade Loop ---
Upgrades.renderAllGenericUpgrades = function() {
  for (const cfg of upgradeConfigs) {
    renderUpgradeRow(cfg);
  }
};

setInterval(function updateTick() { //checks if upgrade conditions are met.
  Upgrades.renderAllGenericUpgrades();
  Upgrades.consumeMapCurrencyUpgrade();

  if (Crusader.total >= 1) {
    $("#CrusaderUpgrade").show();
    Upgrades.hoverUpgrades("CrusaderUpgrade", "Crusader");
  }
  if (Crusader.total < 1) {
    $("#CrusaderUpgrade").hide();
  }
  if (Hunter.total >= 1) {
    $("#HunterUpgrade").show();
    Upgrades.hoverUpgrades("HunterUpgrade", "Hunter");
  }
  if (Hunter.total < 1) {
    $("#HunterUpgrade").hide();
  }
  if (Redeemer.total >= 1) {
    $("#RedeemerUpgrade").show();
    Upgrades.hoverUpgrades("RedeemerUpgrade", "Redeemer");
  }
  if (Redeemer.total < 1) {
    $("#RedeemerUpgrade").hide();
  }
  if (Warlord.total >= 1) {
    $("#WarlordUpgrade").show();
    Upgrades.hoverUpgrades("WarlordUpgrade", "Warlord");
  }
  if (Warlord.total < 1) {
    $("#WarlordUpgrade").hide();
  }

  Upgrades.rollMapCurrency();
}, 500);

export default Upgrades;
