export default class Concentrations {
    constructor(enzymes) {
        /**
         * {
         *  substrates: ["G", "ATP"],
         *  products: ["G6", "ADP"],
         *  cofactors: ["Na"]
         * }
         */
        this.enzymes = enzymes;
        this.molecule_concentrations = [];
        initConcentrations(this.enzymes);
        this.listeners = [];
    }

    initConcentrations(enzymes) {
        for (const enzyme of enzymes) {
            for (const substrate of enzyme.substrates) {
                this.molecule_concentrations[substrate] = 100;
            }
            for (const product of enzyme.products) {
                this.molecule_concentrations[product] = 100;
            }
            for (const cofactor of enzyme.cofactors) {
                this.molecule_concentrations[cofactor] = 100;
            }
        }
    }

    updateConcentrations() {
        let oldConcentrations = this.molecule_concentrations;
        for (const enzyme of this.enzymes) {
            let min_substrate_conc = 0;
            for (const substrate of enzyme.substrates) {
                if (oldConcentrations[substrate] > min_substrate_conc) {
                    min_substrate_conc = oldConcentrations[substrate];
                }
            }
            for (const substrate of enzyme.substrates) {
                this.molecule_concentrations[substrate] -= min_substrate_conc * 0.1;
            }
            for (const product of enzyme.products) {
                this.molecule_concentrations[product] += min_substrate_conc * 0.1;
            }
        }
        for (const listener of this.listeners) {
            listener.onConcentrationUpdate(this.molecule_concentrations);
        }
    }

    addListener(listener) {
        if (Object.hasOwn(listener, 'onConcentrationUpdate')) {
            this.listeners.push(listener);
        }
    }
}