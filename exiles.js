//---Main
var totalLevel = 0;
var dropRate = 0;
var playTime = 0;
var snackBarTimer = 0;

//---Define Class
class Exile {
	constructor(name, level, exp, expToLevel, dropRate, gear, links, rerollLevel) {
		this.name = name;
		this.level = Number(level);
		this.exp = Number(exp);
		this.expToLevel = Number(expToLevel);
		this.dropRate = Number(dropRate); //efficiency
		this.gear = Number(gear);
		this.links = Number(links);
		this.rerollLevel = Number(rerollLevel);
	}

	lvlExile() {
		if (this.level > 0 && this.level <= 99) {
			this.exp += Math.floor((Math.random() * (25 - 15) + 15) + (this.dropRate * 3) + (this.level / 5)); // delete *100
			while (this.exp > this.expToLevel) {
				this.expToLevel = Math.floor((this.expToLevel * 1.10)); //updates level requirement
				this.level++;
				if (this.rerollLevel <= 100) {
					this.dropRate += 0.1; // default is 0.1
				} else {
					this.dropRate += 0.05; //makes rerolls less efficient
				}
			}
		}
	}

	updateExileClass() {
		if (this.level > 0 && this.level <= 99) {
			this.lvlExile();
			document.getElementsByClassName(this.name + 'Level')[0].innerHTML = this.level;
			document.getElementsByClassName(this.name + 'EXP')[0].innerHTML = numeral(this.exp).format('0,0') + "/" + numeral(this.expToLevel).format('0,0');
			document.getElementsByClassName(this.name + 'Efficiency')[0].innerHTML = "x" + numeral(this.dropRate).format('0,0.0');
		}
		if (this.level == 100) {
			document.getElementsByClassName(this.name + 'EXP')[0].innerHTML = "Max";
			$('.' + this.name + 'RerollButton').removeClass('hidden');
		}
	};

	lvlGear() {
		if (this.gear == 0) { //Magic flasks
			const requirements = [
				{ currency: Transmutation, amount: 5 },
				{ currency: Augmentation, amount: 5 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.1;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Upgrade ' + this.name + ' gear to Magic rarity',
					'+0.1 (' + this.name + ')',
					'10 Transmutation<br>10 Augmentation'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Transmutation", "Augmentation");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 1) { //Magic items
			const requirements = [
				{ currency: Transmutation, amount: 10 },
				{ currency: Augmentation, amount: 10 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.1;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Roll ' + this.name + ' flasks',
					'+0.2 (' + this.name + ')',
					'50 Augmentation<br>50 Alteration'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Transmutation").removeClass("hover");
				this.setupHover("Gear", "Alteration", "Augmentation");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 2) { //roll magic flasks
			const requirements = [
				{ currency: Alteration, amount: 50 },
				{ currency: Augmentation, amount: 50 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.2;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Roll ' + this.name + ' gear',
					'+0.2 (' + this.name + ')',
					'100 Augmentation<br>100 Alteration'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Alteration", "Augmentation");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 3) { //roll magic gear
			const requirements = [
				{ currency: Alteration, amount: 100 },
				{ currency: Augmentation, amount: 100 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.2;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'20% quality ' + this.name + ' weapon',
					'+0.2 (' + this.name + ')',
					'20 Blacksmith'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Alteration").removeClass("hover");
				$(".Augmentation").removeClass("hover");
				this.setupHover("Gear", "Blacksmith");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 4) { //20% weapon
			const requirements = [
				{ currency: Blacksmith, amount: 20 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.2;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'20% quality ' + this.name + ' gear',
					'+0.2 (' + this.name + ')',
					'200 Armourer'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Blacksmith").removeClass("hover");
				this.setupHover("Gear", "Armourer");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 5) { //20% gear
			const requirements = [
				{ currency: Armourer, amount: 200 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.2;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Upgrade ' + this.name + ' gear to Rare rarity',
					'+0.3 (' + this.name + ')',
					'10 Regal'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Armourer").removeClass("hover");
				this.setupHover("Gear", "Regal");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 6) { //regal gear to rare
			const requirements = [
				{ currency: Regal, amount: 10 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.3;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy upgrades for ' + this.name + ' gear',
					'+0.4 (' + this.name + ')',
					'30 Chaos'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Regal").removeClass("hover");
				this.setupHover("Gear", "Chaos");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 7) { //upgrade gear
			const requirements = [
				{ currency: Chaos, amount: 30 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.4;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy jewels for ' + this.name + ' gear',
					'+0.4 (' + this.name + ')',
					'50 Chaos'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Chaos");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 8) { //upgrade jewels
			const requirements = [
				{ currency: Chaos, amount: 50 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.4;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Blessed implicits for ' + this.name + ' gear',
					'+0.4 (' + this.name + ')',
					'30 Blessed'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Chaos").removeClass("hover");
				this.setupHover("Gear", "Blessed");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 9) { //bless
			const requirements = [
				{ currency: Blessed, amount: 30 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.4;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy upgrades for ' + this.name + ' gear',
					'+0.5 (' + this.name + ')',
					'100 Chaos'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Blessed").removeClass("hover");
				this.setupHover("Gear", "Chaos");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 10) { //upgrade gear
			const requirements = [
				{ currency: Chaos, amount: 100 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.5;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Enchant ' + this.name + ' gloves',
					'+0.5 (' + this.name + ')',
					'150 Chance<br>15 Regret'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Chaos").removeClass("hover");
				this.setupHover("Gear", "Regret", "Chance");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 11) { //glove enchant
			const requirements = [
				{ currency: Regret, amount: 15 },
				{ currency: Chance, amount: 150 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.5;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Enchant ' + this.name + ' boots',
					'+0.5 (' + this.name + ')',
					'400 Chance<br>40 Regret'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Regret", "Chance");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 12) { //boot enchant
			const requirements = [
				{ currency: Regret, amount: 40 },
				{ currency: Chance, amount: 400 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.5;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'20% quality ' + this.name + ' flasks',
					'+0.5 (' + this.name + ')',
					'50 Glassblower'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Regret").removeClass("hover");
				$(".Chance").removeClass("hover");
				this.setupHover("Gear", "Glassblower");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 13) { //20% flasks
			const requirements = [
				{ currency: Glassblower, amount: 50 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.5;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Anoint ' + this.name + ' amulet',
					'+0.6 (' + this.name + ')',
					'50 Chaos<br>1 Exalted'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Glassblower").removeClass("hover");
				this.setupHover("Gear", "Exalted", "Chaos");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 14) { //anoint
			const requirements = [
				{ currency: Exalted, amount: 1 },
				{ currency: Chaos, amount: 50 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.6;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy upgrades for ' + this.name + ' gear',
					'+0.6 (' + this.name + ')',
					'250 Chaos'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Exalted").removeClass("hover");
				this.setupHover("Gear", "Chaos");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 15) { //gear upgrades
			const requirements = [
				{ currency: Chaos, amount: 250 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.6;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy unique flasks for ' + this.name,
					'+0.7 (' + this.name + ')',
					'200 Chaos<br>2 Exalted'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Exalted", "Chaos");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 16) { //unique flasks
			const requirements = [
				{ currency: Exalted, amount: 2 },
				{ currency: Chaos, amount: 200 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.7;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Divine ' + this.name + ' gear',
					'+0.7 (' + this.name + ')',
					'10 Divine'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Exalted").removeClass("hover");
				$(".Chaos").removeClass("hover");
				this.setupHover("Gear", "Divine");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 17) { //divine
			const requirements = [
				{ currency: Divine, amount: 10 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.7;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy upgrades for ' + this.name + ' gear',
					'+0.8 (' + this.name + ')',
					'3 Exalted'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Divine").removeClass("hover");
				this.setupHover("Gear", "Exalted");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 18) { //gear upgrades
			const requirements = [
				{ currency: Exalted, amount: 3 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.8;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Enchant ' + this.name + ' helmet',
					'+0.9 (' + this.name + ')',
					'2500 Chance<br>250 Regret'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Exalted").removeClass("hover");
				this.setupHover("Gear", "Regret", "Chance");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 19) { //helm enchant
			const requirements = [
				{ currency: Regret, amount: 250 },
				{ currency: Chance, amount: 2500 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.9;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Exalt ' + this.name + ' gear',
					'+1.0 (' + this.name + ')',
					'10 Exalted'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Chance").removeClass("hover");
				$(".Regret").removeClass("hover");
				this.setupHover("Gear", "Exalted");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 20) { //ex gear
			const requirements = [
				{ currency: Exalted, amount: 10 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Craft explode chest for ' + this.name,
					'+1.5 (' + this.name + ')',
					'5 Exalted<br>1 Awakener'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Exalted", "Awakener");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 21) { //explode chest
			const requirements = [
				{ currency: Exalted, amount: 5 },
				{ currency: Awakener, amount: 1 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1.5;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy Watchers Eye for ' + this.name,
					'+1.5 (' + this.name + ')',
					'50 Exalted'
				);
				SnackBar(this.name + " Gear upgraded!");
				$(".Awakener").removeClass("hover");
				this.setupHover("Gear", "Exalted");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 22) { //watchers eye
			const requirements = [
				{ currency: Exalted, amount: 50 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1.5;
				this.gear++;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Buy Headhunter for ' + this.name,
					'+2.0 (' + this.name + ')',
					'150 Exalted'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Exalted");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear == 23) { //headhunter
			const requirements = [
				{ currency: Exalted, amount: 150 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 2;
				this.gear += 7; //so that the loop for mirrors works
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Mirror gear for ' + this.name,
					'+2.5 (' + this.name + ')',
					'30 Exalted<br>1 Mirror'
				);
				SnackBar(this.name + " Gear upgraded!");
				this.setupHover("Gear", "Exalted", "Mirror");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.gear >= 24) { //mirror loop
			const requirements = [
				{ currency: Exalted, amount: this.gear },
				{ currency: Mirror, amount: 1 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 2.5;
				this.gear += 10;
				generateUpgradeHTML(
					this.name,
					'Gear',
					'Mirror gear for ' + this.name,
					'+2.5 (' + this.name + ')',
					this.gear + ' Exalted<br>1 Mirror'
				);
				SnackBar(this.name + " Gear upgraded!");
			} else {
				SnackBar("Requirements not met.");
			}
		}
	};

	lvlLinks() {
		if (this.links == 0) { //4L
			const requirements = [
				{ currency: Fusing, amount: 10 },
				{ currency: Jeweller, amount: 10 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.5;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Colour ' + this.name + ' links',
					'+0.5 (' + this.name + ')',
					'100 Chromatic'
				);
				SnackBar(this.name + " Links upgraded!");
				$(".Fusing").removeClass("hover");
				$(".Jeweller").removeClass("hover");
				this.setupHover("Links", "Chromatic");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "4L";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 1) { //chromatics
			const requirements = [
				{ currency: Chromatic, amount: 100 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.5;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Upgrade ' + this.name + ' links to 5L',
					'+0.6 (' + this.name + ')',
					'150 Jeweller<br>150 Fusing'
				);
				SnackBar(this.name + " Links upgraded!");
				$(".Chromatic").removeClass("hover");
				this.setupHover("Links", "Jeweller", "Fusing");
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 2) { //5L
			const requirements = [
				{ currency: Fusing, amount: 150 },
				{ currency: Jeweller, amount: 150 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 0.6;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Upgrade ' + this.name + ' links to 6L',
					'+1.0 (' + this.name + ')',
					'1500 Jeweller<br>1500 Fusing'
				);
				SnackBar(this.name + " Links upgraded!");
				this.setupHover("Links", "Jeweller", "Fusing");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "5L";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 3) { //6L
			const requirements = [
				{ currency: Fusing, amount: 1500 },
				{ currency: Jeweller, amount: 1500 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Corrupt ' + this.name + ' gear to +1 gems',
					'+1.5 (' + this.name + ')',
					'50 Vaal'
				);
				SnackBar(this.name + " Links upgraded!");
				$(".Fusing").removeClass("hover");
				$(".Jeweller").removeClass("hover");
				this.setupHover("Links", "Vaal");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "6L";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 4) { //+1 gems
			const requirements = [
				{ currency: Vaal, amount: 50 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1.5;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'20% quality ' + this.name + ' gems',
					'+1.5 (' + this.name + ')',
					'120 GCP'
				);
				SnackBar(this.name + " Links upgraded!");
				$(".Vaal").removeClass("hover");
				this.setupHover("Links", "GCP");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "6L (+1 Gems)";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 5) { //20% gems
			const requirements = [
				{ currency: GCP, amount: 120 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1.5;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Corrupt ' + this.name + ' gems to +1',
					'+1.5 (' + this.name + ')',
					'100 Vaal'
				);
				SnackBar(this.name + " Links upgraded!");
				$(".GCP").removeClass("hover");
				this.setupHover("Links", "Vaal");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "6L (+1/20% Gems)";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 6) { //+2 gems
			const requirements = [
				{ currency: Vaal, amount: 100 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 1.5;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Double corrupt ' + this.name + ' gems to +1/23%',
					'+2.0 (' + this.name + ')',
					'150 Vaal'
				);
				SnackBar(this.name + " Links upgraded!");
				this.setupHover("Links", "Vaal");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "6L (+2/20% Gems)";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 7) { //+2/23% gems
			const requirements = [
				{ currency: Vaal, amount: 150 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 2;
				this.links++;
				generateUpgradeHTML(
					this.name,
					'Links',
					'Double corrupt ' + this.name + ' gear to +4 gems',
					'+2.5 (' + this.name + ')',
					'200 Vaal'
				);
				SnackBar(this.name + " Links upgraded!");
				this.setupHover("Links", "Vaal");
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "6L (+2/23% Gems)";
			} else {
				SnackBar("Requirements not met.");
			}
		} else if (this.links == 8) { //+5/23% gems
			const requirements = [
				{ currency: Vaal, amount: 200 }
			];
			if (checkRequirements(requirements)) {
				deductCosts(requirements);
				this.dropRate += 2.5;
				this.links++;
				SnackBar(this.name + " Links upgrades completed!");
				$(".Vaal").removeClass("hover");
				$('#' + this.name + 'LinksUpgrade').remove();
				document.getElementsByClassName(this.name + 'Links')[0].innerHTML = "6L (+5/23% Gems)";
			} else {
				SnackBar("Requirements not met.");
			}
		}
	};

	recruitExile() {
		this.level += 1;
		this.dropRate += 0.1;
		$('.' + this.name + 'Buy').remove();
		$('.' + this.name + 'Hide').remove();
		$("#UpgradeGearTable").append(
			'<tr id="' + this.name + 'GearUpgrade">' +
			'<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + this.name + 'GearButton" onclick="buyGear(' + this.name + ');">' + this.name + ' Gear' + '</button></td>' +
			'<td class="mdl-data-table__cell--non-numeric">Upgrade ' + this.name + ' flasks to Magic rarity</td>' +
			'<td class="mdl-data-table__cell--non-numeric">+0.1 (' + this.name + ')</td>' +
			'<td class="mdl-data-table__cell--non-numeric">5 Transmutation<br>5 Augmentation</td>' +
			'</tr>'
		);
		$("#UpgradeLinksTable").append(
			'<tr id="' + this.name + 'LinksUpgrade">' +
			'<td class="mdl-data-table__cell--non-numeric"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ' + this.name + 'LinksButton" onclick="buyLinks(' + this.name + ');">' + this.name + ' Links</button></td>' +
			'<td class="mdl-data-table__cell--non-numeric">Upgrade ' + this.name + ' links to 4L</td>' +
			'<td class="mdl-data-table__cell--non-numeric">+0.5 (' + this.name + ')</td>' +
			'<td class="mdl-data-table__cell--non-numeric">10 Jeweller<br>10 Fusing</td>' +
			'</tr>'
		);
		document.getElementsByClassName(this.name + 'Efficiency')[0].innerHTML = "x" + this.dropRate.toFixed(1);
		document.getElementsByClassName(this.name + 'Level')[0].innerHTML = this.level;
		this.setupHover("Gear", "Transmutation", "Augmentation");
		this.setupHover("Links", "Jeweller", "Fusing");
	};

	rerollExile() {
		this.level = 1;
		this.rerollLevel += 100;
		this.exp = 0;
		this.expToLevel = 525;
		$('.' + this.name + 'RerollButton').addClass('hidden');
		$('.' + this.name + 'Reroll').removeClass('hidden');
		document.getElementsByClassName(this.name + 'Reroll')[0].innerHTML = '(+' + this.rerollLevel + ')';
	};

	/**
     * Sets up hover effects for upgrade elements, highlighting the required currencies
     * @param {string} upgradeType - Type of upgrade ('Gear' or 'Links')
     * @param {string} firstCurrency - First currency to highlight
     * @param {string} secondCurrency - Second currency to highlight (optional)
     */
    setupHover(upgradeType, firstCurrency, secondCurrency = null) {
        $(`#${this.name}${upgradeType}Upgrade`).off('mouseenter mouseleave');
        $(`#${this.name}${upgradeType}Upgrade`).hover(
            function() {
                $(`.${firstCurrency}`).addClass('hover');
                if (secondCurrency) {
                    $(`.${secondCurrency}`).addClass('hover');
                }
            }, 
            function() {
                $(`.${firstCurrency}`).removeClass('hover');
                if (secondCurrency) {
                    $(`.${secondCurrency}`).removeClass('hover');
                }
            }
        );
    }
}

/**
 * Generates and updates HTML for upgrade buttons and descriptions
 * @param {string} exile - The exile name
 * @param {string} upgradeType - The type of upgrade (e.g., 'Gear', 'Links')
 * @param {string} description - Description of the upgrade
 * @param {string} benefit - The benefit gained from the upgrade
 * @param {string} requirements - The requirements text
 */
function generateUpgradeHTML(exile, upgradeType, description, benefit, requirements) {
    // Generate button text from exile name and upgradeType
    const buttonText = exile + ' ' + upgradeType;
    
    const html = `
        <td class="mdl-data-table__cell--non-numeric">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored ${exile}${upgradeType}Button" 
                    onclick="buy${upgradeType}(${exile});">
                ${buttonText}
            </button>
        </td>
        <td class="mdl-data-table__cell--non-numeric">${description}</td>
        <td class="mdl-data-table__cell--non-numeric">${benefit}</td>
        <td class="mdl-data-table__cell--non-numeric">${requirements}</td>
    `;
    
    // Update the HTML content directly
    $(`#${exile}${upgradeType}Upgrade`).html(html);
}

/**
 * Checks if all currency requirements are met.
 * @param {Array<Object>} requirements - An array of requirement objects, e.g., [{ currency: Transmutation, amount: 5 }, { currency: Augmentation, amount: 5 }]
 * @returns {boolean} - True if all requirements are met, false otherwise.
 */
function checkRequirements(requirements) {
    for (const req of requirements) {
        // Ensure the currency object exists and has a 'total' property
        if (!req.currency || typeof req.currency.total === 'undefined') {
            console.error("Invalid currency object in requirements:", req);
            return false; // Invalid requirement definition
        }
        if (req.currency.total < req.amount) {
            return false; // Not enough of this currency
        }
    }
    return true; // All requirements met
}

/**
 * Deducts currency costs based on the requirements array.
 * Assumes checkRequirements has already passed.
 * @param {Array<Object>} requirements - An array of requirement objects, e.g., [{ currency: Transmutation, amount: 5 }, { currency: Augmentation, amount: 5 }]
 */
function deductCosts(requirements) {
    for (const req of requirements) {
        if (req.currency && typeof req.currency.total !== 'undefined') {
            req.currency.total -= req.amount;
        } else {
             console.error("Attempted to deduct invalid currency:", req);
        }
    }
}

//---Define Exiles
var exileData = [
	Ascendant = new Exile('Ascendant', '0', '0', '525', '0', '0', '0', '0'),
	Slayer = new Exile('Slayer', '0', '0', '525', '0', '0', '0', '0'),
	Gladiator = new Exile('Gladiator', '0', '0', '525', '0', '0', '0', '0'),
	Champion = new Exile('Champion', '0', '0', '525', '0', '0', '0', '0'),
	Assassin = new Exile('Assassin', '0', '0', '525', '0', '0', '0', '0'),
	Saboteur = new Exile('Saboteur', '0', '0', '525', '0', '0', '0', '0'),
	Trickster = new Exile('Trickster', '0', '0', '525', '0', '0', '0', '0'),
	Juggernaut = new Exile('Juggernaut', '0', '0', '525', '0', '0', '0', '0'),
	Berserker = new Exile('Berserker', '0', '0', '525', '0', '0', '0', '0'),
	Chieftain = new Exile('Chieftain', '0', '0', '525', '0', '0', '0', '0'),
	Necromancer = new Exile('Necromancer', '0', '0', '525', '0', '0', '0', '0'),
	Elementalist = new Exile('Elementalist', '0', '0', '525', '0', '0', '0', '0'),
	Occultist = new Exile('Occultist', '0', '0', '525', '0', '0', '0', '0'),
	Deadeye = new Exile('Deadeye', '0', '0', '525', '0', '0', '0', '0'),
	Raider = new Exile('Raider', '0', '0', '525', '0', '0', '0', '0'),
	Pathfinder = new Exile('Pathfinder', '0', '0', '525', '0', '0', '0', '0'),
	Inquisitor = new Exile('Inquisitor', '0', '0', '525', '0', '0', '0', '0'),
	Hierophant = new Exile('Hierophant', '0', '0', '525', '0', '0', '0', '0'),
	Guardian = new Exile('Guardian', '0', '0', '525', '0', '0', '0', '0'),
	Melvin = new Exile('Melvin', '0', '0', '525', '0', '0', '0', '0'),
];
Singularity = new Exile('Singularity', '0', '0', '525', '0', '0', '0', '0'); //flipper
Artificer = new Exile('Artificer', '0', '0', '525', '0', '0', '0', '0'); //crafter

setInterval(function gameTick() {
	let tempLevel = 250;
	for (let i = 0; i < exileData.length; i++) {
		if (exileData[i].level >= 1) {
			exileData[i].updateExileClass();
		}
		tempLevel += exileData[i].level;
		tempLevel += exileData[i].rerollLevel;
	}

	totalLevel = tempLevel;
	document.getElementsByClassName('TotalLevel')[0].innerHTML = "Levels: " + numeral(totalLevel).format('0,0');
	dropRate = upgradeDropRate + Ascendant.dropRate + Slayer.dropRate + Gladiator.dropRate + Champion.dropRate + Assassin.dropRate + Saboteur.dropRate + Trickster.dropRate + Juggernaut.dropRate + Berserker.dropRate + Chieftain.dropRate + Necromancer.dropRate + Occultist.dropRate + Elementalist.dropRate + Deadeye.dropRate + Raider.dropRate + Pathfinder.dropRate + Inquisitor.dropRate + Hierophant.dropRate + Guardian.dropRate + Melvin.dropRate;
	document.getElementsByClassName('TotalDR')[0].innerHTML = "Efficiency: x" + numeral(dropRate).format('0,0.0');

	snackBarTimer -= 100;
	playTime += 0.1;
	document.getElementById("timePlayed").innerHTML = numeral(playTime).format('00:00:00');
}, 100);

//---Unlocking Exiles
//---Ascendant
function recruitAscendant() {
	if (totalLevel >= 0) {
		Ascendant.recruitExile();
	}
}
//---Slayer
function recruitSlayer() {
	if (totalLevel >= 35) {
		Slayer.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Assassin
function recruitAssassin() {
	if (totalLevel >= 65) {
		Assassin.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Juggernaut
function recruitJuggernaut() {
	if (totalLevel >= 110) {
		Juggernaut.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Necromancer
function recruitNecromancer() {
	if (totalLevel >= 170) {
		Necromancer.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Deadeye
function recruitDeadeye() {

	if (totalLevel >= 245) {
		Deadeye.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Inquisitor
function recruitInquisitor() {
	if (totalLevel >= 335) {
		Inquisitor.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Gladiator
function recruitGladiator() {
	if (totalLevel >= 450) {
		Gladiator.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Saboteur
function recruitSaboteur() {
	if (totalLevel >= 580) {
		Saboteur.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Berserker
function recruitBerserker() {
	if (totalLevel >= 725) {
		Berserker.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Elementalist
function recruitElementalist() {
	if (totalLevel >= 885) {
		Elementalist.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Raider
function recruitRaider() {
	if (totalLevel >= 1060) {
		Raider.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Hierophant
function recruitHierophant() {
	if (totalLevel >= 1250) {
		Hierophant.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Champion
function recruitChampion() {
	if (totalLevel >= 1455) {
		Champion.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Trickster
function recruitTrickster() {
	if (totalLevel >= 1675) {
		Trickster.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Chieftain
function recruitChieftain() {
	if (totalLevel >= 1910) {
		Chieftain.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Occultist
function recruitOccultist() {
	if (totalLevel >= 2160) {
		Occultist.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Pathfinder
function recruitPathfinder() {
	if (totalLevel >= 2425) {
		Pathfinder.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---Guardian
function recruitGuardian() {
	if (totalLevel >= 2715) {
		Guardian.recruitExile();
	} else {
		SnackBar("Requirements not met.");
	}
}
//---The Singulatiry
function recruitSingularity() {
	if (totalLevel >= 250 && currencyStashTab == 1) {
		Singularity.level++;
		$(".SingularityHide").remove();
		$(".SingularityBuy").remove();
		$('.flip').removeClass('hidden');
	} else {
		SnackBar("Requirements not met.");
	}
}

//---Delvin' Melvin
function recruitMelvin() {
	if (totalLevel >= 500 && delveStashTab == 1) {
		Melvin.recruitExile();
		$(".MelvinHide").remove();
		$(".MelvinBuy").remove();
		$("#delveLoader").removeClass("hidden");
	} else {
		SnackBar("Requirements not met.");
	}
}

//---The Artificer
function recruitArtificer() {
	if (totalLevel >= 1000 && quadStashTab == 1) {
		Artificer.level++;
		$(".ArtificerHide").remove();
		$(".ArtificerBuy").remove();
		$(".craft").show();
	} else {
		SnackBar("Requirements not met.");
	}
}

//---Upgrading Exiles
function buyGear(name) {
	name.lvlGear();
}
function buyLinks(name) {
	name.lvlLinks();
}
function buyReroll(name) {
	name.rerollExile();
}
