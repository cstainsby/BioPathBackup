/**
 * @class
 * @classdesc Managing model concentrations for
 * real time web app.
 * 
 * @author zburnaby
 * 
 */
export default class Concentrations {
    /**
     * @constructor
     * @param {Object[]} enzymes list of enzymes
     * @param enzymes[].substrates list of input moleules to the enzyme
     * @param enzymes[].products list of output molecules to the enzyme
     * @param enzymes[].cofactors list of molecules effecting the enzyme's production
     */
    constructor(enzymes) {
        /*
         * {
         *  substrates: ["G", "ATP"],
         *  products: ["G6", "ADP"],
         *  cofactors: ["Na"]
         * }
         */
        this.enzymes = enzymes;
        this.molecule_concentrations = [];
        this.initConcentrations(this.enzymes);
        this.listeners = [];
    }

    /**
     * Initializes the molecule_concentrations list given some enzymes
     * @function
     * @param {Object[]} enzymes list of enzymes
     * @param enzymes[].substrates list of input moleules to the enzyme
     * @param enzymes[].products list of output molecules to the enzyme
     * @param enzymes[].cofactors list of molecules effecting the enzyme's production
     */
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

    /**
     * Updates the concentrations of each molecule
     * @function
     */
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
            listener(this.molecule_concentrations);
        }
    }

    /**
     * @callback onUpdateConcentration
     * @param {Object[]} molecule_concentrations
     */

    /**
     * Add listener function from listener queue
     * @function
     * @param {onUpdateConcentration} listener
     */
    addListener(listener) {
        this.listeners.push(listener);
    }

    /**
     * Remove listener function from listener queue
     * @function
     * @param {onUpdateConcentration} listener
     */
    removeListener(listener) {
        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
            }
        }
    }
}