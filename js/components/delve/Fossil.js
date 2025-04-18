// Fossil.js - Contains the Fossil class and fossilData array

class Fossil {
    constructor(name, rate, total) {
        this.name = name;
        this.rate = rate;
        this.total = Number(total);
    }

    rollFossilRNG() {
        let min = 0.0000001;
        let max = 1;
        let f = (Math.random() * (max - min) + min).toFixed(7);
        return f;
    }

    rollFossil(dropRate, upgradeDropRate) {
        let f = this.rollFossilRNG();
        if (f <= this.rate * (dropRate + upgradeDropRate)) {
            this.total += 1 + (this.rate * (dropRate + upgradeDropRate));
            const el = document.getElementsByClassName(this.name + 'Total')[0];
            if (el) {
                el.innerHTML = numeral(this.total).format('0,0', Math.floor);
            }
        }
    }
}

const fossilData = [
    new Fossil('Primitive', 0.0125, 0),
    new Fossil('Potent', 0.0025, 0),
    new Fossil('Powerful', 0.001, 0),
    new Fossil('Prime', 0.00045, 0),
    new Fossil('Aberrant', 0.0025, 0),
    new Fossil('Frigid', 0.0025, 0),
    new Fossil('Metallic', 0.0025, 0),
    new Fossil('Scorched', 0.0025, 0),
    new Fossil('Pristine', 0.0015, 0),
    new Fossil('Aetheric', 0.0005, 0),
    new Fossil('Bound', 0.0005, 0),
    new Fossil('Corroded', 0.0005, 0),
    new Fossil('Dense', 0.0005, 0),
    new Fossil('Enchanted', 0.0005, 0),
    new Fossil('Jagged', 0.0005, 0),
    new Fossil('Lucent', 0.0005, 0),
    new Fossil('Perfect', 0.0005, 0),
    new Fossil('Prismatic', 0.0005, 0),
    new Fossil('Serrated', 0.0005, 0),
    new Fossil('Shuddering', 0.00035, 0),
    new Fossil('Faceted', 0.00035, 0),
];

export { Fossil, fossilData };