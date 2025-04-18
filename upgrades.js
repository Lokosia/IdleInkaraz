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
  currencyTab() {
    if (window.totalLevel >= 250) {
      $("#UpgradeTable").append(
        '<tr id="currencyTab">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored currencyTabButton" id="btn-currency-tab">Currency Stash Tab</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Purchase the Currency Stash Tab</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric">5 Stacked Deck</td>' +
        '</tr>'
      );
      this.hoverUpgrades("currencyTab", "StackedDeck");
      document.getElementById('btn-currency-tab')?.addEventListener('click', () => this.buyCurrencyTab());
      this.currencyTab = this.noOp;
    }
  },
  buyCurrencyTab() {
    if (StackedDeck.total >= 5) {
      StackedDeck.total -= 5;
      this.currencyStashTab = 1;
      window.currencyStashTab = this.currencyStashTab; // Synchronize with global window object
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      $(".StackedDeck").removeClass("hover");
      $('#currencyTab').remove();
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
    } else {
      SnackBar("Requirements not met.");
    }
  },
  delveTab() {
    if (window.totalLevel >= 500) {
      $("#UpgradeTable").append(
        '<tr id="delveTab">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored delveTabButton" id="btn-delve-tab">Delve Stash Tab</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Purchase the Delve Stash Tab</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric">50 Stacked Deck<br>10 Orb of Annulment</td>' +
        '</tr>'
      );
      this.hoverUpgrades("delveTab", "StackedDeck", "Annulment");
      document.getElementById('btn-delve-tab')?.addEventListener('click', () => this.buyDelveTab());
      this.delveTab = this.noOp;
    }
  },
  buyDelveTab() {
    if (Annulment.total >= 10 && StackedDeck.total >= 50) {
      StackedDeck.total -= 50;
      Annulment.total -= 10;
      this.delveStashTab = 1;
      window.delveStashTab = this.delveStashTab; // Synchronize with global window object
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      $(".StackedDeck").removeClass("hover");
      $(".Annulment").removeClass("hover");
      $('#delveTab').remove();
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      this.delveScarab();
    } else {
      SnackBar("Requirements not met.");
    }
  },
  quadTab() {
    if (window.totalLevel >= 1000) {
      $("#UpgradeTable").append(
        '<tr id="quadTab">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored quadTabButton" id="btn-quad-tab">Quad Stash Tab</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Purchase the Quad Stash Tab</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric">1 Eternal Orb</td>' +
        '</tr>'
      );
      this.hoverUpgrades("quadTab", "Eternal");
      document.getElementById('btn-quad-tab')?.addEventListener('click', () => this.buyQuadTab());
      this.quadTab = this.noOp;
    }
  },
  buyQuadTab() {
    if (Eternal.total >= 1) {
      Eternal.total -= 1;
      this.quadStashTab = 1;
      window.quadStashTab = this.quadStashTab; // Synchronize with global window object
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      $(".Eternal").removeClass("hover");
      $('#quadTab').remove();
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
    } else {
      SnackBar("Requirements not met.");
    }
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
  divTab() {
    if (window.totalLevel >= 750) {
      $("#UpgradeTable").append(
        '<tr id="divTab">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored divTabButton" id="btn-div-tab">Divination Stash Tab</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Consume (1) Stacked Deck<br>(per tick)</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric">50 Orb of Annulment<br>1 Exalted</td>' +
        '</tr>'
      );
      this.hoverUpgrades("divTab", "Exalted", "Annulment");
      document.getElementById('btn-div-tab')?.addEventListener('click', () => this.buyDivTab());
      this.divTab = this.noOp;
    }
  },
  buyDivTab() {
    if (Annulment.total >= 50 && Exalted.total >= 1) {
      Annulment.total -= 50;
      Exalted.total -= 1;
      this.divStashTab = 1;
      this.upgradeDropRate += 1;
      SnackBar("Upgrade purchased!");
      $(".Exalted").removeClass("hover");
      $(".Annulment").removeClass("hover");
      $('#divTab').remove();
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
    } else {
      SnackBar("Requirements not met.");
    }
  },
  iiqUpgrade() {
    if (Ascendant.level >= 50) {
      $("#UpgradeTable").append(
        '<tr id="iiqUpgrade">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored iiqUpgradeButton" id="btn-iiq-upgrade">IIQ Gear</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Buy Increased Item Quantity gear for exiles</td>' +
        '<td class="mdl-data-table__cell--non-numeric iiqDropRate">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric iiqUpgradeCostDisplay">+' + numeral(this.iiqCost).format('0,0') + ' Chaos</td>' +
        '</tr>'
      );
      this.hoverUpgrades("iiqUpgrade", "Chaos");
      document.getElementById('btn-iiq-upgrade')?.addEventListener('click', () => this.buyiiqUpgrade());
      this.iiqUpgrade = this.noOp;
    }
  },
  buyiiqUpgrade() {
    if (Chaos.total >= this.iiqCost) {
      Chaos.total -= this.iiqCost;
      this.iiqCost = Math.floor(this.iiqCost * 1.4);
      if (this.iiqDropRate === 1) { // First upgrade gives a big bonus
        this.upgradeDropRate += this.iiqDropRate;
      } else { // Subsequent upgrades give smaller bonuses
        this.upgradeDropRate += 0.1;
      }
      this.iiqDropRate += 0.1; // Increment the drop rate for display purposes
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('iiqUpgradeCostDisplay')[0].innerHTML = numeral(this.iiqCost).format('0,0') + ' Chaos';
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      document.getElementsByClassName('iiqDropRate')[0].innerHTML = this.iiqDropRate.toFixed(1);
    } else {
      SnackBar("Requirements not met.");
    }
  },
  incubatorUpgrade() {
    if (Ascendant.level >= 75) {
      $("#UpgradeTable").append(
        '<tr id="incubatorUpgrade">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored incubatorUpgradeButton" id="btn-incubator-upgrade">Equip Incubators</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Equip Incubators to exile gear</td>' +
        '<td class="mdl-data-table__cell--non-numeric incDropRate">+1.0</td>' +
        '<td class="mdl-data-table__cell--non-numeric incubatorUpgradeCostDisplay">+' + numeral(this.incubatorCost).format('0,0') + ' Chaos</td>' +
        '</tr>'
      );
      this.hoverUpgrades("incubatorUpgrade", "Chaos");
      // Attach event listener after button is in DOM
      document.getElementById('btn-incubator-upgrade')?.addEventListener('click', () => this.buyIncubatorUpgrade());
      this.incubatorUpgrade = this.noOp;
    }
  },
  buyIncubatorUpgrade() {
    if (Chaos.total >= this.incubatorCost) {
      Chaos.total -= this.incubatorCost;
      this.incubatorCost = Math.floor(this.incubatorCost * 1.2);
      if (this.incDropRate === 0) {
        this.incDropRate = 1; // First upgrade gives +1
      } else {
        this.incDropRate += 0.1; // Subsequent upgrades give +0.1
      }
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('incubatorUpgradeCostDisplay')[0].innerHTML = numeral(this.incubatorCost).format('0,0') + ' Chaos';
      document.getElementsByClassName('incDropRate')[0].innerHTML = this.incDropRate.toFixed(1);
    } else {
      SnackBar("Requirements not met.");
    }
  },
  flipSpeed() {
    if (window.totalLevel >= 1000) {
      $("#UpgradeTable").append(
        '<tr id="flipSpeedUpgrade">' +
        '<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored flipSpeedUpgradeButton" id="btn-flip-speed">Flipping Speed</button></td>' +
        '<td class="mdl-data-table__cell--non-numeric">Increase the rate The Singularity flips currency</td>' +
        '<td class="mdl-data-table__cell--non-numeric">+0.5</td>' +
        '<td class="mdl-data-table__cell--non-numeric flipSpeedUpgradeCostDisplay">' + numeral(this.flippingSpeedCost).format('0,0') + ' Eternal</td>' +
        '</tr>'
      );
      this.hoverUpgrades("flipSpeedUpgrade", "Eternal");
      document.getElementById('btn-flip-speed')?.addEventListener('click', () => this.buyflipSpeed());
      this.flipSpeed = this.noOp;
    }
  },
  buyflipSpeed() {
    if (Eternal.total >= this.flippingSpeedCost) {
      Eternal.total -= this.flippingSpeedCost;
      this.flippingSpeedCost = Math.floor(this.flippingSpeedCost * 2);
      this.flippingSpeed++;
      this.upgradeDropRate += 0.5;
      SnackBar("Upgrade purchased!");
      document.getElementsByClassName('flipSpeedUpgradeCostDisplay')[0].innerHTML = numeral(this.flippingSpeedCost).format('0,0') + ' Eternal';
      document.getElementsByClassName('UpgradeDropRate')[0].innerHTML = this.upgradeDropRate.toFixed(1);
      document.getElementsByClassName('flipSpeedMulti')[0].innerHTML = this.flippingSpeed;
    } else {
      SnackBar("Requirements not met.");
    }
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

setInterval(function updateTick() { //checks if upgrade conditions are met.
  Upgrades.currencyTab();
  Upgrades.delveTab();
  Upgrades.quadTab();
  Upgrades.iiqUpgrade();
  Upgrades.incubatorUpgrade();
  Upgrades.consumeMapCurrencyUpgrade();
  Upgrades.divTab();
  Upgrades.flipSpeed();

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
