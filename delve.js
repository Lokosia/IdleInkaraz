var sulphiteDepth = 1;
var sulphiteCost = 110;

var delveLoadingProgress = 0;

// Initialize the Delving UI when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDelvingUI();
});

// Creates and populates the Delving UI sections
function initDelvingUI() {
    const container = document.getElementById('delving-container');
    if (!container) return; // Exit if container not found
    
    // Generate the three main sections
    container.appendChild(createMelvinSection());
    container.appendChild(createDeepDelvingSection());
    container.appendChild(createFossilsSection());
}

// Creates the Melvin character section
function createMelvinSection() {
    const section = document.createElement('div');
    section.className = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG melvin';
    
    section.innerHTML = `
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Delvin' Melvin</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-card--expand">
            Level: <span class="MelvinLevel">0</span> <span class="MelvinReroll hidden"></span><br>
            EXP: <span class="MelvinEXP">0/525</span><br>
            Efficiency: <span class="MelvinEfficiency">x0</span><br>
            Links: <span class="MelvinLinks">3L</span>
        </div>
        <div class="mdl-card__actions mdl-card--border MelvinBuy">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onclick="recruitExile('Melvin');">Recruit Melvin</button>
        </div>
        <div class="mdl-card__actions mdl-card--border MelvinHide">
            500 Total Levels Required<br>Delve Stash Tab Required
        </div>
        <div class="mdl-card__actions mdl-card--border MelvinRerollButton hidden">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onclick="Melvin.rerollExile();">Reroll Melvin</button>
        </div>
    `;
    
    return section;
}

// Creates the Deep Delving section
function createDeepDelvingSection() {
    const section = document.createElement('div');
    section.className = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG imgBG';
    
    section.innerHTML = `
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Deep Delving</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-card--expand">
            <p>Spend Sulphite to traverse the mines.</p>
            <p>Collect currency and fossils.</p>
            <div id="delveLoader" class="mdl-progress mdl-js-progress hidden"></div>
            <br>
            Total Sulphite: <span class="Sulphite">0</span><br>
            Delve Depth: <span class="SulphiteDepth">1</span><br>
            Sulphite Cost: <span class="SulphiteCost">110</span>
        </div>
    `;
    
    return section;
}

// Creates the Fossils section
function createFossilsSection() {
    const section = document.createElement('div');
    section.className = 'mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet cardBG imgBG';
    
    let fossilsHTML = `
        <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Resonators & Fossils</h2>
        </div>
        <div class="mdl-card__supporting-text mdl-card--expand">
            <b>Resonators:</b><br>
    `;
    
    // Group fossils by type
    const resonators = fossilData.filter(fossil => 
        ['Primitive', 'Potent', 'Powerful', 'Prime'].includes(fossil.name)
    );
    
    const fossils = fossilData.filter(fossil => 
        !['Primitive', 'Potent', 'Powerful', 'Prime'].includes(fossil.name)
    );
    
    // Add resonators
    resonators.forEach(fossil => {
        fossilsHTML += `${fossil.name}: <span class="${fossil.name}Total">0</span><br>`;
    });
    
    fossilsHTML += '<br><b>Fossils:</b><br>';
    
    // Add fossils
    fossils.forEach(fossil => {
        fossilsHTML += `${fossil.name}: <span class="${fossil.name}Total">0</span><br>`;
    });
    
    fossilsHTML += '</div>';
    section.innerHTML = fossilsHTML;
    
    return section;
}

class Fossil {
	constructor(name, rate, total) {
		this.name = name;
		this.rate = rate;
		this.total = Number(total);
	}

	rollFossilRNG() { //determines the roll for a drop
		let min = 0.0000001;
		let max = 1;
		let f = (Math.random() * (max - min) + min).toFixed(7);
		return f;
	};

	rollFossil() { //rolls each fossil to drop it
		let f = this.rollFossilRNG();
		if (f <= this.rate * (Melvin.dropRate + upgradeDropRate)) {
			this.total += 1 + (this.rate * (Melvin.dropRate + upgradeDropRate)); //adds multiple if dropRate high enough
			document.getElementsByClassName(this.name + 'Total')[0].innerHTML = numeral(this.total).format('0,0', Math.floor);
		}
	};
}

var fossilData = [
	Primitive = new Fossil('Primitive', '0.0125000', '0'),
	Potent = new Fossil('Potent', '0.0025000', '0'),
	Powerful = new Fossil('Powerful', '0.0010000', '0'),
	Prime = new Fossil('Prime', '0.0004500', '0'),
	Aberrant = new Fossil('Aberrant', '0.0025000', '0'),
	Frigid = new Fossil('Frigid', '0.0025000', '0'),
	Metallic = new Fossil('Metallic', '0.0025000', '0'),
	Scorched = new Fossil('Scorched', '0.0025000', '0'),
	Pristine = new Fossil('Pristine', '0.0015000', '0'),
	Aetheric = new Fossil('Aetheric', '0.0005000', '0'),
	Bound = new Fossil('Bound', '0.0005000', '0'),
	Corroded = new Fossil('Corroded', '0.0005000', '0'),
	Dense = new Fossil('Dense', '0.0005000', '0'),
	Enchanted = new Fossil('Enchanted', '0.0005000', '0'),
	Jagged = new Fossil('Jagged', '0.0005000', '0'),
	Lucent = new Fossil('Lucent', '0.0005000', '0'),
	Perfect = new Fossil('Perfect', '0.0005000', '0'),
	Prismatic = new Fossil('Prismatic', '0.0005000', '0'),
	Serrated = new Fossil('Serrated', '0.0005000', '0'),
	Shuddering = new Fossil('Shuddering', '0.0003500', '0'),
	Faceted = new Fossil('Faceted', '0.0003500', '0'),
];

setInterval(function delveTick() {
	if (Melvin.level >= 1) {
		delve();
	}
}, 2500); //every 2.5 seconds

function delve() {
	if (Sulphite.total >= sulphiteCost) {
		Sulphite.total -= sulphiteCost;
		sulphiteCost = Math.floor((50 + sulphiteDepth) * 2.2);
		sulphiteDepth++;
		Melvin.dropRate += 0.05;
		delveLoadingProgress = 1;
		document.getElementsByClassName('Sulphite')[0].innerHTML = numeral(Sulphite.total).format('0,0');
		document.getElementsByClassName('SulphiteDepth')[0].innerHTML = numeral(sulphiteDepth).format('0,0');
		document.getElementsByClassName('SulphiteCost')[0].innerHTML = numeral(sulphiteCost).format('0,0');
		// Update Melvin's efficiency display to reflect the new value
		document.getElementsByClassName('MelvinEfficiency')[0].innerHTML = "x" + numeral(Melvin.dropRate).format('0,0.0');
		rollFossilTick();
	}
}

function rollFossilTick() {
	for (let i = 0; i < fossilData.length; i++) {
		fossilData[i].rollFossil();
	}
};

setInterval(function delveLoadingBarAnimate() {
	if (delveLoadingProgress >= 1) {
		delveLoadingProgress += 5;
		let e = document.querySelector('#delveLoader');
		componentHandler.upgradeElement(e);
		e.MaterialProgress.setProgress(delveLoadingProgress);
		if (delveLoadingProgress >= 100) {
			delveLoadingProgress = 0;
			e.MaterialProgress.setProgress(delveLoadingProgress);
		}
	}
}, 100); //every 0.1 seconds
